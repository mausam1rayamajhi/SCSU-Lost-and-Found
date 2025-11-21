# SCSU Lost-and-Found

Lost & Found @ SCSU is a full-stack web app that helps students report, browse, and claim lost/found items on campus.  
Built with **FastAPI + PostgreSQL** on the backend and **React + Vite + Tailwind CSS** on the frontend.

---

## Features

- Report lost or found items with photos, location, and contact details  
- Browse all active items, with search and filters  
- Claim items and view your own claims  
- Simple admin dashboard to mark items as resolved/archived  
- JWT-based authentication for secure login

---

## Tech Stack

- **Backend:** FastAPI, PostgreSQL, SQLAlchemy  
- **Frontend:** React, Vite, Tailwind CSS  
- **Auth:** JWT tokens stored in HTTP-only cookies  
- **Deployment:** Azure App Service (API) + Azure Static Web Apps (client)

---

## Development – Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# set env vars for DB connection, JWT secret, etc.
uvicorn app.main:app --reload
