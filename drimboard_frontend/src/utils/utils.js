import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export function capitalizeWords(str) {
  if (!str) {
    return ""; // Handle empty or null strings
  }

  const words = str.split(" ");
  const capitalizedWords = words.map(word => {
    if (word.length === 0) {
      return ""; // Handle empty words if multiple spaces exist
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalizedWords.join(" ");
}
    const api = axios.create({
        // IMPORTANT: Point to the proxy path.
        // Do NOT include the host (http://localhost:3000). The browser will handle that.
        baseURL: '/',
    });

