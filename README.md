# 📄 Dector Sheet AI

**Transforming Natural Language into Google Sheets Mastery.**

Dector Sheet is a premium web application designed to turn complex spreadsheet requirements into highly optimized Google Sheets formulas instantly. Powered by **Groq (Llama 3.3 70B)** and styled with a state-of-the-art **Glassmorphic UI**, it's the ultimate tool for data analysts and spreadsheet power users.

![Project Preview](https://via.placeholder.com/800x450/0f172a/10b981?text=Dector+Sheet+AI+Interface)

## 🚀 Features

- **AI Formula Architect:** Uses Llama 3.3 70B to generate complex formulas (VLOOKUP, QUERY, ARRAYFORMULA, etc.) from simple English.
- **Context Awareness:** Define your column mappings (A=Date, B=Revenue) to give the AI a high-precision blueprint of your data.
- **Premium UI:** A stunning interface featuring glassmorphism, animated mesh backgrounds, and smooth `framer-motion` transitions.
- **Global History:** Instantly save and sync your generated formulas via **Supabase**.
- **One-Click Magic:** Copy formulas directly to your clipboard with built-in validation feedback.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (v4), Framer Motion
- **AI Engine:** Groq SDK (Llama 3.3 70B Versatile)
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React

## 📦 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nexabir/doctorsheet.git
   cd doctorsheet
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. **Initialize Database:**
   Run the provided `supabase_setup.sql` in your Supabase SQL Editor.

5. **Run Locally:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)

1. Push your code to GitHub.
2. Link your repository to Vercel.
3. Add the environment variables from your `.env` file into the Vercel Dashboard under **Settings > Environment Variables**.
4. Deploy!

## 📜 License

MIT License. Developed with ❤️ by [nexabir](https://github.com/nexabir).
