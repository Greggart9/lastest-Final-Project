# EduCollab Monorepo (Next.js + Express + PNPM)

A modernized university course, lecture materials, and academic collaboration platform.

## Architecture

This project is organized as a **PNPM Workspace** monorepo:

```
lastest-Final-Project/
├── client/                     # Next.js 15 (App Router, React 19, Tailwind CSS v4)
│   ├── public/Images/          # University logos, illustrations, and assets
│   ├── src/
│   │   ├── app/                # App Router pages (/, /collegeboard, /settings, /signin, etc.)
│   │   └── components/         # Shared UI components (DashboardSidebar, Modals, etc.)
│   └── package.json
├── server/                     # Node.js + Express REST API
│   ├── src/
│   │   └── server.js           # API endpoints (Auth, Colleges, Courses, Users)
│   └── package.json
├── pnpm-workspace.yaml         # PNPM workspace definition
└── package.json                # Root package with monorepo scripts
```

## Prerequisites

- **Node.js**: v22 LTS (installed at `~/.local/node-v22.14.0-darwin-arm64/bin/node`)
- **PNPM**: v12+ (installed globally)

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Both Client & Server in Development
```bash
pnpm dev
```
- **Client (Frontend)**: Runs at [http://localhost:3000](http://localhost:3000)
- **Server (Backend API)**: Runs at [http://localhost:5001](http://localhost:5001)

### 3. Run Individually
* **Frontend only**:
  ```bash
  pnpm dev:client
  ```
* **Backend API only**:
  ```bash
  pnpm dev:server
  ```

### 4. Build for Production
```bash
pnpm build
```
