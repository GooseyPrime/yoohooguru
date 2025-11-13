export interface SubjectConfig {
  icon: string;
  gradient: string;
  title: string;
  description: string;
}

export const subjectConfigs: Record<string, SubjectConfig> = {
  art: {
    icon: '🎨',
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    title: 'Art & Design',
    description: 'Master painting, drawing, digital art, and creative expression with expert guidance'
  },
  business: {
    icon: '💼',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    title: 'Business & Entrepreneurship',
    description: 'Learn business strategy, entrepreneurship, management, and leadership skills'
  },
  coding: {
    icon: '💻',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    title: 'Programming & Development',
    description: 'Master coding languages, web development, software engineering, and app creation'
  },
  cooking: {
    icon: '👨‍🍳',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    title: 'Cooking & Culinary Arts',
    description: 'Discover recipes, cooking techniques, nutrition, and culinary expertise'
  },
  crafts: {
    icon: '✂️',
    gradient: 'from-yellow-500 via-orange-500 to-red-500',
    title: 'Crafts & DIY Projects',
    description: 'Learn handicrafts, DIY projects, knitting, sewing, and creative making'
  },
  data: {
    icon: '📊',
    gradient: 'from-purple-500 via-blue-500 to-cyan-500',
    title: 'Data Science & Analytics',
    description: 'Master data analysis, machine learning, statistics, and data visualization'
  },
  design: {
    icon: '🎨',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    title: 'Design & UX/UI',
    description: 'Learn graphic design, user experience, interface design, and visual communication'
  },
  finance: {
    icon: '💰',
    gradient: 'from-green-500 via-emerald-500 to-blue-500',
    title: 'Finance & Investment',
    description: 'Understand financial markets, investing, personal finance, and wealth building'
  },
  fitness: {
    icon: '💪',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    title: 'Fitness & Health',
    description: 'Achieve your fitness goals with workout plans, nutrition, and health coaching'
  },
  gardening: {
    icon: '🌱',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    title: 'Gardening & Horticulture',
    description: 'Learn gardening, plant care, landscaping, and sustainable growing practices'
  },
  history: {
    icon: '📚',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    title: 'History & Culture',
    description: 'Explore historical events, cultural studies, archaeology, and historical analysis'
  },
  home: {
    icon: '🏠',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    title: 'Home & Living',
    description: 'Master home organization, interior design, DIY repairs, and sustainable living'
  },
  investing: {
    icon: '📈',
    gradient: 'from-green-500 via-blue-500 to-purple-500',
    title: 'Investing & Trading',
    description: 'Learn stock trading, portfolio management, cryptocurrency, and investment strategies'
  },
  language: {
    icon: '🌍',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    title: 'Language Learning',
    description: 'Master new languages, improve communication skills, and explore world cultures'
  },
  marketing: {
    icon: '📱',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    title: 'Marketing & Digital Marketing',
    description: 'Learn marketing strategies, SEO, social media marketing, and brand development'
  },
  math: {
    icon: '🔢',
    gradient: 'from-blue-500 via-purple-500 to-indigo-500',
    title: 'Mathematics & Statistics',
    description: 'Master mathematics, calculus, algebra, statistics, and quantitative reasoning'
  },
  music: {
    icon: '🎵',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    title: 'Music & Instruments',
    description: 'Learn music theory, instrument playing, composition, and audio production'
  },
  photography: {
    icon: '📷',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    title: 'Photography & Videography',
    description: 'Master photography techniques, camera skills, editing, and visual storytelling'
  },
  sales: {
    icon: '💹',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    title: 'Sales & Negotiation',
    description: 'Develop sales skills, negotiation techniques, customer relationship management'
  },
  science: {
    icon: '🔬',
    gradient: 'from-blue-500 via-cyan-500 to-green-500',
    title: 'Science & Research',
    description: 'Explore biology, chemistry, physics, environmental science, and research methods'
  },
  sports: {
    icon: '⚽',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    title: 'Sports & Athletics',
    description: 'Improve athletic performance, learn sports techniques, and fitness training'
  },
  tech: {
    icon: '🚀',
    gradient: 'from-purple-500 via-blue-500 to-cyan-500',
    title: 'Technology & Innovation',
    description: 'Stay current with emerging tech, AI, blockchain, and technological innovations'
  },
  wellness: {
    icon: '🧘',
    gradient: 'from-green-500 via-teal-500 to-blue-500',
    title: 'Wellness & Mental Health',
    description: 'Focus on mental health, mindfulness, stress management, and holistic wellness'
  },
  writing: {
    icon: '✍️',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    title: 'Writing & Literature',
    description: 'Improve writing skills, creative writing, literature analysis, and content creation'
  }
};

export const getSubjectConfig = (subject: string): SubjectConfig => {
  return subjectConfigs[subject] || {
    icon: '📚',
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    title: subject.charAt(0).toUpperCase() + subject.slice(1),
    description: `Discover the best ${subject} resources, tutorials, and expert guidance`
  };
};

export const getAllSubjects = (): string[] => {
  return Object.keys(subjectConfigs);
};

export const getFeaturedSubjects = (): SubjectConfig[] => {
  return [
    subjectConfigs.coding,
    subjectConfigs.business,
    subjectConfigs.design,
    subjectConfigs.music,
    subjectConfigs.fitness,
    subjectConfigs.language
  ];
};