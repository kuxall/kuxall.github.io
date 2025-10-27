export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  company: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
}

export interface GitHubContributor {
  total: number;
  weeks: Array<{
    w: number;
    a: number;
    d: number;
    c: number;
  }>;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface ProcessedProject {
  name: string;
  description: string;
  topics: string[];
  language: string | null;
  stars: number;
  forks: number;
  lastUpdated: string;
  repoUrl: string;
  homepageUrl: string | null;
  readme?: string;
  isPinned?: boolean;
}

export interface SkillData {
  name: string;
  count: number;
  percentage: number;
  category: 'language' | 'framework' | 'tool';
}

export interface ActivityData {
  totalCommits: number;
  recentCommits: number;
  totalPRs: number;
  totalIssues: number;
  latestRelease?: {
    name: string;
    tag: string;
    url: string;
    published_at: string;
  };
}
