# StackIt 🚀

> **Ask, Answer, Elevate Your Code** - A modern Q&A platform for developers

[![Next.js](https://img.shields.io/badge/Next.js-14.2.21-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green?style=flat-square)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- **🔍 Q&A Hub** - Ask programming questions and get expert answers
- **💬 Threaded Comments** - Multi-level comment system with GIF support
- **⭐ Voting System** - Upvote/downvote posts and comments
- **🏆 Reputation & Badges** - Earn points for valuable contributions
- **🔔 Real-time Notifications** - Get notified when someone responds
- **🔐 Secure Authentication** - OTP-based login with email verification
- **👮‍♂️ Content Moderation** - Advanced reporting and moderation system
- **🎨 Beautiful UI** - Modern design with smooth animations
- **📱 PWA Support** - Installable as a mobile app
- **🌙 Dark/Light Mode** - Customizable theme preferences

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React, Tabler Icons

### Backend
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Custom token-based auth with OTP
- **Email**: Resend API
- **Rate Limiting**: Built-in rate limiting
- **Security**: Cloudflare Turnstile CAPTCHA

### Additional Features
- **Rich Text Editor**: MDX Editor with markdown support
- **GIF Support**: Giphy API integration
- **PWA**: Next.js PWA with offline support
- **Analytics**: Performance monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shravanasati/stackit.git
   cd stackit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=stackit
   DB_SSL=false
   DATABASE_URL=postgresql://your_username:your_password@localhost:5432/stackit

   # Authentication
   SECRET_KEY=your_secret_key_here
   SALT=your_salt_here

   # Email (Resend)
   RESEND_API_KEY=your_resend_api_key

   # Captcha (Cloudflare Turnstile)
   TURNSTILE_SECRET_KEY=your_turnstile_secret

   # Moderation
   MODERATOR_EMAILS=admin@example.com,moderator@example.com

   # Discord Webhook (Optional)
   DISCORD_WEBHOOK_URL=your_discord_webhook_url

   # Environment
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate database schema
   pnpm run db:generate
   
   # Apply migrations
   pnpm run db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
stackit/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── create/            # Post creation
│   ├── feed/              # Main feed
│   ├── login/             # Authentication
│   └── post/              # Individual post pages
├── components/            # React components
│   ├── LandingPage/       # Landing page sections
│   ├── Posts/             # Post-related components
│   ├── ui/                # Reusable UI components
│   └── Gradients/         # Background components
├── lib/                   # Core business logic
│   ├── actions/           # Server actions
│   ├── database/          # Database operations
│   └── utils/             # Utility functions
├── hooks/                 # Custom React hooks
├── migrations/            # Database migrations
└── public/                # Static assets
```

## 🗄️ Database Schema

StackIt uses PostgreSQL with the following main tables:

- **`posts`** - Questions/posts with voting and moderation
- **`comments`** - Threaded comments with GIF support
- **`tokens`** - User authentication tokens
- **`notifications`** - User notifications system
- **`reports`** - Content moderation reports
- **`otp`** - One-time passwords for authentication
- **`security_logs`** - Admin activity logging

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:generate      # Generate database migrations
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio
```

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build the Docker image
docker build -t stackit .

# Run the container
docker run -p 3000:3000 --env-file .env.local stackit
```

## 📊 Key Features Deep Dive

### Authentication System
- **OTP-based login** with email verification
- **Role-based access** (user, admin)
- **Secure token management** with automatic expiration
- **Rate limiting** to prevent abuse

### Content Management
- **Rich text editor** with markdown support
- **Tag system** for categorizing posts
- **Multi-level comments** with threaded replies
- **GIF integration** via Giphy API
- **Vote system** for quality control

### Moderation Tools
- **Content reporting** system
- **Admin dashboard** for moderation
- **Automated content filtering**
- **Security logging** for audit trails

### Performance & UX
- **Progressive Web App** (PWA) support
- **Infinite scrolling** for posts
- **Real-time notifications**
- **Responsive design** for all devices
- **Smooth animations** with Framer Motion

## 🔐 Security Features

- **CAPTCHA protection** with Cloudflare Turnstile
- **Rate limiting** on all sensitive endpoints
- **Content sanitization** to prevent XSS
- **SQL injection protection** via Drizzle ORM
- **Secure authentication** with encrypted tokens

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Manual Deployment

1. **Build the project**
   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Drizzle Team** for the excellent ORM
- **Radix UI** for accessible component primitives
- **Vercel** for hosting and deployment platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shravanasati/stackit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shravanasati/stackit/discussions)
- **Email**: [support@stackit.tech](mailto:support@stackit.tech)

---

<div align="center">
  <strong>Built with ❤️ by the StackIt team</strong>
</div>