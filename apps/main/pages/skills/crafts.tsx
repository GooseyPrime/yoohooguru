import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function CraftsSkills() {
  const skills = [
    {
      id: 'woodworking',
      title: 'Woodworking',
      description: 'Learn carpentry, furniture making, and wood crafting techniques from beginner to advanced levels.'
    },
    {
      id: 'knitting',
      title: 'Knitting & Crocheting',
      description: 'Master knitting and crochet techniques to create beautiful garments, accessories, and home decor.'
    },
    {
      id: 'sewing',
      title: 'Sewing & Tailoring',
      description: 'Develop sewing skills including pattern making, alterations, and creating custom clothing.'
    },
    {
      id: 'pottery',
      title: 'Pottery & Ceramics',
      description: 'Create functional and decorative pottery using hand-building and wheel-throwing techniques.'
    },
    {
      id: 'jewelry-making',
      title: 'Jewelry Making',
      description: 'Craft unique jewelry pieces using various techniques including metalworking, beading, and wire wrapping.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Crafts & DIY"
      categoryDescription="Explore hands-on craft skills including woodworking, knitting, sewing, pottery, and jewelry making. Create beautiful handmade projects."
      skills={skills}
    />
  );
}
