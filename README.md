# Homework-part-6

Student Management App built with Next.js, React, and MySQL.

This assignment uses third-party learning resources and elements from previous
coursework. AI tools were used to explain code and assist with troubleshooting
and bug fixes.

## Requirements

- Node.js
- MySQL 8+
- An OpenWeather API key for city weather

## Setup

1. Create the database and student table by running
   [`database/schema.sql`](./database/schema.sql). The script uses the
   `oosd_webappdev` database and can be rerun without dropping existing data.
2. Create a `.env.local` file in the project root. Configure:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=oosd_webappdev
   DB_PORT=3306
   OPENWEATHER_API_KEY=your_openweathermap_api_key
   ```

   Keep `.env.local` private; it contains credentials and is excluded by
   `.gitignore`.
3. Install dependencies and start the development server:

   ```powershell
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The registration form saves student records through a Next.js Server Action
into the MySQL `students` table. City weather is requested through the app's
server-side `/api/weather` route.
