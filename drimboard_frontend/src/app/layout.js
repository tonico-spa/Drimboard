import "./globals.css";
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';


export const metadata = {
  metadataBase: new URL('https://www.drim.cl'),
  title: {
    default: 'drim — Robótica para crear sin límites',
    template: '%s | drim',
  },
  description:
    'drim es un kit de robótica que permite a niñas, niños y jóvenes crear, programar e inventar sin necesidad de saber código. Aprende, juega y construye con drim.',
  keywords: ['drim', 'duolab', 'robótica', 'kit de robótica', 'programación para niños', 'STEM', 'educación', 'Chile'],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://www.drim.cl',
    siteName: 'drim',
    title: 'drim — Robótica para crear sin límites',
    description:
      'Kit de robótica para crear, programar e inventar sin saber código. Aprende, juega y construye con drim.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'drim — Robótica para crear sin límites',
    description:
      'Kit de robótica para crear, programar e inventar sin saber código.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
