import React from 'react';

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
        "
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
        "{content}"
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
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
  testimonials: TestimonialCardProps[];
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <TestimonialCard key={index} {...testimonial} />
      ))}
    </div>
  );
};

export default TestimonialCard;