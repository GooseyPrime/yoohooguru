import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function FinanceSkills() {
  const skills = [
    {
      id: 'personal-finance',
      title: 'Personal Finance Management',
      description: 'Master budgeting, saving strategies, debt management, and building wealth for financial independence.'
    },
    {
      id: 'accounting',
      title: 'Accounting Fundamentals',
      description: 'Learn accounting principles, financial statements, bookkeeping, and tax preparation basics.'
    },
    {
      id: 'financial-planning',
      title: 'Financial Planning',
      description: 'Develop comprehensive financial plans including retirement, insurance, and estate planning.'
    },
    {
      id: 'credit-management',
      title: 'Credit & Debt Management',
      description: 'Improve credit scores, manage debt effectively, and understand credit systems.'
    },
    {
      id: 'financial-analysis',
      title: 'Financial Analysis',
      description: 'Analyze financial statements, evaluate investments, and make data-driven financial decisions.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Finance"
      categoryDescription="Master personal finance, accounting, financial planning, and money management skills. Build your financial future."
      skills={skills}
    />
  );
}
