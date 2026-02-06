# PerfDash

Performance testing dashboard for Mozilla Bugzilla Testing components (AWSY, mozperftest, Performance, Raptor, Talos).

A focused fork of [Mozilla BugDash](https://github.com/mozilla/bugdash) optimized specifically for performance testing infrastructure workflows.

## Features

- **Fast**: Loads only Testing components (5 components vs 500+)
- **Auto-configured**: Components pre-selected, opens to "Stalled & Longstanding" tab
- **Optimized**: Parallel API requests, 8-10x faster load time
- **Testing-focused**: Only shows buglists relevant to test infrastructure health

## Quick Start

### Local Development

```bash
make run
```

Open http://127.0.0.1:8000 in your browser.

### First Time Setup

1. Click the 🔑 key icon (top right)
2. Enter your Bugzilla API key
3. The app will remember it in your browser's localStorage

### Getting a Bugzilla API Key

**Why needed?** Bugzilla requires authentication to:
- Access higher rate limits (avoid 429 errors)
- View some bug details (security groups, private data)
- Fetch user information (nicknames, real names)

**How to get one:**
1. Go to https://bugzilla.mozilla.org/userprefs.cgi?tab=apikey
2. Log in with your Mozilla LDAP/GitHub account
3. Click "Generate a new API key"
4. Give it a description like "PerfDash Testing Dashboard"
5. Copy the key and paste it into PerfDash

**Security:** Your API key is stored only in your browser's localStorage (under `perfdash.*` keys) - it never leaves your machine except to authenticate with Bugzilla.

## Deployment

### GitHub Pages (Recommended)

This is a static site and works perfectly on GitHub Pages:

1. **Enable GitHub Pages** in your repo settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Push to main branch** - the included workflow will auto-deploy

3. **Access your dashboard** at: `https://yourusername.github.io/perfdash/`

The included `.github/workflows/deploy.yml` handles everything automatically.

### Alternative: Any Static Host

Since this is pure HTML/CSS/JavaScript, you can host it anywhere:
- Netlify: Drop the folder
- Cloudflare Pages: Connect your repo
- Your own server: Just serve the files

No PHP, no Node.js runtime needed - just static file hosting.

## What's Different from BugDash?

**Scope:**
- Focused on Testing product only (not 19+ Firefox products)
- Limited to 5 components: AWSY, mozperftest, Performance, Raptor, Talos
- Removed Firefox release tracking (Beta, Regressions, Tracked tabs)

**Performance:**
- Parallel component loading with Promise.all()
- Increased async concurrency from 10 → 50 requests
- Removed Firefox version API calls (saves 2 HTTP requests)
- Result: ~30 second load time → ~3-5 seconds

**UX:**
- Auto-selects all 5 Testing components on load
- Default tab is "Stalled & Longstanding" (not Triage)
- Removed irrelevant buglists (Top Crashers, Long Defects/Enhancements/Tasks)

**Storage:**
- Uses namespaced localStorage keys (`perfdash.*`) to avoid conflicts

## Available Tabs

- **Triage**: Recent bugs needing classification and assignment
- **Important**: Blocker and Critical defects requiring immediate attention
- **Stalled & Longstanding**: Inactive assignments and stalled work
- **Overview**: Severity breakdown and maintenance metrics
- **Components**: Select which Testing components to monitor

## Code Quality

Before committing changes:

```bash
make format test
```

This runs Biome for linting/formatting and validates cache-bust integrity.

## Original Project

Based on [Mozilla BugDash](https://github.com/mozilla/bugdash) - original at https://bugdash.moz.tools/

## License

MPL-2.0 (Mozilla Public License 2.0)
