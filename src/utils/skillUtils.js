export const OFFICIAL_DOCS = {
    // --- WEB DEVELOPMENT ---
    'React': 'https://react.dev',
    'Vue': 'https://vuejs.org',
    'Angular': 'https://angular.io',
    'Svelte': 'https://svelte.dev',
    'Next.js': 'https://nextjs.org/docs',
    'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'TypeScript': 'https://www.typescriptlang.org/docs/',
    'CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    'HTML': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    'Tailwind': 'https://tailwindcss.com/docs',
    'Bootstrap': 'https://getbootstrap.com/docs',
    'Sass': 'https://sass-lang.com/documentation',
    'Webpack': 'https://webpack.js.org/concepts/',
    'Vite': 'https://vitejs.dev/guide/',

    // --- BACKEND & LANGUAGES ---
    'Node.js': 'https://nodejs.org/en/docs/',
    'Python': 'https://docs.python.org/3/',
    'Django': 'https://docs.djangoproject.com',
    'Flask': 'https://flask.palletsprojects.com/',
    'FastAPI': 'https://fastapi.tiangolo.com/',
    'Java': 'https://docs.oracle.com/en/java/',
    'Spring': 'https://spring.io/projects/spring-boot',
    'Go': 'https://go.dev/doc/',
    'Rust': 'https://www.rust-lang.org/learn',
    'C#': 'https://learn.microsoft.com/en-us/dotnet/csharp/',
    '.NET': 'https://learn.microsoft.com/en-us/dotnet/',
    'PHP': 'https://www.php.net/docs.php',
    'Laravel': 'https://laravel.com/docs',
    'Ruby': 'https://ruby-doc.org/',
    'Rails': 'https://guides.rubyonrails.org/',
    'C++': 'https://cppreference.com',

    // --- DATABASE ---
    'SQL': 'https://www.w3schools.com/sql/', // Global standard for learning SQL
    'MySQL': 'https://dev.mysql.com/doc/',
    'PostgreSQL': 'https://www.postgresql.org/docs/',
    'MongoDB': 'https://www.mongodb.com/docs/',
    'Redis': 'https://redis.io/docs/',
    'Cassandra': 'https://cassandra.apache.org/doc/latest/',
    'Firebase': 'https://firebase.google.com/docs',
    'Supabase': 'https://supabase.com/docs',

    // --- DEVOPS & CLOUD ---
    'Docker': 'https://docs.docker.com/',
    'Kubernetes': 'https://kubernetes.io/docs/',
    'AWS': 'https://docs.aws.amazon.com/',
    'Azure': 'https://learn.microsoft.com/en-us/azure/',
    'Google Cloud': 'https://cloud.google.com/docs',
    'Terraform': 'https://developer.hashicorp.com/terraform/docs',
    'Ansible': 'https://docs.ansible.com/',
    'Jenkins': 'https://www.jenkins.io/doc/',
    'Git': 'https://git-scm.com/doc',
    'GitHub': 'https://docs.github.com/',
    'GitLab': 'https://docs.gitlab.com/',
    'Linux': 'https://linux.org/pages/tutorials/',
    'Bash': 'https://www.gnu.org/software/bash/manual/',

    // --- AI & DATA ---
    'Machine Learning': 'https://en.wikipedia.org/wiki/Machine_learning', // Global concept
    'TensorFlow': 'https://www.tensorflow.org/learn',
    'PyTorch': 'https://pytorch.org/tutorials/',
    'Pandas': 'https://pandas.pydata.org/docs/',
    'NumPy': 'https://numpy.org/doc/',
    'Scikit-Learn': 'https://scikit-learn.org/stable/',
    'Gemini': 'https://ai.google.dev/docs',
    'OpenAI': 'https://platform.openai.com/docs',

    // --- CONCEPTS (Standard Global Resources) ---
    'System Design': 'https://github.com/donnemartin/system-design-primer',
    'Algorithms': 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/',
    'Data Structures': 'https://www.geeksforgeeks.org/data-structures/',
    'Testing': 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing',
    'Security': 'https://owasp.org/',
    'Agile': 'https://www.atlassian.com/agile',
    'Scrum': 'https://www.scrum.org/resources/what-is-scrum'
};

export const getSafeLink = (skillName, aiProvidedUrl = null) => {
    if (!skillName) return { url: '#', label: 'N/A' };

    // A. Priority: Hardcoded Official registry (Most Trusted & Global)
    const registryKey = Object.keys(OFFICIAL_DOCS).find(k =>
        skillName.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(skillName.toLowerCase())
    );

    if (registryKey) {
        return { url: OFFICIAL_DOCS[registryKey], label: `${registryKey} Official` };
    }

    // B. Secondary: AI Provided URL (Strictly Verified)
    if (aiProvidedUrl && !aiProvidedUrl.includes('google.com') && !aiProvidedUrl.includes('search')) {
        return { url: aiProvidedUrl, label: "Official Resource" };
    }

    // C. Fallback: Wikipedia (Standard Global Definition)
    return {
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(skillName)}`,
        label: "Wiki Definition"
    };
};
