from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model and scaler
model = joblib.load("model/tb_model.pkl")

@app.post("/predict")
def predict(features: list = Form(...)):
    features = np.array(features, dtype=np.float32).reshape(1, -1)
    scaled = scaler.transform(features)
    prediction = model.predict(scaled)
    return {"prediction": prediction.tolist()}
