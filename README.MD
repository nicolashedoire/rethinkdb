# Real-time CPU Metrics Dashboard

This project is a real-time CPU metrics visualization dashboard built with Next.js, RethinkDB, and Redis. It collects CPU usage data and displays it in a real-time chart using Server-Sent Events (SSE) and Recharts.

## Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)

## Project Structure

- `app/` - Next.js application
  - `pages/` - React components and pages
  - `utils/` - Utility functions including database connection pool
- `server.js` - Express server with Next.js integration
- `insert-test-data.js` - Script to collect and insert CPU metrics
- `docker-compose.yml` - Docker services configuration
- `Dockerfile` - Multi-stage build configuration

## Quick Start

1. Clone the repository
2. Start the application:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:5000`

## Services

The application consists of three main services:

- **App**: Next.js application with Express server (port 5000)
- **RethinkDB**: Database for storing metrics (ports 28015, 8080)
- **Redis**: Cache server (port 6380)

## Development

For local development:

1. Install dependencies:
```bash
npm install
```

2. Start RethinkDB and Redis:
```bash
docker-compose up rethinkdb redis
```

3. Run the development server:
```bash
npm run dev
```

## Architecture

- The application uses Server-Sent Events (SSE) for real-time updates
- CPU metrics are collected every second using the `os-utils` package
- Data is stored in RethinkDB and can be visualized through the RethinkDB admin interface (port 8080)
- Connection pooling is implemented for RethinkDB connections

## Environment Variables

- `NODE_ENV`: Set to 'production' in Docker environment
- Database configurations are set in the connection files:
  - RethinkDB: host: 'rethinkdb', port: 28015
  - Redis: host: 'redis', port: 6379

## Monitoring

- RethinkDB admin interface: `http://localhost:8080`
- Application metrics: `http://localhost:5000`

## Troubleshooting

1. If the application fails to start, check the Docker logs:
```bash
docker-compose logs -f
```

2. Common issues:
   - Database connection failures: Check if RethinkDB is healthy
   - Port conflicts: Ensure ports 5000, 28015, 8080, and 6380 are available
   - Permission issues: The container runs as non-root user 'nextjs'

## Security Notes

- The application runs as a non-root user in production
- Environment variables should be properly configured in production
- Default ports should be changed in production environment
