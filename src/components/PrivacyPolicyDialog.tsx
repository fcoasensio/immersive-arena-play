import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

interface PrivacyPolicyDialogProps {
  children: ReactNode;
}

const PrivacyPolicyDialog = ({ children }: PrivacyPolicyDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-xl">Política de Privacidad</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 h-[60vh]">
          <div className="font-body text-sm text-muted-foreground space-y-4 pr-4">
            <h3 className="text-foreground font-semibold">Protección de datos de carácter personal según el RGPD</h3>
            <p>Francisco Jiménez Asensio, en aplicación de la normativa vigente en materia de protección de datos de carácter personal, informa que los datos personales que se recogen a través de los formularios del Sitio web: https://www.shootandrun.es, se incluyen en los ficheros automatizados específicos de usuarios de los servicios de Francisco Jiménez Asensio</p>
            <p>La recogida y tratamiento automatizado de los datos de carácter personal tiene como finalidad el mantenimiento de la relación comercial y el desempeño de tareas de información, formación, asesoramiento y otras actividades propias de Francisco Jiménez Asensio</p>
            <p>Estos datos únicamente serán cedidos a aquellas entidades que sean necesarias con el único objetivo de dar cumplimiento a la finalidad anteriormente expuesta.</p>
            <p>Francisco Jiménez Asensio adopta las medidas necesarias para garantizar la seguridad, integridad y confidencialidad de los datos conforme a lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de los mismos, y derogando la antigua LOPD, la nueva Ley Orgánica 3/2018, de 5 diciembre, de Protección de Datos y Garantía de los Derechos Digitales (LOPDGDD).</p>
            <p>El usuario podrá en cualquier momento ejercitar los derechos de acceso, oposición, rectificación, cancelación, limitación y portabilidad reconocidos en el citado Reglamento (UE). El ejercicio de estos derechos puede realizarlo el propio usuario a través de email a: fcoasensio@gmail.com o en la dirección: C/ Independencia, 31, C.P. 30820 – Alcantarilla (Murcia).</p>
            <p>El usuario manifiesta que todos los datos facilitados por él son ciertos y correctos, y se compromete a mantenerlos actualizados, comunicando los cambios a Francisco Jiménez Asensio</p>

            <h3 className="text-foreground font-semibold pt-2">Finalidad del tratamiento de los datos personales</h3>
            <p>¿Con qué finalidad trataremos tus datos personales?</p>
            <p>En Francisco Jiménez Asensio, trataremos tus datos personales recabados a través del Sitio Web: https://www.shootandrun.es, con las siguientes finalidades:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dar cumplimiento de las obligaciones, comerciales, laborales, corporativas y contables de la empresa.</li>
              <li>Prestar sus servicios de acuerdo con las necesidades particulares de los clientes, con el fin de cumplir los contratos suscritos por la misma.</li>
              <li>El proceso de archivo, de actualización de los sistemas, de protección y custodia de información y bases de datos de la empresa.</li>
              <li>Con propósitos de seguridad o prevención de fraude.</li>
              <li>Prestar los servicios contratados por el usuario.</li>
            </ul>
            <p>Te recordamos que puedes oponerte al envío de comunicaciones comerciales por cualquier vía y en cualquier momento, remitiendo un correo electrónico a la dirección anteriormente indicada.</p>
            <p>Los campos de dichos registros son de cumplimentación obligatoria, siendo imposible realizar las finalidades expresadas si no se aportan esos datos.</p>

            <h3 className="text-foreground font-semibold pt-2">¿Por cuánto tiempo se conservan los datos personales recabados?</h3>
            <p>Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o no solicites su supresión y durante el plazo por el cuál pudieran derivarse responsabilidades legales por los servicios prestados.</p>

            <h3 className="text-foreground font-semibold pt-2">Legitimación</h3>
            <p>El tratamiento de tus datos se realiza con las siguientes bases jurídicas que legitiman el mismo:</p>
            <p>La solicitud de información y/o la contratación de los servicios de Francisco Jiménez Asensio, cuyos términos y condiciones se pondrán a tu disposición en todo caso, de forma previa a una eventual contratación.</p>
            <p>El consentimiento libre, específico, informado e inequívoco, en tanto que te informamos poniendo a tu disposición la presente política de privacidad, que tras la lectura de la misma, en caso de estar conforme, puedes aceptar mediante una declaración o una clara acción afirmativa, como el marcado de una casilla dispuesta al efecto.</p>
            <p>En caso de que no nos facilites tus datos o lo hagas de forma errónea o incompleta, no podremos atender tu solicitud, resultando del todo imposible proporcionarte la información solicitada o llevar a cabo la contratación de los servicios.</p>

            <h3 className="text-foreground font-semibold pt-2">Destinatarios</h3>
            <p>Los datos no se comunicarán a ningún tercero ajeno a Francisco Jiménez Asensio, salvo obligación legal.</p>

            <h3 className="text-foreground font-semibold pt-2">Datos recopilados por usuarios de los servicios</h3>
            <p>En los casos en que el usuario incluya ficheros con datos de carácter personal en los servidores de alojamiento compartido, Francisco Jiménez Asensio no se hace responsable del incumplimiento por parte del usuario del RGPD.</p>

            <h3 className="text-foreground font-semibold pt-2">Derechos propiedad intelectual https://www.shootandrun.es</h3>
            <p>Francisco Jiménez Asensio es titular de todos los derechos de autor, propiedad intelectual, industrial, «know how» y cuantos otros derechos guardan relación con los contenidos del sitio web https://www.shootandrun.es y los servicios ofertados en el mismo, así como de los programas necesarios para su implementación y la información relacionada.</p>
            <p>No se permite la reproducción, publicación y/o uso no estrictamente privado de los contenidos, totales o parciales, del sitio web https://www.shootandrun.es sin el consentimiento previo y por escrito.</p>

            <h3 className="text-foreground font-semibold pt-2">Propiedad intelectual del software</h3>
            <p>El usuario debe respetar los programas de terceros puestos a su disposición por Francisco Jiménez Asensio, aún siendo gratuitos y/o de disposición pública.</p>
            <p>Francisco Jiménez Asensio dispone de los derechos de explotación y propiedad intelectual necesarios del software.</p>
            <p>El usuario no adquiere derecho alguno o licencia por el servicio contratado, sobre el software necesario para la prestación del servicio, ni tampoco sobre la información técnica de seguimiento del servicio, excepción hecha de los derechos y licencias necesarios para el cumplimiento de los servicios contratados y únicamente durante la duración de los mismos.</p>
            <p>Para toda actuación que exceda del cumplimiento del contrato, el usuario necesitará autorización por escrito por parte de Francisco Jiménez Asensio, quedando prohibido al usuario acceder, modificar, visualizar la configuración, estructura y ficheros de los servidores propiedad de Francisco Jiménez Asensio, asumiendo la responsabilidad civil y penal derivada de cualquier incidencia que se pudiera producir en los servidores y sistemas de seguridad como consecuencia directa de una actuación negligente o maliciosa por su parte.</p>

            <h3 className="text-foreground font-semibold pt-2">Propiedad intelectual de los contenidos alojados</h3>
            <p>Se prohíbe el uso contrario a la legislación sobre propiedad intelectual de los servicios prestados por Francisco Jiménez Asensio y, en particular de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>La utilización que resulte contraria a las leyes españolas o que infrinja los derechos de terceros.</li>
              <li>La publicación o la transmisión de cualquier contenido que, a juicio de Francisco Jiménez Asensio, resulte violento, obsceno, abusivo, ilegal, racial, xenófobo o difamatorio.</li>
              <li>Los cracks, números de serie de programas o cualquier otro contenido que vulnere derechos de la propiedad intelectual de terceros.</li>
              <li>La recogida y/o utilización de datos personales de otros usuarios sin su consentimiento expreso o contraviniendo lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de los mismos.</li>
              <li>La utilización del servidor de correo del dominio y de las direcciones de correo electrónico para el envío de correo masivo no deseado.</li>
            </ul>
            <p>El usuario tiene toda la responsabilidad sobre el contenido de su web, la información transmitida y almacenada, los enlaces de hipertexto, las reivindicaciones de terceros y las acciones legales en referencia a propiedad intelectual, derechos de terceros y protección de menores.</p>
            <p>El usuario es responsable respecto a las leyes y reglamentos en vigor y las reglas que tienen que ver con el funcionamiento del servicio online, comercio electrónico, derechos de autor, mantenimiento del orden público, así como principios universales de uso de Internet.</p>
            <p>El usuario indemnizará a Francisco Jiménez Asensio por los gastos que generara la imputación de Francisco Jiménez Asensio en alguna causa cuya responsabilidad fuera atribuible al usuario, incluidos honorarios y gastos de defensa jurídica, incluso en el caso de una decisión judicial no definitiva.</p>

            <h3 className="text-foreground font-semibold pt-2">Protección de la información alojada</h3>
            <p>Francisco Jiménez Asensio realiza copias de seguridad de los contenidos alojados en sus servidores, sin embargo no se responsabiliza de la pérdida o el borrado accidental de los datos por parte de los usuarios. De igual manera, no garantiza la reposición total de los datos borrados por los usuarios, ya que los citados datos podrían haber sido suprimidos y/o modificados durante el periodo del tiempo transcurrido desde la última copia de seguridad.</p>
            <p>Los servicios ofertados, excepto los servicios específicos de backup, no incluyen la reposición de los contenidos conservados en las copias de seguridad realizadas por Francisco Jiménez Asensio, cuando esta pérdida sea imputable al usuario; en este caso, se determinará una tarifa acorde a la complejidad y volumen de la recuperación, siempre previa aceptación del usuario.</p>
            <p>La reposición de datos borrados sólo está incluida en el precio del servicio cuando la pérdida del contenido sea debida a causas atribuibles a Francisco Jiménez Asensio.</p>

            <h3 className="text-foreground font-semibold pt-2">Comunicaciones comerciales</h3>
            <p>En aplicación de la LSSI. Francisco Jiménez Asensio no enviará comunicaciones publicitarias o promocionales por correo electrónico u otro medio de comunicación electrónica equivalente que previamente no hubieran sido solicitadas o expresamente autorizadas por los destinatarios de las mismas.</p>
            <p>En el caso de usuarios con los que exista una relación contractual previa, Francisco Jiménez Asensio sí está autorizado al envío de comunicaciones comerciales referentes a productos o servicios de Francisco Jiménez Asensio que sean similares a los que inicialmente fueron objeto de contratación con el cliente.</p>
            <p>En todo caso, el usuario, tras acreditar su identidad, podrá solicitar que no se le haga llegar más información comercial a través de los canales de Atención al Cliente.</p>

            <p className="pt-4 text-xs text-muted-foreground/70">REV: 20.3009</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
