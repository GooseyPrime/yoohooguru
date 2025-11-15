import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function MathSkills() {
  const skills = [
    {
      id: 'algebra',
      title: 'Algebra',
      description: 'Master algebraic concepts including equations, functions, and problem-solving techniques.'
    },
    {
      id: 'calculus',
      title: 'Calculus',
      description: 'Learn differential and integral calculus for advanced mathematics and real-world applications.'
    },
    {
      id: 'statistics',
      title: 'Statistics & Probability',
      description: 'Understand statistical analysis, probability theory, and data interpretation methods.'
    },
    {
      id: 'geometry',
      title: 'Geometry & Trigonometry',
      description: 'Study geometric shapes, spatial reasoning, and trigonometric functions and identities.'
    },
    {
      id: 'applied-math',
      title: 'Applied Mathematics',
      description: 'Apply mathematical concepts to solve real-world problems in science, engineering, and finance.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Mathematics"
      categoryDescription="Master algebra, calculus, statistics, geometry, and applied mathematics. Build strong mathematical foundations."
      skills={skills}
    />
  );
}
