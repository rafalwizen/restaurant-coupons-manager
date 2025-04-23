# Restaurant Coupon Manager

A React-based frontend application for managing restaurant coupons, integrated with a RESTful API. This project provides a foundation with authentication capabilities and is ready for extending with coupon management features.

## Features

- **Authentication System**: Complete login/logout functionality with JWT token management
- **Protected Routes**: Access control based on authentication state
- **Responsive Design**: Mobile and desktop friendly UI using Tailwind CSS
- **Toast Notifications**: User feedback system for actions and errors
- **Error Handling**: Comprehensive API error handling

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for build tooling and development server
- **React Router v6** for routing
- **Axios** for API requests
- **Tailwind CSS** for styling
- **JWT Decode** for token handling

## Project Structure

```
restaurant-coupons-manager/
├── public/             # Static assets
├── src/
│   ├── api/            # API client and request handling
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Layout components (navbar, footer)
│   │   ├── routing/    # Route-related components
│   │   └── ui/         # UI elements (buttons, inputs, etc.)
│   ├── contexts/       # React contexts (auth, toast)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Entry point
│   ├── router.tsx      # Router configuration
│   └── index.css       # Global styles and Tailwind imports
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/restaurant-coupons-manager.git
cd restaurant-coupons-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

## Authentication

The authentication system is built with the following features:

- JWT token storage and management
- Login form with validation
- Protected routes that require authentication
- Automatic redirect to login page for unauthenticated users
- Role-based access control (admin vs regular user)

## API Integration

The application is set up to communicate with a RESTful API as defined in the OpenAPI specification. API requests are centralized in the `api` directory with proper type definitions.

## Future Development

This project is currently focused on authentication and foundation setup. Planned features for future development include:

- Coupon creation and management
- Coupon listing and filtering
- Reports and analytics
- User management for administrators
