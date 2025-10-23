import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function FitnessSkills() {
  const skills = [
    {
      id: 'yoga',
      title: 'Yoga & Mindfulness',
      description: 'Learn various yoga styles, poses, and mindfulness techniques for physical and mental wellness.'
    },
    {
      id: 'strength-training',
      title: 'Strength Training',
      description: 'Master weightlifting techniques, workout planning, and progressive training for muscle building and strength.'
    },
    {
      id: 'cardio-fitness',
      title: 'Cardio & Endurance',
      description: 'Improve cardiovascular health and endurance with running, cycling, and other cardio training methods.'
    },
    {
      id: 'nutrition',
      title: 'Fitness Nutrition',
      description: 'Learn proper nutrition for athletic performance, muscle recovery, and achieving fitness goals.'
    },
    {
      id: 'personal-training',
      title: 'Personal Training',
      description: 'Develop skills to become a certified personal trainer or learn to work with a personal trainer effectively.'
    },
    {
      id: 'sports-conditioning',
      title: 'Sports Conditioning',
      description: 'Specialized training programs for specific sports performance and injury prevention.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Fitness"
      categoryDescription="Master fitness and wellness skills including yoga, strength training, cardio, and sports conditioning with expert guidance."
      skills={skills}
    />
  );
}