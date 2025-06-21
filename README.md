# MNIST Digit Predictor

A full-stack AI web app that predicts handwritten digits as you draw them.

- Draw a digit (0–9) on a canvas in your browser  
- The app uses a trained AI model to predict the digit in real time  
- Built using React (frontend) and Flask (backend)  
- Model is a Convolutional Neural Network (CNN) trained on the MNIST dataset  
- Live predictions update every half-second as you draw  

Tech Stack

- **Frontend**: React + Vite  
- **Backend**: Flask + TensorFlow  
- **ML Model**: CNN trained on MNIST  
- **Image Processing**: Canvas to 28x28 grayscale conversion with Pillow  

Features

- Interactive canvas with adjustable brush size  
- Clean, responsive UI  
- Real-time predictions while drawing  
- Preprocessing and normalization for accurate AI inference  
- RESTful API using JSON and base64 image data  

How to Run

```bash
cd backend
pip install flask flask-cors tensorflow pillow numpy
python server.py

cd frontend
npm install
npm run dev
