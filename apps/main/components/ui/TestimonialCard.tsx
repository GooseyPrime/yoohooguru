import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  date?: string;
  featured?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  avatar,
  content,
  rating,
  date,
  featured = false,
}) => {
  return (
    <div className={`relative ${featured ? 'card-featured' : 'card-default'} h-full`}>
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-4xl text-emerald-400/20">
        &ldquo;
      </div>
      
      {/* Rating Stars */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
          >
            ★
          </span>
        ))}
      </div>
      
      {/* Content */}
      <blockquote className="body-normal text-gray-300 mb-6 italic">
        &ldquo;{content}&rdquo;
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
          {avatar ? (
            <Image src={avatar} alt={name} width={48} height={48} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.split(' ').map(n => n[0]).join('')
          )}
        </div>
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-gray-400">
            {role}
            {company && ` • ${company}`}
          </div>
          {date && (
            <div className="text-xs text-gray-500">{date}</div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TestimonialCarouselProps {
  testimonials?: TestimonialCardProps[];
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  // Default testimonials if none provided
  const defaultTestimonials: TestimonialCardProps[] = [
    {
      name: "Jessica Martinez",
      role: "Marketing Manager",
      company: "TechStart Inc",
      content: "Learning web development through YooHoo.Guru changed my career trajectory. My guru was patient, knowledgeable, and tailored every session to my learning pace. Within 3 months, I built my first full-stack application!",
      rating: 5,
      date: "2 weeks ago"
    },
    {
      name: "David Chen",
      role: "Freelance Designer",
      content: "As a guru on the platform, I've been able to share my design expertise while earning a steady income. The booking system is seamless, payments are always on time, and I've met amazing students from around the world.",
      rating: 5,
      date: "1 month ago"
    },
    {
      name: "Sarah Thompson",
      role: "College Student",
      content: "The Hero Gurus program gave me access to free tutoring when I needed it most. My volunteer tutor helped me ace my calculus exam and restored my confidence. This platform truly changes lives.",
      rating: 5,
      date: "3 weeks ago"
    },
    {
      name: "Michael Rodriguez",
      role: "Small Business Owner",
      content: "Angel's List connected me with a local bookkeeper who saved my business. The verification process gave me confidence, and the service was exactly what I needed at a fair price.",
      rating: 5,
      date: "1 week ago"
    },
    {
      name: "Emily Watson",
      role: "Software Engineer",
      content: "I started as a student learning React, and now I'm a guru teaching others! The platform's AI matching system pairs me with students who truly benefit from my teaching style. It&apos;s incredibly rewarding.",
      rating: 5,
      date: "2 months ago"
    },
    {
      name: "James Park",
      role: "Retired Teacher",
      content: "Volunteering as a Hero Guru lets me continue my passion for teaching. The adaptive tools help me work with students of all abilities, and seeing their progress brings me so much joy.",
      rating: 5,
      date: "1 month ago"
    }
  ];

  const testimonialsToShow = testimonials || defaultTestimonials;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonialsToShow.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} />
      ))}
    </div>
  );
};

export default TestimonialCard;