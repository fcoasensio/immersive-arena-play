import { Helmet } from 'react-helmet-async';
import { Target, Users, Clock, Shield, Zap, MapPin, Star } from 'lucide-react';
import SEOLandingLayout from '@/components/seo/SEOLandingLayout';
import heroBg from '@/assets/hero-bg.jpg';
import laserEquip from '@/assets/laser-tag-equipment.jpg';
import laserBlasters from '@/assets/laser-tag-blasters.jpg';

const faqs = [
  {
    question: '¿Cuál es la edad mínima para jugar al laser tag?',
    answer: 'La edad mínima para participar en nuestras partidas de laser tag es de 8 años. Los menores de 14 años deben ir acompañados por un adulto responsable. Nuestro equipamiento se adapta a diferentes tallas y edades.',
  },
  {
    question: '¿Cuánto cuesta una partida de laser tag en Murcia?',
    answer: 'Los precios dependen del pack elegido y el número de participantes. Disponemos de packs desde 15€ por persona. Consulta nuestros packs en la web o contacta con nosotros para un presupuesto personalizado.',
  },
  {
    question: '¿Cuánto dura una sesión de laser tag?',
    answer: 'Ofrecemos sesiones de 90 minutos (varias partidas con descansos) y sesiones de 150 minutos para experiencias más completas. Cada partida individual dura unos 15 minutos con diferentes modos de juego.',
  },
  {
    question: '¿Es necesario reservar con antelación?',
    answer: 'Sí, recomendamos reservar con al menos 48 horas de antelación para garantizar disponibilidad. Puedes reservar a través de nuestra web o por WhatsApp.',
  },
  {
    question: '¿Dónde estáis ubicados?',
    answer: 'Nos encontramos en Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia). Estamos a solo 10 minutos del centro de Murcia con fácil aparcamiento.',
  },
  {
    question: '¿El laser tag duele?',
    answer: 'No, en absoluto. Nuestro sistema utiliza tecnología infrarroja, no hay impacto físico de ningún tipo. Los sensores detectan los disparos mediante luz infrarroja, por lo que es una actividad 100% segura y sin dolor.',
  },
];

const LaserTagMurcia = () => {
  return (
    <>
      <Helmet>
        <title>Laser Tag en Murcia | Shoot and Run - La mejor experiencia láser</title>
        <meta name="description" content="Laser tag en Murcia y Alcantarilla. Equipamiento militar de última generación, 6 modos de juego y diversión garantizada. Desde 15€/persona. ¡Reserva ahora!" />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/laser-tag-murcia" />
      </Helmet>

      <SEOLandingLayout
        title="Laser Tag en Murcia: La Experiencia de Combate Más Realista"
        subtitle="Vive la adrenalina del laser tag con equipamiento militar de última generación en Alcantarilla, a 10 minutos de Murcia. 6 modos de juego, partidas épicas y diversión garantizada para todas las edades."
        heroImage={heroBg}
        faqs={faqs}
      >
        {/* Intro */}
        <div>
          <p>
            ¿Buscas una actividad diferente en Murcia que combine <strong className="text-foreground">estrategia, adrenalina y trabajo en equipo</strong>? En Shoot and Run ofrecemos la experiencia de laser tag más completa de la Región de Murcia. Nuestras instalaciones en Alcantarilla cuentan con un campo de juego diseñado para ofrecer partidas tácticas e inmersivas que te harán sentir como en una auténtica misión de combate.
          </p>
          <p className="mt-4">
            A diferencia de otros centros de ocio, en Shoot and Run utilizamos <strong className="text-foreground">equipamiento de grado militar</strong> con réplicas realistas de armas tácticas, sensores de alta precisión y un sistema de juego avanzado que registra estadísticas en tiempo real. Cada partida es única gracias a nuestros 6 modos de juego diferentes.
          </p>
        </div>

        {/* Image + features */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={laserEquip} alt="Equipamiento laser tag Shoot and Run Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
          <div className="space-y-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              ¿Por qué elegir <span className="text-neon-blue">Shoot and Run</span>?
            </h2>
            <ul className="space-y-3">
              {[
                { icon: Target, text: 'Equipamiento militar con sensores de precisión y réplicas realistas' },
                { icon: Users, text: 'Partidas de 4 a 16 jugadores con diferentes modos de juego' },
                { icon: Shield, text: 'Actividad 100% segura con tecnología infrarroja, sin impacto físico' },
                { icon: Zap, text: 'Estadísticas en tiempo real: disparos, impactos, precisión' },
                { icon: MapPin, text: 'Ubicación accesible en Alcantarilla, a 10 min de Murcia capital' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modes */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            6 Modos de Juego para <span className="text-neon-blue">Partidas Épicas</span>
          </h2>
          <p>
            En Shoot and Run no te aburrirás nunca. Cada sesión incluye varias partidas con modos de juego diferentes para que la diversión no pare. Desde enfrentamientos por equipos hasta supervivencia individual, cada modalidad ofrece una experiencia táctica única.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              { name: 'Captura la Bandera', desc: 'Dos equipos luchan por capturar la bandera rival. Estrategia y coordinación son la clave.' },
              { name: 'Deathmatch', desc: 'Batalla total entre equipos. Cada eliminación suma puntos. ¡Acción sin parar!' },
              { name: 'Último Héroe', desc: 'Todos contra todos. El último jugador en pie se corona campeón.' },
              { name: 'Dominación', desc: 'Controla puntos estratégicos del mapa para sumar puntos.' },
              { name: 'Pandora', desc: 'Extrae probetas radiactivas y llévalas a tu base antes que el rival.' },
              { name: 'Zombies vs Vampiros', desc: 'Dos bandos sobrenaturales. Si te infectan, ¡cambias de bando!' },
            ].map((mode, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-display text-sm font-bold text-neon-blue mb-1">{mode.name}</h3>
                <p className="text-sm">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Second image block */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Equipamiento de <span className="text-neon-blue">Última Generación</span>
            </h2>
            <p>
              Nuestras réplicas tácticas no tienen nada que ver con las típicas pistolas de plástico de otros centros. En Shoot and Run cada jugador se equipa con un <strong className="text-foreground">fusil táctico con sensores integrados</strong>, chaleco con receptores de alta sensibilidad y un sistema de puntuación digital que muestra tus estadísticas en tiempo real.
            </p>
            <p className="mt-4">
              El campo de juego está diseñado con obstáculos, coberturas y puntos estratégicos que favorecen el juego táctico. No se trata solo de disparar: la estrategia, la comunicación con tu equipo y el posicionamiento son fundamentales para ganar.
            </p>
          </div>
          <img src={laserBlasters} alt="Pistolas laser tag de alta precisión en Murcia" className="rounded-xl border border-border w-full" loading="lazy" />
        </div>

        {/* Who is it for */}
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
            ¿Para quién es el <span className="text-neon-blue">Laser Tag</span>?
          </h2>
          <p>
            El laser tag es una actividad versátil que se adapta a todo tipo de grupos y ocasiones. En Shoot and Run recibimos desde familias con niños a partir de 6 años hasta grupos de adultos que buscan una experiencia competitiva e intensa.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            {[
              { icon: Star, title: 'Cumpleaños', desc: 'Celebra un cumpleaños inolvidable con partidas de laser tag, merienda y diversión asegurada.' },
              { icon: Users, title: 'Grupos y amigos', desc: 'La actividad perfecta para quedar con amigos y vivir una experiencia diferente.' },
              { icon: Shield, title: 'Empresas', desc: 'Team building, despedidas y eventos corporativos con competición por equipos.' },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card/50 text-center">
                <item.icon className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="p-6 rounded-xl border border-border bg-card/50">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            <MapPin className="w-5 h-5 text-neon-blue inline mr-2" />
            Cómo llegar
          </h2>
          <p>
            Nos encontramos en <strong className="text-foreground">Avda. Fernando III El Santo, 24, 30820 Alcantarilla (Murcia)</strong>. Estamos a solo 10 minutos en coche desde el centro de Murcia, con fácil acceso desde la autovía y aparcamiento gratuito en las inmediaciones. También somos accesibles en transporte público con parada de tranvía cercana.
          </p>
        </div>
      </SEOLandingLayout>
    </>
  );
};

export default LaserTagMurcia;
