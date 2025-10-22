import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function WellnessSkills() {
  const skills = [
    {
      id: 'meditation',
      title: 'Meditation & Mindfulness',
      description: 'Learn meditation techniques, mindfulness practices, and stress reduction methods for mental wellness.'
    },
    {
      id: 'stress-management',
      title: 'Stress Management',
      description: 'Develop effective strategies for managing stress, building resilience, and maintaining emotional balance.'
    },
    {
      id: 'work-life-balance',
      title: 'Work-Life Balance',
      description: 'Master techniques for achieving better work-life integration and preventing burnout in modern life.'
    },
    {
      id: 'self-care',
      title: 'Self-Care Practices',
      description: 'Learn comprehensive self-care routines that promote physical, mental, and emotional wellbeing.'
    },
    {
      id: 'emotional-intelligence',
      title: 'Emotional Intelligence',
      description: 'Develop emotional awareness, empathy, and interpersonal skills for better relationships and leadership.'
    },
    {
      id: 'positive-psychology',
      title: 'Positive Psychology',
      description: 'Learn evidence-based practices for cultivating happiness, optimism, and psychological wellbeing.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Wellness"
      categoryDescription="Discover mental wellness and self-care skills including meditation, stress management, and emotional intelligence with expert guidance."
      skills={skills}
    />
  );
}