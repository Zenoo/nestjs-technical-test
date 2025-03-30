# NestJS Technical Test API

This project is a technical test built with [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), and [PostgreSQL](https://www.postgresql.org/). It serves as a RESTful API for managing users, authentication, runs and records.

## Features

- **Authentication**: Endpoints for user login and registration.
- **Swagger API Documentation**: Automatically generated API documentation available at `/api`.
- **Validation**: Input validation using `class-validator`.
- **Database Integration**: Uses Prisma ORM for database management.
- **Seeding**: Predefined data seeding for development.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- `pnpm` package manager

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Zenoo/nestjs-technical-test
   cd nestjs-technical-test
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the environment variables:

   Copy `.env.sample` to `.env` and update the values as needed:

   ```bash
   cp .env.sample .env
   ```

4. Run database migrations:

   ```bash
   pnpm prisma migrate dev
   ```

5. Seed the database (optional):

   ```bash
   pnpm prisma db seed
   ```

## Running the Application

### Development

Start the application in development mode with hot-reloading:

```bash
pnpm start:dev
```

### Production

Build and start the application:

```bash
pnpm build
pnpm start:prod
```

## API Documentation

The API documentation is available at [http://localhost:3000/api](http://localhost:3000/api) (or the port specified in your `.env` file). It is generated using Swagger and includes details about all available endpoints.

## Testing

Run unit tests:

```bash
pnpm test
```

Run end-to-end tests:

```bash
pnpm test:e2e
```

Check test coverage:

```bash
pnpm test:cov
```

## Project Structure

```
nestjs-technical-test/
├── prisma/                 # Prisma schema and migrations
├── src/                    # Source code
│   ├── auth/               # Authentication module
│   ├── common/             # Shared utilities and modules
│   ├── prisma/             # Prisma service
│   ├── records/            # Records module
│   ├── runs/               # Runs module
│   ├── users/              # Users module
│   ├── app.module.ts       # Root module
│   ├── main.ts             # Application entry point
│   └── metadata.ts         # Swagger metadata
├── test/                   # End-to-end tests
├── .env.sample             # Sample environment variables
├── package.json            # Project metadata and scripts
└── README.md               # Project documentation
```

## Environment Variables

The following environment variables are required:

- `PORT`: The port on which the application will run (default: `3000`).
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `DATABASE_URL`: Connection string for the PostgreSQL database.

