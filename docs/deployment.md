# Deployment Guide

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the simplest deployment path for Next.js applications with automatic builds, preview deployments, and edge functions.

#### Setup

1. Connect your GitHub repository to Vercel.
2. Configure environment variables in the Vercel dashboard (see Environment Variables section below).
3. Set the build command to `pnpm build` (auto-detected).
4. Set the install command to `pnpm install` (auto-detected).
5. Deploy.

#### Production Database

Use a managed PostgreSQL service that works well with serverless:
- **Neon** -- serverless PostgreSQL with connection pooling built in.
- **Supabase** -- managed PostgreSQL with pooling via Supavisor.
- **Vercel Postgres** -- integrated with Vercel, powered by Neon.

Set the `DATABASE_URL` environment variable to the connection string provided by your database service. For serverless deployments, use a pooled connection string.

#### Migrations in Production

Run migrations as part of the deployment pipeline:

```bash
# In Vercel, add this as a build command or use a custom script
npx prisma migrate deploy
```

Alternatively, run migrations manually before deploying new code:

```bash
DATABASE_URL="production-connection-string" npx prisma migrate deploy
```

### Option 2: Docker

The project includes a multi-stage Dockerfile for container-based deployments.

#### Build the Image

```bash
docker build -t prompt-platform .
```

#### Run the Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-production-secret" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e AD_PROVIDER="google" \
  -e AI_PROVIDER="openai" \
  prompt-platform
```

#### Docker Compose (Full Stack)

For self-hosted environments with a co-located database:

```yaml
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://prompt_user:prompt_pass@postgres:5432/prompt_platform
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: https://your-domain.com
      AD_PROVIDER: google
      AI_PROVIDER: openai
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: prompt_platform
      POSTGRES_USER: prompt_user
      POSTGRES_PASSWORD: prompt_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U prompt_user -d prompt_platform']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

#### Container Platforms

The Docker image works with:
- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Apps
- DigitalOcean App Platform
- Fly.io
- Railway

## Environment Variables

### Required

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/prompt_platform` |
| `NEXTAUTH_SECRET` | Secret for session encryption. Generate with `openssl rand -base64 32` | `K7x9...` |
| `NEXTAUTH_URL` | Full URL of the application | `https://prompts.example.com` |

### Optional (with defaults)

| Variable | Description | Default |
|---|---|---|
| `AD_PROVIDER` | Ad provider adapter to use | `mock` |
| `AI_PROVIDER` | AI provider adapter to use | `mock` |
| `STORAGE_PROVIDER` | Storage provider adapter to use | `local` |
| `NODE_ENV` | Environment mode | `production` (in Docker) |

### Provider-Specific (Required When Using Real Providers)

| Variable | When needed | Description |
|---|---|---|
| `GOOGLE_AD_CLIENT_ID` | `AD_PROVIDER=google` | Google AdSense client ID |
| `GOOGLE_AD_SLOT` | `AD_PROVIDER=google` | Google AdSense ad slot |
| `OPENAI_API_KEY` | `AI_PROVIDER=openai` | OpenAI API key |
| `ANTHROPIC_API_KEY` | `AI_PROVIDER=anthropic` | Anthropic API key |
| `AWS_ACCESS_KEY_ID` | `STORAGE_PROVIDER=s3` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | `STORAGE_PROVIDER=s3` | AWS secret key |
| `AWS_S3_BUCKET` | `STORAGE_PROVIDER=s3` | S3 bucket name |

## Database Migrations in Production

### Before Deploying New Code

Always run migrations before (or as part of) deploying code that depends on schema changes.

```bash
# Run pending migrations
DATABASE_URL="production-url" npx prisma migrate deploy
```

### Rollback

Prisma does not have built-in rollback. If a migration causes issues:

1. Fix forward with a new migration (preferred).
2. Restore from a database backup (last resort).

Always take a backup before running migrations in production.

### CI/CD Pipeline Example

```yaml
# GitHub Actions example
deploy:
  steps:
    - name: Run migrations
      run: npx prisma migrate deploy
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}

    - name: Deploy to Vercel
      run: vercel deploy --prod
```

## Health Checks

### HTTP Health Check

The application responds to GET requests at the root (`/`). For a dedicated health endpoint, create `src/app/api/health/route.ts`:

```typescript
export async function GET() {
  try {
    // Test database connectivity
    await db.$queryRaw`SELECT 1`
    return Response.json({ status: 'healthy', timestamp: new Date().toISOString() })
  } catch {
    return Response.json({ status: 'unhealthy' }, { status: 503 })
  }
}
```

### Docker Health Check

Add to Dockerfile or docker-compose:

```yaml
healthcheck:
  test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:3000/api/health']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

## Monitoring Considerations

### Logging

- Next.js logs to stdout/stderr by default.
- In production, pipe logs to a log aggregation service (Datadog, Logtail, Axiom).
- Application errors should be logged with context (request ID, user ID, action).

### Error Tracking

- Integrate Sentry or a similar service for error tracking.
- Configure source maps for readable stack traces.
- Set up alerting for elevated error rates.

### Performance Monitoring

- Vercel provides built-in analytics and Web Vitals tracking.
- For Docker deployments, use an APM tool (Datadog, New Relic).
- Monitor: response times, database query durations, error rates.

### Database Monitoring

- Monitor connection pool utilization.
- Track slow queries (set `log_min_duration_statement` in PostgreSQL).
- Monitor disk usage and table sizes.
- Set up alerts for high connection counts or long-running transactions.

### Key Metrics to Track

| Metric | Alert Threshold |
|---|---|
| HTTP 5xx rate | > 1% of requests |
| Response time (p95) | > 2 seconds |
| Database connection pool usage | > 80% |
| Disk usage | > 80% |
| Deployment failures | Any failure |
| Migration failures | Any failure |

## SSL/TLS

- **Vercel:** Automatic HTTPS with managed certificates.
- **Docker:** Use a reverse proxy (Nginx, Caddy, Traefik) for TLS termination, or deploy behind a load balancer that handles TLS.
- **Database:** Always use SSL for production database connections. Add `?sslmode=require` to the `DATABASE_URL`.

## Scaling Considerations

### Vercel

- Serverless functions scale automatically.
- Edge functions for middleware and rate limiting.
- Consider Prisma Accelerate for connection pooling in serverless.

### Docker

- Scale horizontally behind a load balancer.
- Use session affinity (sticky sessions) if not using a shared session store.
- Consider Redis for shared rate limiting state across instances.
- Database connection pooling via PgBouncer or Prisma Accelerate.
