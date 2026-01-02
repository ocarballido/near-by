# 🌍 BNBexplorer – Personalized Guide for Tourist Accommodations

**BNBexplorer** is a web platform that allows property owners (Airbnb, rural homes, etc.) to create a personalized public page for each property, offering useful information to guests such as house rules, accommodation manuals, schedules, nearby points of interest, and more.

> This project is under development – created for learning purposes with potential for future monetization.

---

## ✨ Features

-   🔐 User authentication via [Supabase](https://supabase.com/)
-   🏠 Manage multiple properties per user
-   📍 Google Maps integration for address validation and location
-   📁 Customizable categories and subcategories of content
-   🌍 Multilingual support (English 🇬🇧 / Spanish 🇪🇸) using [`next-intl`](https://next-intl.js.org/)
-   🧾 Legal section: privacy policy, terms of use, content disclaimer
-   🎨 Modern UI with TailwindCSS and accessible components

---

## 📦 Tech Stack

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Database & Auth:** [Supabase](https://supabase.com/)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Internationalization:** [`next-intl`](https://next-intl.js.org/)
-   **Maps & Location:** [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)
-   **Cookie Management:** `cookies-next`
-   **Forms:** `react-hook-form`
-   **UI/UX:** `@radix-ui/react-*`, `lucide-react`

---

## Getting Started

First, run the development server:

```bash
npm run dev                 # Start development server
npm run build               # Build for production
npm run start               # Start the built app
npm run lint                # Run linter
npm run supabase start      # Start Supabase local
npm run supabase stop       # Stop Supabase local
npm run supabase status     # Run Supabase Status
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🧪 Local Development (Supabase + Docker)

This project uses **Supabase** for database and authentication.

For a **fully local development setup** using Supabase with Docker — including:

-   cloning the production database **schema**
-   importing **catalog data only** (`categories`, `sub_categories`)
-   resetting the local database safely
-   working with Auth and Mailpit locally

👉 See **[README-local.md](./README-local.md)** for the complete step-by-step guide.

## 🛡️ Legal Status

This project includes:

-   ✅ Privacy policy: explains processing of personal data required for access
-   ✅ Terms of use: clarifies that this is a non-commercial project (subject to change)
-   ✅ Cookie consent banner
-   ✅ Disclaimer under image uploads: users are responsible for the content they upload

> ⚠️ This app is not yet monetized but is legally prepared for a future commercial model.

---

## 📸 Roadmap

-   [ ] Integrate payment system (Stripe or Paddle)
-   [ ] Owner dashboard with metrics
-   [ ] Shareable QR code or public URL
-   [ ] Team access or collaborative editing
-   [ ] Commercial plan setup

## Special thanks to:

[https://github.com/Razikus/supabase-nextjs-template](https://github.com/Razikus/supabase-nextjs-template)

## Project:

[https://www.bnbexplorer.com/es](https://www.bnbexplorer.com/es)

## 🙌 Author

Developed by Oscar Carballido Perdomo as a personal learning project.
