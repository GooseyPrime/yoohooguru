import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function AutoSkills() {
  const skills = [
    {
      id: 'auto-repair',
      title: 'Auto Repair & Diagnostics',
      description: 'Master automotive repair techniques, diagnostic procedures, and troubleshooting for all vehicle types.'
    },
    {
      id: 'maintenance',
      title: 'Vehicle Maintenance',
      description: 'Learn preventive maintenance, oil changes, brake service, and routine vehicle care to keep cars running smoothly.'
    },
    {
      id: 'diagnostics',
      title: 'Automotive Diagnostics',
      description: 'Understand modern diagnostic tools, OBD-II systems, and computer-based vehicle troubleshooting.'
    },
    {
      id: 'detailing',
      title: 'Auto Detailing',
      description: 'Perfect professional detailing techniques including paint correction, ceramic coating, and interior restoration.'
    },
    {
      id: 'restoration',
      title: 'Classic Car Restoration',
      description: 'Restore vintage and classic vehicles to their former glory with expert guidance on bodywork and mechanics.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Auto & Automotive"
      categoryDescription="Master automotive repair, maintenance, diagnostics, and restoration skills. Learn from expert mechanics and auto professionals."
      skills={skills}
    />
  );
}
