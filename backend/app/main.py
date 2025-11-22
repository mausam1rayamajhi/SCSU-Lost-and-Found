from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .database import Base, engine
from .routers import auth, items, claims, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lost & Found @ SCSU API")

# Frontend origins that are allowed to call the API
origins = [
    "http://localhost:5173",
    "https://proud-desert-02f808d1e.3.azurestaticapps.net",
]

# Standard FastAPI CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(claims.router)
app.include_router(admin.router)


@app.get("/")
def read_root():
    return {"message": "Lost & Found @ SCSU API running"}
