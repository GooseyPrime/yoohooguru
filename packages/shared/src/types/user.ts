export type UserRole = 'gunu' | 'guru' | 'angel' | 'hero-guru' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gunu extends User {
  role: 'gunu';
  // Learners can browse and search for Gurus
  // View Guru profiles and ratings
  // Book one-time sessions
  // Rate and review Gurus after sessions
  // Access learning materials and resources
  // Use AI learning style assessment
  // Filter by location, price, availability
  // Choose video or in-person sessions
}

export interface Guru extends User {
  role: 'guru';
  // All Gunu permissions
  // Create teaching profile with skills offered
  // Set own pricing and availability
  // Accept/decline session requests
  skills: string[];
  bio: string;
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  availability: {
    days: string[];
    hours: {
      start: string; // e.g., "09:00"
      end: string;   // e.g., "17:00"
    };
  };
}

export interface Angel extends User {
  role: 'angel';
  // All Gunu permissions
  // Create service listings
  // Set own pricing and availability
  // Accept/decline service requests
  services: string[];
  bio: string;
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  availability: {
    days: string[];
    hours: {
      start: string; // e.g., "09:00"
      end: string;   // e.g., "17:00"
    };
  };
}

export interface HeroGuru extends User {
  role: 'hero-guru';
  // All Gunu permissions
  // Create teaching profile with skills offered
  // Set own availability (no pricing as it's free)
  // Accept/decline session requests
  skills: string[];
  bio: string;
  specializations: string[]; // Disabilities or special needs they can accommodate
  availability: {
    days: string[];
    hours: {
      start: string; // e.g., "09:00"
      end: string;   // e.g., "17:00"
    };
  };
}

export interface Admin extends User {
  role: 'admin';
  // Platform administration permissions
  // Manage users, content, and disputes
  // Access analytics and reports
  // Configure platform settings
}