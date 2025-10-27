export const siteConfig = {
  // GitHub username to fetch data from
  githubUsername: 'Kuxall',
  
  // Number of featured projects to display
  maxFeaturedProjects: 9,
  
  // Minimum stars for a project to be considered "featured" (if not pinned)
  minStarsForFeatured: 0,
  
  // Analytics configuration (optional)
  analytics: {
    enabled: false, // Set to true in production
    provider: 'plausible', // 'plausible' or 'umami'
    siteId: '', // Your analytics site ID
  },
  
  // SEO Configuration
  seo: {
    title: 'Kushal Raj Sharma - AI & ML Engineer',
    description: 'Portfolio of Kushal Raj Sharma - AI & ML Engineer specializing in NLP, LLMs, and Deep Learning',
    keywords: ['AI', 'Machine Learning', 'NLP', 'LLM', 'Deep Learning', 'Python', 'PyTorch'],
  },
  
  // Theme configuration
  theme: {
    defaultMode: 'dark', // 'light' or 'dark'
    enableToggle: true,
  },
  
  // Contact form configuration
  contact: {
    formspreeId: '', // Optional: Add your Formspree form ID for contact form
  },
  
  // Social links (will be fetched from GitHub, but can be overridden here)
  social: {
    // email: '', // Will be fetched from GitHub profile
    // github: '', // Will be constructed from username
    // linkedin: '', // Will be fetched from GitHub profile blog field if it's a LinkedIn URL
  }
};
