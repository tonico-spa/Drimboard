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


export  function PDFViewer({ pdfUrl }) {
  return (
    <iframe
      src={pdfUrl}
      className="w-full h-screen border-0"
      title="PDF Viewer"
    />
  );
}


export function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate the difference in milliseconds
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    // Return the appropriate relative time
    if (diffSeconds < 60) {
        return 'hace unos segundos';
    } else if (diffMinutes < 60) {
        return diffMinutes === 1 ? 'hace 1 minuto' : `hace ${diffMinutes} minutos`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? 'hace 1 hora' : `hace ${diffHours} horas`;
    } else if (diffDays === 0) {
        return 'hoy';
    } else if (diffDays === 1) {
        return 'ayer';
    } else if (diffDays < 7) {
        return `hace ${diffDays} días`;
    } else if (diffWeeks < 4) {
        return diffWeeks === 1 ? 'hace 1 semana' : `hace ${diffWeeks} semanas`;
    } else if (diffMonths < 12) {
        return diffMonths === 1 ? 'hace 1 mes' : `hace ${diffMonths} meses`;
    } else {
        return diffYears === 1 ? 'hace 1 año' : `hace ${diffYears} años`;
    }
}

