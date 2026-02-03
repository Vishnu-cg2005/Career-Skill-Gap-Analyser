// Simulating backend delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    login: async (email, password) => {
        await delay(1000);
        if (email && password) {
            return { user: { email, name: 'User' }, token: 'mock-jwt-token' };
        }
        throw new Error('Invalid credentials');
    },

    // Helper to get API Key
    getApiKey: () => localStorage.getItem('gemini_api_key'),

    // Helper to get Current Language
    getLanguage: () => localStorage.getItem('app_language') || 'en',

    // Helper to read file text (Frontend Only)
    readFileAsText: (file) => {
        return new Promise((resolve, reject) => {
            if (!file) resolve(null);
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    },

    uploadResume: async (file, roleId = 'frontend') => {
        // 1. Prepare FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roleId', roleId);

        try {
            console.log("Sending to Backend...");
            const response = await fetch('http://localhost:8084/api/resume/analyze', {
                method: 'POST',
                headers: {
                    'Accept-Language': api.getLanguage(),
                    'X-Gemini-API-Key': api.getApiKey()
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Backend Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Backend Response:", data);
            return data;

        } catch (error) {
            console.error("Backend request failed:", error);
            // CRITICAL: Throw error to UI instead of showing fake data
            throw new Error(`Analysis Failed: ${error.message}. Is the backend running on port 8084?`);
        }
    },

    getQuestions: async (skills, role = 'Software Engineer') => {
        const apiKey = api.getApiKey(); // Might be null, that's okay now.

        try {
            // Call Backend API - Try even if no frontend key (Backend might have one configured)
            const skillNames = skills.map(s => s.name);
            const headers = {
                'Content-Type': 'application/json',
                'Accept-Language': api.getLanguage()
            };
            if (apiKey) {
                headers['X-Gemini-API-Key'] = apiKey;
            }

            const response = await fetch('http://localhost:8084/api/assessment/generate', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ skills: skillNames, role: role })
            });

            if (!response.ok) {
                // If 400/Bad Request, it means Backend ALSO has no key. Then we simulate.
                throw new Error(`Backend Assessment Generation Failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Transform Backend Response (List) to Frontend Expected Format (Map by Skill)
            const groupedQuestions = {};
            if (data.questions && Array.isArray(data.questions)) {
                data.questions.forEach(q => {
                    // Backend DTO now returns 'skill'
                    const skillKey = q.skill || q.skillTested || 'General';
                    if (!groupedQuestions[skillKey]) {
                        groupedQuestions[skillKey] = [];
                    }
                    groupedQuestions[skillKey].push({
                        ...q,
                        text: q.question, // Map 'question' to 'text'
                        codeSnippet: q.codeSnippet || null,
                        correct: q.correctAnswerIndex ?? 0 // Use strict index if available
                    });
                });
            }

            if (Object.keys(groupedQuestions).length === 0) {
                throw new Error("Backend returned zero questions. Falling back to simulation.");
            }

            return groupedQuestions;

        } catch (error) {
            console.warn("Backend Question Gen Failed, falling back to dynamic simulation", error);
        }

        // FALLBACK SIMULATION (Dynamic & Random)
        const questions = {};
        const templates = [
            { t: "What is a primary use case for {{skill}}?", o: ["Scalability", "Security", "Testing", "Documentation"] },
            { t: "Which command is essential in {{skill}}?", o: ["init", "start", "build", "deploy"] },
            { t: "How does {{skill}} handle concurrency?", o: ["Threads", "Event Loop", "Processes", "It doesn't"] },
            { t: "What is the best practice for {{skill}} security?", o: ["Sanitization", "Validation", "Encryption", "Firewalls"] }
        ];

        skills.forEach(skill => {
            // Shuffle templates for randomness
            const shuffled = [...templates].sort(() => 0.5 - Math.random()).slice(0, 3);

            questions[skill.name] = shuffled.map((tpl, i) => {
                // Randomize options order
                const options = [...tpl.o].sort(() => 0.5 - Math.random());
                const correctIdx = Math.floor(Math.random() * 4); // Random correct answer for simulation

                return {
                    id: `${skill.id}_sim_${Date.now()}_${i}`,
                    text: tpl.t.replace("{{skill}}", skill.name) + ` (Sim #${Math.floor(Math.random() * 100)})`, // Add distinct marker
                    options: options,
                    correct: correctIdx,
                    codeSnippet: null
                };
            });
        });
        return questions;
    },

    submitTest: async (answers, extractedSkills, targetRole = 'frontend', allQuestions = []) => {
        // 1. Deterministic Grading FIRST
        let totalQuestions = 0;
        let correctAnswers = 0;
        const skillScores = {};
        const failedQuestions = [];

        // Flatten all questions for easy lookup, or iterate provided structure
        // allQuestions is likely the ARRAY of all questions if passed flattened, or the Object. 
        // AnalyzePage passes the 'questions' state which is the Object { skill: [qs] }.
        // Let's normalize:
        const flatQuestions = [];
        if (Array.isArray(allQuestions)) {
            flatQuestions.push(...allQuestions);
        } else {
            Object.values(allQuestions).forEach(qs => flatQuestions.push(...qs));
        }

        flatQuestions.forEach(q => {
            const userAns = answers[q.skill]?.[q.id];
            if (userAns !== undefined) {
                totalQuestions++;
                if (!skillScores[q.skill]) skillScores[q.skill] = { total: 0, correct: 0 };
                skillScores[q.skill].total++;

                if (userAns === q.correct) {
                    correctAnswers++;
                    skillScores[q.skill].correct++;
                } else {
                    failedQuestions.push({
                        skill: q.skill,
                        question: q.text,
                        userAnswer: q.options[userAns],
                        correctAnswer: q.options[q.correct]
                    });
                }
            }
        });

        const overallScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        // Final Skill Percentages
        const finalSkillScores = {};
        Object.keys(skillScores).forEach(skill => {
            const data = skillScores[skill];
            finalSkillScores[skill] = Math.round((data.correct / data.total) * 100);
        });

        // 2. Prepare Data for AI Grading / qualitative Feedback
        const apiKey = api.getApiKey();

        if (apiKey) {
            try {
                const skillsList = extractedSkills.map(s => s.name).join(', ');
                const failedSummary = JSON.stringify(failedQuestions.slice(0, 5)); // Limit context

                // PROMPT: Focus on Roadmap and Feedback based on KNOWN scores
                const prompt = `
                Act as a Career Coach.
                Role: ${targetRole}
                Candidate Skills: ${skillsList}
                
                PERFORMANCE DATA:
                Overall Score: ${overallScore}/100
                Skill Breakdown: ${JSON.stringify(finalSkillScores)}
                Failed Concepts (Sample): ${failedSummary}
                
                Task:
                1. Based on the calculated scores, assign a Readiness Level (Junior/Mid/Senior).
                2. Generate specific "Critical Gaps" based on the failed concepts.
                3. Create a personalized learning roadmap.
                
                Return ONLY a JSON object with this EXACT structure:
                {
                    "overallScore": ${overallScore}, 
                    "readinessLevel": "Junior/Mid/Senior",
                    "skillGapSummary": "Short summary of performance.",
                    "skillScores": ${JSON.stringify(finalSkillScores)},
                    "criticalGaps": [
                        { "skill": "Skill Name", "reason": "Specific concept missed", "learningUrl": "URL to OFFICIAL documentation", "sourceName": "Source Name" }
                    ],
                    "performanceGaps": [],
                    "roadmap": [
                        { "title": "Phase 1: Focus Area", "duration": "1 Week", "tasks": ["Task 1", "Task 2"] }
                    ],
                    "resumeFeedback": {
                        "score": ${overallScore}, // Correlate with test score
                        "strengths": ["Identified Strength 1"],
                        "improvements": ["Identified Improvement 1"]
                    }
                }
                `;

                const response = await import('./geminiAi').then(m => m.geminiService.generateContent(prompt, apiKey));
                const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonStr);

            } catch (err) {
                console.warn("Gemini Feedback Failed", err);
            }
        }

        // --- FALLBACK (Strict Deterministic) ---
        // Identify Gaps Deterministically
        const criticalGaps = [];
        Object.entries(finalSkillScores).forEach(([skill, score]) => {
            if (score < 60) {
                criticalGaps.push({
                    skill,
                    reason: "Failed Assessment Questions",
                    learningUrl: `https://google.com/search?q=${skill}+documentation`,
                    sourceName: "Docs"
                });
            }
        });

        return {
            overallScore,
            skillScores: finalSkillScores,
            criticalGaps,
            performanceGaps: [],
            roadmap: [{ title: "Recovery Plan", duration: "1 Week", tasks: ["Review invalid answers"] }],
            readinessLevel: overallScore > 80 ? "Senior Ready" : overallScore > 50 ? "Mid-Level" : "Junior",
            skillGapSummary: `Scored ${overallScore}% based on ${totalQuestions} questions.`,
            resumeFeedback: { score: overallScore, strengths: ["Completed Assessment"], improvements: ["Review failed topics"] }
        };
    },



    chatWithAssistant: async (message) => {
        await delay(1000 + Math.random() * 1000); // Natural thinking delay

        const msg = message.toLowerCase();

        // 1. GREETINGS & PERSONALITY
        if (msg.match(/\b(hi|hello|hey|start|begin)\b/)) {
            return `**Hello!** 👋 I'm your **Gemini-powered Career Coach**. Use me to:
*   ✨ **Analyze your resume** against job descriptions
*   🧠 **Practice interview questions** for your target role
*   🚀 **Get learning roadmaps** for missing skills

How can I help you accelerate your career today?`;
        }

        // 2. RESUME HELP
        if (msg.match(/\b(resume|cv|upload|scan)\b/)) {
            return `### 📄 Resume Analysis
To get started, navigate to the **Analyze** page. 

**Pro Tip:** Ensure your resume is in **PDF format** for the best results. I scan for:
*   🔑 Key technical skills (React, Python, SQL)
*   🗣️ Soft skills (Leadership, Communication)
*   📉 Quantifiable achievements

*Shall I take you to the upload page?*`;
        }

        // 3. SKILL SPECIFIC ADVICE
        if (msg.includes('react')) {
            return `### ⚛️ Mastering React
React is all about **components** and **state**.
1.  **Hooks**: Master \`useEffect\` and \`useContext\`.
2.  **Performance**: Learn about \`useMemo\` and \`React.memo\`.
3.  **Ecosystem**: Get comfortable with Next.js for server-side rendering.

\`\`\`javascript
// Example Hook
function useUser(id) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  return user;
}
\`\`\`
Check the **Results Page** for curated tutorials!`;
        }

        if (msg.includes('python')) {
            return `### 🐍 Python Tips
Python is versatile. Focus on:
*   **Data Structures**: List comprehensions are powerful.
*   **Libraries**: Pandas for data, Flask/Django for web.
*   **Virtual Envs**: Always use \`venv\` or \`conda\`.

> "Python is a language that lets you work more quickly and integrate systems more effectively."`;
        }

        // 4. INTERVIEW PREP
        if (msg.match(/\b(interview|question|prep)\b/)) {
            return `### 🎤 Interview Preparation
I can generate **custom mock interviews** based on your target role. 

**Common Questions:**
1.  *Tell me about a time you failed.*
2.  *Explain a complex technical concept to a non-technical person.*
3.  *System Design: Design a URL shortener.*

Go to the **Analyze Page** to start a full mock assessment!`;
        }

        // 5. JAVA & OTHER LANGUAGES
        if (msg.includes('java')) {
            return `### ☕ Java Essentials
Java is robust and object-oriented.
*   **Core**: Understand OOP principles (Inheritance, Polymorphism).
*   **Streams API**: Learn functional programming with Streams.
*   **Spring Boot**: The industry standard for microservices.

\`\`\`java
// Stream Example
List<String> names = list.stream()
    .filter(n -> n.startsWith("A"))
    .collect(Collectors.toList());
\`\`\`
`;
        }

        // 6. GENERATIVE FALLBACK (Simulate Real AI)
        // If no specific keyword matches, give a generic but useful "AI" response
        return `### 🧠 Analysis for "${message}"
        
As a **Gemini-powered Assistant**, I can certainly explore **${message}**.

Here are some key perspectives:
1.  **Context**: Understanding the potential impact in a modern dev environment.
2.  **Application**: How this applies to your current career role.
3.  **Next Steps**: Consider building a small proof-of-concept project.

*Would you like me to generate a specific learning roadmap for this?*`;
    },

    analyzeGap: async (currentSkills, targetRole) => {
        await delay(1500);
        return {
            score: 75,
            gaps: ['Advanced Typescript'],
            recommendations: ['Practice more'],
            roadmap: []
        };
    }
};
