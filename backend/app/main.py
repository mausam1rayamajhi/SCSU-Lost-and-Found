from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, items, claims, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lost & Found @ SCSU API")

origins = [
    "http://localhost:5173",
    "https://proud-desert-02f808d1e.3.azurestaticapps.net"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(items.router)
app.include_router(claims.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Lost & Found @ SCSU API running"}
