import React, { useRef, useState, useEffect } from "react";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(12);
  const [prediction, setPrediction] = useState<number | null>(null);
  const predictTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 280;
    canvas.height = 280;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const getPosition = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { x, y } = getPosition(e);
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
    queuePrediction();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing || !ctxRef.current) return;
    const { x, y } = getPosition(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    queuePrediction();
  };

  const queuePrediction = () => {
    if (predictTimeout.current) clearTimeout(predictTimeout.current);
    predictTimeout.current = setTimeout(() => {
      predictDigit();
    }, 300);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    ctxRef.current.fillStyle = "white";
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
  };

  const predictDigit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = 28;
    resizedCanvas.height = 28;
    const ctx = resizedCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 28, 28);
    ctx.drawImage(canvas, 0, 0, 28, 28);
    const base64Image = resizedCanvas.toDataURL("image/png");

    try {
      const res = await fetch("https://digit-predictor-jy2a.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await res.json();
      if (data.prediction) {
        const maxIndex = data.prediction.indexOf(Math.max(...data.prediction));
        setPrediction(maxIndex);
      } else {
        console.error("No prediction received:", data);
      }
    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Gloria Hallelujah', cursive",
        maxWidth: 460,
        margin: "40px auto",
        padding: 30,
        background:
          "repeating-linear-gradient(white, white 22px, #e0e0e0 23px, white 24px)",
        border: "4px dashed #000",
        borderRadius: 16,
        boxShadow: "5px 5px 0px #000",
        position: "relative",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: 24,
          color: "#000",
          marginBottom: 12,
          borderBottom: "2px solid #000",
          paddingBottom: 4,
        }}
      >
        Digit Doodle Pad
      </h2>
      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "bold",
          color: "#000",
          marginBottom: 20,
        }}
      >
        Prediction:{" "}
        <span
          style={{
            fontSize: 34,
            display: "inline-block",
            padding: "4px 10px",
            border: "2px solid #000",
            borderRadius: 6,
            backgroundColor: "#fff",
            boxShadow: "3px 3px 0 #000",
            fontFamily: "monospace",
          }}
        >
          {prediction !== null ? prediction : "..."}
        </span>
      </p>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
          border: "3px solid #000",
          background: "white",
          cursor: "crosshair",
          borderRadius: 4,
          boxShadow: "3px 3px 0 #000",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
      />
      <div
        style={{
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label style={{ fontSize: 14, color: "#000" }}>
          Brush Size:{" "}
          <input
            type="range"
            min={4}
            max={30}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ verticalAlign: "middle", accentColor: "#000" }}
          />
        </label>
        <button
          onClick={clearCanvas}
          style={{
            padding: "6px 14px",
            backgroundColor: "white",
            color: "#000",
            border: "2px solid #000",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: "bold",
            fontFamily: "'Gloria Hallelujah', cursive",
            boxShadow: "3px 3px 0 #000",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default DrawingCanvas;