import { Link } from 'react-router-dom';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import vrCatalogo from '@/assets/recursos/vr-variedad-juegos.png';
import vrNoMarea from '@/assets/recursos/vr-free-roam-no-marea.jpg';

const CatalogoJuegosVRMurcia = () => (
  <BlogArticleLayout slug="catalogo-juegos-vr-murcia">
    <p>
      Una de las preguntas que más nos hacen en{' '}
      <strong className="text-foreground">
        <span translate="no">Shoot and Run</span>
      </strong>{' '}
      es: «¿y a qué se juega en la realidad virtual?». La respuesta corta:{' '}
      <strong className="text-foreground">a más de 20 experiencias diferentes</strong>,
      aptas para todas las edades a partir de 12 años y con capacidad de hasta{' '}
      <strong className="text-foreground">12 jugadores simultáneos</strong> dentro de la
      misma partida.
    </p>

    <div className="my-8 rounded-xl overflow-hidden border border-border">
      <img
        src={vrCatalogo}
        alt="Catálogo de más de 20 juegos de realidad virtual disponibles en Shoot and Run Murcia"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Más de 20 juegos, tres grandes categorías
    </h2>
    <p>
      Para que cada grupo encuentre lo suyo, organizamos el catálogo en tres familias
      claras. Da igual si vienes con peques de 12, con un grupo de amigos veinteañeros o
      con compañeros de la oficina: hay experiencia para todos.
    </p>

    <h3 className="font-display text-lg md:text-xl font-bold text-foreground mt-6">
      🎯 Shooters y acción
    </h3>
    <p>
      Para los que buscan adrenalina pura. Equipos enfrentados, objetivos que cumplir,
      hordas que sobrevivir. Desde batallas tipo arena hasta supervivencia frente a
      zombies o invasiones futuristas. Si el grupo viene con ganas de marcha, este es el
      camino.
    </p>

    <h3 className="font-display text-lg md:text-xl font-bold text-foreground mt-6">
      🗺️ Aventura y exploración
    </h3>
    <p>
      Mundos enteros para recorrer caminando: cuevas, planetas alienígenas, ciudades
      futuristas, escenarios fantásticos. Ideales para quienes prefieren la inmersión y el
      descubrimiento por encima del combate. Funcionan muy bien con familias y grupos
      mixtos.
    </p>

    <h3 className="font-display text-lg md:text-xl font-bold text-foreground mt-6">
      🧩 Escape rooms y puzles
    </h3>
    <p>
      Cooperación pura. Os encerramos (virtualmente) en un escenario y tenéis que resolver
      enigmas en equipo para salir. Perfectos para{' '}
      <Link to="/eventos-empresa-laser-tag" className="text-neon-blue hover:underline">
        eventos de empresa y team building
      </Link>
      , ya que obligan a comunicarse, repartir roles y trabajar juntos bajo presión.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Hasta 12 jugadores en la misma partida
    </h2>
    <p>
      Nuestra arena de <strong className="text-foreground">VR Free Roaming</strong>{' '}
      permite que hasta 12 personas compartan el mismo mundo virtual a la vez, viéndose
      como avatares y pudiendo interactuar entre ellos. Esto es lo que diferencia una
      experiencia memorable de jugar solo en casa: aquí{' '}
      <strong className="text-foreground">vivís la aventura juntos</strong>.
    </p>

    <div className="my-8 rounded-xl overflow-hidden border border-border">
      <img
        src={vrNoMarea}
        alt="Grupo de jugadoras probando gafas de realidad virtual Free Roam"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Apto para todas las edades (desde 12 años)
    </h2>
    <p>
      Tenemos juegos calibrados para distintos perfiles: opciones suaves y familiares,
      experiencias intermedias y títulos más intensos para quienes buscan emociones
      fuertes. Cuando reservas, te orientamos para que elijas los juegos que mejor encajan
      con tu grupo, su edad y lo que esperáis de la sesión.
    </p>
    <ul className="list-disc pl-6 space-y-2">
      <li>
        <strong className="text-foreground">Cumpleaños (12+):</strong> mezclamos shooter y
        aventura para que no se haga repetitivo.
      </li>
      <li>
        <strong className="text-foreground">Familias:</strong> exploración y puzles
        cooperativos, todos jugando a la vez.
      </li>
      <li>
        <strong className="text-foreground">Despedidas y grupos de amigos:</strong>{' '}
        shooters competitivos por equipos.
      </li>
      <li>
        <strong className="text-foreground">Empresas:</strong> escape rooms VR y retos
        cooperativos para reforzar el equipo.
      </li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      ¿Cómo se elige el juego?
    </h2>
    <p>
      No hace falta que vengas con la decisión tomada. Cuando llegáis, nuestro equipo os
      explica las opciones disponibles y os recomienda los títulos más adecuados según el
      grupo. Y si el plan es largo,{' '}
      <strong className="text-foreground">podéis combinar varios juegos</strong> en la
      misma sesión para no aburriros nunca.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Reserva tu experiencia VR en Murcia
    </h2>
    <p>
      Si quieres ver el catálogo completo y reservar, pásate por nuestra{' '}
      <Link to="/realidad-virtual-murcia" className="text-neon-blue hover:underline">
        página de realidad virtual en Murcia
      </Link>{' '}
      o contáctanos por WhatsApp para que te recomendemos los juegos perfectos para tu
      grupo.
    </p>
  </BlogArticleLayout>
);

export default CatalogoJuegosVRMurcia;
