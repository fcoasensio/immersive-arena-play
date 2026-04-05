import { Helmet } from 'react-helmet-async';
import { Building2, Users, Target, Trophy, Handshake, Clock, Star, Zap, Settings } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/hero-bg.jpg';

const faqs = [
  {
    question: '¿Cuánto cuesta un evento de empresa de laser tag?',
    answer: 'El precio varía según el número de participantes y la duración del evento. Contacta con nosotros para recibir un presupuesto personalizado adaptado a las necesidades de tu empresa.',
  },
  {
    question: '¿A partir de qué edad se puede jugar?',
    answer: 'La edad mínima es de 8 años, aunque los eventos corporativos suelen ser para adultos. El laser tag no requiere condición física especial, así que todo el equipo puede participar.',
  },
  {
    question: '¿Cuánto dura la experiencia?',
    answer: 'Los eventos corporativos suelen durar entre 90 y 270 minutos dependiendo del formato. Podemos adaptar la duración a las necesidades de tu equipo.',
  },
  {
    question: '¿Se puede celebrar cumpleaños?',
    answer: 'Sí, también organizamos cumpleaños y celebraciones. Consulta nuestra página de cumpleaños para más información sobre los packs disponibles.',
  },
];

const EventosEmpresaLaserTag = () => {
  return (
    <>
      <Helmet>
        <title>Eventos de Empresa Laser Tag Murcia | Team Building | Shoot and Run</title>
        <meta name="description" content="Team building y eventos corporativos con laser tag en Murcia. Dinámicas adaptadas, actividades competitivas y experiencias personalizadas. Solicita presupuesto." />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/eventos-empresa-laser-tag" />
      </Helmet>

      <SEOLandingLayout
        title="Eventos de empresa en Murcia con Laser Tag: Team Building que funciona"
        subtitle="Si buscas una actividad de team building en Murcia, el laser tag es una opción dinámica que mejora la comunicación, el liderazgo y el trabajo en equipo."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Bloque venta */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            ¿Qué ofrecemos para <span className="text-neon-blue">tu empresa</span>?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Handshake, title: 'Dinámicas adaptadas a empresas', desc: 'Diseñamos cada sesión según los objetivos de tu equipo: integración de nuevos miembros, cohesión, liderazgo o simplemente diversión.' },
              { icon: Trophy, title: 'Actividades competitivas y cooperativas', desc: 'Torneos entre departamentos, partidas colaborativas o formatos mixtos. Tú eliges el enfoque que mejor se adapte.' },
              { icon: Settings, title: 'Experiencias personalizadas', desc: 'Adaptamos duración, formato, número de participantes y combinación de actividades (laser tag + realidad virtual) a tu medida.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card/50 text-center">
                <item.icon className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Beneficios */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            Beneficios del Laser Tag como <span className="text-neon-blue">Team Building</span>
          </h2>
          <p>
            El laser tag no es solo diversión: es una herramienta real de <strong className="text-foreground">desarrollo de equipos</strong>. Las dinámicas de juego generan situaciones donde los participantes deben comunicarse, tomar decisiones rápidas y confiar en sus compañeros.
          </p>
          <ul className="mt-4 space-y-3">
            {[
              { icon: Target, text: 'Mejora la comunicación interna del equipo de forma natural y divertida' },
              { icon: Users, text: 'Integra a todos los participantes independientemente de su condición física' },
              { icon: Zap, text: 'Rompe la rutina y reduce el estrés sacando al equipo de su zona de confort' },
              { icon: Star, text: 'Descubre líderes naturales y fortalece las relaciones interpersonales' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <item.icon className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cómo funciona */}
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

        {/* Despedidas */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            También para despedidas y <span className="text-neon-blue">celebraciones</span>
          </h2>
          <p>
            Además de eventos corporativos, organizamos <strong className="text-foreground">despedidas de soltero/a, celebraciones de fin de año, aniversarios de empresa y jornadas de incentivos</strong>. Cualquier excusa es buena para vivir una experiencia diferente fuera de la oficina.
          </p>
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
