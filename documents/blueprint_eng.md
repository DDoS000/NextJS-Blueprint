# 📋 Project Blueprint: Modern Type-Safe Stack (Next.js + Elysia)
This document outlines strict rules and guidelines for the AI Agent in developing this project.

## 0. Project Overview and High-Level Architecture
### Purpose and Scope
- **Project Goal**: Build a modern, type-safe full-stack application using Next.js for the frontend and ElysiaJS for the backend, emphasizing scalability, security, and maintainability.
- **Assumptions**: Development in a monorepo; future expansions for OAuth; production-ready with custom auth.
- **Constraints**: Strict TypeScript; no use of Supabase Auth SDK for login logic.
- **Risks**: Custom authentication vulnerabilities; Bun's production maturity; dependency conflicts in monorepo.

### System Diagrams (Using C4 Model)
- **System Context Diagram**: Illustrates interactions with users, Supabase database, and external OAuth providers.
- **Container Diagram**: Shows `apps/web` (Next.js) and `apps/server` (Elysia) as core containers.
- **Component Diagram**: Details controllers, services, repositories, and UI components.

| Diagram Type | Tool Recommendation | Description |
|--------------|---------------------|-------------|
| System Context | Draw.io | External interactions |
| Container | PlantUML | Internal modules |
| Component | UML | Service breakdowns |

## 1. Tech Stack & Infrastructure
### Core Structure
- **Repository**: Monorepo (separate `apps/web` and `apps/server`)
- **Language**: TypeScript (Strict Mode)
- **Runtime**: Bun (Backend), Node.js (Frontend Environment)
- **Monorepo Management**: Turborepo or Bun workspaces for dependency hoisting, caching, and path aliases.

### Frontend (`apps/web`)
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui (Base Components), Lucide React (Icons)
- **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`
- **State Management**: TanStack Query v5 (Server State), React Hooks (Local State)
- **Form & Validation**: React Hook Form + Zod

### Backend (`apps/server`)
- **Framework**: ElysiaJS
- **Communication**: Elysia Eden Treaty (automatic Type sharing between Backend/Frontend)
- **Validation**: TypeBox (Native Elysia)

### Database & Storage
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma

### Authentication
- **Primary**: Custom Email/Password (using `Bun.password` Argon2 hashing)
- **Architecture**: Design `Account` table to support OAuth (e.g., Discord) in the future
- **Session**: JWT (issued by Elysia) stored in HTTP-Only Cookie

### Testing
- **E2E**: Playwright

## 2. Development Rules
### A. General & Type Safety
1. **Strict Typing**: Prohibit `any` absolutely; always use clear Interfaces or Types.
2. **End-to-End Types**: Use **Eden Treaty** to pull Types from Backend to Frontend directly; no duplicate API Types.

### B. Frontend Architecture (Next.js + shadcn)
1. **Component Usage**:
   - Primarily use Components from **shadcn/ui** (e.g., Button, Input, Card); do not create new ones if existing ones suffice.
   - Use `lucide-react` for all icons.
2. **Styling**: Always use Tailwind CSS through `cn()` function for Class management.
3. **Client/Server**: Default to Server Components; use `'use client'` only for interactivity or Hooks.
4. **Data Fetching**: Prohibit raw `fetch`; always use **TanStack Query** paired with **Eden Client**.

### C. Backend Architecture (ElysiaJS)
1. **Pattern**: Use `Controller` -> `Service` -> `Repository (Prisma)`
2. **Validation**: Every Endpoint must have data validation with **TypeBox** (`t`).

### D. Authentication (Custom Hybrid)
1. **No Supabase Auth SDK**: Prohibit using Supabase Auth (GoTrue) for Login Logic; use Supabase only as Database.
2. **Security**: Passwords must be hashed with `Bun.password` before saving.
3. **Future Proof**: User table must make Password Nullable to support OAuth Providers in the future.

## 3. Workflow for AI
When receiving a command to create a new feature, follow this sequence:
1. **Database**: Design/modify `schema.prisma` and run Migration.
2. **Backend**: Create Service and Controller in Elysia with TypeBox Validation.
3. **Integration**: Verify Eden Treaty exports Types correctly.
4. **Frontend Logic**: Create Custom Hook (TanStack Query) that calls the API.
5. **Frontend UI**: Build the web page by composing from **shadcn/ui components**.
6. **Testing**: Write Playwright Test covering the workflow.

## 4. Required Skills
- TypeScript, SQL, REST API Design
- Next.js App Router Patterns
- ElysiaJS & Bun Ecosystem
- Prisma ORM Modeling
- Tailwind CSS & shadcn/ui customization
- Zod & TypeBox Validation schemas