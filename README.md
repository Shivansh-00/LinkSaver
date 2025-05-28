# 🔗 Link Saver with Auto-Summary

This is a take-home assignment for the **Software Developer Internship at OMVAD**. The application allows users to log in with demo credentials, save links, fetch their titles, and auto-generate summaries using the **Jina AI API**. All data is stored in the browser using `localStorage`.

---

## 🚀 Live Demo

🔗 [Click here to view the demo](https://drive.google.com/file/d/1Bf3j3uU1hUX8EG6kHRVoWDLr7hC9bTXB/view?usp=sharing)  
⚠️ **Note:** Please deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) to provide an interactive demo as required by OMVAD.

---

## 🛠️ Tech Stack Used

- **Frontend Framework:** React with Vite
- **Styling:** Tailwind CSS
- **API:** Jina AI Summary API (no key required)
- **Storage:** localStorage (client-side only)
- **Deployment:** Currently on Google Drive (should be on Vercel)

---

## 🧩 Features

- 🔐 Simple login with hardcoded demo credentials (`demo@test.com` / `password123`)
- ➕ Paste a link and get the title + auto-generated summary
- 📜 View saved links with URL, title, and summary
- 🗑️ Delete links from the saved list
- 📱 Fully responsive and mobile-friendly UI
- 🧠 Clean UI/UX and error handling for invalid URLs or failed summaries

---

## 📝 Demo Credentials

Email: demo@test.com
Password: password123




---

## 🖼️ Screenshots

| Login Page | Add Link | Saved Bookmarks |
|------------|----------|-----------------|
| ![Login](screenshots/login.png) | ![Add Link](screenshots/add-link.png) | ![Saved](screenshots/saved-bookmarks.png) |

---

## 🧪 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Shivansh-00/LinkSaver.git
   cd LinkSaver


Install dependencies:
npm install

Run the development server:
npm run dev


⏱️ Time Spent Breakdown
Task	Time Spent
Project setup & Auth	1 hour
URL input + Jina AI API	1.5 hours
Save & display bookmarks	1.5 hours
Delete + Responsive UI	1 hour
Deployment + README	0.5 hour

Total: ~5.5 hours
Visit http://localhost:5173


 Summary API Info
We used Jina AI's public summarization endpoint:

js
Copy
Edit
const getSummary = async (url) => {
  try {
    const response = await fetch('https://r.jina.ai/' + encodeURIComponent(url));
    return await response.text();
  } catch (err) {
    return 'Summary temporarily unavailable.';
  }
};
