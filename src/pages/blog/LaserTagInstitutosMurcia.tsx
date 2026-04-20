import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import laserInstituto from '@/assets/recursos/laser-tag-instituto-patio.jpg';

const LaserTagInstitutosMurcia = () => (
  <BlogArticleLayout slug="laser-tag-institutos-murcia">
    <p>
      ¿Buscas una actividad diferente para tu instituto que motive al alumnado, trabaje
      competencias clave y encima no implique desplazamientos ni autobuses? En{' '}
      <strong className="text-foreground">Shoot and Run</strong> llevamos el{' '}
      <strong className="text-foreground">láser tag outdoor</strong> directamente al patio
      de tu centro: montamos un campo de obstáculos hinchables profesional y gestionamos la
      jornada completa para que vosotros solo tengáis que disfrutar.
    </p>

    <div className="my-8 rounded-xl overflow-hidden border border-border">
      <img
        src={laserInstituto}
        alt="Campo de laser tag montado en patio deportivo de instituto con obstáculos hinchables"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      La batalla llega a tu instituto
    </h2>
    <p>
      El concepto es simple: el centro educativo solo pone el espacio (un patio deportivo o
      campo de hierba de unos <strong className="text-foreground">30 × 20 metros</strong>) y
      nuestro equipo se encarga del resto. Llegamos desde Alcantarilla (Murcia), montamos el
      campo en 60 minutos y desmontamos al terminar. El patio queda exactamente como lo
      encontramos.
    </p>

    <ul className="space-y-2 list-disc list-inside">
      <li><strong className="text-foreground">Duración:</strong> 3,5 horas de actividad (10:00 – 13:30)</li>
      <li><strong className="text-foreground">Capacidad:</strong> hasta +200 alumnos en una sola jornada</li>
      <li><strong className="text-foreground">Transporte:</strong> 0 € de coste para el centro</li>
      <li><strong className="text-foreground">Burocracia:</strong> entregamos seguro RC, ficha técnica y autorización</li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Modo "Rueda Infinita": +200 alumnos sin tiempos muertos
    </h2>
    <p>
      El gran problema de las actividades escolares con muchos alumnos suele ser la espera.
      Para resolverlo hemos diseñado el modo{' '}
      <strong className="text-foreground">Rueda Infinita</strong>: siempre hay 16-18
      jugadores activos en el campo y, cada vez que un jugador acumula 4-5 eliminaciones,
      sale y entra el siguiente al instante. La espera máxima por turno es de apenas 3-5
      minutos, y cada alumno juega varias veces a lo largo de la jornada.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Equipamiento profesional y 100 % seguro
    </h2>
    <p>
      Usamos el mismo material que en nuestras instalaciones de Murcia:{' '}
      <strong className="text-foreground">gorras tácticas con sensor infrarrojo</strong> en
      la cabeza, réplicas tácticas con emisor láser de hasta 200 metros de alcance y un{' '}
      <strong className="text-foreground">sistema de puntuación electrónico en tiempo
      real</strong> que muestra estadísticas individuales y por equipos al finalizar cada
      partida.
    </p>
    <p>
      Sin proyectiles, sin dolor, sin riesgo. Es una actividad{' '}
      <strong className="text-foreground">100 % inclusiva</strong>: apta para cualquier
      nivel de condición física y para todas las etapas de la ESO.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Valor pedagógico alineado con la LOMLOE
    </h2>
    <p>
      No es solo diversión: la actividad trabaja de forma directa cuatro competencias clave
      del currículo de Educación Secundaria, por lo que es válida como{' '}
      <strong className="text-foreground">actividad complementaria oficial</strong> y
      evaluable en Educación Física y Tutoría.
    </p>
    <ul className="space-y-2 list-disc list-inside">
      <li><strong className="text-foreground">Competencia social y cívica:</strong> trabajo en equipo, roles complementarios y comunicación bajo presión.</li>
      <li><strong className="text-foreground">Autonomía e iniciativa personal:</strong> toma de decisiones rápidas, planificación táctica y gestión emocional.</li>
      <li><strong className="text-foreground">Competencia motriz y salud:</strong> actividad física intensa al aire libre, coordinación, agilidad y resistencia.</li>
      <li><strong className="text-foreground">Competencia ciudadana:</strong> fair play, respeto al adversario y cumplimiento de normas.</li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Cómo es la jornada (cronograma tipo)
    </h2>
    <ul className="space-y-2 list-disc list-inside">
      <li><strong className="text-foreground">09:00</strong> – Llegada del equipo y montaje del campo (60 min).</li>
      <li><strong className="text-foreground">10:00</strong> – Briefing: equipamiento, normas y seguridad.</li>
      <li><strong className="text-foreground">10:30 – 12:30</strong> – Bloque principal de Rueda Infinita.</li>
      <li><strong className="text-foreground">12:30</strong> – Pausa de hidratación y marcadores parciales (15 min).</li>
      <li><strong className="text-foreground">12:45 – 13:15</strong> – Ronda final con mayor intensidad.</li>
      <li><strong className="text-foreground">13:30</strong> – Ceremonia de premios, fotos grupales y desmontaje.</li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Por qué los centros nos eligen
    </h2>
    <ol className="space-y-2 list-decimal list-inside">
      <li><strong className="text-foreground">Sin desplazamiento del alumnado:</strong> nada de autobuses, permisos ni costes para las familias.</li>
      <li><strong className="text-foreground">Máxima seguridad:</strong> tecnología láser sin proyectiles y seguro de responsabilidad civil incluido.</li>
      <li><strong className="text-foreground">Equipamiento de competición:</strong> material homologado, no un juguete.</li>
      <li><strong className="text-foreground">100 % inclusiva:</strong> todos participan en igualdad de condiciones.</li>
      <li><strong className="text-foreground">Experiencia memorable:</strong> la actividad de la que hablarán todo el curso.</li>
    </ol>

    {/* Descarga del dossier */}
    <div className="my-10 p-6 md:p-8 rounded-xl border border-neon-blue/30 bg-neon-blue/5">
      <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2">
        Descarga el dossier completo para tu centro
      </h3>
      <p className="font-body text-sm md:text-base text-muted-foreground mb-4">
        Si formas parte del equipo directivo, AMPA o departamento de Educación Física,
        descarga la presentación oficial con todos los detalles, condiciones y fotos del
        campo real. Ideal para compartir en claustro o en la junta del centro.
      </p>
      <Button variant="neon" size="lg" asChild>
        <a
          href="/dossier-laser-tag-centros-educativos.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="w-5 h-5 mr-2" /> Descargar dossier (PDF)
        </a>
      </Button>
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Reserva la fecha para tu instituto
    </h2>
    <p>
      Operamos en toda la Región de Murcia desde nuestra sede en Alcantarilla. Confirmamos
      fecha y espacio en menos de 24 horas. Si quieres organizar también{' '}
      <Link to="/eventos-empresa-laser-tag" className="text-neon-blue hover:underline">
        eventos de empresa
      </Link>{' '}
      o{' '}
      <Link to="/cumpleanos-laser-tag-murcia" className="text-neon-blue hover:underline">
        cumpleaños
      </Link>
      , también podemos ayudarte. Escríbenos por WhatsApp o reserva online y diseñamos la
      jornada perfecta para tu centro.
    </p>
  </BlogArticleLayout>
);

export default LaserTagInstitutosMurcia;
