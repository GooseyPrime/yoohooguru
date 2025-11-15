import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function HistorySkills() {
  const skills = [
    {
      id: 'world-history',
      title: 'World History',
      description: 'Explore major civilizations, events, and movements that shaped human history across the globe.'
    },
    {
      id: 'american-history',
      title: 'American History',
      description: 'Study U.S. history from colonial times through modern era, including key events and figures.'
    },
    {
      id: 'historical-research',
      title: 'Historical Research Methods',
      description: 'Learn to conduct historical research, analyze primary sources, and evaluate historical evidence.'
    },
    {
      id: 'genealogy',
      title: 'Genealogy & Family History',
      description: 'Trace your family roots, build family trees, and preserve family history for future generations.'
    },
    {
      id: 'ancient-civilizations',
      title: 'Ancient Civilizations',
      description: 'Discover ancient cultures including Egypt, Greece, Rome, and Mesopotamia.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="History"
      categoryDescription="Study world history, American history, historical research, and genealogy. Understand the past to inform the present."
      skills={skills}
    />
  );
}
