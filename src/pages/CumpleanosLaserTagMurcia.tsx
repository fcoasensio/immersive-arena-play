import { Helmet } from 'react-helmet-async';
import { Cake, Users, Clock, Gift, Star, PartyPopper, Gamepad2, UserCheck } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/hero-bg.jpg';

const faqs = [
  {
    question: '¿Cuánto cuesta un cumpleaños de laser tag en Murcia?',
    answer: 'El precio del pack de cumpleaños es de 25€ por participante (mínimo 8 jugadores). Incluye partidas de laser tag con monitor, zona de merienda y gestión completa del evento. Consulta con nosotros para opciones personalizadas.',
  },
  {
    question: '¿A partir de qué edad se puede jugar?',
    answer: 'La edad mínima para participar es de 8 años. Nuestro equipamiento se adapta a diferentes tallas y los monitores están siempre presentes para garantizar la seguridad y la diversión de los más pequeños.',
  },
  {
    question: '¿Cuánto dura la experiencia?',
    answer: 'La duración estándar de un cumpleaños es de 150 minutos (2 horas y media), que incluyen varias partidas de laser tag con descansos y tiempo para la merienda o celebración.',
  },
  {
    question: '¿Se puede celebrar cumpleaños?',
    answer: 'Por supuesto. Tenemos packs especiales de cumpleaños que incluyen partidas de laser tag, zona para merienda, invitaciones personalizadas, monitores y coordinación completa del evento. Es una de las opciones más populares para cumpleaños infantiles y de adolescentes en Murcia.',
  },
];

const CumpleanosLaserTagMurcia = () => {
  return (
    <>
      <Helmet>
        <title>Cumpleaños Laser Tag en Murcia | Shoot and Run - Fiestas infantiles</title>
        <meta name="description" content="Cumpleaños con laser tag en Murcia para niños y adolescentes. Packs personalizados, monitores, zona merienda y opción de realidad virtual. ¡Reserva ahora!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/cumpleanos-laser-tag-murcia" />
      </Helmet>

      <SEOLandingLayout
        title="Cumpleaños con Laser Tag en Murcia: Diversión asegurada para niños y adolescentes"
        subtitle="Organiza un cumpleaños diferente en Murcia con una experiencia de laser tag que combina juego, emoción y trabajo en equipo. Nos encargamos de todo para que los niños disfruten mientras tú te despreocupas."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Bloque venta */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Todo lo que incluye nuestro <span className="text-neon-blue">Pack Cumpleaños</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Gift, title: 'Packs de cumpleaños personalizados', desc: 'Adaptamos la experiencia al número de participantes, la edad y tus preferencias para que sea un día inolvidable.' },
              { icon: Cake, title: 'Zona para merienda o celebración', desc: 'Espacio privado para la tarta, regalos y merienda. Puedes traer tu propia comida o consultarnos opciones de catering.' },
              { icon: UserCheck, title: 'Monitores incluidos', desc: 'Un monitor dedicado se encarga de todo: explicar reglas, gestionar partidas y garantizar la seguridad y diversión.' },
              { icon: Gamepad2, title: 'Opciones con realidad virtual', desc: 'Combina laser tag con una sesión de realidad virtual free roaming para una fiesta todavía más completa.' },
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

        {/* Seguridad */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            Seguridad <span className="text-neon-blue">Garantizada</span>
          </h2>
          <p>
            La seguridad de los niños es nuestra máxima prioridad. El laser tag utiliza <strong className="text-foreground">tecnología infrarroja</strong>, lo que significa que no hay impacto físico de ningún tipo. No duele, no mancha y es completamente seguro para niños a partir de 8 años.
          </p>
          <p className="mt-4">
            Nuestros monitores están formados para gestionar grupos infantiles y se aseguran de que todos los participantes entiendan las reglas y disfruten de la experiencia en un entorno controlado y seguro.
          </p>
        </div>

        {/* Cómo funciona */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Cómo funciona un <span className="text-neon-blue">Cumpleaños</span> en Shoot & Run
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Reserva tu fecha', desc: 'Elige día y hora a través de la web o por WhatsApp. Te recomendamos reservar con antelación, especialmente los fines de semana (plazas limitadas).' },
              { step: '2', title: 'Confirmación con anticipo', desc: 'Confirma la reserva con un anticipo de 50€ por Bizum. Nuestro equipo revisará los detalles contigo.' },
              { step: '3', title: 'El gran día', desc: 'Llegad 10 minutos antes. El monitor se encargará de todo: briefing, equipamiento, partidas y gestión del grupo.' },
              { step: '4', title: 'Merienda y celebración', desc: 'Tras las partidas, disfrutad de la zona de merienda privada para la tarta, regalos y celebración.' },
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

        {/* Por qué elegir */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            ¿Por qué un cumpleaños de <span className="text-neon-blue">Laser Tag</span>?
          </h2>
          <p>
            Los cumpleaños de laser tag son la opción preferida por niños y adolescentes porque combinan lo que más les gusta: <strong className="text-foreground">acción, competición y diversión con amigos</strong>. Es una actividad que fomenta el trabajo en equipo, la estrategia y el deporte, todo mientras se lo pasan en grande.
          </p>
          <p className="mt-4">
            Además, es una actividad que funciona igual de bien para niños que para adolescentes y adultos. Los padres que se animan a jugar descubren que es tan divertido para ellos como para los pequeños. ¡Muchos repiten año tras año!
          </p>
        </div>

        {/* Resumen */}
        <div className="p-6 rounded-xl border border-neon-blue/30 bg-neon-blue/5">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            <PartyPopper className="w-5 h-5 text-neon-blue inline mr-2" />
            Resumen del Pack Cumpleaños
          </h2>
          <ul className="space-y-2 mt-4">
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Duración:</strong> 150 minutos</li>
            <li className="flex items-center gap-2"><Users className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Jugadores:</strong> 8-16 participantes</li>
            <li className="flex items-center gap-2"><Star className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Precio:</strong> desde 25€/participante</li>
            <li className="flex items-center gap-2"><Gift className="w-4 h-4 text-neon-blue" /> <strong className="text-foreground">Incluye:</strong> partidas + monitor + zona merienda</li>
          </ul>
        </div>
      </SEOLandingLayout>
    </>
  );
};

export default CumpleanosLaserTagMurcia;
