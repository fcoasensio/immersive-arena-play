import { Link } from 'react-router-dom';
import BlogArticleLayout from '@/components/blog/BlogArticleLayout';
import vrNoMarea from '@/assets/recursos/vr-free-roam-no-marea.jpg';
import vrCatalogo from '@/assets/recursos/vr-variedad-juegos.png';

const RealidadVirtualFreeRoamNoMarea = () => (
  <BlogArticleLayout slug="realidad-virtual-free-roam-no-marea">
    <p>
      Si has probado unas gafas de realidad virtual en casa y has acabado con dolor de
      cabeza, sensación de náusea o esa molesta desorientación al quitártelas, no eres el
      único. Es uno de los motivos por los que mucha gente desconfía de la VR. La buena
      noticia: en{' '}
      <strong className="text-foreground">
        <span translate="no">Shoot and Run</span>
      </strong>{' '}
      trabajamos con <strong className="text-foreground">VR Free Roaming</strong>, una
      tecnología pensada precisamente para eliminar ese problema.
    </p>

    <div className="my-8 rounded-xl overflow-hidden border border-border">
      <img
        src={vrNoMarea}
        alt="Adolescentes probando gafas de realidad virtual Free Roam sin sentir mareo"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      ¿Por qué marea la VR doméstica?
    </h2>
    <p>
      El mareo en realidad virtual (cinetosis o motion sickness) aparece cuando tu cerebro
      recibe señales contradictorias: <strong className="text-foreground">tus ojos ven
      movimiento</strong> dentro del juego, pero{' '}
      <strong className="text-foreground">tu cuerpo permanece quieto</strong> en el sofá.
      Esa desconexión entre vista y oído interno es la que provoca náuseas, sudores y
      desorientación.
    </p>
    <p>
      En la VR de casa te mueves usando el joystick: avanzas, retrocedes y giras sin dar
      un solo paso real. Cuanto más larga sea la sesión, peor se lleva. Por eso muchas
      personas abandonan la realidad virtual tras pocos minutos.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Free Roaming: caminas de verdad
    </h2>
    <p>
      La VR Free Roaming funciona al revés. <strong className="text-foreground">Si quieres
      avanzar en el juego, andas físicamente por la sala</strong>. Si quieres girar, giras
      la cabeza y el cuerpo. Tus ojos y tu sistema vestibular reciben exactamente la misma
      información, así que el cerebro no se confunde y el mareo desaparece.
    </p>
    <ul className="list-disc pl-6 space-y-2">
      <li>
        <strong className="text-foreground">Sala amplia y libre de cables:</strong>{' '}
        sensores de tracking de precisión que cubren todo el espacio.
      </li>
      <li>
        <strong className="text-foreground">Gafas inalámbricas autónomas:</strong> sin
        ordenador atado a la espalda, sin tropezar con cables.
      </li>
      <li>
        <strong className="text-foreground">Movimiento natural 1:1:</strong> un paso real
        equivale a un paso dentro del juego.
      </li>
      <li>
        <strong className="text-foreground">Hasta 12 jugadores simultáneos</strong>{' '}
        compartiendo el mismo mundo virtual y viéndose entre sí como avatares.
      </li>
    </ul>

    <div className="my-8 rounded-xl overflow-hidden border border-border">
      <img
        src={vrCatalogo}
        alt="Variedad de experiencias de realidad virtual Free Roam en Shoot and Run"
        className="w-full h-auto"
        loading="lazy"
      />
    </div>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      ¿Quién puede jugar?
    </h2>
    <p>
      A partir de <strong className="text-foreground">12 años</strong>, sin límite máximo
      de edad. Hemos tenido grupos de adolescentes, familias, despedidas y eventos de
      empresa con personas que nunca habían tocado unas gafas VR y han salido encantadas,
      sin marearse y pidiendo repetir.
    </p>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Consejos para tu primera sesión
    </h2>
    <ul className="list-disc pl-6 space-y-2">
      <li>Llega bien hidratado y evita comidas muy pesadas justo antes.</li>
      <li>Usa ropa cómoda y calzado deportivo: te vas a mover de verdad.</li>
      <li>
        Si llevas gafas graduadas, no hay problema: nuestros visores se ajustan para que
        te quepan debajo.
      </li>
      <li>
        Si en algún momento te sientes raro, basta con quitarte las gafas un minuto. Pero
        en Free Roam casi nunca pasa.
      </li>
    </ul>

    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mt-8">
      Pruébalo en Murcia
    </h2>
    <p>
      Estamos en Murcia y nuestra arena de VR Free Roaming es una de las pocas de la
      región. Si quieres descubrir cómo es la realidad virtual sin mareos, échale un
      vistazo a nuestra{' '}
      <Link to="/realidad-virtual-murcia" className="text-neon-blue hover:underline">
        página de realidad virtual en Murcia
      </Link>{' '}
      o reserva directamente tu sesión.
    </p>
  </BlogArticleLayout>
);

export default RealidadVirtualFreeRoamNoMarea;
