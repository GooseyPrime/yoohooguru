import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function BusinessSkills() {
  const skills = [
    {
      id: 'business-planning',
      title: 'Business Planning & Strategy',
      description: 'Learn to create effective business plans, strategic frameworks, and growth models for startups and established companies.'
    },
    {
      id: 'marketing',
      title: 'Marketing & Branding',
      description: 'Master digital marketing, brand development, and customer acquisition strategies for businesses of all sizes.'
    },
    {
      id: 'leadership',
      title: 'Leadership & Management',
      description: 'Develop leadership skills, team management techniques, and organizational strategies for effective business leadership.'
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship',
      description: 'Learn the fundamentals of starting and running a successful business, from ideation to execution.'
    },
    {
      id: 'project-management',
      title: 'Project Management',
      description: 'Master project planning, execution, and delivery using methodologies like Agile, Scrum, and traditional project management.'
    },
    {
      id: 'business-analytics',
      title: 'Business Analytics',
      description: 'Analyze business data, create insights, and make data-driven decisions to improve organizational performance.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Business"
      categoryDescription="Master essential business skills including entrepreneurship, marketing, leadership, and analytics. Learn from successful business professionals and entrepreneurs."
      skills={skills}
    />
  );
}