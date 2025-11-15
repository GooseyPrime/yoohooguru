import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function GardeningSkills() {
  const skills = [
    {
      id: 'vegetable-gardening',
      title: 'Vegetable Gardening',
      description: 'Grow fresh vegetables, herbs, and produce in your backyard or container garden.'
    },
    {
      id: 'landscaping',
      title: 'Landscaping & Design',
      description: 'Design and create beautiful outdoor spaces with professional landscaping techniques.'
    },
    {
      id: 'organic-gardening',
      title: 'Organic Gardening',
      description: 'Practice sustainable, chemical-free gardening methods for healthier plants and environment.'
    },
    {
      id: 'composting',
      title: 'Composting & Soil Health',
      description: 'Create nutrient-rich compost and maintain healthy soil for thriving gardens.'
    },
    {
      id: 'indoor-plants',
      title: 'Indoor Plant Care',
      description: 'Successfully grow and maintain houseplants, succulents, and indoor gardens.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Gardening"
      categoryDescription="Learn vegetable gardening, landscaping, organic methods, and plant care. Create beautiful, productive gardens."
      skills={skills}
    />
  );
}
