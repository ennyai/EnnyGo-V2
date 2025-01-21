# EnnyGo V2

EnnyGo is a web application designed to enhance athletes' experience by integrating with Strava, generating creative activity names, and enabling virtual ultra-endurance events. The platform fosters community engagement through live event tracking and a blog section.

## Features

- 🏃‍♂️ Strava Integration
  - OAuth2 Authentication
  - Activity Sync
  - Webhook Integration
  - Creative Activity Naming
- 🎯 Virtual Events
  - Ultra-endurance Challenges
  - Live Progress Tracking
  - Community Leaderboards
- 📱 Modern Dashboard
  - Activity Statistics
  - Progress Visualization
  - Achievement Tracking
- 📝 Blog Platform
  - Community Stories
  - Training Tips
  - Event Updates

## Tech Stack

- **Frontend:**
  - React (Functional Components + Hooks)
  - Vite
  - Redux Toolkit
  - React Router
  - shadcn/ui Components
  - Tailwind CSS

- **Backend:**
  - Express.js
  - MongoDB
  - Strava API Integration
  - Webhook System

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Strava API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ennyai/EnnyGo-V2.git
   cd EnnyGo-V2
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_STRAVA_CLIENT_ID=your_client_id
   VITE_STRAVA_CLIENT_SECRET=your_client_secret
   VITE_STRAVA_REDIRECT_URI=http://localhost:3000/dashboard
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:3000`.

## Development

### Branch Strategy

- `main` - Production-ready code
- `staging` - Pre-production testing
- `development` - Active development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run tests
- `yarn test:coverage` - Run tests with coverage report

## Testing

We use Vitest and React Testing Library for testing. Run tests with:

```bash
yarn test
```

## Error Handling

Check `docs/ERROR_SOLUTIONS.md` for common issues and their solutions.

## Contributing

1. Create a feature branch from `development`
2. Make your changes
3. Submit a pull request to `development`

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Route components
├── store/         # Redux store and slices
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
├── services/      # API services
└── server/        # Backend code
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Strava API](https://developers.strava.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
