import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function HomeSkills() {
  const skills = [
    {
      id: 'home-repair',
      title: 'Home Repair & Maintenance',
      description: 'Fix common household issues including plumbing, electrical, and structural repairs.'
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      description: 'Create beautiful, functional living spaces with professional interior design principles.'
    },
    {
      id: 'home-organization',
      title: 'Home Organization',
      description: 'Declutter and organize your home with effective storage solutions and organizational systems.'
    },
    {
      id: 'cleaning',
      title: 'Deep Cleaning Techniques',
      description: 'Master professional cleaning methods for a spotless, healthy home environment.'
    },
    {
      id: 'renovation',
      title: 'Home Renovation',
      description: 'Plan and execute home improvement projects from small updates to major renovations.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Home Improvement"
      categoryDescription="Learn home repair, interior design, organization, cleaning, and renovation skills. Maintain and improve your living space."
      skills={skills}
    />
  );
}
