# SRM SkillX - Official Source Code

This is the official source code for the SRM SkillX platform, a skill swap and peer-learning application for SRM University AP students.

## Features

- **Full Stack Integration:** React Frontend connected to Supabase Backend.
- **Real-Time Authentication:** Secure login/signup with verified `@srmap.edu.in` email support.
- **Live Updates:** Optimized for Hot Module Replacement (HMR) for instant code updates.
- **Modern UI:** Tailwind CSS v4 with Glassmorphism and Motion animations.
- **Database:** Supabase (PostgreSQL) for user data and content.

## Development Setup

To run this project locally in Visual Studio Code:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```

3.  **Access Application:**
    Open `http://localhost:5173` in your browser.

## Project Structure

- **`/src`**: Core application source code.
    - **`App.tsx`**: Main application component and routing.
    - **`main.tsx`**: Application entry point.
    - **`/components`**: Reusable UI components (Layout, etc.).
    - **`/pages`**: Full page components (Landing, Auth, Community, etc.).
    - **`/lib`**: Supabase client and API functions.
- **`/utils`**: Utility functions and configuration.
- **`/styles`**: Global CSS and Tailwind configuration.

## Supabase Connection

This project is pre-configured to connect to the SRM SkillX Supabase instance.
Configuration is located in: `utils/supabase/info.tsx`

The `src/lib/supabase.ts` file initializes the connection automatically.

## Deployment

To build for production:
```bash
npm run build
```
The output will be in the `dist` directory, ready for deployment to Vercel, Netlify, or any static host.
