
# uvicorn main:app
# uvicorn main:app --reload
import json

# Main Imports
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai
from pydantic import BaseModel

# Custom Function Imports
from functions.database import store_messages, reset_messages
from functions.openai_requests import convert_audio_to_text, get_chat_response
from functions.text_to_speech import convert_text_to_speech

# Initiate App
app = FastAPI()

# CORS - Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4173",
    "http://localhost:4174",
    "http://localhost:3000",
]

# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Check Health
@app.get("/reset")
async def reset_conversation():
    reset_messages()
    return {"message": "Conversation reset"}


# Reset messages
@app.get("/health")
async def check_health():
    return {"message": "Healthy"}


# Get Audio
@app.post("/post-audio/")
async def post_audio(file: UploadFile = File(...)):
    # Get Saved Audio
    # audio_input = open("jin_voice.mp3", "rb")

    # Save file from frontend 
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_input = open(file.filename, "rb")

    # Decode Audio
    message_decoded = convert_audio_to_text(audio_input)

    # print(message_decoded)
    # Guard: Ensure message decoded
    if not message_decoded:
        return HTTPException(status_code=400, detail="Failed to decode Audio")

    # Get ChatGPT Response
    chat_response = get_chat_response(message_decoded)

    # Guard: Ensure message decoded
    if not chat_response:
        return HTTPException(status_code=400, detail="Failed to get chat response")

    # Store messages
    store_messages(message_decoded, chat_response)

    result = {
        "answer": chat_response,
        "question": message_decoded,
    }
    return result


class TextModel(BaseModel):
    text: str


@app.post('/transform')
async def transform_audio(item: TextModel):
    print(item.text)
    audio_output = convert_text_to_speech(item.text)

    # Guard: Ensure message decoded
    if not audio_output:
        return HTTPException(status_code=400, detail="Failed to get Eleven labs audio response")

    # Create a generater that yields chunk of data
    def iterfile():
        yield audio_output

    return StreamingResponse(iterfile(), media_type="application/octet-stream")

# # Post bot Response
# # Note: Not playing in browser when using post request
# @app.post("/post-audio/")
# async def post_audio(file: UploadFile = File(...)):

#     print("hello")
