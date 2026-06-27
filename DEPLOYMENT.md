# InnoTech-Hub Deployment & Setup Guide

## Overview
InnoTech-Hub is a full-stack event platform and SaaS ecosystem built with React 19, TypeScript, Vite 7, TanStack Router, and TanStack Start. The app includes event management, student authentication, CMS, file uploads, and admin dashboards.

---

## Environment Variables

### Required Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):

```
# Vercel Blob Storage - for file uploads
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
BLOB_PREFIX=uploads
```

#### How to Get Vercel Blob Token
1. Go to [Vercel Dashboard](https://vercel.com)
2. Navigate to **Storage** → **Blob**
3. Create a new Blob storage instance
4. Copy the **Read/Write Token**
5. Paste it into `BLOB_READ_WRITE_TOKEN`

---

## Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/innotech-hub-connect.git
cd innotech-hub-connect

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your Vercel Blob token to .env
```

### Running Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173`

---

## Features & Functionality

### Authentication System
- **Local Storage Based**: Uses `src/lib/auth.ts` for user management
- **Roles**: `admin`, `student`, `public`
- **Protected Routes**: `ProtectedRoute` component ensures role-based access
- **Demo Accounts**:
  - Admin: Use the signup form and select role
  - Student: Use the signup form and select role

### CMS Collections
- **Events**: Event details, registration, rounds, rewards, payment
- **Sponsors/Partners**: Logo upload, website URL, sponsorship levels
- **Team Categories & Members**: Team structure, member profiles
- **Pages**: Privacy, Terms, Rules (auto-seeded)
- **Site Stats**: Home page statistics and hero metrics
- **Roadmap**: Phases, milestones, progress tracking
- **Media**: Post categories and content

### File Upload System
- **FileUploadField Component**: `src/components/admin/FileUploadField.tsx`
- **Upload API**: `api/upload.js` handles base64 → Vercel Blob conversion
- **Fallback**: If upload fails, uses browser-based data URLs as preview
- **Supported Types**: Images (JPG, PNG, WebP), PDFs, documents

### Student Profile Features
- Profile photo upload
- Basic details (name, email, phone, college, department, year, city, state)
- Professional details (LinkedIn, GitHub, portfolio, resume upload)
- Achievement tracking (hackathons, projects, certificates, workshops)
- Certificate count display (auto-fetched from `getMyCertificates()`)

### Theme System
- Dark/Light/System preference
- Stored in localStorage
- Early script injection prevents theme flash on page load
- Settings UI in `StudentSettingsPage.tsx`

### Admin Dashboard
- Event CMS with inline editor
- Sponsor/Partner management with logo upload
- Student management and verification
- Certificate management
- Payment tracking
- Settings and configuration

### Student Dashboard
- Event registration and history
- Certificate viewing
- Profile management
- Settings and preferences
- Notifications and submissions

---

## Project Structure

```
src/
├── components/
│   ├── admin/              # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── CmsModule.tsx
│   │   ├── FileUploadField.tsx
│   │   └── ...
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── site/               # Public-facing components
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sections.tsx
│   │   └── ...
│   └── ui/                 # Shadcn UI components
├── pages/                  # Route components
│   ├── AdminDashboardPage.tsx
│   ├── AdminEventsPage.tsx
│   ├── StudentProfilePage.tsx
│   ├── StudentSettingsPage.tsx
│   └── ...
├── routes/                 # TanStack Router routes
│   ├── __root.tsx          # Root layout with theme init
│   ├── admin/              # Admin routes
│   ├── student/            # Student routes
│   └── ...
├── lib/
│   ├── auth.ts            # Authentication logic
│   ├── cms.ts             # CMS persistence & seed data
│   ├── events.ts          # Event utilities
│   ├── studentPlatform.ts # Student profile & data
│   ├── theme.ts           # Theme management
│   └── ...
├── data/
│   ├── roadmapData.ts
│   └── mediaOutreachLinks.ts
├── styles.css
├── router.tsx
└── start.ts
api/
└── upload.js              # Vercel serverless file upload
```

---

## Build & Deployment

### Build for Production
```bash
npm run build
```

This creates:
- `dist/client/` - Client bundle
- `dist/server/` - Server bundle
- Pre-rendered static pages

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click **Add New** → **Project**
   - Import GitHub repository
   - Vercel auto-detects Next.js/TanStack Start

3. **Configure Environment Variables**
   - In Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add `BLOB_READ_WRITE_TOKEN` and `BLOB_PREFIX`
   - Redeploy

4. **Deploy**
   - Vercel automatically builds and deploys on every push
   - Default build command: `npm run build`
   - Default output directory: `dist/client`

---

## Important Features

### Protected Routes
Routes are protected via `ProtectedRoute` component in `src/components/auth/ProtectedRoute.tsx`:
- Redirects unauthorized users to login
- Redirects wrong roles to their respective dashboards
- Shows loading state while checking authentication

### CMS Content Persistence
- All CMS data stored in `localStorage` under `innotech-cms-*` keys
- Includes seed data for pages, sponsors, events, statistics
- Survives browser refresh but lost on cache clear
- Can be enhanced with backend database

### Theme Flash Prevention
- Inline script in `RootShell` applies theme before React hydration
- Prevents white flash on dark theme preference
- Reads from localStorage: `themePreference`

### Error Boundaries
- Admin error boundary in `AdminLayout.tsx` catches section-level errors
- Protected route error boundary ensures user stays logged in during errors
- Graceful fallbacks with "Try again" and "Back to dashboard" options

---

## Troubleshooting

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist && npm run build`

### Upload Not Working
- Verify `BLOB_READ_WRITE_TOKEN` is set and valid
- Check browser console for network errors
- Ensure file is not too large (default: 8MB max)

### Authentication Issues
- Clear browser localStorage and cookies
- Refresh page and try login again
- Check console for auth errors

### Routes Not Loading
- Ensure routes are defined in `src/routes/`
- Check `src/routeTree.gen.ts` is generated
- Rebuild: `npm run build`

### Theme Not Persisting
- Check if localStorage is enabled
- Verify `themePreference` key in browser Storage
- Check `StudentSettingsPage.tsx` for theme preference logic

---

## Testing Accounts

### Create Test Accounts
1. Go to `/signup`
2. Fill in details
3. Select role (Admin or Student)
4. Login with same email/password

### Sample Data
- Seed events, sponsors, and stats included in `src/lib/cms.ts`
- Modify seed data and redeploy to update defaults

---

## Monitoring & Maintenance

### Logs
- Client errors → Browser DevTools Console
- Server errors → Vercel Logs
- API uploads → Check `api/upload.js` console output

### Performance
- Client bundle size: ~365KB (gzipped)
- Server bundle: ~48KB
- Prerendered pages: 44 static pages

### Security
- Authentication: localStorage (consider migrating to secure backend)
- API: Protect endpoints with environment variables
- File uploads: Validate on server before storing

---

## Future Enhancements

1. **Database Backend**: Migrate from localStorage to PostgreSQL/MongoDB
2. **Payment Integration**: Stripe/Razorpay for event payments
3. **Email Notifications**: SendGrid/Mailgun for event updates
4. **Analytics**: Track user behavior, event conversions
5. **Mobile App**: React Native version
6. **API Documentation**: OpenAPI/Swagger spec

---

## Support & Contribution

- **Issues**: Open on GitHub
- **Discussions**: GitHub Discussions
- **Contributing**: Fork → Branch → PR

---

## License

This project is part of InnoTech-Hub. Refer to LICENSE file.

---

## Contact

- **Email**: innotechhub@gmail.com
- **Discord**: https://discord.gg/PHh7BRmq
- **Website**: https://innotech-hub.com

---

**Last Updated**: June 23, 2026
**Status**: Production Ready ✅
