import Materials from '@/components/materials/Materials';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Materiales',
  description:
    'Material de aprendizaje, actividades y foro para usuarios del kit drim.',
};

export default function MaterialesPage() {
  return (
    <>
      <Materials />
      <Footer />
    </>
  );
}
