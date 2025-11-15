import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function InvestingSkills() {
  const skills = [
    {
      id: 'stock-market',
      title: 'Stock Market Investing',
      description: 'Learn to invest in stocks, analyze companies, and build a diversified investment portfolio.'
    },
    {
      id: 'real-estate',
      title: 'Real Estate Investing',
      description: 'Invest in rental properties, REITs, and real estate for long-term wealth building.'
    },
    {
      id: 'retirement-planning',
      title: 'Retirement Planning',
      description: 'Build retirement wealth through 401(k)s, IRAs, and strategic investment planning.'
    },
    {
      id: 'portfolio-management',
      title: 'Portfolio Management',
      description: 'Construct and manage investment portfolios with proper asset allocation and risk management.'
    },
    {
      id: 'options-trading',
      title: 'Options & Trading',
      description: 'Understand options trading, derivatives, and advanced investment strategies.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Investing"
      categoryDescription="Master stock market investing, real estate, retirement planning, and portfolio management. Build wealth through smart investing."
      skills={skills}
    />
  );
}
