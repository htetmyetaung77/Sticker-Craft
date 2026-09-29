# 🚀 Deployment Guide / အက်ပ်ကို အင်တာနက်ပေါ် လွှင့်တင်နည်း လမ်းညွှန် (Vercel & Render)

This application (**StickerCraft & GIF Studio**) can be deployed for free on either **Vercel** (recommended for frontend/serverless) or **Render** (as a full-stack Web Service).

---

## ⚡ Option 1: Deploy to Vercel (အကြံပြုချက် - အလွယ်ကူဆုံး)

Vercel is the fastest and easiest platform for deploying Vite/React applications.

### အဆင့်များ (Steps):
1. **GitHub သို့ ကုဒ်များ Push လုပ်ပါ (Push to GitHub)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for StickerCraft Studio"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

2. **Vercel သို့ သွားပါ (Go to Vercel)**:
   - [vercel.com](https://vercel.com) သို့ သွားပြီး Login ဝင်ပါ။
   - **Add New Project** ကို နှိပ်ပြီး သင်၏ GitHub repository ကို ရွေးချယ်ပါ။

3. **Build Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - (Project ထဲတွင် `vercel.json` ဖိုင် ပါဝင်ပြီးဖြစ်သောကြောင့် အလိုအလျောက် သတ်မှတ်ပေးပါမည်)

4. **Environment Variables**:
   - `GEMINI_API_KEY`: သင်၏ Gemini API Key ထည့်သွင်းပါ (optional for AI generation)

5. **Deploy**:
   - **Deploy** ခလုတ်ကို နှိပ်လိုက်သည်နှင့် ၁ မိနစ်အတွင်း live URL တစ်ခု ချက်ချင်း ရရှိပါမည်။

---

## 🌐 Option 2: Deploy to Render (Web Service)

Render allows you to run both the frontend and full-stack Express server.

### အဆင့်များ (Steps):
1. **Render သို့ သွားပါ (Go to Render)**:
   - [render.com](https://render.com) သို့ သွားပြီး Login ဝင်ပါ။
   - Dashboard မှ **New +** &rarr; **Web Service** ကို ရွေးပါ။
   - GitHub repository ကို ချိတ်ဆက်ပါ။

2. **Configure Settings**:
   - **Name**: `stickercraft-studio`
   - **Region**: Singapore or Frankfurt (နီးစပ်ရာ ရွေးပါ)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `GEMINI_API_KEY`: သင်၏ Google Gemini API key

4. **Deploy Web Service**:
   - **Create Web Service** ကို နှိပ်ပါ။ Render က build လုပ်ပြီး `https://your-app.onrender.com` URL ဖြင့် လွှင့်တင်ပေးပါမည်။

---

## 🛠 Local Development & Testing

```bash
# Dependencies သွင်းရန်
npm install

# Local Dev Server စတင်ရန်
npm run dev

# Production Build စစ်ဆေးရန် (No Errors)
npm run build
```
