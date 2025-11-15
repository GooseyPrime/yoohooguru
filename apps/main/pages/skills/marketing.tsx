import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function MarketingSkills() {
  const skills = [
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      description: 'Master online marketing strategies including SEO, social media, email, and content marketing.'
    },
    {
      id: 'social-media',
      title: 'Social Media Marketing',
      description: 'Build brand presence and engage audiences across Facebook, Instagram, LinkedIn, and TikTok.'
    },
    {
      id: 'content-marketing',
      title: 'Content Marketing',
      description: 'Create compelling content that attracts, engages, and converts your target audience.'
    },
    {
      id: 'seo',
      title: 'SEO & Search Marketing',
      description: 'Optimize websites for search engines and drive organic traffic with proven SEO techniques.'
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Build email campaigns, grow subscriber lists, and maximize email marketing ROI.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Marketing"
      categoryDescription="Learn digital marketing, social media, content creation, SEO, and email marketing. Grow your brand and reach."
      skills={skills}
    />
  );
}
