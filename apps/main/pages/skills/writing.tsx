import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function WritingSkills() {
  const skills = [
    {
      id: 'creative-writing',
      title: 'Creative Writing',
      description: 'Develop storytelling skills, character development, and narrative techniques for fiction writing.'
    },
    {
      id: 'copywriting',
      title: 'Copywriting',
      description: 'Write persuasive marketing copy, sales pages, and advertisements that convert.'
    },
    {
      id: 'technical-writing',
      title: 'Technical Writing',
      description: 'Create clear documentation, manuals, and technical content for specialized audiences.'
    },
    {
      id: 'blogging',
      title: 'Blogging & Content Creation',
      description: 'Build successful blogs, write engaging content, and grow your online audience.'
    },
    {
      id: 'editing',
      title: 'Editing & Proofreading',
      description: 'Master editing techniques, grammar, style, and polish written content to perfection.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Writing"
      categoryDescription="Master creative writing, copywriting, technical writing, blogging, and editing. Craft compelling written content."
      skills={skills}
    />
  );
}
