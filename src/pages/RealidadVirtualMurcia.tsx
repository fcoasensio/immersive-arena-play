import { Helmet } from 'react-helmet-async';
import { Glasses, Users, Clock, Gamepad2, Star, Crosshair, MapPin, Compass } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import VRGamesCatalog from '@/components/VRGamesCatalog';
import heroBg from '@/assets/recursos/realidad-virtual-murcia.jpg';

const faqs = [
  {
    question: '¿Cuánto cuesta una sesión de realidad virtual?',
    answer: 'Los precios varían según el pack elegido. Consulta nuestros packs en la web o contacta con nosotros para un presupuesto adaptado a tu grupo.',
  },
  {
    question: '¿A partir de qué edad se puede jugar?',
    answer: 'La edad mínima recomendada es de 12 años, aunque depende de la experiencia elegida. Algunas experiencias de terror están recomendadas para mayores de 16 años.',
  },
  {
    question: '¿Cuánto dura la experiencia?',
    answer: 'Las sesiones tienen una duración de entre 90 y 150 minutos, dependiendo del pack elegido. Cada experiencia individual dura entre 15 y 30 minutos.',
  },
  {
    question: '¿Se puede celebrar cumpleaños?',
    answer: 'Sí, puedes añadir realidad virtual a tu cumpleaños o reservar una sesión VR exclusiva. Compatible con nuestros packs de laser tag para una fiesta completa.',
  },
  {
    question: '¿Qué pasa si el número real de jugadores no coincide con mi reserva?',
    answer: 'No pasa nada. El número de jugadores que indicas al reservar es orientativo: el importe final se calcula con los jugadores reales que asistan el día de la actividad.',
  },
];

const RealidadVirtualMurcia = () => {
  return (
    <>
      <Helmet>
        <title>Realidad Virtual en Murcia | VR Free Roaming | Shoot and Run</title>
        <meta name="description" content="Realidad virtual en Murcia para grupos. Juegos multijugador, escape rooms VR y experiencias inmersivas Free Roaming. ¡Reserva tu experiencia VR!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/realidad-virtual-murcia" />
      </Helmet>

      <SEOLandingLayout
        title="Realidad Virtual en Murcia: Experiencias inmersivas para grupos"
        subtitle="Descubre la mejor experiencia de realidad virtual en Murcia con juegos multijugador, escape rooms VR y experiencias únicas para grupos."
        heroImage={heroBg}
        heroImagePosition="center 25%"
        faqs={faqs}
      >
        {/* Qué es */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            ¿Qué es el <span className="text-neon-blue">Free Roaming VR</span>?
          </h2>
          <p>
            La <strong className="text-foreground">realidad virtual Free Roaming</strong> es la evolución definitiva del entretenimiento inmersivo. A diferencia de los sistemas VR convencionales donde te sientas con un casco y un mando, en Shoot & Run te equipamos con un sistema inalámbrico que te permite <strong className="text-foreground">caminar, correr, agacharte y explorar</strong> mundos virtuales con total libertad de movimiento.
          </p>
          <p className="mt-4">
            Nuestras instalaciones en Alcantarilla (Murcia) cuentan con un espacio de juego dedicado donde hasta 12 jugadores simultáneos pueden compartir la misma experiencia virtual. Cada movimiento que haces en el mundo real se replica exactamente en el mundo virtual, creando una sensación de inmersión total.
          </p>
        </div>

        {/* Catálogo */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Catálogo de <span className="text-neon-blue">Experiencias VR</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Crosshair, title: 'Juegos multijugador', desc: 'Enfréntate a oleadas de enemigos o compite con tus amigos en escenarios futuristas. Acción pura con libertad de movimiento total.' },
              { icon: Gamepad2, title: 'Escape Rooms VR', desc: 'Resuelve enigmas en entornos virtuales imposibles en la vida real. Trabaja en equipo contra el reloj en escenarios alucinantes.' },
              { icon: Compass, title: 'Experiencias únicas', desc: 'Explora mundos fantásticos, vive aventuras interactivas y descubre experiencias que solo son posibles en realidad virtual.' },
            ].map((cat, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card/50 text-center">
                <cat.icon className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{cat.title}</h3>
                <p className="text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Catálogo completo de juegos */}
        <VRGamesCatalog />

        {/* Inmersión */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            Una experiencia que no <span className="text-neon-blue">olvidarás</span>
          </h2>
          <p>
            No importa si eres un gamer experimentado o si nunca has probado un casco VR: la sensación de estar <strong className="text-foreground">dentro de otro mundo</strong>, caminando por paisajes imposibles e interactuando con objetos virtuales que casi puedes tocar, es algo que sorprende a todo el mundo.
          </p>
          <p className="mt-4">
            Nuestros clientes destacan especialmente la sensación de presencia: <strong className="text-foreground">tu cerebro se convence de que estás en otro lugar</strong>. Los escenarios de terror provocan sustos reales, las alturas generan vértigo auténtico y las batallas hacen que tu corazón se acelere.
          </p>
        </div>

        {/* Para quién */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            ¿Para quién es la <span className="text-neon-blue">Realidad Virtual</span>?
          </h2>
          <p>
            Nuestras experiencias VR se adaptan a diferentes perfiles y edades. No necesitas experiencia previa ni ser un amante de la tecnología: nuestros monitores te guían en todo momento.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { title: 'Familias', desc: 'Experiencias cooperativas aptas para niños a partir de 12 años. Una actividad que padres e hijos disfrutan juntos.' },
              { title: 'Grupos de amigos', desc: 'Competid o colaborad en experiencias multijugador. La VR genera momentos memorables y muchas risas.' },
              { title: 'Cumpleaños', desc: 'Añade una experiencia VR a tu cumpleaños para hacerlo aún más especial. Compatible con nuestros packs de laser tag.' },
              { title: 'Eventos de empresa', desc: 'Team building innovador que sorprende a todo el equipo. Disponible como actividad individual o combinada con laser tag.' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-display text-sm font-bold text-neon-blue mb-1">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ubicación */}
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            <MapPin className="w-5 h-5 text-neon-blue inline mr-2" />
            Dónde encontrarnos
          </h2>
          <p>
            Nuestro centro de realidad virtual y laser tag se encuentra en <strong className="text-foreground">Avda. Fernando III El Santo, 24. 30820-Alcantarilla (Murcia)</strong>. A solo 10 minutos del centro de Murcia, con fácil acceso en coche y aparcamiento gratuito en la zona.
          </p>
        </div>
      </SEOLandingLayout>
    </>
  );
};

export default RealidadVirtualMurcia;
