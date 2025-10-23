import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function TechSkills() {
  const skills = [
    {
      id: 'computer-basics',
      title: 'Computer Basics & Troubleshooting',
      description: 'Learn fundamental computer skills, troubleshooting common issues, and basic maintenance techniques.'
    },
    {
      id: 'smartphone-tips',
      title: 'Smartphone & Tablet Tips',
      description: 'Master your smartphone or tablet with productivity tips, apps, and customization techniques.'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Privacy',
      description: 'Learn to protect your digital privacy and secure your devices from cyber threats and attacks.'
    },
    {
      id: 'tech-seniors',
      title: 'Tech for Seniors',
      description: 'Specialized technology training designed for older adults to navigate modern digital tools confidently.'
    },
    {
      id: 'smart-home',
      title: 'Smart Home Setup',
      description: 'Learn to set up and manage smart home devices including security systems, lighting, and automation.'
    },
    {
      id: 'product-reviews',
      title: 'Tech Product Reviews',
      description: 'Develop skills for evaluating and reviewing technology products to make informed purchasing decisions.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Technology"
      categoryDescription="Master essential technology skills including computer basics, smartphone tips, cybersecurity, and smart home setup for users of all ages."
      skills={skills}
    />
  );
}