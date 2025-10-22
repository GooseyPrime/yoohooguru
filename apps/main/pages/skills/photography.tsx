import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function PhotographySkills() {
  const skills = [
    {
      id: 'portrait',
      title: 'Portrait Photography',
      description: 'Master portrait photography techniques, lighting setups, and posing guidance for stunning portraits.'
    },
    {
      id: 'landscape',
      title: 'Landscape Photography',
      description: 'Learn composition, lighting, and post-processing techniques for breathtaking landscape photography.'
    },
    {
      id: 'wedding',
      title: 'Wedding Photography',
      description: 'Develop skills for capturing weddings including storytelling, candid shots, and working with couples.'
    },
    {
      id: 'product',
      title: 'Product Photography',
      description: 'Learn studio lighting, composition, and editing techniques for professional product photography.'
    },
    {
      id: 'photo-editing',
      title: 'Photo Editing',
      description: 'Master photo editing with Lightroom, Photoshop, and other tools to enhance your images.'
    },
    {
      id: 'videography',
      title: 'Videography & Video Editing',
      description: 'Learn video production techniques, camera work, and editing with Premiere Pro and Final Cut Pro.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Photography"
      categoryDescription="Master photography and videography skills including portrait, landscape, wedding, and product photography with professional editing techniques."
      skills={skills}
    />
  );
}