# Task Manager Frontend

A modern, responsive task management application built with Next.js, React, and Tailwind CSS. This frontend provides a beautiful UI for managing tasks, analytics, and user authentication, with full support for dark mode and mobile devices.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS and Heroicons
- **Dark Mode**: Toggleable dark/light theme across all pages
- **Authentication**: Secure login and registration with JWT
- **Task Management**: Create, view, edit, delete, and filter tasks
- **Analytics Dashboard**: Visualize task stats with charts (Chart.js)
- **Search, Filter, Sort**: Powerful search, filtering, and sorting for tasks
- **Pagination**: Efficiently browse large task lists
- **Reusable Components**: Modal forms, task items, and more
- **Accessibility**: Keyboard navigation and accessible forms
- **Mobile Friendly**: Fully responsive for all device sizes

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local` and update values as needed (API base URL, etc).

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

- `app/` - Next.js app directory (pages, layouts, routing)
- `components/` - Reusable React components (TaskModal, TaskItem, etc)
- `context/` - React context providers (Auth, Theme)
- `lib/` - API utilities and helpers
- `public/` - Static assets
- `styles/` - Global styles (Tailwind config)

## Customization
- Update branding, colors, and logo in `components` and `public` as needed.
- Adjust Tailwind config for custom themes.


