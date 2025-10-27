import type { GitHubUser, GitHubRepo, GitHubLanguages, ProcessedProject, SkillData } from '../types/github';
import { siteConfig } from '../../site.config';
import cachedData from '../data/github-cache.json';

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN; // Optional, for higher rate limits

const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN && { 'Authorization': `token ${GITHUB_TOKEN}` })
};

/**
 * Fetch GitHub user profile data
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const response = await fetch(`${GITHUB_API}/users/${username}`, { headers });
    
    if (!response.ok) {
      console.warn('Failed to fetch user from API, using cached data');
      return cachedData.user as GitHubUser;
    }
    
    return response.json();
  } catch (error) {
    console.warn('Error fetching user from API, using cached data:', error);
    return cachedData.user as GitHubUser;
  }
}

/**
 * Fetch all user repositories
 */
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;
    
    while (true) {
      const response = await fetch(
        `${GITHUB_API}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
        { headers }
      );
      
      if (!response.ok) {
        console.warn('Failed to fetch repos from API, using cached data');
        return cachedData.repos as GitHubRepo[];
      }
      
      const data = await response.json();
      
      if (data.length === 0) break;
      
      repos.push(...data);
      
      if (data.length < perPage) break;
      
      page++;
    }
    
    // Filter out forks and archived repos
    return repos.filter(repo => !repo.fork && !repo.archived);
  } catch (error) {
    console.warn('Error fetching repos from API, using cached data:', error);
    return cachedData.repos as GitHubRepo[];
  }
}

/**
 * Fetch README content for a repository
 */
export async function fetchRepoReadme(username: string, repo: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${username}/${repo}/readme`,
      { headers: { ...headers, 'Accept': 'application/vnd.github.v3.raw' } }
    );
    
    if (!response.ok) return null;
    
    const content = await response.text();
    
    // Extract first paragraph or first 200 characters
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    return lines[0]?.substring(0, 200) || null;
  } catch {
    return null;
  }
}

/**
 * Fetch repository languages
 */
export async function fetchRepoLanguages(username: string, repo: string): Promise<GitHubLanguages> {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${username}/${repo}/languages`,
      { headers }
    );
    
    if (!response.ok) return {};
    
    return response.json();
  } catch {
    return {};
  }
}

/**
 * Get featured projects (top by stars and recent activity)
 */
export async function getFeaturedProjects(username: string): Promise<ProcessedProject[]> {
  const repos = await fetchUserRepos(username);
  
  // Sort by stars and then by updated date
  const sortedRepos = repos
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, siteConfig.maxFeaturedProjects);
  
  // Process projects
  const projects: ProcessedProject[] = await Promise.all(
    sortedRepos.map(async (repo) => ({
      name: repo.name,
      description: repo.description || 'No description available',
      topics: repo.topics || [],
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      lastUpdated: repo.updated_at,
      repoUrl: repo.html_url,
      homepageUrl: repo.homepage,
    }))
  );
  
  return projects;
}

/**
 * Get all languages used across repositories with statistics
 */
export async function getLanguageStats(repos: GitHubRepo[]): Promise<SkillData[]> {
  const languageMap = new Map<string, number>();
  
  // Count language occurrences
  repos.forEach(repo => {
    if (repo.language) {
      languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
    }
  });
  
  const total = Array.from(languageMap.values()).reduce((sum, count) => sum + count, 0);
  
  // Convert to SkillData array
  const skills: SkillData[] = Array.from(languageMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      category: 'language' as const
    }))
    .sort((a, b) => b.count - a.count);
  
  return skills;
}

/**
 * Get skills from repository topics
 */
export async function getSkillsFromTopics(repos: GitHubRepo[]): Promise<SkillData[]> {
  const topicMap = new Map<string, number>();
  
  repos.forEach(repo => {
    repo.topics?.forEach(topic => {
      topicMap.set(topic, (topicMap.get(topic) || 0) + 1);
    });
  });
  
  const total = Array.from(topicMap.values()).reduce((sum, count) => sum + count, 0);
  
  return Array.from(topicMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      category: determineSkillCategory(name)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30); // Top 30 skills
}

/**
 * Determine skill category based on name
 */
function determineSkillCategory(skill: string): 'language' | 'framework' | 'tool' {
  const frameworks = [
    'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'astro',
    'django', 'flask', 'fastapi', 'express', 'nestjs',
    'pytorch', 'tensorflow', 'scikit-learn', 'langchain', 'streamlit',
    'bootstrap', 'tailwind', 'material-ui'
  ];
  
  const tools = [
    'docker', 'kubernetes', 'git', 'github', 'gitlab',
    'ci-cd', 'jenkins', 'github-actions',
    'postgres', 'mysql', 'mongodb', 'redis',
    'aws', 'azure', 'gcp', 'vercel', 'netlify'
  ];
  
  const lowerSkill = skill.toLowerCase();
  
  if (frameworks.some(f => lowerSkill.includes(f))) {
    return 'framework';
  }
  
  if (tools.some(t => lowerSkill.includes(t))) {
    return 'tool';
  }
  
  return 'language';
}

/**
 * Generate tagline from bio and skills
 */
export function generateTagline(user: GitHubUser, topSkills: string[]): string {
  const bio = user.bio || '';
  const skills = topSkills.slice(0, 3).join(', ');
  
  if (bio) {
    return bio;
  }
  
  if (skills) {
    return `Developer passionate about ${skills}`;
  }
  
  return 'Software Developer';
}

/**
 * Generate about paragraph from profile data
 */
export function generateAboutParagraph(user: GitHubUser, topSkills: SkillData[]): string {
  const name = user.name || user.login;
  const bio = user.bio || '';
  const location = user.location ? ` based in ${user.location}` : '';
  const skillNames = topSkills.slice(0, 5).map(s => s.name).join(', ');
  
  if (bio) {
    return `${bio}${location ? ` Currently ${location}.` : ''} Skilled in ${skillNames}.`;
  }
  
  return `${name} is a software developer${location} specializing in ${skillNames}.`;
}
