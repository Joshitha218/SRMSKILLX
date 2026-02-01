# SRM SkillX - Official Source Code

This is the official source code for the SRM SkillX platform, a skill swap and peer-learning application for SRM University AP students.

## Features

- **Full Stack Integration:** React Frontend connected to Supabase Backend.
- **Real-Time Authentication:** Secure login/signup with verified `@srmap.edu.in` email support.
- **Skill Persistence:** Skills are saved to the database.
- **Peer Search:** Find other students by skill or name.
- **Real-Time Chat:** Message other students to arrange skill swaps.
- **Live Updates:** Optimized for Hot Module Replacement (HMR).
- **Modern UI:** Tailwind CSS v4 with Glassmorphism and Motion animations.

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

## Database Setup (Crucial!)

**You must run the provided SQL script to fix the "Table not found" errors.**

1.  Go to your Supabase Dashboard.
2.  Open the **SQL Editor**.
3.  Open the file `supabase_schema.sql` included in this project.
4.  Copy the contents and paste them into the Supabase SQL Editor.
5.  Click **Run**.

This will create the necessary `users`, `skills`, `goals`, `badges`, and `messages` tables.

## Supabase Connection

This project is pre-configured to connect to the SRM SkillX Supabase instance.
Configuration is located in: `utils/supabase/info.tsx`

## Deployment

To build for production:
```bash
npm run build
```
The output will be in the `dist` directory.
