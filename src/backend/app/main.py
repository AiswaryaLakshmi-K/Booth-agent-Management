from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import engine, Base
from .routers import auth, users, booths, families, issues

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Booth Agent Management System (Tamil Nadu)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(booths.router, prefix="/api")
app.include_router(families.router, prefix="/api")
app.include_router(issues.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Booth Agent API - Tamil Nadu Elections"}