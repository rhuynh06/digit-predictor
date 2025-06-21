from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import base64

app = Flask(__name__)

# Allow only frontend at localhost:5173
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})

# Load model once at startup
model = tf.keras.models.load_model("mnist_digit_cnn_model.keras")

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return '', 204  # Handle preflight

    try:
        data = request.get_json()
        image_data = data.get("image")

        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        # Remove base64 header and decode
        image_bytes = base64.b64decode(image_data.split(",")[1])
        image = Image.open(io.BytesIO(image_bytes)).convert("L")
        image = image.resize((28, 28))
        image_np = np.array(image)

        # Normalize and reshape
        image_np = 1.0 - image_np / 255.0
        image_np = image_np.reshape(1, 28, 28, 1)

        # Predict
        prediction = model.predict(image_np)
        return jsonify({"prediction": prediction[0].tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's assigned port or default to 5000
    app.run(host="0.0.0.0", port=port)

