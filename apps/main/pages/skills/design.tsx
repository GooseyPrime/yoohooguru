import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function DesignSkills() {
  const skills = [
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      description: 'Master graphic design principles, typography, and visual communication using Adobe Creative Suite.'
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design',
      description: 'Create user-centered digital experiences with modern UI/UX design tools like Figma and Adobe XD.'
    },
    {
      id: 'branding',
      title: 'Branding & Identity',
      description: 'Develop cohesive brand identities including logos, color palettes, and brand guidelines.'
    },
    {
      id: 'web-design',
      title: 'Web Design',
      description: 'Design beautiful, responsive websites with HTML, CSS, and modern design frameworks.'
    },
    {
      id: 'illustration',
      title: 'Digital Illustration',
      description: 'Create stunning digital illustrations for branding, editorial, and commercial projects.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Design"
      categoryDescription="Learn graphic design, UI/UX, branding, web design, and digital illustration. Create professional visual designs."
      skills={skills}
    />
  );
}
