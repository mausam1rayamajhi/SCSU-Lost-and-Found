# SCSU-Lost-and-Found
Lost &amp; Found @ SCSU is a full-stack web app that helps students report, browse, and claim lost/found items on campus. Built with FastAPI + PostgreSQL on the backend and React + TailwindCSS on the frontend. Includes user authentication, claim verification, an admin dashboard, and real-time item management.

Features
- User Authentication (JWT-based)
- Add update and delete items
- Search and filter lost/found items
- Upload item details with images 
- Claim request workflow
- Admin dashboard for approval and management
- PostgreSQL relational database
- Full Cloud deployment (Azure App Service and Static Web Apps)
- Rest API with FastAPI/docs interface
- Server logs and CORS configuration

Tech Stack 

Frontend:
- React + Vite
- Tailwind CSS
- Axios
- React Router

Backend:
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- JWT Auth
- Uvicorn

Cloud / DevOps:
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- GitHub Actions (CI/CD)


Project Structure
backend/
    app/
       routers/
       models.py
       schemas.py
       auth.py
       main.py
       database.py

frontend/
    src/
       components/
       pages/
       api/
       App.jsx

.github/
    workflows/

Deployment links

Frontend: https://proud-desert-02f808d1e.3.azurestaticapps.net/

Backend: scsu-lost-found-backend-cma4hucnhydvh4dv.eastus2-01.azurewebsites.net

GitRepo: https://github.com/mausam1rayamajhi/SCSU-Lost-and-Found


Running locally

Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
cd frontend
npm install
npm run dev


Author
GitHub: https://github.com/mausam1rayamajhi
LinkedIn: https://linkedin.com/in/mausamrayamajhi