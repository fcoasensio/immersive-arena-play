import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import laserOutdoor from '@/assets/recursos/laser-tag-outdoor-evento.jpg';

const LaserTagAyuntamientosFiestas = () => (
  <BlogArticleLayout slug="laser-tag-ayuntamientos-fiestas-patronales">
    <p>
      ¿Eres concejal de Juventud, Festejos o Cultura y buscas una actividad que llene la
      plaza, atraiga al público joven y se comparta sola en redes? En{' '}
      <strong className="text-foreground">Shoot and Run</strong> llevamos un{' '}
      <strong className="text-foreground">campo de láser tag outdoor profesional</strong>{' '}
      directamente a la plaza de tu pueblo: fiestas patronales, Navidad, verano, Carnaval o
      Semana Santa. Tú pones el espacio y la fecha, nosotros ponemos todo lo demás.
    </p>

    <div className="my-8 rounded-xl overflow-hidden border border-border">
      <img
        src={laserOutdoor}
        alt="Campo de laser tag outdoor montado en la plaza de un pueblo durante las fiestas patronales"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      El reto de los eventos municipales: enganchar al público joven
    </h2>
    <p>
      Los vecinos de <strong className="text-foreground">12 a 35 años</strong> son el
      segmento más difícil de captar en la programación municipal. Las actividades
      tradicionales ya no generan el impacto de antes y los ayuntamientos necesitan
      propuestas que enganchen, que se compartan en Instagram y TikTok y que generen
      comunidad. El láser tag outdoor cubre justo ese hueco: es{' '}
      <strong className="text-foreground">apto desde los 12 hasta los 60 años</strong>,
      no requiere experiencia previa y el público también disfruta como espectador.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      +250 vecinos jugando en una sola jornada
    </h2>
    <p>
      Gracias a nuestro modo{' '}
      <strong className="text-foreground">Rueda Infinita</strong> (rotación continua sin
      tiempos muertos), la capacidad de participación es enorme:
    </p>
    <ul className="space-y-2 list-disc list-inside">
      <li><strong className="text-foreground">Jornada de 4 h:</strong> +200 jugadores únicos. Ideal para una tarde de fiestas.</li>
      <li><strong className="text-foreground">Jornada de 6 h:</strong> +300 jugadores únicos. Perfecta para un día grande de patronales.</li>
      <li><strong className="text-foreground">Jornada de 8 h:</strong> +420 jugadores únicos. Para fiestas mayores y eventos anuales.</li>
    </ul>
    <p>
      Siempre hay 16-18 jugadores activos en el campo y el siguiente entra al instante en
      cuanto el anterior acumula 4-5 eliminaciones. Nadie espera más de unos minutos para
      volver a entrar.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Cuándo encaja en la programación municipal
    </h2>
    <ul className="space-y-2 list-disc list-inside">
      <li><strong className="text-foreground">Fiestas patronales:</strong> el plato fuerte del año. Llena la plaza y genera boca a boca.</li>
      <li><strong className="text-foreground">Navidad y Reyes:</strong> torneos navideños como alternativa activa al mercado tradicional.</li>
      <li><strong className="text-foreground">Verano:</strong> verbenas nocturnas, campamentos urbanos y actividades de junio a septiembre.</li>
      <li><strong className="text-foreground">Carnaval:</strong> partidas temáticas con disfraces, contenido viral asegurado.</li>
      <li><strong className="text-foreground">Semana Santa:</strong> ocio activo y saludable que complementa la programación cultural.</li>
      <li><strong className="text-foreground">Plan de Juventud:</strong> programa anual de ocio alternativo para 12-35 años.</li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Servicio "llave en mano": cero gestión para el ayuntamiento
    </h2>
    <p>
      El consistorio solo necesita aportar un espacio libre de unos{' '}
      <strong className="text-foreground">30 × 20 metros</strong> (plaza mayor, parque,
      pista deportiva o campo de hierba) y la fecha. Nosotros nos ocupamos de todo:
    </p>
    <ul className="space-y-2 list-disc list-inside">
      <li><strong className="text-foreground">Desplazamiento incluido</strong> desde Alcantarilla a cualquier municipio de la Región de Murcia.</li>
      <li><strong className="text-foreground">Montaje en 60 minutos</strong> antes del inicio: obstáculos hinchables y equipamiento listos.</li>
      <li><strong className="text-foreground">Personal cualificado</strong> gestionando todas las partidas durante la jornada.</li>
      <li><strong className="text-foreground">Seguro de RC</strong> incluido. El ayuntamiento no asume responsabilidad sobre la actividad.</li>
      <li><strong className="text-foreground">Documentación completa:</strong> ficha técnica, autorización y certificado de seguridad.</li>
      <li><strong className="text-foreground">Desmontaje y limpieza:</strong> el espacio queda exactamente como lo encontramos.</li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Equipamiento profesional, 100 % seguro
    </h2>
    <p>
      Trabajamos con material homologado de última generación:{' '}
      <strong className="text-foreground">gorras tácticas con sensor infrarrojo</strong>,
      réplicas tácticas con emisor láser sin proyectiles y un campo de obstáculos
      hinchables adaptable a cualquier espacio. Sin dolor, sin riesgo, sin proyectiles, y
      con seguro de responsabilidad civil incluido.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      6 razones por las que los ayuntamientos nos contratan
    </h2>
    <ol className="space-y-2 list-decimal list-inside">
      <li><strong className="text-foreground">Alto impacto ciudadano:</strong> genera expectación y llena el espacio.</li>
      <li><strong className="text-foreground">Atrae al público joven (12-35):</strong> el segmento más difícil de captar.</li>
      <li><strong className="text-foreground">Muy fotogénico para redes:</strong> contenido viral para el ayuntamiento y los vecinos.</li>
      <li><strong className="text-foreground">Bajo coste de gestión:</strong> cero carga de trabajo para el consistorio.</li>
      <li><strong className="text-foreground">Seguridad garantizada:</strong> seguro RC, equipamiento homologado y personal cualificado.</li>
      <li><strong className="text-foreground">Inclusivo:</strong> apto para cualquier nivel, todos juegan en igualdad de condiciones.</li>
    </ol>

    {/* Descarga del dossier */}
    <div className="my-10 p-6 md:p-8 rounded-xl border border-neon-blue/30 bg-neon-blue/5">
      <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">
        Descarga el dossier para ayuntamientos
      </h3>
      <p className="font-body text-sm md:text-base text-muted-foreground mb-4">
        Hemos preparado un dossier comercial completo pensado para concejalías de Festejos,
        Juventud y Cultura: capacidad por jornada, equipamiento, calendario de eventos a lo
        largo del año y condiciones del servicio. Ideal para presentarlo al equipo de
        gobierno o adjuntarlo al expediente.
      </p>
      <Button variant="neon" size="lg" asChild>
        <a
          href="/dossier-laser-tag-ayuntamientos.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="w-5 h-5 mr-2" /> Descargar dossier municipal (PDF)
        </a>
      </Button>
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Reserva la fecha para tu municipio
    </h2>
    <p>
      Operamos en toda la Región de Murcia desde nuestra sede en Alcantarilla. Te enviamos
      presupuesto personalizado, ficha técnica y copia del seguro RC sin compromiso. Si
      además te interesan otros formatos, también organizamos{' '}
      <Link to="/eventos-empresa-laser-tag" className="text-neon-blue hover:underline">
        eventos para empresas
      </Link>{' '}
      y{' '}
      <Link to="/blog/laser-tag-institutos-murcia" className="text-neon-blue hover:underline">
        actividades en institutos
      </Link>
      . Contáctanos por WhatsApp o reserva online y diseñamos la jornada perfecta para tus
      fiestas.
    </p>
  </BlogArticleLayout>
);

export default LaserTagAyuntamientosFiestas;
