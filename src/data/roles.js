export const GLOBAL_ROLES = [
    // --- TECHNOLOGY & ENGINEERING ---
    { id: 'frontend', name: 'Frontend Developer', icon: '🎨', category: 'Technology' },
    { id: 'backend', name: 'Backend Developer', icon: '⚙️', category: 'Technology' },
    { id: 'fullstack', name: 'Full Stack Developer', icon: '🚀', category: 'Technology' },
    { id: 'devops', name: 'DevOps Engineer', icon: '♾️', category: 'Technology' },
    { id: 'mobile_ios', name: 'iOS Developer', icon: '🍎', category: 'Technology' },
    { id: 'mobile_android', name: 'Android Developer', icon: '🤖', category: 'Technology' },
    { id: 'sre', name: 'Site Reliability Engineer', icon: 'uptime', category: 'Technology' },
    { id: 'cloud_architect', name: 'Cloud Architect', icon: '☁️', category: 'Technology' },
    { id: 'systems_engineer', name: 'Systems Engineer', icon: '🖥️', category: 'Technology' },
    { id: 'embedded', name: 'Embedded Systems Eng', icon: '🔌', category: 'Technology' },
    { id: 'firmware', name: 'Firmware Engineer', icon: '💾', category: 'Technology' },
    { id: 'qa_manual', name: 'QA Tester (Manual)', icon: '🐞', category: 'Technology' },
    { id: 'qa_automation', name: 'QA Automation Eng', icon: '🤖', category: 'Technology' },
    { id: 'blockchain', name: 'Blockchain Developer', icon: '🔗', category: 'Technology' },
    { id: 'game_dev', name: 'Game Developer', icon: '🎮', category: 'Technology' },
    { id: 'ar_vr', name: 'AR/VR Developer', icon: '👓', category: 'Technology' },
    { id: 'network_eng', name: 'Network Engineer', icon: '🌐', category: 'Technology' },
    { id: 'cybersecurity', name: 'Cybersecurity Analyst', icon: '🔒', category: 'Technology' },
    { id: 'pentester', name: 'Penetration Tester', icon: '🕵️', category: 'Technology' },
    { id: 'security_architect', name: 'Security Architect', icon: '🏰', category: 'Technology' },
    { id: 'it_support', name: 'IT Support Specialist', icon: '💻', category: 'Technology' },
    { id: 'database_admin', name: 'Database Administrator', icon: '🗄️', category: 'Technology' },

    // --- DATA & AI ---
    { id: 'data_scientist', name: 'Data Scientist', icon: '🧪', category: 'Data & AI' },
    { id: 'data_analyst', name: 'Data Analyst', icon: '📊', category: 'Data & AI' },
    { id: 'data_eng', name: 'Data Engineer', icon: '🔧', category: 'Data & AI' },
    { id: 'ml_eng', name: 'Machine Learning Eng', icon: '🧠', category: 'Data & AI' },
    { id: 'ai_researcher', name: 'AI Researcher', icon: '🔬', category: 'Data & AI' },
    { id: 'nlp_eng', name: 'NLP Engineer', icon: '🗣️', category: 'Data & AI' },
    { id: 'cv_eng', name: 'Computer Vision Eng', icon: '👁️', category: 'Data & AI' },
    { id: 'bi_analyst', name: 'BI Analyst', icon: '📈', category: 'Data & AI' },
    { id: 'analytics_manager', name: 'Analytics Manager', icon: '👔', category: 'Data & AI' },

    // --- PRODUCT & DESIGN ---
    { id: 'product_manager', name: 'Product Manager', icon: '📅', category: 'Product' },
    { id: 'product_owner', name: 'Product Owner', icon: '👑', category: 'Product' },
    { id: 'scrum_master', name: 'Scrum Master', icon: '🔄', category: 'Product' },
    { id: 'ui_designer', name: 'UI Designer', icon: '✨', category: 'Design' },
    { id: 'ux_designer', name: 'UX Designer', icon: '🧠', category: 'Design' },
    { id: 'product_designer', name: 'Product Designer', icon: '📐', category: 'Design' },
    { id: 'graphic_designer', name: 'Graphic Designer', icon: '🖌️', category: 'Design' },
    { id: 'motion_designer', name: 'Motion Designer', icon: '🎞️', category: 'Design' },
    { id: 'illustrator', name: 'Illustrator', icon: '✏️', category: 'Design' },
    { id: 'web_designer', name: 'Web Designer', icon: '🌐', category: 'Design' },
    { id: 'art_director', name: 'Art Director', icon: '🎭', category: 'Design' },

    // --- MARKETING & CONTENT ---
    { id: 'digital_marketer', name: 'Digital Marketer', icon: '📢', category: 'Marketing' },
    { id: 'seo_specialist', name: 'SEO Specialist', icon: '🔍', category: 'Marketing' },
    { id: 'content_marketer', name: 'Content Marketer', icon: '📝', category: 'Marketing' },
    { id: 'copywriter', name: 'Copywriter', icon: '✍️', category: 'Marketing' },
    { id: 'social_media', name: 'Social Media Manager', icon: '📱', category: 'Marketing' },
    { id: 'email_marketer', name: 'Email Marketing Spc', icon: '📧', category: 'Marketing' },
    { id: 'brand_manager', name: 'Brand Manager', icon: '🏷️', category: 'Marketing' },
    { id: 'growth_hacker', name: 'Growth Hacker', icon: '🚀', category: 'Marketing' },
    { id: 'pr_specialist', name: 'PR Specialist', icon: '📰', category: 'Marketing' },

    // --- BUSINESS & SALES ---
    { id: 'biz_dev', name: 'Business Dev Manager', icon: '🤝', category: 'Business' },
    { id: 'sales_rep', name: 'Sales Representative', icon: '💼', category: 'Business' },
    { id: 'account_exec', name: 'Account Executive', icon: '👔', category: 'Business' },
    { id: 'sales_manager', name: 'Sales Manager', icon: '📊', category: 'Business' },
    { id: 'customer_success', name: 'Customer Success Mgr', icon: '😊', category: 'Business' },
    { id: 'operations_mgr', name: 'Operations Manager', icon: '⚙️', category: 'Business' },
    { id: 'project_manager', name: 'Project Manager', icon: '📋', category: 'Business' },
    { id: 'program_manager', name: 'Program Manager', icon: '🗂️', category: 'Business' },
    { id: 'consultant', name: 'Management Consultant', icon: '🧐', category: 'Business' },
    { id: 'hr_manager', name: 'HR Manager', icon: '👥', category: 'Business' },
    { id: 'recruiter', name: 'Tech Recruiter', icon: '🔍', category: 'Business' },

    // --- FINANCE & LEGAL ---
    { id: 'accountant', name: 'Accountant', icon: '🧾', category: 'Finance' },
    { id: 'financial_analyst', name: 'Financial Analyst', icon: '💹', category: 'Finance' },
    { id: 'investment_banker', name: 'Investment Banker', icon: '🏦', category: 'Finance' },
    { id: 'auditor', name: 'Auditor', icon: '📋', category: 'Finance' },
    { id: 'tax_specialist', name: 'Tax Specialist', icon: '💰', category: 'Finance' },
    { id: 'corporate_lawyer', name: 'Corporate Lawyer', icon: '⚖️', category: 'Legal' },
    { id: 'paralegal', name: 'Paralegal', icon: '📎', category: 'Legal' },
    { id: 'compliance', name: 'Compliance Officer', icon: '✅', category: 'Legal' },

    // --- ENGINEERING (PHYSICAL) ---
    { id: 'mech_eng', name: 'Mechanical Engineer', icon: '⚙️', category: 'Engineering' },
    { id: 'civil_eng', name: 'Civil Engineer', icon: '🏗️', category: 'Engineering' },
    { id: 'electrical_eng', name: 'Electrical Engineer', icon: '⚡', category: 'Engineering' },
    { id: 'chemical_eng', name: 'Chemical Engineer', icon: '🧪', category: 'Engineering' },
    { id: 'aerospace_eng', name: 'Aerospace Engineer', icon: '✈️', category: 'Engineering' },
    { id: 'robotics_eng', name: 'Robotics Engineer', icon: '🤖', category: 'Engineering' },

    // --- HEALTHCARE & SCIENCE ---
    { id: 'physician', name: 'Physician / Doctor', icon: '🩺', category: 'Healthcare' },
    { id: 'nurse', name: 'Registered Nurse', icon: '🏥', category: 'Healthcare' },
    { id: 'pharmacist', name: 'Pharmacist', icon: '💊', category: 'Healthcare' },
    { id: 'dentist', name: 'Dentist', icon: '🦷', category: 'Healthcare' },
    { id: 'psychologist', name: 'Psychologist', icon: '🧠', category: 'Healthcare' },
    { id: 'biologist', name: 'Biologist', icon: '🧬', category: 'Science' },
    { id: 'chemist', name: 'Chemist', icon: '⚗️', category: 'Science' },
    { id: 'research_scientist', name: 'Research Scientist', icon: '🔬', category: 'Science' },

    // --- CREATIVE & MEDIA ---
    { id: 'video_editor', name: 'Video Editor', icon: '🎬', category: 'Creative' },
    { id: 'sound_eng', name: 'Sound Engineer', icon: '🎧', category: 'Creative' },
    { id: 'animator_3d', name: '3D Animator', icon: '🧊', category: 'Creative' },
    { id: 'photographer', name: 'Photographer', icon: '📸', category: 'Creative' },
    { id: 'journalist', name: 'Journalist', icon: '📰', category: 'Creative' },
    { id: 'fashion_designer', name: 'Fashion Designer', icon: '👗', category: 'Creative' },
    { id: 'architect', name: 'Architect', icon: '🏛️', category: 'Creative' },
    { id: 'interior_designer', name: 'Interior Designer', icon: '🛋️', category: 'Creative' },

    // --- EDUCATION ---
    { id: 'teacher', name: 'Teacher (K-12)', icon: '🍎', category: 'Education' },
    { id: 'professor', name: 'University Professor', icon: '🎓', category: 'Education' },
    { id: 'instructional', name: 'Instructional Designer', icon: '📚', category: 'Education' },
    { id: 'edu_admin', name: 'Education Admin', icon: '🏫', category: 'Education' },

    // --- SKILLED TRADES & OTHERS ---
    { id: 'chef', name: 'Executive Chef', icon: '👨‍🍳', category: 'Service' },
    { id: 'event_planner', name: 'Event Planner', icon: '🎉', category: 'Service' },
    { id: 'pilot', name: 'Airline Pilot', icon: '✈️', category: 'Service' },
    { id: 'real_estate', name: 'Real Estate Agent', icon: '🏠', category: 'Service' },
];

export const getRolesByCategory = () => {
    const categories = {};
    GLOBAL_ROLES.forEach(role => {
        if (!categories[role.category]) categories[role.category] = [];
        categories[role.category].push(role);
    });
    return categories;
};
