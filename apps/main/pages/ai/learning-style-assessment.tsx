import { useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../../components/ui/Navigation';
import Head from 'next/head';

const questions = [
  {
    id: 'q1',
    question: 'When learning something new, I prefer to:',
    options: [
      { value: 'visual', label: 'Watch videos or look at diagrams' },
      { value: 'auditory', label: 'Listen to explanations or lectures' },
      { value: 'kinesthetic', label: 'Try it hands-on and practice' },
      { value: 'reading', label: 'Read detailed instructions or articles' }
    ]
  },
  {
    id: 'q2',
    question: 'I remember information best when:',
    options: [
      { value: 'visual', label: 'I see it written down or in pictures' },
      { value: 'auditory', label: 'I hear it explained out loud' },
      { value: 'kinesthetic', label: 'I physically do it myself' },
      { value: 'reading', label: 'I read and take notes about it' }
    ]
  },
  {
    id: 'q3',
    question: 'When following directions, I prefer:',
    options: [
      { value: 'visual', label: 'Maps, diagrams, or visual guides' },
      { value: 'auditory', label: 'Verbal instructions' },
      { value: 'kinesthetic', label: 'To just start and figure it out as I go' },
      { value: 'reading', label: 'Written step-by-step instructions' }
    ]
  },
  {
    id: 'q4',
    question: 'In my free time, I enjoy:',
    options: [
      { value: 'visual', label: 'Watching movies or browsing images' },
      { value: 'auditory', label: 'Listening to music or podcasts' },
      { value: 'kinesthetic', label: 'Sports, crafts, or hands-on activities' },
      { value: 'reading', label: 'Reading books or articles' }
    ]
  },
  {
    id: 'q5',
    question: 'When studying, I find it helpful to:',
    options: [
      { value: 'visual', label: 'Use highlighters, colors, and visual organizers' },
      { value: 'auditory', label: 'Discuss topics or explain them out loud' },
      { value: 'kinesthetic', label: 'Take breaks and move around while studying' },
      { value: 'reading', label: 'Write summaries and detailed notes' }
    ]
  },
  {
    id: 'q6',
    question: 'I understand concepts better when:',
    options: [
      { value: 'visual', label: 'I can see examples and demonstrations' },
      { value: 'auditory', label: 'Someone explains them to me' },
      { value: 'kinesthetic', label: 'I can experiment and try different approaches' },
      { value: 'reading', label: 'I can read detailed explanations' }
    ]
  },
  {
    id: 'q7',
    question: 'When solving problems, I tend to:',
    options: [
      { value: 'visual', label: 'Draw diagrams or visualize solutions' },
      { value: 'auditory', label: 'Talk through the problem' },
      { value: 'kinesthetic', label: 'Try different solutions until one works' },
      { value: 'reading', label: 'Research and read about similar problems' }
    ]
  },
  {
    id: 'q8',
    question: 'In a classroom, I learn best when:',
    options: [
      { value: 'visual', label: 'The teacher uses slides, videos, or visual aids' },
      { value: 'auditory', label: 'The teacher lectures and explains verbally' },
      { value: 'kinesthetic', label: 'There are hands-on activities and projects' },
      { value: 'reading', label: 'There are readings and written materials' }
    ]
  }
];

export default function LearningStyleAssessment() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    primaryStyle: string;
    secondaryStyle: string;
    scores: Record<string, number>;
    stylePercentages?: Record<string, number>;
    recommendations: string[];
    teachingApproach: string[];
    strengths: string[];
    developmentAreas: string[];
  } | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/ai/learning-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze learning style');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing learning style:', error);
      alert('Failed to analyze learning style. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswered = responses[currentQ.id] !== undefined;

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Head>
          <title>Learning Style Results | YooHoo.Guru</title>
        </Head>
        <Navigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-purple-500 border-opacity-20">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Your Learning Style Results
            </h1>

            {/* Primary Style */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Primary Learning Style: {result.primaryStyle}
              </h2>
              <p className="text-purple-100">
                Secondary Style: {result.secondaryStyle}
              </p>
            </div>

            {/* Style Percentages */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Learning Style Breakdown</h3>
              {Object.entries(result.stylePercentages || {}).map(([style, percentage]: [string, number]) => (
                <div key={style} className="mb-3">
                  <div className="flex justify-between text-purple-300 mb-1">
                    <span className="capitalize">{style}</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Characteristics */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Learning Characteristics</h3>
              <ul className="space-y-2">
                {result.characteristics?.map((char: string, index: number) => (
                  <li key={index} className="text-purple-300 flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            {/* Study Recommendations */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Study Recommendations</h3>
              <ul className="space-y-2">
                {result.studyRecommendations?.map((rec: string, index: number) => (
                  <li key={index} className="text-purple-300 flex items-start">
                    <span className="text-purple-400 mr-2">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Teaching Approach */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Best Teaching Approach for You</h3>
              <p className="text-purple-300 leading-relaxed">{result.teachingApproach}</p>
            </div>

            {/* Strengths and Development */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Strength Areas</h3>
                <ul className="space-y-2">
                  {result.strengthAreas?.map((area: string, index: number) => (
                    <li key={index} className="text-green-300 flex items-start">
                      <span className="text-green-400 mr-2">💪</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Development Areas</h3>
                <ul className="space-y-2">
                  {result.developmentAreas?.map((area: string, index: number) => (
                    <li key={index} className="text-yellow-300 flex items-start">
                      <span className="text-yellow-400 mr-2">📈</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setCurrentQuestion(0);
                  setResponses({});
                }}
                className="flex-1 bg-white bg-opacity-10 text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-20 transition-all duration-300"
              >
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Head>
        <title>Learning Style Assessment | YooHoo.Guru</title>
      </Head>
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-purple-300 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-10 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-purple-500 border-opacity-20">
          <h2 className="text-2xl font-bold text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  responses[currentQ.id] === option.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white bg-opacity-5 text-purple-300 hover:bg-opacity-10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-full font-semibold bg-white bg-opacity-10 text-white hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswered || isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Analyzing...' : 'Get Results'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}