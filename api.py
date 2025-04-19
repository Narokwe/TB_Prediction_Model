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

# Load model
model = joblib.load("model/tb_model.pkl")

@app.post("/predict")
def predict(features: list = Form(...)):
    # Convert features to numpy array and reshape
    features = np.array(features, dtype=np.float32).reshape(1, -1)
    
    # Make prediction directly without scaling
    prediction = model.predict(features)
    
    # Return prediction as list
    return {"prediction": prediction.tolist()}