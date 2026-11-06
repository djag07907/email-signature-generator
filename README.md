# Email Signature Generator ✉️✨

A modern, responsive, and feature-rich web application built with **Next.js 15**, **React 19**, and **Tailwind CSS 4** to design, customize, and export professional email signatures compatible with Gmail, Outlook, Apple Mail, and other major email clients.

---

## 🚀 Features

- **24 Handcrafted, Top-Tier Templates**:
  - **10 Free Templates**: Minimalist White, Classic Left-Image, Stacked Centered, Accent Bar, Compact Line, Soft Card, Two Column, Underline Accent, Monogram Tile, and Serif Classic.
  - **8 Premium Templates**: Modern, Creative, Professional, Executive Dark, Gradient Edge, Pill Header, Midnight Split, and Duo Tone.
  - **6 Corporate Templates**: Corporate Clean, Corporate Branded, Corporate Split, Corporate Executive, Corporate Stacked, and Corporate Card (with company branding and logo integration).
- **Dynamic Context-Aware Style Engine**:
  - Adapts style controls based on the selected template (only displays controls for elements that exist on that template).
  - Customize Typography (Poppins, Inter, Roboto, Open Sans, Source Sans 3, Lato, Montserrat, Merriweather, Georgia, Arial).
  - Custom Color Palette (accent, name, contact text, secondary/muted role text).
  - Background & Border controls (with automatic text contrast switching on dark cards).
  - Configurable dividers (color & pixel thickness).
  - Profile photo styles (circle or rounded square).
- **Client-Safe HTML Generation**:
  - Emits robust, table-based HTML with inline styling so signatures render consistently across Gmail, Outlook, Apple Mail, and mobile clients without breaking.
- **One-Click Export**:
  - Copy directly to clipboard with visual confirmation.
  - Download as a standalone `.html` file.
- **Real-Time Live Preview**:
  - Instant visual feedback as you type and style.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Node.js Version Requirements

This project is configured for **Node.js 26.x** (compatible with Node 22+):

- `.nvmrc` & `.node-version`: `26.13.0`
- `package.json`: `"engines": { "node": "26.x" }`

### Setting up Node with NVM:

```bash
# Install the exact Node version
nvm install 26.13.0

# Activate it in the current terminal
nvm use

# (Optional) Make Node 26 your global default
nvm alias default 26.13.0
```

---

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/djag07907/email-signature-generator.git
cd email-signature-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 📜 Available Commands

| Command         | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `npm run dev`   | Runs the Next.js development server with Turbopack at `localhost:3000` |
| `npm run build` | Compiles an optimized production build                                 |
| `npm run start` | Starts the production server after building                            |
| `npm run lint`  | Runs ESLint to check for code quality and formatting issues            |

---

## ☁️ Deployment (Vercel)

This application is ready for seamless zero-config deployment on **[Vercel](https://vercel.com/)**:

1. Push your repository to GitHub.
2. Import the repository into your Vercel Dashboard.
3. In **Project Settings** → **General** → **Node.js Version**, ensure **26.x** is selected (to match the `"engines"` configuration in `package.json`).
4. Click **Deploy**.
