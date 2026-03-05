# TaxCopilot Frontend

Next.js frontend for TaxCopilot AI — an AI-powered tax compliance assistant for Indian businesses and Chartered Accountants.

## Overview

TaxCopilot helps CAs respond to tax notices efficiently by analyzing government tax notices, providing legal research, and generating compliant response drafts. This frontend provides the document upload flow, workspace management, drafting studio, and law library interface.

See [requirements.md](../requirements.md) and [design.md](../design.md) for full product specs.

## Prerequisites

- Node.js 20+
- Running backend and gateway services (or use Docker Compose)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and set NEXT_PUBLIC_API_URL (default: http://localhost:8000)
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command   | Description                    |
| --------- | ------------------------------ |
| `npm run dev`  | Start dev server (port 3000)   |
| `npm run build`| Production build               |
| `npm run start`| Start production server        |
| `npm run lint` | Run ESLint                     |

## Environment Variables

| Variable               | Description                    | Default              |
| ---------------------- | ------------------------------ | -------------------- |
| `NEXT_PUBLIC_API_URL`  | API gateway base URL           | `http://localhost:8000` |

## Docker

The frontend can run via Docker Compose from the project root:

```bash
docker-compose up --build
```

Frontend is served at http://localhost:3000.
