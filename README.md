# InnoTech-Hub Connect

**Global Tech Events & Smart Campus SaaS Ecosystem**

A student-first platform featuring outcome-based events, AI growth tools, and SaaS solutions for colleges and clubs.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup (5 minutes)
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Add your BLOB_READ_WRITE_TOKEN to .env

# 3. Start dev server
npm run dev
```

Visit **http://localhost:5173**

### Build for Production
```bash
npm run build
```

---

## 📚 Key Features

✨ **Event Platform**
- Discover, register, and attend events
- Hackathons, workshops, live sessions, podcasts
- Payment and ticketing integration
- Project submissions and verification

👥 **Student Growth**
- Personal innovation passport
- Certificate tracking and verification
- AI-powered recommendations
- Skill growth analytics

🎯 **Admin Dashboard**
- Event CMS with event management
- Sponsor/partner logo upload
- Student management and verification
- Payment tracking and reports
- Settings and configuration

🔧 **SaaS Products** (Upcoming)
- Club task manager
- Volunteer attendance & tracking
- College document repository
- Faculty attendance & alerts

---

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing**: TanStack Router with file-based routes
- **Build**: Vite 7
- **Server**: TanStack Start with pre-rendering
- **Storage**: Vercel Blob (file uploads)
- **Database**: localStorage (seedable, extendable to backend)
- **Auth**: localStorage-based with role guards

---

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Full deployment guide for Vercel
- **[.env.example](./.env.example)** - Environment variable template

---

## 🔐 Authentication

### Roles
- **Admin**: Full access to CMS, events, students, payments
- **Student**: Access to profile, events, certificates, dashboard
- **Public**: Access to home, pricing, events listing

### Getting Started
1. Go to `/signup` to create an account
2. Select your role (Admin or Student)
3. Login and explore

---

## 📁 Project Structure

```
src/
├── components/        # Reusable components
│   ├── admin/        # Admin UI
│   ├── auth/         # Auth logic
│   └── ui/           # Shadcn components
├── pages/            # Route page components
├── routes/           # TanStack Router definitions
├── lib/              # Core utilities
│   ├── auth.ts       # Authentication
│   ├── cms.ts        # CMS & persistence
│   ├── events.ts     # Event logic
│   └── theme.ts      # Theme management
└── data/             # Static data

api/
└── upload.js         # Vercel file upload endpoint
```

---

## 🎨 Key Pages

### Public
- `/` - Home with hero, roadmap, SaaS, benefits
- `/pricing` - Pricing plans
- `/events` - Event listing
- `/contact` - Contact form
- `/privacy-policy`, `/terms`, `/rules` - Legal pages

### Student
- `/student/dashboard` - Personal dashboard
- `/student/profile` - Profile editing
- `/student/events` - Registered events
- `/student/certificates` - Earned certificates
- `/student/settings` - Preferences & theme

### Admin
- `/admin/dashboard` - Overview
- `/admin/events` - Event CMS
- `/admin/sponsors` - Sponsor management
- `/admin/partners` - Partner management
- `/admin/students` - Student verification
- `/admin/certificates` - Certificate management

---

## ⚙️ Environment Setup

### Required Variables
```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
BLOB_PREFIX=uploads
```

### Getting Vercel Blob Token
1. Create account at [Vercel](https://vercel.com)
2. Navigate to **Storage** → **Blob**
3. Create a Blob storage instance
4. Copy the Read/Write Token
5. Paste into `.env`

---

## 🚀 Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New** → **Project**
   - Select your repo

3. **Set Environment Variables**
   - Add `BLOB_READ_WRITE_TOKEN`
   - Add `BLOB_PREFIX`

4. **Deploy**
   - Click Deploy
   - Site goes live automatically

---

## 🛠️ Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📊 Features by Module

| Module | Status | Description |
|--------|--------|-------------|
| Event Platform | ✅ Complete | Full event management and registration |
| Student Dashboard | ✅ Complete | Growth tracking and analytics |
| Admin CMS | ✅ Complete | Content management interface |
| File Uploads | ✅ Complete | Image and document uploads via Vercel Blob |
| Authentication | ✅ Complete | Role-based access control |
| Dark Theme | ✅ Complete | Dark/light/system preference |
| AI Tools | 🔄 In Progress | Recommendation and analysis (placeholder UI) |
| Payments | 🔄 In Progress | Event payment integration |
| Notifications | 🔄 In Progress | Real-time notifications |
| Backend Database | ⏳ Future | Migration from localStorage |

---

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist package-lock.json
npm install && npm run build
```

### File Upload Not Working
- Check `BLOB_READ_WRITE_TOKEN` in `.env`
- Verify file size < 8MB
- Check browser console for errors

### Theme Not Changing
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Try again in Settings

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/awesome`
3. Commit changes: `git commit -m 'Add awesome feature'`
4. Push: `git push origin feature/awesome`
5. Open Pull Request

---

## 📞 Support

- **Email**: innotechhub@gmail.com
- **Discord**: https://discord.gg/PHh7BRmq
- **Issues**: [GitHub Issues](https://github.com/innotech-hub/connect/issues)

---

## 📄 License

InnoTech-Hub Connect - All Rights Reserved

---

**Status**: 🟢 Production Ready  
**Last Updated**: June 23, 2026  
**Build**: ✅ Passing

