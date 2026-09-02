# Pennies

Pennies is a personal finance application built to make day-to-day spending easier to understand and manage.

Instead of starting with charts and long-term reporting, Pennies focuses on a more immediate question: **what do I need to pay today, and what does the rest of the month look like?**

Users can import transaction data from their bank, organize transactions into categories and recurring groups, track autopay items, and switch between daily and monthly views.

## Project Status

Pennies is a personal project that I actively used, but it is not currently maintained as a production application. The code is being preserved here primarily as a portfolio project.

The application depends on its original Supabase database structure and configuration, so cloning the repository and supplying new Supabase credentials is unlikely to produce a fully working application without additional setup.

## Features

- User authentication
- Multiple financial accounts
- CSV transaction import
- Transaction categorization
- Recurring transaction groups
- Autopay tracking
- Daily transaction view
- Monthly transaction view and totals
- Group-level editing for recurring transactions

## Tech

Pennies is built with:

- Next.js 14 / App Router
- React
- TypeScript
- Supabase
- Tailwind CSS
- DaisyUI
- React Hook Form
- Zod
- Papa Parse
- Day.js

The application uses Next.js server and client components, application API routes, Supabase for authentication and persistence, and client-side state/context where interaction requires it.

## How It Works

The basic flow is intentionally simple:

1. Create an account and sign in.
2. Add a financial account.
3. Create transaction categories.
4. Upload a CSV exported from your bank.
5. Review and organize imported transactions.
6. Use the home screen to see what is due today or review the month as a whole.

Recurring transactions can be grouped so shared information can be maintained together instead of editing individual transactions repeatedly.

## Local Setup

**Note**: This is the proper setup process, but it will likely not result in a fully working application because of the project's current status.

Install dependencies:

```bash
yarn install
```

Create a `.env.local` file with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
yarn dev
```

Then open `http://localhost:3000`.

## Project Structure

The project follows the Next.js App Router structure under `src/app`.

Application routes handle accounts, categories, authentication, CSV importing, and transaction views. Shared UI components and contexts live alongside those routes, while reusable application, API, and Supabase utilities are organized under `src/utils`.

## Why I Built It

Pennies started from a practical problem: most finance tools are good at telling you where your money went, but I wanted something more useful for deciding what I needed to do with it **today**.

The project became an opportunity to build that workflow end to end, including authentication, data modeling, CSV ingestion, transaction normalization, recurring-payment handling, and the UI used to manage it.