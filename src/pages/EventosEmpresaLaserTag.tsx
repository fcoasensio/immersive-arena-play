import { Helmet } from 'react-helmet-async';
import { Building2, Users, Target, Trophy, Handshake, Clock, Star, Zap } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/hero-bg.jpg';
import laserEquip from '@/assets/equipamiento-lasertag-real.png';
import laserSniper from '@/assets/laser-tag-sniper.jpg';

const faqs = [
  {
    question: '¿Cuántas personas pueden participar en un evento de empresa?',
    answer: 'Nuestras partidas admiten entre 4 y 16 jugadores simultáneos. Para grupos más grandes organizamos turnos y torneos con clasificaciones, así todos participan y la competición se mantiene durante toda la jornada.',
  },
  {
    question: '¿Cuánto cuesta un evento corporativo de laser tag?',
    answer: 'El precio varía según el número de participantes y la duración del evento. Contacta con nosotros para recibir un presupuesto personalizado adaptado a las necesidades de tu empresa.',
  },
  {
    question: '¿Cuánto dura un evento de empresa?',
    answer: 'Los eventos corporativos suelen durar entre 90 y 270 minutos dependiendo del formato. Podemos adaptar la duración a las necesidades de tu equipo.',
  },
  {
    question: '¿Se puede combinar laser tag con otras actividades?',
    answer: 'Sí, ofrecemos la posibilidad de combinar laser tag con realidad virtual para crear un evento más completo y variado. Consulta nuestros packs combinados.',
  },
  {
    question: '¿Emitís factura para la empresa?',
    answer: 'Sí, emitimos factura con todos los datos fiscales necesarios para la contabilidad de tu empresa.',
  },
  {
    question: '¿Es seguro para personas que nunca han jugado?',
    answer: 'Totalmente. El laser tag no implica impacto físico. Nuestros monitores explican las reglas antes de cada partida y acompañan al grupo durante toda la experiencia.',
  },
];

const EventosEmpresaLaserTag = () => {
  return (
    <>
      <Helmet>
        <title>Eventos de Empresa Laser Tag Murcia | Team Building | Shoot and Run</title>
        <meta name="description" content="Team building y eventos corporativos con laser tag en Murcia. Fortalece tu equipo con actividades competitivas y divertidas. Presupuesto personalizado." />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/eventos-empresa-laser-tag" />
      </Helmet>

      <SEOLandingLayout
        title="Eventos de Empresa y Team Building con Laser Tag en Murcia"
        subtitle="Fortalece los lazos de tu equipo con una experiencia de laser tag corporativa. Competición, estrategia y diversión para cohesionar equipos de trabajo."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Intro */}
        <div>
          <p>
            El laser tag es una de las actividades de <strong className="text-foreground">team building</strong> más efectivas y divertidas que existen. En Shoot and Run diseñamos eventos corporativos a medida que combinan competición, estrategia y trabajo en equipo para fortalecer las relaciones entre compañeros de trabajo.
          </p>
          <p className="mt-4">
            Ya sea para una jornada de team building, una celebración de fin de año, una despedida de soltero/a entre compañeros o simplemente un día diferente fuera de la oficina, nuestras instalaciones en Alcantarilla (Murcia) son el escenario perfecto para crear <strong className="text-foreground">recuerdos que refuercen la cohesión de tu equipo</strong>.
          </p>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Beneficios del Laser Tag como <span className="text-neon-blue">Team Building</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Handshake, title: 'Mejora la comunicación', desc: 'Los jugadores deben coordinarse y comunicarse constantemente para ganar. Se generan dinámicas de equipo naturales.' },
              { icon: Target, title: 'Fomenta el liderazgo', desc: 'En cada partida surgen líderes naturales que organizan la estrategia del equipo. Una forma de descubrir talentos.' },
              { icon: Trophy, title: 'Competición sana', desc: 'La rivalidad entre equipos genera motivación y compromiso. Las estadísticas en tiempo real alimentan la competitividad.' },
              { icon: Zap, title: 'Rompe la rutina', desc: 'Sacar al equipo de su zona de confort en un entorno lúdico reduce el estrés y mejora las relaciones interpersonales.' },
              { icon: Users, title: 'Integra a todos', desc: 'El laser tag no requiere forma física especial. Todos pueden participar independientemente de su condición.' },
              { icon: Star, title: 'Resultados medibles', desc: 'Al final de cada partida, las estadísticas muestran el rendimiento de cada jugador y equipo.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg border border-border bg-card/50">
                <item.icon className="w-6 h-6 text-neon-blue shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={laserEquip} alt="Equipamiento laser tag eventos empresa Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Formatos de <span className="text-neon-blue">Eventos Corporativos</span>
            </h2>
            <p>
              Adaptamos cada evento a las necesidades de tu empresa. Estos son algunos de los formatos más populares:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-2">
                <Trophy className="w-4 h-4 text-neon-blue shrink-0 mt-1" />
                <span><strong className="text-foreground">Torneo por departamentos:</strong> Enfrenta a los diferentes departamentos en un campeonato con eliminatorias, semifinales y final.</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 text-neon-blue shrink-0 mt-1" />
                <span><strong className="text-foreground">Jornada de integración:</strong> Mezcla personas de diferentes equipos para que se conozcan y trabajen juntas en las partidas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-neon-blue shrink-0 mt-1" />
                <span><strong className="text-foreground">Experiencia combinada:</strong> Combina laser tag con realidad virtual para un evento más completo y variado.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Cómo Organizar tu <span className="text-neon-blue">Evento de Empresa</span>
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Cuéntanos qué necesitas', desc: 'Contacta con nosotros por WhatsApp, email o teléfono. Cuéntanos el número de personas, la fecha deseada y el tipo de evento.' },
              { step: '2', title: 'Presupuesto personalizado', desc: 'Preparamos un presupuesto adaptado a tus necesidades con diferentes opciones de duración y formato.' },
              { step: '3', title: 'Confirmación y logística', desc: 'Una vez aprobado, coordinamos todos los detalles logísticos para que el día del evento todo salga perfecto.' },
              { step: '4', title: 'Día del evento', desc: 'Nuestro equipo se encarga de todo: recepción del grupo, briefing, gestión de partidas y clasificaciones.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold text-neon-blue">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second image */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Despedidas de Soltero/a y <span className="text-neon-blue">Celebraciones</span>
            </h2>
            <p>
              Además de eventos corporativos, somos especialistas en <strong className="text-foreground">despedidas de soltero y soltera</strong>. Si buscas una actividad original y divertida para celebrar con tu grupo de amigos antes del gran día, el laser tag es la opción perfecta.
            </p>
            <p className="mt-4">
              Las despedidas suelen incluir partidas competitivas con sistema de puntuación, coronación del equipo ganador y momentos memorables que no olvidaréis. Podéis personalizar la experiencia con temáticas especiales y combinarla con realidad virtual para un evento aún más completo.
            </p>
            <p className="mt-4">
              También organizamos <strong className="text-foreground">celebraciones de fin de año, aniversarios de empresa y jornadas de incentivos</strong>. Cualquier excusa es buena para sacar a tu equipo de la oficina y vivir una experiencia diferente.
            </p>
          </div>
          <img src={laserSniper} alt="Laser tag despedidas y eventos en Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
        </div>

        {/* CTA box */}
        <div className="p-6 rounded-xl border border-neon-blue/30 bg-neon-blue/5">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            <Building2 className="w-5 h-5 text-neon-blue inline mr-2" />
            Solicita Presupuesto para tu Empresa
          </h2>
          <p>
            Cada evento es único y merece un presupuesto adaptado. Contacta con nosotros y te preparamos una propuesta a medida para tu equipo. Sin compromiso.
          </p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Duración flexible:</strong> de 90 a 270 minutos</li>
            <li className="flex items-center gap-2"><Users className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Grupos:</strong> desde 4 personas</li>
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Factura:</strong> disponible para empresas</li>
          </ul>
        </div>
      </SEOLandingLayout>
    </>
  );
};

export default EventosEmpresaLaserTag;
