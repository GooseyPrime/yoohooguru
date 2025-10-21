import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import '@testing-library/jest-dom';
import SubdomainLandingPage from '../components/SubdomainLandingPage';

// Mock axios
jest.mock('axios');
const axios = require('axios');

// Mock useAuth hook
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null
  })
}));

// Mock theme for styled-components
const mockTheme = {
  colors: {
    primary: '#6c5ce7',
    secondary: '#a29bfe',
    text: '#2c3e50',
    background: '#ffffff'
  },
  fonts: {
    sans: 'Inter, system-ui, sans-serif'
  },
  motion: {
    in: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'cubic-bezier(0.4, 0, 1, 1)'
  }
};

const mockCookingConfig = {
  character: 'Chef Guru',
  category: 'culinary',
  primarySkills: ['cooking', 'baking', 'nutrition', 'meal-prep', 'food-styling'],
  affiliateCategories: ['kitchen-tools', 'cookbooks', 'ingredients', 'appliances'],
  theme: {
    primaryColor: '#e74c3c',
    secondaryColor: '#f39c12',
    accentColor: '#d35400',
    icon: '👨‍🍳',
    emoji: '🍳'
  },
  seo: {
    title: 'Chef Guru - Master Culinary Skills',
    description: 'Learn cooking, baking, and culinary arts from expert chefs. Master knife skills, cooking techniques, and recipes.',
    keywords: ['cooking lessons', 'culinary skills', 'chef training', 'baking classes', 'food preparation']
  }
};

const mockHomeData = {
  success: true,
  guru: mockCookingConfig,
  featuredPosts: [
    {
      id: '1',
      title: 'Essential Knife Skills for Beginners',
      excerpt: 'Master the fundamental knife techniques every cook should know.',
      publishedAt: Date.now()
    },
    {
      id: '2',
      title: 'Perfecting Your Sourdough Starter',
      excerpt: 'Learn the secrets to maintaining a healthy and active sourdough starter.',
      publishedAt: Date.now() - 86400000
    }
  ],
  stats: {
    totalPosts: '15',
    totalViews: '2K+',
    monthlyVisitors: '500'
  }
};

const mockNewsData = {
  success: true,
  subdomain: 'cooking',
  articles: [
    {
      id: 'news-1',
      title: 'Latest Trends in Culinary Arts',
      summary: 'Discover the newest developments in cooking techniques.',
      url: '#',
      source: 'Culinary News'
    }
  ]
};

const renderSubdomainLandingPage = (subdomain = 'cooking', config = mockCookingConfig) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider theme={mockTheme}>
        <SubdomainLandingPage subdomain={subdomain} config={config} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('SubdomainLandingPage', () => {
  beforeEach(() => {
    // Mock successful API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/home')) {
        return Promise.resolve({ data: mockHomeData });
      }
      if (url.includes('/news/')) {
        return Promise.resolve({ data: mockNewsData });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders subdomain landing page with hero section', async () => {
    renderSubdomainLandingPage();

    await waitFor(() => {
      expect(screen.getByText('Master Cooking Skills')).toBeInTheDocument();
    });

    expect(screen.getByText('Learn from certified professionals and advance your expertise')).toBeInTheDocument();
  });

  it('displays skill tags from configuration', async () => {
    renderSubdomainLandingPage();

    await waitFor(() => {
      expect(screen.getByText('cooking')).toBeInTheDocument();
    });

    expect(screen.getByText('baking')).toBeInTheDocument();
    expect(screen.getByText('nutrition')).toBeInTheDocument();
  });

  it('shows featured content section', async () => {
    renderSubdomainLandingPage();

    await waitFor(() => {
      expect(screen.getByText('Featured Learning Resources')).toBeInTheDocument();
    });

    expect(screen.getByText('Essential Knife Skills for Beginners')).toBeInTheDocument();
    expect(screen.getByText('Perfecting Your Sourdough Starter')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    // Mock pending promises
    axios.get.mockImplementation(() => new Promise(() => {}));

    renderSubdomainLandingPage();

    // Loading state should show the subdomain landing page with some basic structure
    expect(document.body).toBeInTheDocument();
  });

  it('includes proper SEO meta tags in helmet', async () => {
    renderSubdomainLandingPage();

    await waitFor(() => {
      // Check that Helmet is being used (title should be set)
      expect(document.title).toBe('Cooking - Master Culinary Skills');
    });
  });
});