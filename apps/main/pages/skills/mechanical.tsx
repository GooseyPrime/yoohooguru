import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function MechanicalSkills() {
  const skills = [
    {
      id: 'mechanical-engineering',
      title: 'Mechanical Engineering',
      description: 'Master mechanical engineering principles, mechanics, thermodynamics, and machine design.'
    },
    {
      id: 'cad-design',
      title: 'CAD Design',
      description: 'Create professional technical drawings and 3D models using AutoCAD, SolidWorks, and Fusion 360.'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing Processes',
      description: 'Understand manufacturing methods including CNC machining, welding, and quality control.'
    },
    {
      id: 'robotics',
      title: 'Robotics & Automation',
      description: 'Build and program robots, understand automation systems, and mechanical control systems.'
    },
    {
      id: 'thermodynamics',
      title: 'Thermodynamics & HVAC',
      description: 'Study heat transfer, energy systems, and HVAC design for mechanical applications.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Mechanical Engineering"
      categoryDescription="Learn mechanical engineering, CAD design, manufacturing, robotics, and thermodynamics. Master mechanical systems."
      skills={skills}
    />
  );
}
