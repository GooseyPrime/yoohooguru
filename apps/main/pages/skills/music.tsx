import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function MusicSkills() {
  const skills = [
    {
      id: 'guitar',
      title: 'Guitar Playing',
      description: 'Learn acoustic and electric guitar techniques, chords, scales, and songs from beginner to advanced levels.'
    },
    {
      id: 'piano',
      title: 'Piano & Keyboard',
      description: 'Master piano playing, music theory, and keyboard techniques for classical, jazz, or contemporary styles.'
    },
    {
      id: 'vocal-training',
      title: 'Vocal Training',
      description: 'Improve your singing voice with breathing techniques, pitch control, and performance skills.'
    },
    {
      id: 'music-theory',
      title: 'Music Theory',
      description: 'Understand the fundamentals of music theory including scales, chords, progressions, and composition.'
    },
    {
      id: 'music-production',
      title: 'Music Production',
      description: 'Learn to produce music using digital audio workstations like Ableton, Logic Pro, and FL Studio.'
    },
    {
      id: 'dj-skills',
      title: 'DJing & Electronic Music',
      description: 'Master DJ techniques, beat matching, and electronic music production for live performances.'
    }
  ];
  
  return (
    <CategoryTemplate
      categoryName="Music"
      categoryDescription="Discover music skills including instrument playing, vocal training, music theory, and production. Learn from professional musicians and producers."
      skills={skills}
    />
  );
}