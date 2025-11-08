<h1 align="center"><img style="width: 60px; height: 60px;" src="public/icon-light.svg" alt="Just-Say"> <br/> Just-Say </h1>

<p align="center"><i>“Don’t gossip — just say it”</i></p>

Live Demo : [just-say-manmohit.vercel.app](just-say-manmohit.vercel.app)
## 🧭 what’s this?

A small anonymous messaging web app — kinda like NGL, but built for fun.  

I started it as a **Next.js project from the [Chai aur Code tutorials](https://youtu.be/28-fJmm_ONQ?si=5FSekzrMx7MML_6h)**,  
and then just… went off-road with it.  
(By the way , it was a great tutorial by [@Hitesh Choudhary ](https://github.com/hiteshchoudhary) Sir)

Now it’s got my own logic, structure, and way of doing things.

It’s fully working btw — not some half-done side project.

The UI is okay-ish (used plain shadcn components), the main focus was on backend side because never practiced backend properly before.

---

## ⚙️ what it does

- lets you create a user and get a unique link
- people can send you anonymous or non-anonymous messages
- you can view the messages you sent and received in your dashboard
- works fine on mobile too (by luck,I haven't actually worked on responsiveness yet)
- authentication is handled with NextAuth.js
- backend is on Next.js itself (no separate server)
- everything stored in MongoDB
- has integration with Gemini api for message generation usign vercel's AI sdk

---

## 🚀 ideas for future

There’s a lot that can be improved or added. Some ideas I’ve parked for later:

- 🔒 **make it E2E encrypted**
- 🪶 **add a proper message screen** (like NGL-style replies people can post on social media)
- 🗂️ **“folder” system for messages**
  - user can create folders.
  - each folder gets a unique link
  - messages sent via that link go into that folder
  - helps manage different message contexts
- 👤 **social-style profiles**
  - search for users by username
  - message them directly without needing their shared link

---

## 💡 random extra ideas

- emoji reactions on messages
- small dashboard showing stats like message count
- reply threads (mini chat vibe)
- custom themes
- anonymous polls

---

## 🧩 current state

> ✅ working and functional  
> 🧑‍💻 built mostly for learning  
> 🎨 UI is okay, theming can be better, will keeping adding to it
> 💭 lots of ideas waiting for free weekends

---
