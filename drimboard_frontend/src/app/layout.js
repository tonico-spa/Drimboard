import { Geist, Geist_Mono, Roboto  } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { AuthProvider } from '../context/AuthContext';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '700'], // Specify desired weights, e.g., regular and bold
  subsets: ['latin'], // Specify desired subsets
  display: 'swap', // Recommended for better user experience
});

export const metadata = {
  title: "drimboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <AuthProvider>
         <Navbar />
        <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
