const subdomainConfig = {
  art: {
    icon: '🎨',
    name: 'Art',
    description: 'Master painting, drawing, sculpture, and digital art with expert guidance from professional artists.',
    gradient: 'from-pink-500 to-purple-500',
    articles: 167,
    gurus: '200+',
    students: '3K+',
    categories: [
      { icon: '🖼️', name: 'Painting', count: 67 },
      { icon: '✏️', name: 'Drawing', count: 45 },
      { icon: '🗿', name: 'Sculpture', count: 23 },
      { icon: '💻', name: 'Digital Art', count: 89 },
      { icon: '🎨', name: 'Mixed Media', count: 34 },
      { icon: '📷', name: 'Photography', count: 56 },
      { icon: '🖌️', name: 'Watercolor', count: 28 },
      { icon: '🎭', name: 'Illustration', count: 41 }
    ]
  },
  business: {
    icon: '💼',
    name: 'Business',
    description: 'Build your entrepreneurial skills with expert guidance on startups, management, and business strategy.',
    gradient: 'from-blue-500 to-cyan-500',
    articles: 189,
    gurus: '300+',
    students: '5K+',
    categories: [
      { icon: '🚀', name: 'Startups', count: 78 },
      { icon: '📊', name: 'Management', count: 89 },
      { icon: '💰', name: 'Finance', count: 56 },
      { icon: '📱', name: 'Marketing', count: 94 },
      { icon: '🤝', name: 'Leadership', count: 67 },
      { icon: '📈', name: 'Strategy', count: 45 },
      { icon: '💼', name: 'Consulting', count: 34 },
      { icon: '🌍', name: 'International', count: 28 }
    ]
  },
  coding: {
    icon: '💻',
    name: 'Coding',
    description: 'Master programming languages and software development with expert developers from top tech companies.',
    gradient: 'from-green-500 to-emerald-500',
    articles: 234,
    gurus: '400+',
    students: '8K+',
    categories: [
      { icon: '⚛️', name: 'React', count: 89 },
      { icon: '🐍', name: 'Python', count: 123 },
      { icon: '🌐', name: 'JavaScript', count: 145 },
      { icon: '📱', name: 'Mobile Dev', count: 67 },
      { icon: '🔧', name: 'Backend', count: 98 },
      { icon: '🎨', name: 'Frontend', count: 112 },
      { icon: '🤖', name: 'AI/ML', count: 78 },
      { icon: '🔒', name: 'Cybersecurity', count: 45 }
    ]
  },
  cooking: {
    icon: '🍳',
    name: 'Cooking',
    description: 'Learn culinary arts from professional chefs and passionate home cooks.',
    gradient: 'from-orange-500 to-red-500',
    articles: 156,
    gurus: '250+',
    students: '4K+',
    categories: [
      { icon: '🍕', name: 'Italian', count: 67 },
      { icon: '🥘', name: 'Asian', count: 89 },
      { icon: '🥖', name: 'Baking', count: 78 },
      { icon: '🍷', name: 'Wine', count: 34 },
      { icon: '🥗', name: 'Healthy', count: 56 },
      { icon: '🍔', name: 'Grilling', count: 45 },
      { icon: '🍰', name: 'Desserts', count: 67 },
      { icon: '🌮', name: 'Mexican', count: 38 }
    ]
  },
  crafts: {
    icon: '✂️',
    name: 'Crafts',
    description: 'Discover the joy of handmade creations with expert crafters and artisans.',
    gradient: 'from-yellow-500 to-orange-500',
    articles: 143,
    gurus: '180+',
    students: '2.5K+',
    categories: [
      { icon: '🧶', name: 'Knitting', count: 56 },
      { icon: '🧵', name: 'Sewing', count: 67 },
      { icon: '🎨', name: 'DIY Projects', count: 89 },
      { icon: '📿', name: 'Jewelry', count: 34 },
      { icon: '🪵', name: 'Woodworking', count: 45 },
      { icon: '🕯️', name: 'Candles', count: 23 },
      { icon: '🎭', name: 'Puppetry', count: 18 },
      { icon: '🖼️', name: 'Scrapbooking', count: 29 }
    ]
  },
  data: {
    icon: '📊',
    name: 'Data',
    description: 'Master data analysis, visualization, and data science with industry experts.',
    gradient: 'from-indigo-500 to-purple-500',
    articles: 178,
    gurus: '220+',
    students: '3.5K+',
    categories: [
      { icon: '📈', name: 'Analytics', count: 89 },
      { icon: '📊', name: 'Visualization', count: 67 },
      { icon: '🤖', name: 'Machine Learning', count: 78 },
      { icon: '🗃️', name: 'Big Data', count: 45 },
      { icon: '📱', name: 'Mobile Analytics', count: 34 },
      { icon: '🔍', name: 'Data Mining', count: 56 },
      { icon: '📊', name: 'Statistics', count: 45 },
      { icon: '🌐', name: 'Web Analytics', count: 38 }
    ]
  },
  design: {
    icon: '🎨',
    name: 'Design',
    description: 'Learn graphic design, UI/UX, and creative direction from professional designers.',
    gradient: 'from-purple-500 to-pink-500',
    articles: 201,
    gurus: '280+',
    students: '4.5K+',
    categories: [
      { icon: '🎨', name: 'Graphic Design', count: 89 },
      { icon: '📱', name: 'UI Design', count: 94 },
      { icon: '👤', name: 'UX Design', count: 87 },
      { icon: '🎭', name: 'Branding', count: 56 },
      { icon: '🌐', name: 'Web Design', count: 67 },
      { icon: '📦', name: 'Product Design', count: 45 },
      { icon: '🎯', name: 'Logo Design', count: 34 },
      { icon: '📖', name: 'Typography', count: 28 }
    ]
  },
  finance: {
    icon: '💰',
    name: 'Finance',
    description: 'Take control of your finances with expert guidance on investing, budgeting, and wealth management.',
    gradient: 'from-green-500 to-teal-500',
    articles: 167,
    gurus: '200+',
    students: '6K+',
    categories: [
      { icon: '📈', name: 'Investing', count: 89 },
      { icon: '💳', name: 'Personal Finance', count: 78 },
      { icon: '🏠', name: 'Real Estate', count: 56 },
      { icon: '💼', name: 'Corporate Finance', count: 45 },
      { icon: '🪙', name: 'Crypto', count: 67 },
      { icon: '📊', name: 'Trading', count: 34 },
      { icon: '💰', name: 'Wealth Management', count: 28 },
      { icon: '🏦', name: 'Banking', count: 23 }
    ]
  },
  fitness: {
    icon: '💪',
    name: 'Fitness',
    description: 'Transform your body and health with certified personal trainers and fitness experts.',
    gradient: 'from-red-500 to-orange-500',
    articles: 134,
    gurus: '180+',
    students: '5K+',
    categories: [
      { icon: '🏋️', name: 'Weight Training', count: 67 },
      { icon: '🧘', name: 'Yoga', count: 56 },
      { icon: '🏃', name: 'Cardio', count: 45 },
      { icon: '🥊', name: 'Boxing', count: 34 },
      { icon: '🏊', name: 'Swimming', count: 28 },
      { icon: '🚴', name: 'Cycling', count: 23 },
      { icon: '🤸', name: 'Gymnastics', count: 19 },
      { icon: '💪', name: 'CrossFit', count: 41 }
    ]
  },
  gardening: {
    icon: '🌱',
    name: 'Gardening',
    description: 'Grow your green thumb with expert gardeners and horticulturists.',
    gradient: 'from-green-500 to-emerald-500',
    articles: 112,
    gurus: '120+',
    students: '2K+',
    categories: [
      { icon: '🌹', name: 'Flowers', count: 45 },
      { icon: '🥕', name: 'Vegetables', count: 56 },
      { icon: '🌿', name: 'Herbs', count: 23 },
      { icon: '🌳', name: 'Trees', count: 19 },
      { icon: '🏡', name: 'Landscaping', count: 34 },
      { icon: '🌺', name: 'Tropical', count: 28 },
      { icon: '🍅', name: 'Organic', count: 41 },
      { icon: '🏺', name: 'Container', count: 29 }
    ]
  },
  history: {
    icon: '📚',
    name: 'History',
    description: 'Explore the past with expert historians and archaeologists.',
    gradient: 'from-amber-500 to-orange-500',
    articles: 145,
    gurus: '150+',
    students: '2.5K+',
    categories: [
      { icon: '🏛️', name: 'Ancient', count: 56 },
      { icon: '⚔️', name: 'Military', count: 34 },
      { icon: '👑', name: 'Royalty', count: 23 },
      { icon: '🗺️', name: 'Geography', count: 19 },
      { icon: '🏺', name: 'Archaeology', count: 28 },
      { icon: '📜', name: 'Medieval', count: 34 },
      { icon: '🌍', name: 'World Wars', count: 21 },
      { icon: '📖', name: 'Cultural', count: 39 }
    ]
  },
  home: {
    icon: '🏠',
    name: 'Home',
    description: 'Transform your living space with expert interior designers and home improvement specialists.',
    gradient: 'from-blue-500 to-indigo-500',
    articles: 198,
    gurus: '220+',
    students: '4K+',
    categories: [
      { icon: '🛋️', name: 'Furniture', count: 67 },
      { icon: '🎨', name: 'Interior Design', count: 78 },
      { icon: '🔨', name: 'DIY', count: 89 },
      { icon: '🏡', name: 'Organization', count: 56 },
      { icon: '🌿', name: 'Garden', count: 45 },
      { icon: '💡', name: 'Lighting', count: 34 },
      { icon: '🎭', name: 'Decor', count: 67 },
      { icon: '🔧', name: 'Repairs', count: 43 }
    ]
  },
  investing: {
    icon: '📈',
    name: 'Investing',
    description: 'Build wealth with expert investors and financial analysts.',
    gradient: 'from-emerald-500 to-teal-500',
    articles: 187,
    gurus: '200+',
    students: '7K+',
    categories: [
      { icon: '📊', name: 'Stocks', count: 89 },
      { icon: '🏠', name: 'Real Estate', count: 67 },
      { icon: '💎', name: 'Commodities', count: 34 },
      { icon: '🪙', name: 'Crypto', count: 56 },
      { icon: '💼', name: 'ETFs', count: 45 },
      { icon: '🌍', name: 'International', count: 28 },
      { icon: '📱', name: 'Robo-Advisors', count: 23 },
      { icon: '💰', name: 'Portfolio', count: 41 }
    ]
  },
  language: {
    icon: '🗣️',
    name: 'Language',
    description: 'Master new languages with native speakers and expert linguists.',
    gradient: 'from-blue-500 to-cyan-500',
    articles: 156,
    gurus: '250+',
    students: '8K+',
    categories: [
      { icon: '🇪🇸', name: 'Spanish', count: 78 },
      { icon: '🇫🇷', name: 'French', count: 67 },
      { icon: '🇩🇪', name: 'German', count: 56 },
      { icon: '🇮🇹', name: 'Italian', count: 34 },
      { icon: '🇯🇵', name: 'Japanese', count: 45 },
      { icon: '🇰🇷', name: 'Korean', count: 23 },
      { icon: '🇨🇳', name: 'Mandarin', count: 89 },
      { icon: '🇸🇦', name: 'Arabic', count: 19 }
    ]
  },
  marketing: {
    icon: '📱',
    name: 'Marketing',
    description: 'Master digital marketing with experts from leading agencies and brands.',
    gradient: 'from-purple-500 to-indigo-500',
    articles: 223,
    gurus: '300+',
    students: '6K+',
    categories: [
      { icon: '📧', name: 'Email Marketing', count: 56 },
      { icon: '📱', name: 'Social Media', count: 89 },
      { icon: '🔍', name: 'SEO', count: 78 },
      { icon: '💰', name: 'PPC', count: 45 },
      { icon: '🎬', name: 'Content', count: 67 },
      { icon: '📊', name: 'Analytics', count: 34 },
      { icon: '🎯', name: 'Conversion', count: 28 },
      { icon: '🤖', name: 'Marketing Automation', count: 41 }
    ]
  },
  math: {
    icon: '🔢',
    name: 'Math',
    description: 'Master mathematics from basics to advanced concepts with expert mathematicians.',
    gradient: 'from-blue-500 to-indigo-500',
    articles: 134,
    gurus: '150+',
    students: '3K+',
    categories: [
      { icon: '📐', name: 'Geometry', count: 45 },
      { icon: '📊', name: 'Statistics', count: 56 },
      { icon: '🧮', name: 'Algebra', count: 67 },
      { icon: '∞', name: 'Calculus', count: 34 },
      { icon: '🎲', name: 'Probability', count: 23 },
      { icon: '🔢', name: 'Number Theory', count: 19 },
      { icon: '📈', name: 'Applied Math', count: 41 },
      { icon: '🧠', name: 'Logic', count: 28 }
    ]
  },
  music: {
    icon: '🎵',
    name: 'Music',
    description: 'Master the art of music with expert guidance from professional musicians.',
    gradient: 'from-purple-500 to-indigo-500',
    articles: 178,
    gurus: '250+',
    students: '5K+',
    categories: [
      { icon: '🎹', name: 'Piano', count: 45 },
      { icon: '🎸', name: 'Guitar', count: 67 },
      { icon: '🥁', name: 'Drums', count: 34 },
      { icon: '🎺', name: 'Brass', count: 23 },
      { icon: '🎻', name: 'Strings', count: 56 },
      { icon: '🎤', name: 'Vocals', count: 78 },
      { icon: '🎧', name: 'Production', count: 89 },
      { icon: '🎼', name: 'Theory', count: 45 }
    ]
  },
  photography: {
    icon: '📷',
    name: 'Photography',
    description: 'Capture stunning photos with guidance from professional photographers.',
    gradient: 'from-pink-500 to-purple-500',
    articles: 165,
    gurus: '200+',
    students: '4K+',
    categories: [
      { icon: '📷', name: 'Portrait', count: 67 },
      { icon: '🌅', name: 'Landscape', count: 56 },
      { icon: '🏙️', name: 'Street', count: 34 },
      { icon: '🐾', name: 'Wildlife', count: 23 },
      { icon: '🎭', name: 'Fine Art', count: 28 },
      { icon: '📱', name: 'Mobile', count: 45 },
      { icon: '💡', name: 'Lighting', count: 39 },
      { icon: '🎬', name: 'Video', count: 31 }
    ]
  },
  sales: {
    icon: '💼',
    name: 'Sales',
    description: 'Master sales techniques with top performers and sales experts.',
    gradient: 'from-green-500 to-emerald-500',
    articles: 143,
    gurus: '180+',
    students: '3.5K+',
    categories: [
      { icon: '🤝', name: 'Negotiation', count: 56 },
      { icon: '📞', name: 'Cold Calling', count: 34 },
      { icon: '🎯', name: 'Closing', count: 45 },
      { icon: '👥', name: 'B2B Sales', count: 67 },
      { icon: '🏠', name: 'Real Estate', count: 28 },
      { icon: '🚗', name: 'Auto', count: 23 },
      { icon: '💻', name: 'Tech Sales', count: 41 },
      { icon: '📱', name: 'SaaS', count: 34 }
    ]
  },
  science: {
    icon: '🔬',
    name: 'Science',
    description: 'Explore scientific concepts with expert scientists and researchers.',
    gradient: 'from-blue-500 to-cyan-500',
    articles: 156,
    gurus: '200+',
    students: '4K+',
    categories: [
      { icon: '🧬', name: 'Biology', count: 67 },
      { icon: '⚛️', name: 'Chemistry', count: 56 },
      { icon: '🌍', name: 'Physics', count: 45 },
      { icon: '🧪', name: 'Lab', count: 34 },
      { icon: '🔭', name: 'Astronomy', count: 23 },
      { icon: '🌊', name: 'Oceanography', count: 19 },
      { icon: '🌡️', name: 'Climate', count: 28 },
      { icon: '🧠', name: 'Neuroscience', count: 31 }
    ]
  },
  sports: {
    icon: '⚽',
    name: 'Sports',
    description: 'Master any sport with professional athletes and expert coaches.',
    gradient: 'from-green-500 to-emerald-500',
    articles: 134,
    gurus: '180+',
    students: '6K+',
    categories: [
      { icon: '⚽', name: 'Soccer', count: 67 },
      { icon: '🏀', name: 'Basketball', count: 56 },
      { icon: '🏈', name: 'Football', count: 45 },
      { icon: '⚾', name: 'Baseball', count: 34 },
      { icon: '🎾', name: 'Tennis', count: 28 },
      { icon: '🏐', name: 'Volleyball', count: 23 },
      { icon: '🏊', name: 'Swimming', count: 41 },
      { icon: '🏃', name: 'Track & Field', count: 29 }
    ]
  },
  tech: {
    icon: '💻',
    name: 'Tech',
    description: 'Stay ahead in technology with expert guidance from tech industry leaders.',
    gradient: 'from-cyan-500 to-blue-500',
    articles: 245,
    gurus: '400+',
    students: '10K+',
    categories: [
      { icon: '🤖', name: 'AI', count: 89 },
      { icon: '🔒', name: 'Cybersecurity', count: 78 },
      { icon: '☁️', name: 'Cloud', count: 67 },
      { icon: '📱', name: 'Mobile', count: 56 },
      { icon: '🌐', name: 'Web Dev', count: 94 },
      { icon: '📊', name: 'Data', count: 45 },
      { icon: '🔧', name: 'DevOps', count: 34 },
      { icon: '🚀', name: 'Space Tech', count: 23 }
    ]
  },
  wellness: {
    icon: '🧘',
    name: 'Wellness',
    description: 'Achieve holistic health and wellness with certified health experts.',
    gradient: 'from-teal-500 to-green-500',
    articles: 167,
    gurus: '220+',
    students: '8K+',
    categories: [
      { icon: '🧘', name: 'Meditation', count: 67 },
      { icon: '💆', name: 'Massage', count: 34 },
      { icon: '🥗', name: 'Nutrition', count: 56 },
      { icon: '😴', name: 'Sleep', count: 23 },
      { icon: '🏃', name: 'Exercise', count: 45 },
      { icon: '🌿', name: 'Herbal', count: 28 },
      { icon: '💊', name: 'Supplements', count: 19 },
      { icon: '🧠', name: 'Mental Health', count: 41 }
    ]
  },
  writing: {
    icon: '✍️',
    name: 'Writing',
    description: 'Master the craft of writing with published authors and writing coaches.',
    gradient: 'from-indigo-500 to-purple-500',
    articles: 189,
    gurus: '250+',
    students: '4.5K+',
    categories: [
      { icon: '📖', name: 'Fiction', count: 78 },
      { icon: '📰', name: 'Journalism', count: 56 },
      { icon: '🎭', name: 'Screenwriting', count: 34 },
      { icon: '📝', name: 'Copywriting', count: 67 },
      { icon: '📚', name: 'Technical', count: 23 },
      { icon: '✍️', name: 'Creative', count: 45 },
      { icon: '🎯', name: 'Business', count: 28 },
      { icon: '🌟', name: 'Poetry', count: 19 }
    ]
  }
};

module.exports = subdomainConfig;