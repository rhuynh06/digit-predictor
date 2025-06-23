from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import base64

app = Flask(__name__)

# Allow your GitHub Pages origin and methods globally
CORS(app, origins=["https://rhuynh06.github.io"], methods=["GET", "POST", "OPTIONS"], supports_credentials=True)

model = tf.keras.models.load_model("mnist_digit_cnn_model.keras")

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        response = make_response()
        response.status_code = 204
        response.headers.add("Access-Control-Allow-Origin", "https://rhuynh06.github.io")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response

    try:
        data = request.get_json()
        image_data = data.get("image")
        if not image_data:
            return jsonify({"error": "No image provided"}), 400

        image_bytes = base64.b64decode(image_data.split(",")[1])
        image = Image.open(io.BytesIO(image_bytes)).convert("L")
        image = image.resize((28, 28))
        image_np = np.array(image)
        image_np = 1.0 - image_np / 255.0
        image_np = image_np.reshape(1, 28, 28, 1)

        prediction = model.predict(image_np)
        return jsonify({"prediction": prediction[0].tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)