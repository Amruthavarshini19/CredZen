from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import plaid, simulator, insights, learning, cards

app = FastAPI(title="CredZen Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register RoutersAPI
app.include_router(plaid.router, tags=["Plaid"]) # Root level for Plaid compatibility
app.include_router(simulator.router, prefix="/api/simulator", tags=["Simulator"])
app.include_router(insights.router, prefix="/api/smart-pick", tags=["Smart Pick"])
app.include_router(learning.router, prefix="/api/learning", tags=["Learning"])
app.include_router(cards.router, prefix="/api/cards", tags=["Cards"])

@app.get("/")
def read_root():
    return {"message": "CredZen Python Backend Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
