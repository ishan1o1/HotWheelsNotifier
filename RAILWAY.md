# 🚀 Railway Deployment Guide for HotWheels Notifier

This guide provides step-by-step instructions to deploy the **HotWheels Notifier** application on [Railway](https://railway.app/).

---

## 🛠️ Prerequisites

1. A [Railway Account](https://railway.app/).
2. A GitHub account with this repository pushed to your GitHub.
3. Your Telegram Bot Token & Chat ID.

---

## 📋 Step-by-Step Deployment Instructions

### 1. Push Your Code to GitHub
Ensure all latest changes are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

---

### 2. Create a New Project on Railway
1. Log in to [Railway Dashboard](https://railway.app/dashboard).
2. Click **"+ New Project"**.
3. Select **"Deploy from GitHub repo"**.
4. Search for and select your **`HotWheelsNotifier`** repository.
5. Click **"Deploy Now"**.

---

### 3. Configure Environment Variables
In your Railway project dashboard:
1. Click on your newly created service.
2. Navigate to the **"Variables"** tab.
3. Add the following environment variables:

| Variable Name | Description | Value Example | Required? |
| :--- | :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | Your Telegram Bot token from @BotFather | `8712288918:AAHPuTh4iAGHOb...` | **Yes** |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for alerts | `1573201198` | **Yes** |
| `CRON_SCHEDULE` | Cron schedule for product checking | `* * * * *` *(Every min)* | Optional |
| `FIRSTCRY_API` | Custom FirstCry endpoint (if needed) | *(Default built-in)* | Optional |
| `DATA_DIR` | Mount path for persistent storage | `/app/data` | Optional |
| `LOGGER_URL` | External log service URL | `https://your-logger.com` | Optional |
| `LOGGER_API_KEY` | External logger API Key | `key_xxx` | Optional |

> 💡 **Note:** `PORT` is automatically injected by Railway.

---

### 4. (Optional) Set Up Persistent Storage Volume
To persist seen/notified products across redeployments:
1. In your Railway service dashboard, click **"+ Add"** -> **"Volume"**.
2. Mount path: `/app/data`.
3. Set Environment Variable in the **Variables** tab:
   - `DATA_DIR`: `/app/data`
4. Re-deploy.

---

### 5. Verify Deployment
1. Go to the **"Logs"** tab in Railway.
2. You should see output similar to:
   ```text
   Health check HTTP server listening on port 3000
   FirstCry Monitor Started (Cron: * * * * *)
   Scheduled product check started
   Pagination calculated
   Product fetch completed
   Scheduled product check completed
   ```
3. To test the health check endpoint, enable a **Public Domain** under **Settings** -> **Networking** -> **Generate Domain**.
4. Open `https://your-app.up.railway.app/health` in your browser. You should receive:
   ```json
   {
     "status": "ok",
     "service": "HotWheels Notifier",
     "uptime": 42.5,
     "timestamp": "2026-08-04T11:20:00.000Z"
   }
   ```

---

## ⚡ Deployment Checklist
- [x] `package.json` contains `"start": "node src/index.js"`
- [x] `railway.json` and `Procfile` included
- [x] HTTP healthcheck listener on `PORT`
- [x] Persistent filesystem directory support (`DATA_DIR`)
- [x] Sensitive variables (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) safely configured in Railway Variables
