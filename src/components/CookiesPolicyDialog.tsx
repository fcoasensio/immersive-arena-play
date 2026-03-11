import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

interface CookiesPolicyDialogProps {
  children: ReactNode;
}

const CookiesPolicyDialog = ({ children }: CookiesPolicyDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-xl">Política de Cookies</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 h-[60vh]">
          <div className="font-body text-sm text-muted-foreground space-y-4 pr-4">
            <p>Francisco Jiménez Asensio informa acerca del uso de las cookies en su página web: https://www.shootandrun.es/</p>

            <h3 className="text-foreground font-semibold pt-2">¿Qué son las cookies?</h3>
            <p>Las cookies son archivos que se pueden descargar en su equipo a través de las páginas web. Son herramientas que tienen un papel esencial para la prestación de numerosos servicios de la sociedad de la información. Entre otros, permiten a una página web almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información obtenida, se pueden utilizar para reconocer al usuario y mejorar el servicio ofrecido.</p>

            <h3 className="text-foreground font-semibold pt-2">Tipos de cookies</h3>
            <p>Según quien sea la entidad que gestione el dominio desde donde se envían las cookies y trate los datos que se obtengan se pueden distinguir dos tipos:</p>

            <h4 className="text-foreground font-medium">• Cookies propias:</h4>
            <p>Aquéllas que se envían al equipo terminal del usuario desde un equipo o dominio gestionado por el propio editor y desde el que se presta el servicio solicitado por el usuario.</p>

            <h4 className="text-foreground font-medium">• Cookies de terceros:</h4>
            <p>Aquéllas que se envían al equipo terminal del usuario desde un equipo o dominio que no es gestionado por el editor, sino por otra entidad que trata los datos obtenidos través de las cookies.</p>
            <p>En el caso de que las cookies sean instaladas desde un equipo o dominio gestionado por el propio editor pero la información que se recoja mediante éstas sea gestionada por un tercero, no pueden ser consideradas como cookies propias.</p>

            <p>Existe también una segunda clasificación según el plazo de tiempo que permanecen almacenadas en el navegador del cliente, pudiendo tratarse de:</p>

            <h4 className="text-foreground font-medium">• Cookies de sesión:</h4>
            <p>Diseñadas para recabar y almacenar datos mientras el usuario accede a una página web. Se suelen emplear para almacenar información que solo interesa conservar para la prestación del servicio solicitado por el usuario en una sola ocasión (p.e. una lista de productos adquiridos).</p>

            <h4 className="text-foreground font-medium">• Cookies persistentes:</h4>
            <p>Los datos siguen almacenados en el terminal y pueden ser accedidos y tratados durante un periodo definido por el responsable de la cookie, y que puede ir de unos minutos a varios años.</p>

            <p>Por último, existe otra clasificación con seis tipos de cookies según la finalidad para la que se traten los datos obtenidos:</p>

            <h4 className="text-foreground font-medium">• Cookies técnicas:</h4>
            <p>Aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan como, por ejemplo, controlar el tráfico y la comunicación de datos, identificar la sesión, acceder a partes de acceso restringido, recordar los elementos que integran un pedido, realizar el proceso de compra de un pedido, realizar la solicitud de inscripción o participación en un evento, utilizar elementos de seguridad durante la navegación, almacenar contenidos para la difusión de vídeos o sonido o compartir contenidos a través de redes sociales.</p>

            <h4 className="text-foreground font-medium">• Cookies de personalización:</h4>
            <p>Permiten al usuario acceder al servicio con algunas características de carácter general predefinidas en función de una serie de criterios en el terminal del usuario como por ejemplo serian el idioma, el tipo de navegador a través del cual accede al servicio, la configuración regional desde donde accede al servicio, etc.</p>

            <h4 className="text-foreground font-medium">• Cookies de análisis:</h4>
            <p>Permiten al responsable de las mismas, el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas. La información recogida mediante este tipo de cookies se utiliza en la medición de la actividad de los sitios web, aplicación o plataforma y para la elaboración de perfiles de navegación de los usuarios de dichos sitios, aplicaciones y plataformas, con el fin de introducir mejoras en función del análisis de los datos de uso que hacen los usuarios del servicio.</p>

            <h4 className="text-foreground font-medium">• Cookies publicitarias:</h4>
            <p>Permiten la gestión, de la forma más eficaz posible, de los espacios publicitarios.</p>

            <h4 className="text-foreground font-medium">• Cookies de publicidad comportamental:</h4>
            <p>Almacenan información del comportamiento de los usuarios obtenida a través de la observación continuada de sus hábitos de navegación, lo que permite desarrollar un perfil específico para mostrar publicidad en función del mismo.</p>

            <h4 className="text-foreground font-medium">• Cookies de redes sociales externas:</h4>
            <p>Se utilizan para que los visitantes puedan interactuar con el contenido de diferentes plataformas sociales (facebook, youtube, twitter, linkedIn, etc..) y que se generen únicamente para los usuarios de dichas redes sociales. Las condiciones de utilización de estas cookies y la información recopilada se regula por la política de privacidad de la plataforma social correspondiente.</p>

            <h3 className="text-foreground font-semibold pt-2">Desactivación y eliminación de cookies</h3>
            <p>Tienes la opción de permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador instalado en su equipo. Al desactivar cookies, algunos de los servicios disponibles podrían dejar de estar operativos. La forma de deshabilitar las cookies es diferente para cada navegador, pero normalmente puede hacerse desde el menú Herramientas u Opciones. También puede consultarse el menú de Ayuda del navegador dónde puedes encontrar instrucciones. El usuario podrá en cualquier momento elegir qué cookies quiere que funcionen en este sitio web.</p>
            <p>Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Microsoft Internet Explorer o Microsoft Edge:</strong><br />http://windows.microsoft.com/es-es/windows-vista/Block-or-allow-cookies</li>
              <li><strong>Mozilla Firefox:</strong><br />http://support.mozilla.org/es/kb/impedir-que-los-sitios-web-guarden-sus-preferencia</li>
              <li><strong>Chrome:</strong><br />https://support.google.com/accounts/answer/61416?hl=es</li>
              <li><strong>Safari:</strong><br />http://safari.helpmax.net/es/privacidad-y-seguridad/como-gestionar-las-cookies/</li>
              <li><strong>Opera:</strong><br />http://help.opera.com/Linux/10.60/es-ES/cookies.html</li>
            </ul>
            <p>Además, también puede gestionar el almacén de cookies en su navegador a través de herramientas como las siguientes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ghostery:</strong> www.ghostery.com/</li>
              <li><strong>Your Online Choices:</strong> www.youronlinechoices.com/es/</li>
            </ul>

            <h3 className="text-foreground font-semibold pt-2">Cookies utilizadas en https://www.shootandrun.es/</h3>
            <p>A continuación se identifican las cookies que están siendo utilizadas en este portal así como su tipología y función:</p>
            <p>—–</p>

            <h3 className="text-foreground font-semibold pt-2">Aceptación de la Política de cookies</h3>
            <p>https://www.shootandrun.es/, asume que usted acepta el uso de cookies. No obstante, muestra información sobre su Política de cookies en la parte inferior o superior de cualquier página del portal con cada inicio de sesión con el objeto de que usted sea consciente.</p>
            <p>Ante esta información es posible llevar a cabo las siguientes acciones:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Aceptar cookies:</strong> No se volverá a visualizar este aviso al acceder a cualquier página del portal durante la presente sesión.</li>
              <li><strong>Cerrar:</strong> Se oculta el aviso en la presente página.</li>
              <li><strong>Modificar su configuración:</strong> Podrá obtener más información sobre qué son las cookies, conocer la Política de cookies de https://www.shootandrun.es/ y modificar la configuración de su navegador.</li>
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CookiesPolicyDialog;
