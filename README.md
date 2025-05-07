# Evalia - Evaluate Job Candidates with AI

## Prerequisites

1. **Environment Variables**
 Create a `.env.local` file in the root of the project by copying `.env.template`:

 ```bash
 cp .env.template .env.local

Then, fill in the required values. The following environment variables are required:

### GCP
* `GOOGLE_CLOUD_SERVICE_ACCOUNT_B64_CREDENTIALS`: Base64-encoded credentials for Google Cloud.
* `GOOGLE_CLOUD_RUN_SCORE_CANDIDATES_BACKEND_URL`: The URL to the deployed scoring backend.

### Redis
* `REDIS_URL`: Redis connection string.
* `REDIS_CACHE_TTL_SECONDS`: Time-to-live (TTL) for cached responses (in seconds).

2. **Install Dependencies**
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app should be available at `http://localhost:3000`.

## Testing

### Unit Tests (Jest)

```bash
npm run test:jest
```

### End-to-End Tests (Cypress)

1. Start the dev server:
```bash
npm run dev
```

2. In a new terminal, run:
```bash
npm run test:cypress
```

## Clean
Remove dependencies

```bash
npm run clean
```
