# MNIST Digit Predictor

A full-stack AI web app that predicts handwritten digits as you draw them.

- Draw any digit (0–9) on an interactive canvas  
- The app uses a trained Convolutional Neural Network (CNN) to recognize the digit  
- Predictions update live as you draw, approximately every 300ms  
- Built with **React + TypeScript** (frontend) and **Flask + TensorFlow** (backend)  
- Model trained on the classic **MNIST** handwritten digits dataset  

---

## Tech Stack

- **Frontend**: React, TypeScript, HTML5 Canvas  
- **Backend**: Flask, TensorFlow, NumPy, Pillow  
- **ML Model**: CNN trained on MNIST  
- **Image Processing**: Canvas → 28×28 grayscale image using Pillow  

---

## Features

- Interactive canvas with adjustable brush size  
- Responsive and stylized user interface  
- Real-time digit predictions (debounced inference)  
- Preprocessing and normalization for accurate classification  
- REST API using JSON and base64-encoded image data  
- Hosted version (Render backend + GitHub Pages frontend)  

## Run Locally (Recommended for Best Performance)

```bash
# Clone the repo
git clone https://github.com/yourusername/digit-predictor.git
cd digit-predictor

# Backend setup
cd backend
pip install flask flask-cors tensorflow pillow numpy
python app_local.py  # Runs at http://localhost:5050

# Frontend setup (in a new terminal)
cd ../frontend
npm install
npm run dev  # Runs at http://localhost:5173
