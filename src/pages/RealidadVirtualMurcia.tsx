import { Helmet } from 'react-helmet-async';
import { Glasses, Users, Clock, Gamepad2, Star, Crosshair, MapPin, Compass } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/hero-bg.jpg';
import vrExperience from '@/assets/vr-experience.jpg';
import vrAdventure from '@/assets/vr-adventure.png';

const faqs = [
  {
    question: '¿Cuál es la edad mínima para la realidad virtual?',
    answer: 'La edad mínima recomendada para nuestras experiencias de realidad virtual es de 8 años, aunque depende de la experiencia elegida. Algunas experiencias de terror están recomendadas para mayores de 12 años.',
  },
  {
    question: '¿Cuánto cuesta una sesión de realidad virtual?',
    answer: 'Los precios varían según el pack elegido. Consulta nuestros packs en la web o contacta con nosotros para un presupuesto adaptado a tu grupo.',
  },
  {
    question: '¿Cuánto dura una sesión de realidad virtual?',
    answer: 'Las sesiones tienen una duración de entre 90 y 150 minutos, dependiendo del pack elegido. Cada experiencia individual dura entre 15 y 30 minutos.',
  },
  {
    question: '¿Puedo marearme con la realidad virtual?',
    answer: 'Nuestro sistema de Free Roaming minimiza las posibilidades de mareo porque el movimiento físico coincide con el virtual. No obstante, si algún participante se siente incómodo, puede parar en cualquier momento.',
  },
  {
    question: '¿Necesito experiencia previa con VR?',
    answer: 'No, en absoluto. Nuestros monitores explican el funcionamiento y os acompañan durante toda la experiencia. La mayoría de nuestros clientes prueban la VR por primera vez con nosotros.',
  },
  {
    question: '¿Se puede combinar VR con laser tag?',
    answer: 'Sí, ofrecemos packs combinados de laser tag + realidad virtual para una experiencia completa. Es la opción más popular para grupos que quieren probar ambas actividades.',
  },
];

const RealidadVirtualMurcia = () => {
  return (
    <>
      <Helmet>
        <title>Realidad Virtual en Murcia | VR Free Roaming | Shoot and Run</title>
        <meta name="description" content="Experiencias de realidad virtual Free Roaming en Murcia. Muévete libremente en mundos virtuales: shooters, aventuras y escape rooms VR. ¡Reserva tu sesión!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/realidad-virtual-murcia" />
      </Helmet>

      <SEOLandingLayout
        title="Realidad Virtual Free Roaming en Murcia: Entra en Otro Mundo"
        subtitle="Experimenta la realidad virtual como nunca antes. Nuestro sistema Free Roaming te permite moverte libremente por mundos virtuales inmersivos. Shooters, aventuras y escape rooms en VR."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Intro */}
        <div>
          <p>
            La <strong className="text-foreground">realidad virtual Free Roaming</strong> es la evolución definitiva del entretenimiento inmersivo. A diferencia de los sistemas VR convencionales donde te sientas con un casco y un mando, en Shoot and Run te equipamos con un sistema inalámbrico que te permite <strong className="text-foreground">caminar, correr, agacharte y explorar</strong> mundos virtuales con total libertad de movimiento.
          </p>
          <p className="mt-4">
            Nuestras instalaciones en Alcantarilla (Murcia) cuentan con un espacio de juego dedicado donde hasta 4 jugadores simultáneos pueden compartir la misma experiencia virtual. Cada movimiento que haces en el mundo real se replica exactamente en el mundo virtual, creando una <strong className="text-foreground">sensación de inmersión total</strong>.
          </p>
        </div>

        {/* What is Free Roaming */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={vrExperience} alt="Realidad virtual Free Roaming en Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              ¿Qué es el <span className="text-neon-blue">Free Roaming VR</span>?
            </h2>
            <p>
              Free Roaming significa que no estás atado a un sitio fijo. Llevas un casco VR inalámbrico y una mochila con el sistema de tracking que sigue tus movimientos en tiempo real. Caminas de verdad, te agachas de verdad, y apuntas con tus propias manos.
            </p>
            <p className="mt-4">
              Esto hace que la experiencia sea mucho más inmersiva y física que cualquier sistema VR doméstico. Además, al compartir el espacio con otros jugadores, podéis veros en el mundo virtual y colaborar o competir entre vosotros.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Catálogo de <span className="text-neon-blue">Experiencias VR</span>
          </h2>
          <p className="mb-6">
            Disponemos de un amplio catálogo de experiencias virtuales para todos los gustos y edades. Desde shooters de acción hasta aventuras cooperativas y escape rooms virtuales.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Crosshair, title: 'Shooters', desc: 'Enfréntate a oleadas de enemigos en escenarios futuristas. Acción pura con armas virtuales que sientes en tus manos.', color: 'text-accent' },
              { icon: Compass, title: 'Aventuras', desc: 'Explora mundos fantásticos, resuelve puzles y vive historias interactivas en primera persona con tus amigos.', color: 'text-neon-blue' },
              { icon: Gamepad2, title: 'Escape Rooms VR', desc: 'Resuelve enigmas en entornos virtuales imposibles en la vida real. Trabaja en equipo contra el reloj.', color: 'text-secondary' },
            ].map((cat, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card/50 text-center">
                <cat.icon className={`w-8 h-8 ${cat.color} mx-auto mb-3`} />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{cat.title}</h3>
                <p className="text-sm">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Second image */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Una Experiencia que no <span className="text-neon-blue">Olvidarás</span>
            </h2>
            <p>
              La realidad virtual Free Roaming es una experiencia que hay que vivir para entender. No importa si eres un gamer experimentado o si nunca has probado un casco VR: la sensación de estar <strong className="text-foreground">dentro de otro mundo</strong>, caminando por paisajes imposibles y interactuando con objetos virtuales que casi puedes tocar, es algo que sorprende a todo el mundo.
            </p>
            <p className="mt-4">
              Nuestros clientes destacan especialmente la sensación de presencia: <strong className="text-foreground">tu cerebro se convence de que estás en otro lugar</strong>. Los escenarios de terror provocan sustos reales, las alturas generan vértigo auténtico y las batallas hacen que tu corazón se acelere.
            </p>
            <p className="mt-4">
              Es la actividad perfecta para grupos de amigos, cumpleaños, despedidas y eventos de empresa que buscan algo verdaderamente diferente y memorable.
            </p>
          </div>
          <img src={vrAdventure} alt="Aventura de realidad virtual en Shoot and Run Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
        </div>

        {/* Who */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            ¿Para quién es la <span className="text-neon-blue">Realidad Virtual</span>?
          </h2>
          <p>
            Nuestras experiencias VR se adaptan a diferentes perfiles y edades. Desde aventuras aptas para toda la familia hasta experiencias de terror para los más atrevidos. No necesitas experiencia previa ni ser un amante de la tecnología: nuestros monitores te guían en todo momento.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { title: 'Familias', desc: 'Experiencias cooperativas aptas para niños a partir de 8 años. Una actividad que padres e hijos disfrutan juntos.' },
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

        {/* Location */}
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            <MapPin className="w-5 h-5 text-neon-blue inline mr-2" />
            Dónde encontrarnos
          </h2>
          <p>
            Nuestro centro de realidad virtual y laser tag se encuentra en <strong className="text-foreground">Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)</strong>. A solo 10 minutos del centro de Murcia, con fácil acceso en coche y aparcamiento gratuito en la zona. También accesible en transporte público.
          </p>
        </div>
      </SEOLandingLayout>
    </>
  );
};

export default RealidadVirtualMurcia;
