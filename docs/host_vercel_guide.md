# 🚀 AURUMCHAIN: The Ultimate Localhost & Vercel Hosting Guide

This master guide provides a step-by-step walkthrough for configuring, running, and hosting the **AURUMCHAIN** platform. It covers everything from launching a robust local development environment (`localhost`) to deploying a production-ready, zero-trust live site on **Vercel**.

---

## 📊 Quick Comparison: Localhost vs. Vercel

Before diving in, let's look at how the application behaves in both environments:

| Feature | 💻 Localhost Environment | ⚡ Vercel Production Environment |
| :--- | :--- | :--- |
| **URL Address** | `http://localhost:3000` | `https://aurumchain.vercel.app` (or custom domain) |
| **Solana RPC** | Solana Devnet (`https://api.devnet.solana.com`) | Solana Devnet or Mainnet-Beta RPC |
| **Supabase Project** | Development Instance / Direct DB connection | Deployed Supabase Instance |
| **Auth Redirects** | Direct to `http://localhost:3000/auth/callback` | Configured to Vercel production URL |
| **Performance** | Hot module reloading (HMR) for development | Fully optimized static assets & Edge functions |
| **API Endpoints** | Local port binding (e.g., `http://localhost:4000`) | Deployed server or Serverless Next.js API Routes |

---

## 💻 Part 1: Localhost Development Setup

To run AURUMCHAIN locally and ensure a high-fidelity experience, follow these steps:

### Step 1.1: Clone & Install Dependencies
1. Open your terminal (PowerShell, Git Bash, or Terminal).
2. Navigate to your project directory:
   ```bash
   cd c:\Rupom\Projects\AURUMCHAIN
   ```
3. Install all required npm packages:
   ```bash
   npm install
   ```

### Step 1.2: Configure Local Environment Variables
1. Create a file named `.env.local` in the root of the project (this will store your local secrets and config).
2. Copy the configuration template from `.env.example` into your new `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and set the following essential variables:
   ```env
   # Frontend Local Server URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Local / Development API URL
   NEXT_PUBLIC_API_URL=http://localhost:4000

   # Supabase Configuration (Use your project credentials)
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # Solana Blockchain Configuration (Devnet)
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_BLOCKCHAIN_NETWORK=solana-devnet
   NEXT_PUBLIC_SOLANA_CLUSTER=devnet
   ```

### Step 1.3: Run the Development Server
1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   👉 **`http://localhost:3000`**

### Step 1.4: Run watchers & Indexers (Required for On-Chain Synchronization)
The platform relies on on-chain Solana indexers to synchronize Supabase with wallet actions in real-time. Keep a separate terminal window open running:
```bash
npx ts-node scripts/indexer_watcher.ts
```

---

## ⚡ Part 2: Hosting Live on Vercel

Vercel is the ultimate hosting platform for Next.js apps, providing global edge delivery, automatic builds, and SSL out of the box.

### Step 2.1: Prepare your Git Repository
Vercel deploys directly from your Git repository. Ensure your code is committed and pushed to your Remote Git Provider (GitHub, GitLab, or Bitbucket):
```bash
git add .
git commit -m "chore: prepare configuration for Vercel deployment"
git push origin main
```
> [!IMPORTANT]
> Ensure `.env` and `.env.local` are listed in your `.gitignore` so your private keys and keys are never pushed to a public repository!

### Step 2.2: Deploy via Vercel Dashboard (Recommended)

1. **Log in to Vercel**
   - Go to [vercel.com](https://vercel.com) and log in using your GitHub account.

2. **Create a New Project**
   - Click the **"Add New..."** button in the top right, then select **"Project"**.
   - Under **"Import Git Repository"**, authorize Vercel to access your GitHub repositories if you haven't already.
   - Find your `AURUMCHAIN` repository and click **"Import"**.

3. **Configure Project Settings**
   - **Project Name**: `aurumchain` (Vercel will give you a default `aurumchain.vercel.app` URL).
   - **Framework Preset**: **Next.js** (This is auto-detected).
   - **Root Directory**: `./` (Default).
   - **Build & Development Settings**: Keep defaults (Vercel reads `vercel.json` and runs `npm run build` using the output directory `.next`).

4. **Input Environment Variables**
   - Expand the **"Environment Variables"** dropdown.
   - Copy-paste each variable from your `.env.local` to the Vercel fields. Refer to **Part 3** below to see exactly how variables map between local and production.
   - Click **"Add"** for each variable.

5. **Deploy!**
   - Click the **"Deploy"** button.
   - Vercel will now provision containers, install dependencies, run type checking, build static pages, compile API routes, and deploy the application. This takes approximately 2-3 minutes.
   - Once completed, you will see a **"Congratulations!"** screen with a live preview screenshot and a **live link**! 🎉

---

## 🔑 Part 3: Environment Variables Matrix (Local vs. Vercel)

Ensure your variables are properly segmented. Use this reference matrix to configure your systems:

| Variable Name | 💻 Localhost Value | ⚡ Vercel Value | Importance / Details |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-app.vercel.app` | Dictates base URLs for redirection and callbacks. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | `https://your-app.vercel.app` | Set to your backend URL or Vercel URL if using internal Next.js API routes. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | `https://xyz.supabase.co` | Same URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | `eyJhbGc...` | Same client-safe key. |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | `eyJhbGc...` | **DO NOT EXPOSE IN FRONTEND.** Set in Vercel settings (safe, encrypted at rest). |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | `https://api.devnet.solana.com` | `https://api.devnet.solana.com` | Solana network access (use a private RPC like Alchemy/Helius in production for higher limits). |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your Project ID | Same Project ID | Enables wallet pairings (Phantom, Solflare, etc.). |
| `SUMSUB_APP_TOKEN` | `sbx:Cbc7tUD...` | `sbx:Cbc7tUD...` | Sumsub App Token (use `sbx:` prefixes for sandbox/development). |
| `SUMSUB_SECRET_KEY` | `ZmyyL9G...` | `ZmyyL9G...` | Private Key for generating Sumsub signatures. |
| `NEXT_PUBLIC_SUMSUB_LEVEL_NAME` | `basic-kyc-level` | `basic-kyc-level` | Matches the KYC level created in the Sumsub dashboard. |

> [!TIP]
> Next.js automatically bundles variables prefixed with `NEXT_PUBLIC_` into the JavaScript bundle sent to the user's browser. Server-only variables (like `SUPABASE_SERVICE_ROLE_KEY` and `SUMSUB_SECRET_KEY`) **must NOT** have this prefix to remain completely secure and hidden on Vercel's backend execution layer.

---

## 🔄 Part 4: Third-Party Integrations Setup

To make your Vercel deployment fully functional, three external services must be updated with your new Vercel Live Link:

### 4.1: Supabase Authentication Configuration
Because Supabase handles user logins and email confirmations, you must authorize your live Vercel domains, otherwise users won't be able to log in from the production link.

1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project, and navigate to **Authentication** ➔ **URL Configuration** in the left menu.
3. **Site URL**:
   - Change this to your Vercel production URL (e.g., `https://aurumchain.vercel.app`).
4. **Redirect URLs**:
   - Keep `http://localhost:3000/**` (so your local environment still works perfectly!).
   - Add a new Redirect URL: `https://your-app.vercel.app/**` (replace with your Vercel domain).
   - Add another Redirect URL for wildcards: `https://your-app-*.vercel.app/**` (this supports preview branch deployments).
5. Click **Save**.

### 4.2: WalletConnect Cloud Configuration
If you use WalletConnect for multi-wallet support:
1. Go to **[WalletConnect Cloud](https://cloud.walletconnect.com)**.
2. Select your project.
3. Navigate to **Explorer Settings** or **Domain Verification**.
4. Add both your Localhost domain (`localhost:3000`) and your Vercel production domain (`aurumchain.vercel.app`) to the allowed origins.

### 4.3: Sumsub KYC Webhook Setup (Optional)
If you have automated KYC verification webhooks:
1. Go to the **[Sumsub Dashboard](https://cockpit.sumsub.com)**.
2. Navigate to **Developer Space** ➔ **Webhooks**.
3. Point your webhook URL to your Vercel API endpoint:
   👉 `https://your-app.vercel.app/api/kyc/webhook`
4. For local testing, use a proxy tool like **ngrok** to forward requests to `http://localhost:3000/api/kyc/webhook`.

---

## 🚀 Part 5: Managing the Live Deployment

Vercel provides a modern, zero-maintenance developer experience. Here is how to keep your app updated:

### 5.1: Automatic CI/CD Pushes
Whenever you push code changes to GitHub:
- **`main` or `master` Branch**: Vercel automatically detects the push, triggers a production build, and performs a zero-downtime hot swap to publish your changes live in minutes.
- **Any other branch (e.g., `feature/payouts`)**: Vercel triggers a **Preview Deployment**, giving you a unique URL to test changes before merging them.

### 5.2: Monitoring Logs and Health
- **Build Logs**: If your deploy fails, click on the deployment in Vercel to see the terminal output. Typical failures are due to TypeScript compiler errors, missing environment variables, or eslint warnings.
- **Serverless Function Logs**: Navigate to **Project ➔ Logs** on Vercel. This gives you a live console stream showing `console.log` statements and error reports executing inside Next.js API routes (Serverless Functions).

---

## 🩺 Part 6: Troubleshooting Vercel Deployments

### ❌ Error: "Build Failed: Next.js Error: Type '...' is not assignable..."
- **Why**: Next.js strictly compiles TypeScript during production builds. Some files might have loose type definitions that work in local dev mode but crash the compiler.
- **Fix**: Check the exact line in Vercel's build log, fix the TypeScript type assignment, test locally by running `npm run build` (which runs the production compiler locally), and push the fix.

### ❌ Error: "Supabase client not initialized" / Blank Page
- **Why**: The `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables are missing or copy-pasted with typos.
- **Fix**: Go to **Vercel Dashboard ➔ Settings ➔ Environment Variables**, double-check the keys, and click **Redeploy** on your latest deployment.

### ❌ Error: Phantom Wallet connects but throws "Network Mismatch"
- **Why**: The app is requesting Solana Devnet but your wallet is set to Solana Mainnet, or vice-versa.
- **Fix**: Open the Phantom Extension, go to **Settings** ➔ **Developer Settings**, toggle **Testnet Mode** on, and select **Solana Devnet**. Make sure your `.env` has `NEXT_PUBLIC_SOLANA_CLUSTER=devnet`.

---

## 🎨 Professional Pro-Tips for a Live Demo
1. **Speed & Caching**: Vercel automatically deploys your assets on a Global Edge CDN. If your images (like property cards) take time to load, utilize the Next.js `<Image />` component which automatically compresses and serves images in Next-Gen formats (`.webp`).
2. **Custom Domains**: Purchase a custom domain (e.g., `invest.aurumchain.com`) and add it under **Settings ➔ Domains** in Vercel. Vercel will automatically generate and renew SSL certificates for it.
3. **Analytics**: Turn on **Speed Insights** and **Analytics** in the Vercel Dashboard to track actual site visitors and Core Web Vitals live!

*Have any questions or need custom RPC endpoints? Reach out to our engineering team or refer to the primary developer docs under `docs/`!*
