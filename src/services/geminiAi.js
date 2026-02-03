
export const geminiService = {
    generateContent: async (prompt, apiKey) => {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful Career Coach and Technical Assistant. 
                            Provide concise, professional, and encouraging answers using Markdown formatting.
                            Use bold for emphasis, lists for steps, and code blocks for technical examples.
                            User Question: ${prompt}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Gemini API Error');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini API request failed:', error);
            throw error; // Re-throw to be handled by caller
        }
    }
};
