# KaziLink Deployment Guide
## How to Put Your App Live on the Internet

**No coding knowledge needed for Path A. Just follow each step carefully.**

---

## PATH A — Online Method (Free, ~30 Minutes)
### Use this to get your app live today with no installation

This method uses a free website called **StackBlitz** (an online code editor)
and **Vercel** (a free hosting service). Both are free.

---

### STEP 1 — Create a Free GitHub Account
GitHub is where your app code will be stored online.

1. Go to: **github.com**
2. Click the green **"Sign up"** button
3. Enter your email, create a username and password
4. Verify your email address
5. You now have a GitHub account ✅

---

### STEP 2 — Create a New GitHub Repository (Storage Folder)
A "repository" is just a folder online where your app files live.

1. After logging in to GitHub, click the **"+"** button at the top right
2. Click **"New repository"**
3. Name it: `kazilink`
4. Make sure **"Public"** is selected
5. Tick the box: **"Add a README file"**
6. Click **"Create repository"** ✅

---

### STEP 3 — Upload Your Project Files to GitHub
You need to upload all the files from the `kazilink-project` folder.

**The files to upload are:**
```
kazilink-project/
├── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx  ← this is your KaziLink app
```

**How to upload:**
1. In your new GitHub repository, click **"Add file"**
2. Click **"Upload files"**
3. Drag all files from the `kazilink-project` folder into the box
4. For the `src/` folder: you must enter the path manually:
   - Click "Add file" → "Create new file"
   - In the name box type: `src/App.jsx`
   - Paste the entire contents of `App.jsx` into the editor
   - Repeat for `src/main.jsx` and `src/index.css`
5. Click **"Commit changes"** ✅

> **TIP:** If this feels complicated, ask someone who uses a computer regularly
> to help you drag and drop the files. It takes about 10 minutes.

---

### STEP 4 — Create a Free Vercel Account
Vercel is the service that will host (serve) your app to the world.

1. Go to: **vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (this links your Vercel to your GitHub)
4. Authorise the connection
5. You now have a Vercel account connected to GitHub ✅

---

### STEP 5 — Deploy Your App on Vercel

1. In Vercel, click **"Add New Project"**
2. You will see your GitHub repositories listed
3. Find **"kazilink"** and click **"Import"**
4. Vercel will detect it's a React/Vite project automatically
5. Under **"Framework Preset"** — select **"Vite"**
6. Leave all other settings as default
7. Click **"Deploy"** 🚀

Vercel will build your app. This takes about 2–3 minutes.

---

### STEP 6 — Your App is Live!

When it finishes, Vercel gives you a link like:
```
https://kazilink.vercel.app
```

Open that link on your phone or computer — **your app is live!** 🎉

Anyone in the world can now open that link and use KaziLink.

---

### Giving It a Custom Domain Name (Optional)
Instead of `kazilink.vercel.app` you can have `kazilink.co.tz` or similar.

1. Buy a domain from **Zitec.co.tz** or **domains.co.tz** (~TSh 30,000/year)
2. In Vercel → your project → **"Settings"** → **"Domains"**
3. Enter your domain name and follow the instructions
4. It will take a few hours to activate

---

## PATH B — Professional Method (With a Developer)

This is for when you are ready to launch for real users with:
- A real database (data saves permanently, not just while app is open)
- Real photo uploads (stored on a server)
- SMS notifications to your phone
- Secure login system
- Push notifications to users' phones

### What to Tell Your Developer

Give your developer these exact requirements:

#### 1. Tech Stack
- **Frontend:** React + Vite + Tailwind CSS (already done — App.jsx)
- **Database:** Supabase (free tier to start)
- **Auth:** Supabase Auth (phone number + OTP login for Tanzania)
- **File storage:** Supabase Storage (for photos)
- **SMS:** Africa's Talking API or Beem Africa (for Tanzania notifications)
- **Hosting:** Vercel (free tier)
- **Mobile app (later):** Expo / React Native

#### 2. What the Developer Needs to Build
- Connect the React app to Supabase database
- Replace in-memory state with real database queries
- Set up photo upload to Supabase Storage
- Create SMS notification triggers using Africa's Talking
- Build an Admin web page for you (the middleman) to see all notifications
- (Later) Package as Android app using Expo

#### 3. Database Tables (already defined in your Schema document)
Share the `KaziLink_Requirements_and_Schema.md` document with your developer.
All 6 tables are described in detail there.

#### 4. Budget Estimate
| Task | Estimated Cost |
|------|---------------|
| Connect app to Supabase (database) | TSh 300,000 |
| Photo upload system | TSh 150,000 |
| SMS notifications | TSh 200,000 |
| Admin dashboard | TSh 200,000 |
| Android app (Expo) | TSh 500,000 |
| **Total estimate** | **~TSh 1,350,000** |

> Find developers on: **fiverr.com** (search "React Supabase developer"),
> or ask at universities like UDSM, Ardhi, or Mzumbe for computer science students.

---

## Keeping Costs Low — Free Tier Summary

| Service | Free Allowance | Paid from |
|---------|----------------|-----------|
| Vercel hosting | Unlimited for personal projects | $20/month for teams |
| Supabase database | 500MB, 50,000 users | $25/month |
| Supabase photo storage | 1GB | $25/month (included) |
| Africa's Talking SMS | TSh 0 — pay per SMS | ~TSh 60 per SMS |
| GitHub | Unlimited | Free forever for public |

**You can run KaziLink for free until you have ~50,000 users.** After that, costs are very reasonable.

---

## Updating Your App After Launch

Once live on Vercel, every time you update files on GitHub, Vercel automatically re-deploys the new version within 2–3 minutes. No manual work needed.

---

## Getting Help

If you are stuck at any step:
1. Take a screenshot of the problem
2. Share it with a local IT person or university student
3. Or share this document and ask them to follow Step 3 onwards

The hardest part is Step 3 (uploading files). Everything after that is just clicking buttons.

---

*KaziLink Deployment Guide — prepared for the app owner*
