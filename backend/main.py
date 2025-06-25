from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from together import Together
import motor.motor_asyncio
from datetime import datetime
import os
from dotenv import load_dotenv


load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.journal_db
entries_collection = db.entries

together_client = Together(api_key=TOGETHER_API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EntryIn(BaseModel):
    content: str

@app.post("/journal")
async def create_entry(entry: EntryIn):
    prompt = (
        f"Read the following journal entry and detect the user's mood. "
        f"Respond with the mood as a single word followed by its emoji, e.g., happy 😊:\n\n"
        f"{entry.content}"
    )

    response = together_client.chat.completions.create(
        model="deepseek-ai/DeepSeek-V3",
        messages=[{"role": "user", "content": prompt}]
    )

    mood_response = response.choices[0].message.content.strip()

    doc = {
        "content": entry.content,
        "mood": mood_response,
        "timestamp": datetime.utcnow()
    }

    result = await entries_collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

@app.get("/journal")
async def get_entries():
    entries = []
    async for doc in entries_collection.find().sort("timestamp", -1):
        doc["_id"] = str(doc["_id"])
        entries.append(doc)
    return entries
