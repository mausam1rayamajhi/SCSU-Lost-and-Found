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
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Extra safety: always add CORS headers on responses
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    origin = request.headers.get("origin")
    if origin in origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Catch all OPTIONS handler for preflight requests
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str, request: Request):
    origin = request.headers.get("origin")
    headers = {
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": request.headers.get(
            "Access-Control-Request-Headers",
            "Authorization,Content-Type",
        ),
    }
    if origin in origins:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"

    return JSONResponse(status_code=200, content=None, headers=headers)


# Routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(claims.router)
app.include_router(admin.router)


@app.get("/")
def read_root():
    return {"message": "Lost & Found @ SCSU API running"}
