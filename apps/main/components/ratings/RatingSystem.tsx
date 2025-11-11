import { useState } from 'react';
import styled from 'styled-components';

const RatingContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const RatingHeader = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarButton = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.filled ? '#FFD700' : '#b0b0b0'};
  transition: color 0.2s;
  
  &:hover {
    color: #FFD700;
  }
`;

const RatingComment = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  background: #667eea;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AverageRating = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFD700;
`;

const RatingCount = styled.span`
  color: #b0b0b0;
  font-size: 1rem;
`;

const ReviewsContainer = styled.div`
  margin-top: 2rem;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Reviewer = styled.div`
  color: #ffffff;
  font-weight: 600;
`;

const ReviewDate = styled.div`
  color: #b0b0b0;
  font-size: 0.9rem;
`;

const ReviewComment = styled.div`
  color: #b0b0b0;
  line-height: 1.6;
`;

const StarRating = styled.div`
  color: #FFD700;
  font-size: 1.2rem;
`;

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingSystemProps {
  guruId: string;
  guruName: string;
  averageRating: number;
  totalReviews: number;
  onSubmitReview: (rating: number, comment: string) => void;
}

export default function RatingSystem({ 
  guruId: _guruId, 
  guruName, 
  averageRating, 
  totalReviews, 
  onSubmitReview 
}: RatingSystemProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: '1',
      reviewer: 'Alex Johnson',
      rating: 5,
      comment: 'Excellent teaching! Really helped me understand complex concepts in a simple way.',
      date: '2024-01-15'
    },
    {
      id: '2',
      reviewer: 'Sarah Williams',
      rating: 4,
      comment: 'Great session, very knowledgeable. Would recommend to others looking to learn this skill.',
      date: '2024-01-10'
    },
    {
      id: '3',
      reviewer: 'Michael Chen',
      rating: 5,
      comment: 'Outstanding guidance and patience. Made learning enjoyable and effective.',
      date: '2024-01-05'
    }
  ];
  
  const handleSubmit = async () => {
    if (userRating === 0) return;
    
    setIsSubmitting(true);
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmitReview(userRating, comment);
      setComment('');
      setUserRating(0);
    } catch (error) {
      console.error('Failed to submit review', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <RatingContainer>
        <RatingHeader>Rate {guruName}</RatingHeader>
        <RatingStars>
          {[1, 2, 3, 4, 5].map(star => (
            <StarButton
              key={star}
              filled={star <= (hoverRating || userRating)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(star)}
            >
              ★
            </StarButton>
          ))}
        </RatingStars>
        <RatingComment
          placeholder="Share your experience with this Guru..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <SubmitButton 
          onClick={handleSubmit} 
          disabled={isSubmitting || userRating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </SubmitButton>
      </RatingContainer>
      
      <RatingDisplay>
        <AverageRating>★ {averageRating.toFixed(1)}</AverageRating>
        <RatingCount>({totalReviews} reviews)</RatingCount>
      </RatingDisplay>
      
      <ReviewsContainer>
        <h3 style={{color: '#ffffff', marginBottom: '1rem'}}>Recent Reviews</h3>
        {mockReviews.map(review => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <Reviewer>{review.reviewer}</Reviewer>
              <ReviewDate>{review.date}</ReviewDate>
            </ReviewHeader>
            <StarRating>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </StarRating>
            <ReviewComment>{review.comment}</ReviewComment>
          </ReviewCard>
        ))}
      </ReviewsContainer>
    </div>
  );
}