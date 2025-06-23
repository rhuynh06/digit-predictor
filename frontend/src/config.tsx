const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const BACKEND_URL = isLocalhost
  ? "http://localhost:5050"
  : "https://digit-predictor-jy2a.onrender.com";