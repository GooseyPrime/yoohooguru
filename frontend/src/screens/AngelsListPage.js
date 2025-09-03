import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-top: 2rem;
`;

const CategoryCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--gray-900);
  }

  p {
    color: var(--gray-600);
    margin-bottom: 1rem;
    font-size: var(--text-sm);
  }
`;

export default function AngelsListPage() {
  const categories = [
    'Cleaning',
    'Yard & Garden', 
    'Assembly',
    'Pet Care',
    'Moving Help',
    'Rentals'
  ];

  return (
    <Container>
      <Content>
        <h1>Angel&apos;s List</h1>
        <p className="text-muted">
          Browse local help, rentals, and odd jobs. Booking will prompt sign‑in.
        </p>
        <CategoryGrid>
          {categories.map(category => (
            <CategoryCard key={category}>
              <h3>{category}</h3>
              <p>Popular near you</p>
              <Button variant="ghost" size="sm">
                View {category}
              </Button>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Content>
    </Container>
  );
}
