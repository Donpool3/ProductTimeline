# Product Timeline Web Application

Transform project documentation into interactive, visual case studies that capture the complete product lifecycle from problem discovery through implementation and outcomes.

## Overview

The Product Timeline Web Application is a companion tool that automatically discovers, parses, and visualizes project documentation as an interactive timeline. It addresses a critical business need: capturing case study information in real-time as the project evolves, rather than attempting to reconstruct the narrative after the fact.

### Key Features

- **Automatic Documentation Discovery**: Scans project directories for requirements, design docs, implementation logs, and research notes
- **Interactive Timeline Visualization**: Horizontal timeline with phases, milestones, and artifacts
- **Narrative Context Management**: Add rich text annotations and decision rationale
- **Metrics and Analytics**: Track quantitative progress and business impact
- **Multi-Project Support**: Manage portfolio of timelines across organization
- **Export Capabilities**: Generate PowerPoint presentations, PDF reports, and HTML websites
- **Real-Time Updates**: Timeline grows automatically as documentation changes
- **Platform Integration**: RESTful API, embeddable widgets, and webhooks for ops platform

## Architecture

This is a monorepo containing:

- **Frontend**: React 18 + TypeScript + Vite + Material-UI
- **Backend**: NestJS + TypeScript + PostgreSQL + Redis

## Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **Docker**: For running PostgreSQL and Redis locally
- **Git**: For version control

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ProductTimeline
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend workspaces.

### 3. Set Up Environment Variables

#### Backend

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` and configure your environment variables (defaults work for local development).

#### Frontend

```bash
cd packages/frontend
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development).

### 4. Start Docker Services

From the root directory:

```bash
npm run docker:up
```

This starts PostgreSQL and Redis containers.

### 5. Start Development Servers

From the root directory:

```bash
npm run dev
```

This starts both frontend and backend in development mode with hot reload.

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

## Project Structure

```
ProductTimeline/
├── packages/
│   ├── frontend/              # React frontend application
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── store/         # Redux store
│   │   │   ├── App.tsx        # Main app component
│   │   │   └── main.tsx       # Entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── jest.config.js
│   │
│   └── backend/               # NestJS backend API
│       ├── src/
│       │   ├── app.module.ts  # Root module
│       │   ├── app.controller.ts
│       │   ├── app.service.ts
│       │   └── main.ts        # Entry point
│       ├── package.json
│       ├── tsconfig.json
│       └── jest.config.js
│
├── docker-compose.yml         # Docker services (PostgreSQL, Redis)
├── package.json               # Root package.json (workspaces)
├── .prettierrc.js            # Prettier configuration
├── .gitignore
└── README.md
```

## Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both workspaces
- `npm run test` - Run tests in both workspaces
- `npm run lint` - Lint both workspaces
- `npm run format` - Format code with Prettier
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services
- `npm run docker:logs` - View Docker logs

### Frontend Workspace

```bash
cd packages/frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

### Backend Workspace

```bash
cd packages/backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## Development Workflow

### 1. Create a New Feature

1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Implement feature in appropriate workspace
3. Write tests
4. Run linter and formatter
5. Commit changes with descriptive message
6. Push and create pull request

### 2. Running Tests

```bash
# Run all tests
npm run test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run tests in watch mode (in workspace)
cd packages/frontend
npm run test:watch
```

### 3. Code Quality

```bash
# Lint all code
npm run lint

# Format all code
npm run format

# Check formatting without changes
npm run format:check
```

## Docker Services

### PostgreSQL

- **Host**: localhost
- **Port**: 5432
- **Database**: timeline_db
- **User**: timeline_user
- **Password**: timeline_password

### Redis

- **Host**: localhost
- **Port**: 6379

### Managing Docker Services

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Restart services
npm run docker:down && npm run docker:up
```

## API Documentation

Once the backend is running, visit:

**http://localhost:3001/api/docs**

This provides interactive Swagger documentation for all API endpoints.

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=timeline_user
DATABASE_PASSWORD=timeline_password
DATABASE_NAME=timeline_db

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d

CORS_ORIGIN=http://localhost:5173

WATCH_ENABLED=true
WATCH_DEBOUNCE_MS=1000

MOCK_MODE=false
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_MOCK_MODE=false
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_EXPORT=true
```

## Technology Stack

### Frontend

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Material-UI (MUI)**: Component library
- **Redux Toolkit**: State management
- **React Router**: Routing
- **D3.js**: Timeline visualization
- **Recharts**: Charts and metrics
- **Axios**: HTTP client
- **Jest**: Testing framework

### Backend

- **NestJS**: Node.js framework
- **TypeScript**: Type safety
- **PostgreSQL**: Relational database
- **TypeORM**: ORM for database access
- **Redis**: Caching and sessions
- **Socket.io**: Real-time communication
- **Passport JWT**: Authentication
- **Swagger**: API documentation
- **Chokidar**: File system watching
- **Unified.js**: Markdown parsing
- **Jest**: Testing framework

## Troubleshooting

### Port Already in Use

If ports 3001 (backend) or 5173 (frontend) are in use:

```bash
# Find process using port
lsof -i :3001
lsof -i :5173

# Kill process
kill -9 <PID>
```

Or change ports in environment variables.

### Docker Services Not Starting

```bash
# Check Docker is running
docker ps

# Remove old containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Database Connection Issues

1. Ensure Docker services are running: `docker ps`
2. Check environment variables match docker-compose.yml
3. Try restarting Docker services: `npm run docker:down && npm run docker:up`

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Ensure linting and formatting pass
5. Submit pull request

## License

[Your License Here]

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## Next Steps

After setup, refer to the implementation plan in `.kiro/specs/product-timeline-webapp/tasks.md` to begin building features.

Start with Phase 1 tasks to build the foundation, then move to Phase 2 for mock data and UI development.
