import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function SalesSkills() {
  const skills = [
    {
      id: 'sales-techniques',
      title: 'Sales Techniques',
      description: 'Master proven sales methods, closing strategies, and persuasion techniques for any industry.'
    },
    {
      id: 'negotiation',
      title: 'Negotiation Skills',
      description: 'Develop powerful negotiation tactics to close deals and create win-win outcomes.'
    },
    {
      id: 'b2b-sales',
      title: 'B2B Sales',
      description: 'Excel in business-to-business sales including account management and enterprise selling.'
    },
    {
      id: 'customer-relations',
      title: 'Customer Relationship Management',
      description: 'Build lasting customer relationships, manage CRM systems, and maximize customer lifetime value.'
    },
    {
      id: 'cold-calling',
      title: 'Cold Calling & Prospecting',
      description: 'Generate leads and book appointments through effective cold calling and prospecting strategies.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Sales"
      categoryDescription="Master sales techniques, negotiation, B2B sales, customer relations, and prospecting. Close more deals and grow revenue."
      skills={skills}
    />
  );
}
