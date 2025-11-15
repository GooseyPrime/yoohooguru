import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function SportsSkills() {
  const skills = [
    {
      id: 'basketball',
      title: 'Basketball',
      description: 'Improve basketball fundamentals, shooting technique, ball handling, and game strategy.'
    },
    {
      id: 'soccer',
      title: 'Soccer',
      description: 'Master soccer skills including dribbling, passing, shooting, and tactical positioning.'
    },
    {
      id: 'tennis',
      title: 'Tennis',
      description: 'Develop tennis technique, footwork, serve, and competitive match play strategies.'
    },
    {
      id: 'golf',
      title: 'Golf',
      description: 'Perfect your golf swing, putting, course management, and mental game for lower scores.'
    },
    {
      id: 'coaching',
      title: 'Sports Coaching',
      description: 'Learn coaching methods, team management, player development, and game strategy.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Sports & Athletics"
      categoryDescription="Improve skills in basketball, soccer, tennis, golf, and sports coaching. Elevate your athletic performance."
      skills={skills}
    />
  );
}
