import type { GitHubUser } from '../types/github';
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
