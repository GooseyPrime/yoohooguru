import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentHubCard } from './Card';

interface ContentHub {
  icon: string;
  title: string;
  articleCount: number;
  href: string;
  gradient: string;
}

interface ContentHubCarouselProps {
  hubs?: ContentHub[];
}

export const ContentHubCarousel: React.FC<ContentHubCarouselProps> = ({ hubs }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [mounted, setMounted] = useState(false);

  // All 24 content hubs
  const allHubs: ContentHub[] = hubs || [
    { icon: "💻", title: "Technology", articleCount: 245, href: "https://tech.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10" },
    { icon: "📊", title: "Business", articleCount: 189, href: "https://business.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-blue-500/10" },
    { icon: "🎨", title: "Art", articleCount: 167, href: "https://art.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10" },
    { icon: "💪", title: "Fitness", articleCount: 134, href: "https://fitness.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-red-500/10" },
    { icon: "📚", title: "Language", articleCount: 156, href: "https://language.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10" },
    { icon: "🏠", title: "Home", articleCount: 198, href: "https://home.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-green-500/10 hover:to-emerald-500/10" },
    { icon: "🎵", title: "Music", articleCount: 143, href: "https://music.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-pink-500/10 hover:to-purple-500/10" },
    { icon: "🍳", title: "Cooking", articleCount: 178, href: "https://cooking.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-yellow-500/10" },
    { icon: "📸", title: "Photography", articleCount: 121, href: "https://photography.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10" },
    { icon: "✍️", title: "Writing", articleCount: 165, href: "https://writing.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-indigo-500/10" },
    { icon: "🧘", title: "Wellness", articleCount: 142, href: "https://wellness.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-green-500/10 hover:to-teal-500/10" },
    { icon: "💼", title: "Career", articleCount: 187, href: "https://career.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-emerald-500/10" },
    { icon: "🔬", title: "Science", articleCount: 156, href: "https://science.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-500/10" },
    { icon: "🎭", title: "Theater", articleCount: 98, href: "https://theater.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10" },
    { icon: "🏃", title: "Sports", articleCount: 167, href: "https://sports.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-red-500/10 hover:to-orange-500/10" },
    { icon: "🌱", title: "Gardening", articleCount: 134, href: "https://gardening.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-green-500/10 hover:to-lime-500/10" },
    { icon: "💰", title: "Finance", articleCount: 201, href: "https://finance.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-green-500/10" },
    { icon: "🎮", title: "Gaming", articleCount: 189, href: "https://gaming.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-indigo-500/10" },
    { icon: "🚗", title: "Automotive", articleCount: 145, href: "https://automotive.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-gray-500/10 hover:to-slate-500/10" },
    { icon: "🐾", title: "Pets", articleCount: 156, href: "https://pets.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-amber-500/10 hover:to-orange-500/10" },
    { icon: "🌍", title: "Travel", articleCount: 178, href: "https://travel.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-cyan-500/10" },
    { icon: "👗", title: "Fashion", articleCount: 143, href: "https://fashion.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-pink-500/10 hover:to-rose-500/10" },
    { icon: "🔧", title: "DIY", articleCount: 167, href: "https://diy.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-orange-500/10 hover:to-amber-500/10" },
    { icon: "🧠", title: "Psychology", articleCount: 134, href: "https://psychology.yoohoo.guru", gradient: "hover:bg-gradient-to-br hover:from-indigo-500/10 hover:to-purple-500/10" }
  ];

  // Responsive items per page - always start with default for SSR
  const getItemsPerPage = () => {
    if (!mounted || typeof window === 'undefined') return 6;
    if (window.innerWidth >= 1024) return 12; // lg: 2 rows of 6
    if (window.innerWidth >= 768) return 6;   // md: 2 rows of 3
    return 4;                                  // sm: 2 rows of 2
  };

  const [itemsPerPage, setItemsPerPage] = React.useState(6); // Always start with 6 for SSR

  React.useEffect(() => {
    setMounted(true);
    setItemsPerPage(getItemsPerPage());
    const handleResize = () => setItemsPerPage(getItemsPerPage());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mounted]);

  const totalPages = Math.ceil(allHubs.length / itemsPerPage);

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentPage ? 1 : -1);
    setCurrentPage(index);
  };

  const getCurrentHubs = () => {
    const startIndex = currentPage * itemsPerPage;
    return allHubs.slice(startIndex, startIndex + itemsPerPage);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden mb-12">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {getCurrentHubs().map((hub, index) => (
              <div key={`${currentPage}-${index}`} className="animate-fade-in-up">
                <ContentHubCard {...hub} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <>
          {/* Arrow Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full glass-button flex items-center justify-center text-white hover:bg-white-20 transition-all duration-300 z-10 shadow-lg"
            aria-label="Previous hubs"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full glass-button flex items-center justify-center text-white hover:bg-white-20 transition-all duration-300 z-10 shadow-lg"
            aria-label="Next hubs"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentPage
                    ? 'w-8 h-3 bg-gradient-to-r from-emerald-500 to-blue-500'
                    : 'w-3 h-3 bg-white-30 hover:bg-white-50'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ContentHubCarousel;