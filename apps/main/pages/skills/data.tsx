import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function DataSkills() {
  const skills = [
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description: 'Master data analysis techniques using Excel, SQL, and statistical methods to extract meaningful insights.'
    },
    {
      id: 'python',
      title: 'Python for Data Science',
      description: 'Learn Python programming for data manipulation, analysis, and visualization using pandas, NumPy, and matplotlib.'
    },
    {
      id: 'sql',
      title: 'SQL & Database Management',
      description: 'Write complex SQL queries, design databases, and manage data efficiently in relational database systems.'
    },
    {
      id: 'visualization',
      title: 'Data Visualization',
      description: 'Create compelling data visualizations and dashboards using Tableau, Power BI, and Python libraries.'
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning Basics',
      description: 'Understand fundamental machine learning concepts and build predictive models with scikit-learn.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Data Science"
      categoryDescription="Develop data analysis, Python programming, SQL, visualization, and machine learning skills. Transform data into insights."
      skills={skills}
    />
  );
}
