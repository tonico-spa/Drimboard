import "./globals.css";
import Navbar from '@/components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';


export const metadata = {
  title: "Drimboard",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
