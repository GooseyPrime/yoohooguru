import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function ArtSkills() {
  const skills = [
    {
      id: 'drawing',
      title: 'Drawing & Sketching',
      description: 'Learn fundamental drawing techniques, sketching, and visual art skills from basic to advanced levels.'
    },
    {
      id: 'painting',
      title: 'Painting Techniques',
      description: 'Master various painting styles including oil, acrylic, and watercolor with guidance from professional artists.'
    },
    {
      id: 'digital-art',
      title: 'Digital Art & Illustration',
      description: 'Create stunning digital artwork using industry-standard tools like Adobe Photoshop, Procreate, and Illustrator.'
    },
    {
      id: 'sculpture',
      title: 'Sculpture & 3D Art',
      description: 'Learn sculpting techniques in various materials including clay, wood, and digital 3D modeling.'
    },
    {
      id: 'printmaking',
      title: 'Printmaking',
      description: 'Explore traditional and modern printmaking techniques including screen printing, etching, and block printing.'
    },
    {
      id: 'mixed-media',
      title: 'Mixed Media Art',
      description: 'Combine various art forms and materials to create unique mixed media artworks and installations.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Art"
      categoryDescription="Discover visual arts and creativity skills. Learn drawing, painting, digital art, sculpture, and more from expert Gurus."
      skills={skills}
    />
  );
}