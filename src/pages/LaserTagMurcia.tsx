import { Helmet } from 'react-helmet-async';
import { Users, Crosshair, MapPin, PartyPopper, Building2, Calendar } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/recursos/laser-tag-murcia.jpg';

const faqs = [
  {
    question: '¿Cuánto cuesta jugar al laser tag en Murcia?',
    answer: 'Los precios dependen del pack elegido y el número de participantes. Disponemos de packs desde 18€ por persona. Consulta nuestros packs en la web o contacta con nosotros para un presupuesto personalizado.',
  },
  {
    question: '¿A partir de qué edad se puede jugar?',
    answer: 'La edad mínima para participar en nuestras partidas de laser tag es de 8 años. Los menores de 8 años deben ir acompañados por un adulto responsable.',
  },
  {
    question: '¿Cuánto dura la experiencia?',
    answer: 'Ofrecemos sesiones de 90 minutos (varias partidas con descansos) y sesiones de 150 minutos para experiencias más completas. Cada partida individual dura unos 15 minutos con diferentes modos de juego.',
  },
  {
    question: '¿Se puede celebrar cumpleaños?',
    answer: 'Por supuesto. Tenemos packs especiales de cumpleaños que incluyen partidas de laser tag, zona para merienda, invitaciones personalizadas y coordinación completa del evento. Es una de las opciones más populares para cumpleaños infantiles y de adolescentes en Murcia.',
  },
];

const LaserTagMurcia = () => {
  return (
    <>
      <Helmet>
        <title>Laser Tag en Murcia | Shoot and Run - La experiencia más realista</title>
        <meta name="description" content="Laser tag en Murcia para grupos, cumpleaños y eventos. Equipamiento profesional, escenarios indoor y outdoor. Desde 18€/persona. ¡Reserva ahora!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/laser-tag-murcia" />
      </Helmet>

      <SEOLandingLayout
        title="Laser Tag en Murcia: La experiencia más realista para grupos y eventos"
        subtitle="Si estás buscando laser tag en Murcia, en Shoot & Run te ofrecemos una experiencia inmersiva diseñada para grupos, cumpleaños y eventos. Nuestro campo combina estrategia, adrenalina y tecnología para que vivas una partida única desde el primer minuto."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Bloque venta */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            ¿Por qué elegir <span className="text-neon-blue">Shoot & Run</span>?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Users, title: 'Grupos desde 4 personas', desc: 'Partidas adaptadas al tamaño de tu grupo, desde quedadas con amigos hasta grandes eventos.' },
              { icon: Crosshair, title: 'Equipamiento profesional', desc: 'Sin chalecos molestos. Usamos headbands con sensores de alta precisión y réplicas tácticas realistas.' },
              { icon: MapPin, title: 'Escenarios indoor y outdoor', desc: 'Elige entre nuestro campo interior con obstáculos tácticos o la experiencia al aire libre para partidas aún más épicas.' },
              { icon: PartyPopper, title: 'Cumpleaños y despedidas', desc: 'Packs especiales con todo organizado: partidas, merienda, invitaciones y coordinación completa.' },
              { icon: Building2, title: 'Eventos de empresa', desc: 'Team building, jornadas corporativas y actividades de grupo que fomentan el trabajo en equipo y la diversión.' },
              { icon: Calendar, title: 'Reserva fácil y rápida', desc: 'Reserva online en menos de 2 minutos o contáctanos por WhatsApp para resolver cualquier duda.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card/50">
                <item.icon className="w-7 h-7 text-neon-blue mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experiencia */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            Una experiencia de <span className="text-neon-blue">combate inmersiva</span>
          </h2>
          <p>
            En Shoot & Run no encontrarás las típicas pistolas de plástico de otros centros. Nuestro equipamiento profesional incluye <strong className="text-foreground">réplicas tácticas realistas</strong> y un sistema de headbands con sensores de alta sensibilidad que detectan cada impacto con precisión. Sin chalecos incómodos, sin peso extra: solo tú, tu estrategia y la adrenalina del momento.
          </p>
          <p className="mt-4">
            Cada sesión incluye varias partidas con <strong className="text-foreground">diferentes modos de juego</strong>: desde enfrentamientos por equipos hasta supervivencia individual. Nuestro sistema registra estadísticas en tiempo real para que puedas ver quién ha sido el mejor tirador, quién ha sobrevivido más y quién necesita mejorar la puntería.
          </p>
        </div>

        {/* Para quién */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            ¿Para quién es el <span className="text-neon-blue">Laser Tag</span>?
          </h2>
          <p>
            El laser tag es una actividad versátil que se adapta a todo tipo de grupos y ocasiones. En Shoot & Run recibimos desde familias con niños a partir de 8 años hasta grupos de adultos que buscan una experiencia competitiva e intensa.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-neon-blue font-bold">•</span>
              <span><strong className="text-foreground">Cumpleaños infantiles y de adolescentes:</strong> la alternativa más divertida y original a las fiestas clásicas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-blue font-bold">•</span>
              <span><strong className="text-foreground">Quedadas con amigos:</strong> la actividad perfecta para pasar un rato inolvidable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-blue font-bold">•</span>
              <span><strong className="text-foreground">Despedidas de soltero/a:</strong> adrenalina y risas garantizadas antes del gran día.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon-blue font-bold">•</span>
              <span><strong className="text-foreground">Eventos de empresa:</strong> team building diferente que une a los equipos de trabajo.</span>
            </li>
          </ul>
        </div>

        {/* Ubicación */}
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            <MapPin className="w-5 h-5 text-neon-blue inline mr-2" />
            Cómo llegar
          </h2>
          <p>
            Nos encontramos en <strong className="text-foreground">Avda. Fernando III El Santo, 24. 30820-Alcantarilla (Murcia)</strong>. Estamos a solo 10 minutos en coche desde el centro de Murcia, con fácil acceso desde la autovía y aparcamiento gratuito en las inmediaciones.
          </p>
        </div>
      </SEOLandingLayout>
    </>
  );
};

export default LaserTagMurcia;
