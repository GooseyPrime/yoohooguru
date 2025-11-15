import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function ScienceSkills() {
  const skills = [
    {
      id: 'biology',
      title: 'Biology & Life Sciences',
      description: 'Study living organisms, cellular biology, genetics, and ecosystem dynamics.'
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      description: 'Understand chemical reactions, molecular structures, and laboratory techniques.'
    },
    {
      id: 'physics',
      title: 'Physics',
      description: 'Explore mechanics, electromagnetism, thermodynamics, and quantum physics principles.'
    },
    {
      id: 'environmental-science',
      title: 'Environmental Science',
      description: 'Learn about ecosystems, climate change, sustainability, and environmental conservation.'
    },
    {
      id: 'lab-techniques',
      title: 'Laboratory Techniques',
      description: 'Master scientific methodology, experimental design, and laboratory safety protocols.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Science"
      categoryDescription="Explore biology, chemistry, physics, environmental science, and laboratory techniques. Understand the natural world."
      skills={skills}
    />
  );
}
