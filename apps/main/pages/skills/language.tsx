import CategoryTemplate from '../../components/categories/CategoryTemplate';

export default function LanguageSkills() {
  const skills = [
    {
      id: 'spanish',
      title: 'Spanish Language',
      description: 'Learn conversational Spanish, grammar, and cultural fluency for travel or career advancement.'
    },
    {
      id: 'french',
      title: 'French Language',
      description: 'Master French pronunciation, vocabulary, and conversation skills from beginner to advanced.'
    },
    {
      id: 'mandarin',
      title: 'Mandarin Chinese',
      description: 'Study Mandarin characters, tones, and conversational skills for business or personal growth.'
    },
    {
      id: 'esl',
      title: 'English as Second Language',
      description: 'Improve English fluency, grammar, and communication skills for non-native speakers.'
    },
    {
      id: 'language-learning',
      title: 'Language Learning Methods',
      description: 'Discover effective techniques and strategies for learning any foreign language efficiently.'
    }
  ];

  return (
    <CategoryTemplate
      categoryName="Language Learning"
      categoryDescription="Learn Spanish, French, Mandarin, English, and effective language learning techniques. Communicate across cultures."
      skills={skills}
    />
  );
}
