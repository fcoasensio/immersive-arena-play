import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AvisoLegal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Aviso Legal</h1>

        <div className="prose prose-sm text-muted-foreground space-y-6 font-body">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Datos identificativos</h2>
            <p>
              En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se facilitan los
              siguientes datos:
            </p>
            <p>
              <strong>Denominación:</strong> shootandrun<br />
              <strong>Domicilio:</strong> Avda. Cristo Yacente, 24, 30820 Alcantarilla (Murcia)<br />
              <strong>Email:</strong> reservas@shootandrun.es<br />
              <strong>Teléfono:</strong> 606 323 053
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Objeto</h2>
            <p>
              El presente sitio web tiene por objeto facilitar información sobre los servicios de ocio y entretenimiento
              ofrecidos por shootandrun, así como permitir la gestión de reservas online.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, tecnología,
              software, enlaces y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente,
              son propiedad intelectual de shootandrun o de terceros, sin que puedan entenderse cedidos al usuario ninguno
              de los derechos de explotación reconocidos por la normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Condiciones de uso</h2>
            <p>
              El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que SHOOT&RUN ofrece a
              través de su sitio web y a no emplearlos para incurrir en actividades ilícitas o contrarias a la buena fe
              y al ordenamiento legal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Limitación de responsabilidad</h2>
            <p>
              SHOOT&RUN no se hace responsable de los daños y perjuicios de cualquier naturaleza que pudieran derivarse
              del uso indebido de los servicios y contenidos del sitio web por parte del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Legislación aplicable y jurisdicción</h2>
            <p>
              La relación entre SHOOT&RUN y el usuario se regirá por la normativa española vigente. Para la resolución
              de cualquier controversia, las partes se someterán a los Juzgados y Tribunales de Murcia.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvisoLegal;
