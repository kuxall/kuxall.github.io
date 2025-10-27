# Kuxall's Developer Portfolio

A modern, fast, and accessible developer portfolio built with Astro and Tailwind CSS. All content is automatically fetched from GitHub, making it easy to keep your portfolio up-to-date.

🌐 **Live Site**: [kuxall.github.io](https://kuxall.github.io)

## ✨ Features

- **Fully Automated Content**: All data fetched from GitHub API (profile, repositories, stats)
- **Modern Design**: Clean, responsive UI with dark/light theme toggle
- **Performance**: Static site generation for blazing-fast load times
- **Accessibility**: WCAG AA compliant, keyboard navigable, semantic HTML
- **SEO Optimized**: Meta tags, OpenGraph, Twitter cards, sitemap
- **Auto-Refresh**: Weekly automatic updates via GitHub Actions

## 📊 Data Sources

All portfolio data is automatically fetched from the GitHub API for user **Kuxall**:

### Profile Information
- Name, avatar, bio, location, company, email
- Followers count, public repositories
- GitHub profile URL

### Projects
- **Featured Projects**: Top repositories by stars and recent activity
- Each project includes:
  - Name, description, topics/tags
  - Primary language, star count, fork count
  - Last updated date
  - Links to repository and live demo (if available)

### Skills
- **Languages**: Automatically detected from repository languages
- **Technologies**: Extracted from repository topics
- Ranked by usage frequency across repositories

### Activity & Stats
- Total repositories, stars, and forks
- Public repository count
- GitHub contribution graph

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kuxall/kuxall.github.io.git
   cd kuxall.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:4321`

### Build for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

### Site Configuration

Edit `site.config.ts` to customize:

```typescript
export const siteConfig = {
  // GitHub username to fetch data from
  githubUsername: 'Kuxall',
  
  // Number of featured projects (default: 9)
  maxFeaturedProjects: 9,
  
  // Theme settings
  theme: {
    defaultMode: 'dark', // 'light' or 'dark'
    enableToggle: true,
  },
  
  // SEO configuration
  seo: {
    title: 'Your Name - Developer Portfolio',
    description: 'Your custom description',
    keywords: ['your', 'keywords'],
  },
  
  // Optional analytics
  analytics: {
    enabled: false,
    provider: 'plausible', // or 'umami'
    siteId: '',
  },
};
```

### Changing Featured Projects Logic

Featured projects are selected in `src/lib/github.ts`:

```typescript
export async function getFeaturedProjects(username: string) {
  const repos = await fetchUserRepos(username);
  
  // Customize sorting logic here
  const sortedRepos = repos
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, siteConfig.maxFeaturedProjects);
  
  // ...
}
```

To prioritize pinned repositories, you can use the GitHub GraphQL API to fetch pinned repos first.

## 🔄 Auto-Refresh Setup

The portfolio automatically refreshes weekly to fetch the latest data from GitHub.

### How It Works

1. **Scheduled Workflow**: `.github/workflows/auto-refresh.yml` runs every Monday at 00:00 UTC
2. **Rebuild**: Fetches fresh data from GitHub API during build
3. **Commit**: Updates timestamp file to track last refresh

### Manual Refresh

You can manually trigger a refresh:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Auto Refresh Data** workflow
4. Click **Run workflow**

### Optional: GitHub Token for Higher Rate Limits

If you encounter API rate limiting, add a GitHub token:

1. Create a Personal Access Token (PAT) with `public_repo` scope
2. Add it as a repository secret named `GITHUB_TOKEN`
3. The workflows will automatically use it

## 🚢 Deployment

### GitHub Pages (Automatic)

This repository is configured to automatically deploy to GitHub Pages on every push to `main`.

**Setup Steps:**

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The site will deploy automatically on the next push

### Manual Deployment

If you prefer manual deployment:

```bash
npm run build
```

Then deploy the `dist/` folder to your hosting provider.

## 📁 Project Structure

```
/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Pages deployment
│       └── auto-refresh.yml    # Weekly data refresh
├── public/
│   ├── favicon.svg             # Site favicon
│   └── robots.txt              # SEO robots file
├── src/
│   ├── components/             # Astro components
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Projects.astro
│   │   ├── Skills.astro
│   │   ├── Activity.astro
│   │   ├── Contact.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base HTML layout
│   ├── lib/
│   │   └── github.ts           # GitHub API utilities
│   ├── pages/
│   │   └── index.astro         # Main page
│   ├── styles/
│   │   └── global.css          # Global styles
│   └── types/
│       └── github.ts           # TypeScript types
├── astro.config.mjs            # Astro configuration
├── site.config.ts              # Site configuration
├── tailwind.config.mjs         # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🎯 Accessibility & SEO

### Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels where appropriate
- ✅ Keyboard navigation support
- ✅ Focus states on interactive elements
- ✅ Color contrast meets WCAG AA standards
- ✅ Respects `prefers-reduced-motion`
- ✅ Alt text for images

### SEO Features

- ✅ Meta title and description
- ✅ OpenGraph tags for social sharing
- ✅ Twitter Card tags
- ✅ Sitemap.xml (auto-generated by Astro)
- ✅ Robots.txt
- ✅ Semantic heading hierarchy
- ✅ Fast page load times

## 🛠️ Technology Stack

- **Framework**: [Astro](https://astro.build) - Static Site Generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- **Language**: TypeScript
- **Deployment**: GitHub Pages via GitHub Actions
- **Data Source**: GitHub REST API

## 📝 Content Guidelines

All content is automatically generated from your GitHub data:

- **Tagline**: Generated from GitHub bio and top skills
- **About**: Composed from profile bio, location, and skills
- **Projects**: Pulled from your repositories
- **Skills**: Inferred from languages and topics

To update content:

1. Update your GitHub profile bio
2. Add topics to your repositories
3. Keep repository descriptions up-to-date
4. The portfolio will automatically refresh weekly

## 🤝 Contributing

This is a personal portfolio, but feel free to:

- Fork for your own use
- Submit issues for bugs
- Suggest improvements

## 📄 License

MIT License - feel free to use this template for your own portfolio!

## 📧 Contact

- GitHub: [@Kuxall](https://github.com/Kuxall)
- Portfolio: [kuxall.github.io](https://kuxall.github.io)

---

**Built with** ❤️ **using Astro and Tailwind CSS**
