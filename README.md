# Fotosnap

A full-stack Instagram-style photo sharing app. Share posts and 24-hour stories, like, comment, bookmark and follow people.

**Live demo:** https://fotosnap.vercel.app

## Features

- Email and password sign-up and login
- Photo posts with captions, likes, comments and bookmarks
- Stories grouped by user, with a full-screen story viewer
- User profiles with avatars, bios, and follower and following lists
- Follow suggestions
- Images go straight from the browser to S3 through presigned URLs and are served by CloudFront
- Light and dark themes

## Tech stack

| Area           | Tools                                                                            |
| -------------- | -------------------------------------------------------------------------------- |
| Frontend       | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, TanStack Query, React Hook Form |
| Backend        | NestJS, tRPC, Better Auth, Drizzle ORM, Zod                                      |
| Database       | PostgreSQL (Amazon RDS)                                                          |
| Storage        | Amazon S3 + CloudFront                                                           |
| Infrastructure | Vercel (web), AWS Elastic Beanstalk with CodePipeline and CodeBuild (API)        |
| Tooling        | Turborepo, pnpm workspaces, TypeScript, Vitest, ESLint, oxlint, Prettier         |

## Project structure

```
apps/
  web/        Next.js frontend
  backend/    NestJS API (tRPC routers, auth, uploads, migrations)
packages/
  trpc/                Shared tRPC router types and Zod schemas
  eslint-config/       Shared ESLint config
  typescript-config/   Shared tsconfig files
```

The frontend and backend share types through `@repo/trpc`, so API calls are type-checked end to end.

## Getting started

### Prerequisites

- Node.js 24+
- pnpm 11+
- PostgreSQL

### Setup

```bash
pnpm install
```

Create `apps/backend/.env`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/fotosnap
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_NAME=fotosnap
UI_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=change-me

# Optional: store uploads in S3 instead of on disk
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=
```

Create `apps/web/.env`:

```env
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
BACKEND_PROTOCOL=http
BACKEND_HOST=localhost

# Optional: CloudFront URL that serves uploaded images
NEXT_PUBLIC_IMAGES_URL=
```

Apply the database migrations:

```bash
pnpm --filter backend exec drizzle-kit migrate
```

### Run

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

### Other scripts

```bash
pnpm build         # build all apps and packages
pnpm lint          # lint everything
pnpm check-types   # type-check everything
pnpm format        # format with Prettier
```

## Deployment

- **Web:** Vercel, with `apps/web` as the root directory.
- **API:** CodePipeline builds `apps/backend` with CodeBuild (`apps/backend/buildspec.yml`) and deploys it to Elastic Beanstalk. The instance role grants S3 access, so no AWS keys are stored on the server.
- **Images:** a private S3 bucket behind CloudFront with Origin Access Control. The bucket needs a CORS rule that allows `PUT` from the web app's origin.
