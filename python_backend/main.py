
# # @app.get('/')
# # def print_hello():
# #     response = client.models.generate_content(
# #     model='gemini-2.0-flash-001', contents="2+2"
# # )
# #     print(response.text)
# #     return {"message" : response}

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Load system prompt from file
with open('system-prompt.txt', 'r', encoding='utf-8') as f:
    system_prompt = f.read()

# Request body model
class Prompt(BaseModel):
    text: str

@app.post('/chat')
def chat(prompt: Prompt):
    response = client.models.generate_content(
        model='gemini-2.0-flash-001',
        contents=prompt.text,
        config=types.GenerateContentConfig(system_instruction=system_prompt)
    )
    return {"response": response.text}
