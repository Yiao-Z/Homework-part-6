This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Student management setup

Configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_PORT` in
`.env.local`. For the supplied `student_db.sql`, set
`DB_NAME=student_management_app`, matching its `CREATE DATABASE` and `USE`
statements. The app expects the `students` table columns in that SQL:
first/last name, email, phone, mailing address, program, `year` (for example
`Y2`), and creation time.

To enable the dashboard's city weather search, add your OpenWeather API key to
the same `.env.local` file:

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
```

Restart the development server after changing `.env.local`. Keep this key
server-side; the app calls OpenWeather through its `/api/weather` route.

The app also detects the earlier student table with `student_number`, `name`,
`email`, `program`, and `year_level`. With that table, the add form asks for a
student number and full name and omits address fields. Existing records remain
untouched; the app does not rename or migrate database columns.

The matching table definition is also in `database/schema.sql`. The app does
not execute SQL files automatically; run your setup script yourself against
MySQL before starting the app. **Review the script first:** the provided
script contains `DROP DATABASE IF EXISTS student_management_app`, which
permanently deletes and recreates that database, including any existing data.

After you have set up the database, install dependencies and start the app:

```powershell
npm install
npm run dev
```
