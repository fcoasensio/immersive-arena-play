import { Helmet } from 'react-helmet-async';
import { Cake, Users, Clock, Gift, Star, PartyPopper, Shield, Target } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/hero-bg.jpg';
import laserSets from '@/assets/laser-tag-sets.jpg';
import laserPistols from '@/assets/laser-tag-pistols.jpg';

const faqs = [
  {
    question: '¿A partir de qué edad se puede celebrar un cumpleaños de laser tag?',
    answer: 'La edad mínima para participar es de 8 años. Nuestro equipamiento se adapta a diferentes tallas y los monitores están siempre presentes para garantizar la seguridad y la diversión de los más pequeños.',
  },
  {
    question: '¿Cuánto cuesta un cumpleaños de laser tag?',
    answer: 'El precio del pack de cumpleaños es de 25€ por participante (mínimo 8 jugadores). Incluye partidas de laser tag con monitor, zona de merienda y gestión completa del evento. Consulta con nosotros para opciones personalizadas.',
  },
  {
    question: '¿Cuánto dura un cumpleaños completo?',
    answer: 'La duración estándar de un cumpleaños es de 150 minutos (2 horas y media), que incluyen varias partidas de laser tag con descansos y tiempo para la merienda o celebración.',
  },
  {
    question: '¿Cuántos niños pueden participar?',
    answer: 'Nuestras partidas admiten entre 4 y 16 jugadores simultáneos. Si tu grupo es mayor, podemos organizar turnos para que todos participen. El mínimo recomendado para un cumpleaños es de 8 participantes.',
  },
  {
    question: '¿Se puede traer merienda o tarta de fuera?',
    answer: 'Sí, ponemos a vuestra disposición una zona de merienda donde podéis traer vuestra propia comida, tarta y bebidas. También podemos gestionar catering si lo preferís.',
  },
  {
    question: '¿Los padres pueden quedarse durante la actividad?',
    answer: 'Por supuesto. Los padres y acompañantes son bienvenidos. Disponemos de zona de espera cómoda, y los adultos también pueden participar en las partidas si lo desean.',
  },
];

const CumpleanosLaserTagMurcia = () => {
  return (
    <>
      <Helmet>
        <title>Cumpleaños Laser Tag en Murcia | Shoot and Run - Fiestas infantiles</title>
        <meta name="description" content="Celebra el mejor cumpleaños infantil en Murcia con laser tag. Pack completo desde 25€/niño: partidas, monitor, zona merienda. ¡Reserva la fiesta perfecta!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/cumpleanos-laser-tag-murcia" />
      </Helmet>

      <SEOLandingLayout
        title="Cumpleaños de Laser Tag en Murcia: La Fiesta Que Todos Recordarán"
        subtitle="Organiza el cumpleaños más épico en Alcantarilla. Partidas de laser tag con monitor, zona de merienda y diversión garantizada. Pack completo desde 25€ por participante."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Intro */}
        <div>
          <p>
            ¿Quieres que tu hijo o hija celebre un cumpleaños que sea <strong className="text-foreground">la envidia de todo el colegio</strong>? En Shoot and Run organizamos fiestas de cumpleaños con laser tag en Alcantarilla (Murcia) que combinan acción, diversión y una experiencia que los niños no olvidarán jamás.
          </p>
          <p className="mt-4">
            Olvídate de los cumpleaños aburridos en parques de bolas o hamburgueserías. Nuestros cumpleaños de laser tag ofrecen una <strong className="text-foreground">experiencia inmersiva</strong> con equipamiento militar de última generación, diferentes modos de juego y un monitor dedicado que se encarga de que todo salga perfecto.
          </p>
        </div>

        {/* What's included */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            ¿Qué incluye nuestro <span className="text-neon-blue">Pack Cumpleaños</span>?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Target, title: 'Partidas de Laser Tag', desc: 'Varias partidas con modos de juego variados adaptados a la edad de los participantes.' },
              { icon: Users, title: 'Monitor dedicado', desc: 'Un monitor se encarga de explicar las reglas, arbitrar y gestionar las partidas.' },
              { icon: Cake, title: 'Zona de merienda', desc: 'Espacio privado para la merienda, tarta y celebración del cumpleaños.' },
              { icon: Shield, title: 'Equipamiento completo', desc: 'Fusiles tácticos, chalecos con sensores y sistema de puntuación para todos.' },
              { icon: Star, title: 'Diploma al ganador', desc: 'Diploma especial para el jugador o equipo que mejor lo haga en las partidas.' },
              { icon: Gift, title: 'Sorpresa cumpleañero', desc: 'Detalle especial para el protagonista del día.' },
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

        {/* Images */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={laserSets} alt="Sets de laser tag para cumpleaños infantiles en Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Seguridad <span className="text-neon-blue">Garantizada</span>
            </h2>
            <p>
              La seguridad de los niños es nuestra máxima prioridad. El laser tag utiliza <strong className="text-foreground">tecnología infrarroja</strong>, lo que significa que no hay impacto físico de ningún tipo. No duele, no mancha y es La seguridad de los niños es nuestra máxima prioridad. El laser tag utiliza <strong className="text-foreground">tecnología infrarroja</strong>, lo que significa que no hay impacto físico de ningún tipo. No duele, no mancha y es completamente seguro para niños a partir de 8 años.
            </p>
            <p className="mt-4">
              Nuestros monitores están formados para gestionar grupos infantiles y se aseguran de que todos los participantes entiendan las reglas y disfruten de la experiencia en un entorno controlado y seguro.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
            Cómo funciona un <span className="text-neon-blue">Cumpleaños</span> en Shoot and Run
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Reserva tu fecha', desc: 'Elige día y hora a través de la web o por WhatsApp. Te recomendamos reservar con al menos una semana de antelación.' },
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

        {/* Second image */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
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
            <p className="mt-4">
              En Shoot and Run nos encargamos de todo para que tú solo tengas que preocuparte de disfrutar del día. Desde la organización de las partidas hasta la preparación de la zona de merienda, nuestro equipo gestiona cada detalle.
            </p>
          </div>
          <img src={laserPistols} alt="Equipamiento laser tag cumpleaños Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
        </div>

        {/* Pricing summary */}
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
