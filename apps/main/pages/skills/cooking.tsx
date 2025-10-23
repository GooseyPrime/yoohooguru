import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function CookingSkills() {
  const skills = [
    {
      id: 'baking',
      title: 'Baking & Pastry',
      description: 'Master the art of baking breads, pastries, cakes, and desserts with professional techniques and recipes.'
    },
    {
      id: 'international-cuisine',
      title: 'International Cuisines',
      description: 'Learn authentic recipes and cooking techniques from cuisines around the world including Italian, Mexican, and Asian.'
    },
    {
      id: 'meal-planning',
      title: 'Meal Planning & Prep',
      description: 'Develop efficient meal planning skills and preparation techniques for healthy, time-saving meals throughout the week.'
    },
    {
      id: 'knife-skills',
      title: 'Knife Skills & Techniques',
      description: 'Master professional knife handling, cutting techniques, and kitchen safety for efficient food preparation.'
    },
    {
      id: 'healthy-cooking',
      title: 'Healthy Cooking',
      description: 'Learn to prepare nutritious, balanced meals that are both delicious and beneficial for your health and wellness.'
    },
    {
      id: 'grilling',
      title: 'Grilling & BBQ',
      description: 'Perfect your outdoor cooking skills with grilling techniques, BBQ recipes, and smoking methods for all occasions.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Cooking"
      categoryDescription="Learn culinary arts and cooking skills from professional chefs. Master baking, international cuisines, healthy cooking, and more."
      skills={skills}
    />
  );
}