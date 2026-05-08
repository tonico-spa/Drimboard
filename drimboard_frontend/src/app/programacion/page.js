import EmbeddedPage from '@/components/EmbeddedPage';
import styles from './page.module.css';

export const metadata = {
  title: 'Programación',
  description:
    'Programa con bloques en el editor visual de drim, directamente desde tu navegador y sin instalar nada.',
};

export default function ProgramacionPage() {
  return (
    <div className={styles.container}>
      <div className={styles.embed}>
        <EmbeddedPage
          url="https://blockly-web.dplpleoajxzor.amplifyapp.com/"
          allowedOrigins={['https://blockly-web.dplpleoajxzor.amplifyapp.com']}
        />
      </div>
    </div>
  );
}
