const LOCAL = window.location.hostname === "localhost";

export const BACKEND_URL = LOCAL
  ? "http://localhost:5050"
  : "https://digit-predictor-jy2a.onrender.com";
