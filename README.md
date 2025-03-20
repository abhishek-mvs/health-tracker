# 🏃‍♂️ Health Tracker

A modern, collaborative health tracking application that helps you and your groups maintain a healthy lifestyle together. Track weight, monitor progress, and achieve fitness goals as a community.

![Health Tracker Banner](https://your-banner-image-url.png)

## ✨ Features

### 📊 Personal Health Tracking
- **Weight Logging**: Easy-to-use interface for recording daily weight measurements
- **Progress Visualization**: Interactive graphs showing weight trends over time
- **Historical Data**: View and manage your complete weight history

### 👥 Group Collaboration
- **Group Creation**: Create and manage health-focused groups
- **Member Management**: Invite friends and family to join your health journey
- **Shared Progress**: Track collective progress and motivate each other
- **Group Analytics**: View aggregated group statistics and achievements

### 🎯 User Experience
- **Responsive Design**: Beautiful, mobile-first interface that works on all devices
- **Real-time Updates**: Instant data synchronization across all users
- **Intuitive Navigation**: Clean and modern UI with smooth transitions
- **Dark/Light Mode**: Comfortable viewing experience in any lighting condition

### 🔒 Security & Privacy
- **Secure Authentication**: Email-based authentication system
- **Data Privacy**: Personal health data is kept private and secure
- **User Control**: Full control over data sharing preferences

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Custom animations with Motion library
  - Responsive design principles
- **Components**:
  - Custom UI components
  - Chart.js for data visualization
  - React DatePicker for date selection
  - Radix UI for accessible components

### Backend & Database
- **Database**: [Supabase](https://supabase.com/)
  - PostgreSQL for data storage
  - Real-time subscriptions
  - Row Level Security
- **Authentication**: Supabase Auth
  - Email authentication
  - Session management
  - Protected routes

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**:
  - TypeScript for type safety
  - Prettier for code formatting
  - Modern ES6+ features

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/health-tracker.git
   cd health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in the `.env` file.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

Create a `.env` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and Supabase
