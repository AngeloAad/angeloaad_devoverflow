# DevFlow

A comprehensive Q&A platform for developers to ask questions, share knowledge, and collaborate with the global programming community.

## 🚀 Features

- **Authentication System**: Secure login/signup with credentials, GitHub, and Google OAuth via NextAuth
- **Question Management**: Ask, edit, delete, and filter questions with rich markdown support
- **Answer System**: Post answers with markdown formatting, code highlighting, and voting
- **AI-Powered Assistance**: Get intelligent answers to programming questions using OpenAI's GPT models
- **Tag System**: Organize and filter content by programming languages and technologies
- **User Profiles**: Customizable profiles showcasing user activity, reputation, and badges
- **Responsive Design**: Fully responsive UI optimized for all device sizes
- **Dark/Light Mode**: Theme support with system preference detection
- **Real-time Markdown Preview**: Live preview while writing questions and answers

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: App Router, Server Components, and Server Actions
- **React 19**: Latest React features and patterns
- **TypeScript**: Type-safe code development
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives
- **MDX Editor**: Rich markdown editing experience
- **Bright**: Syntax highlighting for code blocks

### Backend
- **Next.js API Routes/Server Actions**: RESTful API endpoints and server actions
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: MongoDB object modeling
- **NextAuth.js**: Authentication solution
- **AI SDK**: Integration with OpenAI and Deepseek models

### DevOps & Tools
- **ESLint & Prettier**: Code quality and formatting
- **Pino**: Logging infrastructure
- **Turbopack**: Fast development builds

## 📋 Project Structure

```
dev-overflow/
├── app/                  # Next.js App Router structure
│   ├── (auth)/           # Authentication routes
│   ├── (root)/           # Main application routes
│   ├── api/              # API endpoints
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── editor/           # Markdown editor components
│   ├── forms/            # Form components
│   ├── navigation/       # Navigation components
│   └── ui/               # UI component library
├── lib/                  # Utility functions and helpers
├── public/               # Static assets
└── auth.ts               # Authentication configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/dev-overflow.git
cd dev-overflow
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Key Implementation Details

### Authentication Flow
The application uses NextAuth.js for authentication with multiple providers:
- Credentials-based authentication with bcrypt password hashing
- OAuth integration with GitHub and Google
- JWT session handling for secure authentication state

### Database Schema
MongoDB collections with Mongoose models for:
- Users: Profile information, reputation, and activity
- Questions: Title, content, tags, and metadata
- Answers: Content, votes, and question references
- Tags: Name, description, and usage statistics

### AI Integration
- Integration with OpenAI's GPT models for generating answers
- Context-aware responses based on question content
- User answer enhancement and validation

### Performance Optimizations
- Server-side rendering for improved SEO and initial load performance
- Static generation with ISR (Incremental Static Regeneration) for frequently accessed pages
- Image optimization with Next.js Image component
- Code splitting and lazy loading for improved bundle size

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/)