# Restaurant Admin Dashboard

A modern, real-time dashboard for restaurant management with advanced analytics, customer insights, and business intelligence.

## Features

- 📊 Real-time Analytics Dashboard
- 🤖 AI-powered Business Assistant
- 📱 Responsive Design
- 🔄 Live Transaction Monitoring
- 📈 Sales & Performance Metrics
- 👥 Customer Relationship Management
- 📦 Product Bundle Analytics
- 🎯 Data-driven Recommendations

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional)

### Environment Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Start development server: `npm run dev`

### Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── db/            # Database schemas and types
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── types/         # TypeScript definitions
├── public/            # Static assets
└── docker/           # Docker configuration
```

### Technology Stack

- React 18 with TypeScript
- Vite for building and development
- TailwindCSS for styling
- Recharts for data visualization
- LibSQL for database management
- Lucide React for icons

## Database

The application uses LibSQL for data management with the following key tables:

- Users & Authentication
- Products & Inventory
- Orders & Transactions
- Customer Management
- Analytics Events

## Deployment

### Using Docker

```bash
# Build the image
docker build -t restaurant-dashboard .

# Run the container
docker run -p 3000:3000 restaurant-dashboard
```

### Manual Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` directory to your hosting provider
3. Configure environment variables
4. Set up SSL certificates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details