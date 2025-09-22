# 🎨 Ryansh's Creative Portfolio

A modern, responsive portfolio website showcasing comics, videos, and creative works by Ryansh Sharma from Sydney, Australia.

![Next.js](https://img.shields.io/badge/Next.js-14.0.4-000000?logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-3ECF8E?logo=supabase)

## ✨ Features

### 🌟 Public Portfolio
- **Hero Section** - Animated landing page with creative showcase
- **Comics Gallery** - Interactive grid with full-size image viewing
- **Video Collection** - YouTube integration with responsive embeds
- **About Page** - Personal story and creative journey
- **Mobile-First Design** - Fully responsive across all devices

### 🔐 Admin Dashboard
- **Easy Publishing** - One-click admin access for daily content updates
- **Drag & Drop Upload** - Simple photo upload for comic strips
- **YouTube Integration** - Paste any YouTube URL for instant video embedding
- **Real-time Editing** - Inline content editing with immediate preview
- **Secure Authentication** - Protected admin area with Supabase integration

### 🚀 Technical Features
- **Modern Stack** - Built with Next.js 14, React 18, and Tailwind CSS
- **Cloud Storage** - Automatic image optimization via Supabase Storage
- **Database Integration** - PostgreSQL database for content management
- **Notification System** - User-friendly feedback for all actions
- **Responsive Design** - Optimized for desktop, tablet, and mobile

## 🛠 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database and storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ryanshrules-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL commands from `supabase_setup.sql` in your Supabase SQL editor
   - This creates the necessary tables and storage policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
ryanshrules-website/
├── app/                    # Next.js app directory
│   ├── layout.js          # Root layout component
│   ├── page.js            # Main application component
│   └── global.css         # Global styles with Tailwind
├── lib/                   # Utility libraries
│   └── supabase.js        # Supabase client configuration
├── supabase_setup.sql     # Database schema and policies
├── package.json           # Dependencies and scripts
└── tailwind.config.js     # Tailwind CSS configuration
```

## 🎯 Usage Guide

### For Content Creators (Admin)

1. **Access Admin Panel**
   - Click "Admin" in the navigation
   - Login with credentials (default: `admin` / `ryansh2024`)

2. **Publishing Comics**
   - Navigate to Comics section
   - Click "Add New Comic"
   - Drag & drop your comic image or click to browse
   - Add title and date
   - Click "Save"

3. **Adding Videos**
   - Go to Videos section
   - Click "Add New Video"
   - Paste YouTube URL (e.g., `https://youtube.com/watch?v=dQw4w9WgXcQ`)
   - Add title and date
   - Click "Save"

4. **Managing Content**
   - **Edit**: Click edit button on any item
   - **Delete**: Click delete with confirmation
   - **View**: Click comics for full-size viewing

### For Visitors

- **Browse Comics** - View all comic strips in a beautiful grid layout
- **Watch Videos** - Embedded YouTube videos with responsive design
- **Learn About Ryansh** - Personal story and creative journey
- **Full-size Viewing** - Click any comic for enlarged view

## 🔧 Configuration

### Admin Credentials
**⚠️ Important**: Change default credentials for production use!

Default login:
- Username: `admin`
- Password: `ryansh2024`

### Supabase Setup
The application uses Supabase for:
- **Database**: PostgreSQL for comics and videos metadata
- **Storage**: Image hosting with CDN
- **Authentication**: Secure admin login

### Database Schema
```sql
-- Comics table
comics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  date VARCHAR(50),
  image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Videos table
videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  date VARCHAR(50),
  youtube_id VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 📱 Responsive Design

The website is optimized for all screen sizes:

- **Desktop** (1200px+): Full multi-column layout
- **Tablet** (768px - 1199px): Responsive grid adjustments
- **Mobile** (< 768px): Single column with touch-friendly interface

## 🎨 Customization

### Styling
- Built with Tailwind CSS for easy customization
- Dark/light theme sections for visual contrast
- Smooth animations and transitions
- Hover effects and interactive elements

### Content
- Update personal information in the About section
- Modify hero text and call-to-action buttons
- Customize color scheme via Tailwind classes
- Add new sections or modify existing layouts

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public read access, authenticated write access
- Secure file uploads to Supabase Storage
- Environment variables for sensitive data
- Admin authentication with session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/ryanshrules-website/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide React](https://lucide.dev/)
- File uploads via [React Dropzone](https://react-dropzone.js.org/)

---

**Made with ❤️ for creative storytelling and digital art showcase**