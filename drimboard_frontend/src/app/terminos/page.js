import styles from "../../styles/Terms.module.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Términos y condiciones | Drimboard",
};

export default function TerminosPage() {
  return (
    <>
      <div className={styles.termsContainer}>
        <h1 className={styles.termsTitle}>
          Términos y condiciones de venta y uso de DRIM
        </h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Identificación del proveedor</h2>
          <p className={styles.paragraph}>
            Los presentes términos y condiciones regulan la compra, entrega, uso y
            soporte del sistema educativo DRIM, desarrollado y comercializado por
            Duolab (Nombre de fantasía) Rut 77.990.781-3, en adelante “Duolab”.
          </p>
          <p className={styles.paragraph}>
            DRIM corresponde a un sistema educativo de robótica, programación y
            computación física compuesto por hardware, software, contenidos
            pedagógicos y/o servicios asociados, según el plan o modalidad
            contratada por cada cliente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Aceptación de los términos y condiciones</h2>
          <p className={styles.paragraph}>
            La compra, recepción, activación o uso de DRIM implica la aceptación de
            los presentes términos y condiciones por parte del comprador,
            institución, docente, usuario o responsable de implementación.
          </p>
          <p className={styles.paragraph}>
            En caso de que DRIM sea adquirido por una institución educativa,
            fundación, empresa u organización, dicha entidad será responsable de
            informar estos términos a las personas que utilicen el sistema,
            incluyendo docentes, monitores, estudiantes u otros usuarios autorizados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Naturaleza del producto</h2>
          <p className={styles.paragraph}>
            DRIM es una solución educativa tecnológica en etapa de validación,
            mejora continua y comercialización temprana. Si bien el sistema ha sido
            desarrollado para su uso en actividades educativas reales, el comprador
            declara conocer y aceptar que DRIM no corresponde a un producto final
            cerrado, sino a una tecnología en evolución.
          </p>
          <p className={styles.paragraph}>
            Por lo anterior, el hardware, software, plataforma, materiales
            pedagógicos, funcionalidades, interfaz y componentes asociados podrán
            experimentar ajustes, actualizaciones, modificaciones, mejoras o cambios
            de versión durante su uso.
          </p>
          <p className={styles.paragraph}>
            Duolab realizará esfuerzos razonables para corregir errores, mejorar la
            experiencia de uso y actualizar el sistema de acuerdo con la
            retroalimentación recibida, los resultados de implementación y el
            desarrollo progresivo del producto.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Posibles fallas, ajustes y mejoras</h2>
          <p className={styles.paragraph}>
            El comprador declara conocer que, dada la naturaleza tecnológica y
            evolutiva de DRIM, el sistema podría presentar fallas, errores,
            incompatibilidades, interrupciones, limitaciones de funcionamiento o
            comportamientos no esperados, tanto en el hardware como en el software o
            la plataforma asociada.
          </p>
          <p className={styles.paragraph}>Estas situaciones podrán incluir, entre otras:</p>
          <ul className={styles.list}>
            <li>a) errores de software o funcionamiento de la plataforma;</li>
            <li>b) fallas o inestabilidad en funcionalidades en desarrollo;</li>
            <li>c) ajustes requeridos en la programación del dispositivo;</li>
            <li>
              d) incompatibilidades con ciertos computadores, navegadores, redes o
              configuraciones institucionales;
            </li>
            <li>
              e) fallas físicas, electrónicas o de conexión derivadas del uso
              educativo del dispositivo;
            </li>
            <li>
              f) necesidad de actualizar componentes, materiales, guías o actividades
              pedagógicas;
            </li>
            <li>
              g) cambios en el diseño, interfaz, conectores, sensores, actuadores o
              funcionalidades disponibles.
            </li>
          </ul>
          <p className={styles.paragraph}>
            Duolab se compromete a evaluar las fallas reportadas y, cuando
            corresponda, entregar soporte técnico, actualizaciones, instrucciones de
            corrección, reparación, reemplazo de componentes o cambio por nuevas
            versiones disponibles, según la naturaleza del problema, la
            disponibilidad de stock y las condiciones específicas del plan contratado.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Actualizaciones y nuevas versiones</h2>
          <p className={styles.paragraph}>
            DRIM podrá recibir actualizaciones de software, firmware, plataforma,
            contenidos pedagógicos y documentación técnica. Estas actualizaciones
            podrán modificar, agregar o reemplazar funcionalidades existentes con el
            objetivo de mejorar la seguridad, estabilidad, usabilidad o pertinencia
            educativa del sistema.
          </p>
          <p className={styles.paragraph}>
            En caso de que Duolab desarrolle nuevas versiones del hardware o de
            componentes específicos, podrá ofrecer reemplazos, actualizaciones o
            condiciones preferentes de cambio a sus clientes, según disponibilidad,
            pertinencia técnica y condiciones comerciales vigentes.
          </p>
          <p className={styles.paragraph}>
            La existencia de nuevas versiones no implica necesariamente la obligación
            automática de reemplazar todos los dispositivos previamente adquiridos,
            salvo que se haya pactado expresamente en la cotización, contrato o plan
            de implementación correspondiente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Uso educativo del sistema</h2>
          <p className={styles.paragraph}>
            DRIM está diseñado para ser utilizado con fines educativos, formativos,
            demostrativos y de aprendizaje en programación, electrónica, robótica y
            computación física.
          </p>
          <p className={styles.paragraph}>
            El comprador se compromete a utilizar el sistema conforme a las
            instrucciones entregadas por Duolab, los materiales pedagógicos
            disponibles, las recomendaciones de seguridad y las condiciones de uso
            indicadas para cada componente.
          </p>
          <p className={styles.paragraph}>
            El uso de DRIM por parte de niñas, niños o adolescentes deberá realizarse
            bajo supervisión de una persona adulta responsable, docente, monitor/a o
            profesional a cargo de la actividad.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            7. Condiciones de seguridad y cuidado del hardware
          </h2>
          <p className={styles.paragraph}>
            El comprador y los usuarios deberán manipular los dispositivos y
            componentes de DRIM con cuidado, evitando golpes, exposición a líquidos,
            manipulación indebida, apertura no autorizada, conexión de componentes no
            compatibles o uso en condiciones distintas a las recomendadas.
          </p>
          <p className={styles.paragraph}>Duolab no será responsable por daños derivados de:</p>
          <ul className={styles.list}>
            <li>a) uso inadecuado o distinto al propósito educativo del producto;</li>
            <li>b) manipulación no autorizada del hardware;</li>
            <li>
              c) conexión de componentes externos no recomendados o incompatibles;
            </li>
            <li>
              d) golpes, caídas, humedad, calor excesivo o daño físico causado por
              terceros;
            </li>
            <li>
              e) intervención, reparación o modificación realizada por personas no
              autorizadas;
            </li>
            <li>f) incumplimiento de las instrucciones de uso o seguridad.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Plataforma, software y acceso digital</h2>
          <p className={styles.paragraph}>
            Cuando la compra incluya acceso a una plataforma, software o contenidos
            digitales, dicho acceso se otorgará conforme a las condiciones del plan
            contratado.
          </p>
          <p className={styles.paragraph}>
            Duolab podrá realizar mantenimientos, actualizaciones o ajustes en la
            plataforma, los que podrían generar interrupciones temporales del
            servicio. Cuando sea posible, Duolab informará oportunamente sobre
            mantenimientos programados o cambios relevantes.
          </p>
          <p className={styles.paragraph}>
            El acceso a la plataforma podrá requerir conexión a internet, uso de
            navegadores compatibles, computadores u otros dispositivos adecuados. La
            disponibilidad y calidad de la conexión a internet será responsabilidad
            del usuario o institución que implemente DRIM.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            9. Cuentas de usuario y responsabilidad de acceso
          </h2>
          <p className={styles.paragraph}>
            En caso de que se entreguen cuentas de usuario para docentes,
            estudiantes, administradores u otros perfiles, cada usuario será
            responsable de mantener la confidencialidad de sus credenciales de acceso.
          </p>
          <p className={styles.paragraph}>
            El comprador o institución será responsable de informar oportunamente a
            Duolab en caso de uso no autorizado, pérdida de acceso, cambio de
            responsables o necesidad de desactivar cuentas.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Soporte técnico y acompañamiento</h2>
          <p className={styles.paragraph}>
            Duolab podrá ofrecer soporte técnico, pedagógico o de implementación de
            acuerdo con el plan contratado. El soporte podrá realizarse mediante
            correo electrónico, reuniones remotas, material de ayuda, capacitaciones,
            guías, videos u otros canales definidos por Duolab.
          </p>
          <p className={styles.paragraph}>
            El alcance del soporte dependerá de la modalidad de compra o
            implementación acordada. Salvo que se indique expresamente lo contrario,
            el soporte no incluye asistencia presencial ilimitada, reemplazo por mal
            uso, desarrollo de funcionalidades a medida ni adaptación completa a
            sistemas internos de cada institución.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Garantía y reemplazos</h2>
          <p className={styles.paragraph}>
            Duolab responderá por fallas atribuibles a defectos de fabricación o
            funcionamiento del producto, conforme a la normativa aplicable y a las
            condiciones comerciales acordadas.
          </p>
          <p className={styles.paragraph}>
            La garantía no cubrirá daños ocasionados por mal uso, manipulación
            indebida, accidentes, intervención no autorizada, exposición a
            condiciones inadecuadas o desgaste derivado de uso intensivo no
            contemplado.
          </p>
          <p className={styles.paragraph}>
            En caso de falla, el comprador deberá informar a Duolab entregando una
            descripción del problema, fotografías o videos cuando corresponda, número
            de compra o factura, y cualquier antecedente necesario para evaluar la
            situación.
          </p>
          <p className={styles.paragraph}>
            Duolab podrá ofrecer, según corresponda, orientación de uso,
            actualización, reparación, reemplazo de componentes o cambio del
            dispositivo, conforme a la evaluación técnica realizada.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>12. Limitación de responsabilidad</h2>
          <p className={styles.paragraph}>
            DRIM es una herramienta de apoyo para procesos educativos. Los resultados
            de aprendizaje, implementación o impacto pueden variar según el contexto,
            nivel de acompañamiento docente, condiciones institucionales, tiempo de
            uso, conectividad, recursos disponibles y características de los
            participantes.
          </p>
          <p className={styles.paragraph}>
            Duolab no garantiza resultados educativos específicos, calificaciones,
            certificaciones, aprendizajes determinados o mejoras medibles en todos los
            contextos de implementación, salvo que ello haya sido expresamente pactado
            por escrito.
          </p>
          <p className={styles.paragraph}>
            Duolab no será responsable por interrupciones, pérdidas de información,
            problemas de conectividad, incompatibilidades externas o dificultades de
            implementación atribuibles a infraestructura, redes, dispositivos o
            decisiones ajenas a Duolab.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>13. Propiedad intelectual</h2>
          <p className={styles.paragraph}>
            Todos los diseños, materiales, contenidos, guías, software,
            documentación, identidad visual, metodologías, recursos pedagógicos y
            desarrollos asociados a DRIM son propiedad de Duolab o se encuentran
            licenciados para su uso por Duolab.
          </p>
          <p className={styles.paragraph}>
            La compra de DRIM no transfiere propiedad intelectual sobre el producto,
            software, plataforma, contenidos o materiales asociados. El comprador
            recibe únicamente una autorización de uso en los términos establecidos en
            la cotización, contrato o plan adquirido.
          </p>
          <p className={styles.paragraph}>
            Queda prohibida la reproducción, distribución, venta, modificación,
            ingeniería inversa, copia o uso comercial no autorizado de los materiales,
            software, hardware o contenidos de DRIM, salvo autorización expresa y por
            escrito de Duolab.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>14. Uso de imágenes, registros y testimonios</h2>
          <p className={styles.paragraph}>
            En actividades de capacitación, talleres, pilotos o implementaciones,
            Duolab podrá solicitar autorización para registrar fotografías, videos,
            testimonios o evidencia de uso con fines de difusión, reporte, mejora del
            producto o comunicación institucional.
          </p>
          <p className={styles.paragraph}>
            El uso de imágenes de estudiantes, docentes u otros participantes
            requerirá las autorizaciones correspondientes de la institución,
            participantes o representantes legales, según corresponda.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>15. Precios, pagos y facturación</h2>
          <p className={styles.paragraph}>
            Los precios, condiciones de pago, impuestos, plazos de entrega, cantidad
            de kits, servicios incluidos, capacitaciones y acompañamiento serán los
            indicados en la cotización, propuesta comercial, orden de compra, factura
            o contrato correspondiente.
          </p>
          <p className={styles.paragraph}>
            Salvo que se indique expresamente lo contrario, los precios no incluyen
            servicios adicionales no descritos en la propuesta, tales como traslados,
            capacitaciones adicionales, soporte presencial extendido, desarrollo a
            medida o reposición por daño atribuible al usuario.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>16. Entrega de productos</h2>
          <p className={styles.paragraph}>
            Los plazos de entrega serán informados en la cotización o comunicación
            comercial correspondiente. Dichos plazos podrán variar por disponibilidad
            de stock, importación de componentes, fabricación, certificaciones,
            logística u otros factores externos.
          </p>
          <p className={styles.paragraph}>
            Duolab informará al comprador en caso de retrasos relevantes y propondrá
            alternativas razonables cuando corresponda.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>17. Devoluciones y cancelaciones</h2>
          <p className={styles.paragraph}>
            DRIM se comercializa como una solución educativa tecnológica en etapa de
            validación comercial y mejora continua. Antes de la compra, Duolab pondrá
            a disposición del comprador información sobre las características del
            producto, funcionalidades disponibles, limitaciones conocidas, condiciones
            de uso, requerimientos técnicos y alcance del soporte incluido.
          </p>
          <p className={styles.paragraph}>
            Una vez realizada la compra y entregado el producto, no se aceptarán
            devoluciones por arrepentimiento, cambio de opinión, expectativas
            subjetivas, preferencia por otra solución, falta de uso por parte de la
            institución o decisión posterior de no implementar el sistema, siempre que
            esta exclusión haya sido informada antes de la compra y sin perjuicio de
            los derechos legales irrenunciables que correspondan.
          </p>
          <p className={styles.paragraph}>
            Las funcionalidades, limitaciones o características informadas previamente
            como parte de una versión piloto comercial, beta, experimental o en mejora
            continua no constituirán por sí solas causal de devolución. En estos
            casos, Duolab podrá entregar soporte, actualizaciones, correcciones,
            mejoras de software, ajustes de documentación o condiciones preferentes de
            actualización, según corresponda.
          </p>
          <p className={styles.paragraph}>
            En caso de fallas atribuibles a defectos de fabricación o funcionamiento
            bajo condiciones normales de uso, se aplicará la garantía legal
            correspondiente, sin que esta política limite los derechos establecidos
            por la normativa vigente.
          </p>
          <p className={styles.paragraph}>
            En el caso de productos personalizados, servicios ya ejecutados,
            capacitaciones realizadas o kits entregados y utilizados, no se realizarán
            devoluciones, sin perjuicio de los derechos que correspondan conforme a la
            normativa vigente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>18. Confidencialidad</h2>
          <p className={styles.paragraph}>
            En caso de que durante la implementación se comparta información técnica,
            pedagógica, comercial, institucional o estratégica entre Duolab y el
            comprador, ambas partes deberán mantener reserva sobre dicha información y
            no divulgarla a terceros sin autorización, salvo que sea información
            pública o requerida por autoridad competente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>19. Modificación de estos términos</h2>
          <p className={styles.paragraph}>
            Duolab podrá actualizar estos términos y condiciones para reflejar mejoras
            del producto, cambios legales, ajustes comerciales o nuevas modalidades de
            implementación.
          </p>
          <p className={styles.paragraph}>
            Las nuevas versiones de estos términos serán informadas o puestas a
            disposición de los clientes por los canales habituales de comunicación.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>20. Legislación aplicable</h2>
          <p className={styles.paragraph}>
            Estos términos y condiciones se regirán por las leyes de la República de
            Chile.
          </p>
          <p className={styles.paragraph}>
            Cualquier controversia derivada de la interpretación, cumplimiento o
            ejecución de estos términos será resuelta conforme a la normativa chilena
            aplicable y a los mecanismos acordados entre las partes.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>21. Declaración final</h2>
          <p className={styles.paragraph}>
            El comprador declara conocer y aceptar que DRIM es una solución educativa
            tecnológica en evolución, desarrollada bajo un enfoque de mejora continua.
            En consecuencia, comprende que el sistema puede presentar fallas, requerir
            ajustes o recibir nuevas versiones, y que Duolab realizará esfuerzos
            razonables para acompañar, corregir y mejorar la experiencia de uso, sin
            que ello implique que el producto se encuentre en una versión final,
            definitiva o libre de errores.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
