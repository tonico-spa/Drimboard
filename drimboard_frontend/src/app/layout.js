import "./globals.css";
import Navbar from '@/components/Navbar';
import { AuthProvider } from '../context/AuthContext';


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
