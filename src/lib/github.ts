import type { GitHubUser, GitHubRepo } from '../types/github';
import cachedData from '../data/github-cache.json';

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

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
 * Fetch GitHub repositories
 */
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, { headers });

    if (!response.ok) {
      console.warn('Failed to fetch repos from API');
      return [];
    }

    return response.json();
  } catch (error) {
    console.warn('Error fetching repos from API:', error);
    return [];
  }
}

/**
 * Calculate GitHub stats for the Stats component
 */
export async function fetchGitHubStats(username: string) {
  try {
    const user = await fetchGitHubUser(username);
    const repos = await fetchGitHubRepos(username);

    // Calculate total stars across all repos
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // Get unique languages
    const languages = new Set(repos.map(repo => repo.language).filter(Boolean));

    // Calculate years of experience (from account creation)
    const accountCreated = new Date(user.created_at);
    const yearsOfExperience = Math.max(1, new Date().getFullYear() - accountCreated.getFullYear());

    return {
      yearsOfExperience,
      projectsCompleted: user.public_repos,
      technologiesUsed: languages.size,
      githubStars: totalStars
    };
  } catch (error) {
    console.warn('Error calculating GitHub stats:', error);
    // Return default values if API fails
    return {
      yearsOfExperience: 4,
      projectsCompleted: 15,
      technologiesUsed: 25,
      githubStars: 100
    };
  }
}
