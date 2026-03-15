import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PoliticaPrivacidad = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Política de Privacidad</h1>

        <div className="prose prose-sm text-muted-foreground space-y-6 font-body">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Responsable del tratamiento</h2>
            <p>
              <strong>shootandrun</strong><br />
              Avda. Cristo Yacente, 24, 30820 Alcantarilla (Murcia)<br />
              Email: reservas@shootandrun.es<br />
              Teléfono: 606 323 053
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Finalidad del tratamiento</h2>
            <p>
              Los datos personales que nos facilites serán tratados con las siguientes finalidades:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestión de reservas y contratación de servicios.</li>
              <li>Envío de comunicaciones relacionadas con tu reserva.</li>
              <li>Atención de consultas y solicitudes de información.</li>
              <li>Cumplimiento de obligaciones legales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Legitimación</h2>
            <p>
              La base legal para el tratamiento de tus datos es el consentimiento del interesado, la ejecución de un contrato
              y el cumplimiento de obligaciones legales aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Destinatarios</h2>
            <p>
              No se cederán datos a terceros salvo obligación legal. Los datos podrán ser tratados por proveedores de
              servicios necesarios para la gestión (hosting, pasarela de pago), con los que se han firmado los
              correspondientes contratos de encargo de tratamiento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Derechos del interesado</h2>
            <p>
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento
              y portabilidad enviando un correo a{" "}
              <a href="mailto:reservas@shootandrun.es" className="text-primary hover:underline">
                reservas@shootandrun.es
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Conservación de datos</h2>
            <p>
              Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron
              recogidos y durante los plazos legalmente establecidos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Cookies</h2>
            <p>
              Este sitio web puede utilizar cookies técnicas y analíticas. Puedes obtener más información sobre las
              cookies que utilizamos en nuestra política de cookies.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidad;
