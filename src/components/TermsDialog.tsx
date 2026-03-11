import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

interface TermsDialogProps {
  children: ReactNode;
}

const TermsDialog = ({ children }: TermsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-xl">Términos y Condiciones del Servicio</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 h-[60vh]">
          <div className="font-body text-sm text-muted-foreground space-y-4 pr-4">
            <h3 className="text-foreground font-semibold">IDENTIFICADOR DEL PRESTADOR</h3>
            <ul className="space-y-1">
              <li><strong>Titular:</strong> Francisco Jiménez Asensio</li>
              <li><strong>Domicilio social:</strong> C/ Independencia, 31. – 30820 – Alcantarilla (Murcia)</li>
              <li><strong>CIF/NIF:</strong> 52806442Y</li>
              <li><strong>Teléfono:</strong> +34 606323053</li>
              <li><strong>E-mail:</strong> hola@shootandrun.es</li>
            </ul>

            <h3 className="text-foreground font-semibold pt-2">OBJETO</h3>
            <p>Mediante el presente texto ponemos a disposición de todos los usuarios y clientes las condiciones de uso y registro que son de aplicación a nuestra plataforma de servicios online https://www.shootandrun.es y a los servicios que prestamos, quedando reflejados en éste todos los derechos y obligaciones que asisten a las partes.</p>
            <p>Todos los usuarios que visitan o acceden a nuestra plataforma y/o que utilizan alguno de los servicios que ponemos a disposición, aceptan las condiciones de uso y la política de privacidad, así como las diferentes modificaciones y/o textos legales adicionales que sean incluidas en el futuro. En caso de no estar de acuerdo con alguna de las condiciones, puedes darte de baja del servicio en cualquier momento o en caso de no ser usuario registrado, abandonar la plataforma.</p>
            <p>Junto a las presentes condiciones, cada uno de los servicios prestado puede quedar regulado por condiciones de uso y registro de carácter particular, siendo obligatorio en todo caso que el usuario acepte las mismas expresamente antes de su utilización y/o contratación.</p>

            <h3 className="text-foreground font-semibold pt-2">REGISTRO Y ACCESO DE USUARIOS</h3>
            <h4 className="text-foreground font-medium">1. PROCEDIMIENTO DE REGISTRO</h4>
            <p>Cualquier usuario, siempre que tenga más de 18 años y ostente poder suficiente en caso de actuar en nombre y representación de algún tercero, sea persona física o jurídica, puede registrarse en nuestra plataforma.</p>
            <p>Para ello únicamente deberá acceder al formulario dispuesto al efecto, introducir los datos solicitados y aceptar las condiciones de uso y registro, así como la política de privacidad que regirán la relación entre el usuario y el prestador.</p>
            <p>Mediante el usuario y contraseña introducida durante el proceso de registro el usuario podrá acceder a la plataforma para contratar y gestionar sus servicios e información, así como completar su perfil de usuario.</p>

            <h3 className="text-foreground font-semibold pt-2">CONTRATACIÓN ELECTRÓNICA DE SERVICIOS</h3>
            <h4 className="text-foreground font-medium">1. INFORMACIÓN PREVIA APLICABLE A LA CONTRATACIÓN ELECTRÓNICA</h4>
            <p>De conformidad con lo dispuesto en el artículo 23 y siguientes de la Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico, los contratos celebrados por vía electrónica producirán todos los efectos previstos por el ordenamiento jurídico, siempre que concurra el consentimiento de ambas partes y éste pueda ser acreditado.</p>
            <p>A estos efectos, se entenderá que el seguimiento de todas las fases del proceso de registro y en su caso, el abono de la cantidad económica correspondiente, implica necesariamente la prestación del consentimiento expreso requerido para la contratación del servicio.</p>
            <p>Del mismo modo, y atendiendo a lo dispuesto en el artículo 27 de la Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico, se pone a disposición de los usuarios, de forma previa al inicio del procedimiento de contratación toda la información relativa al mismo.</p>
            <p>Las condiciones de contratación indicadas a continuación son de aplicación directa a la contratación de todos los servicios puestos a disposición a través del portal web https://www.shootandrun.es, salvo que expresamente se disponga lo contrario.</p>

            <h4 className="text-foreground font-medium">2. PROCEDIMIENTO DE CONTRATACIÓN</h4>
            <p>El procedimiento de contratación de los servicios se lleva a cabo de forma completamente electrónica a través de nuestra plataforma, sin que exista en ningún momento presencia física de las partes y/o transacción física externa.</p>
            <p>Cualquier persona con acceso a Internet puede llevar a cabo la contratación, con el único requisito previo de haberse registrado como usuario, siendo éste esencial para poder iniciar el procedimiento de contratación.</p>
            <p>Las fases del procedimiento de contratación son visibles para los usuarios a lo largo de todo el procedimiento de contratación. Pueden diferenciarse 3 fases:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Identificación del usuario.</li>
              <li>Selección del servicio y forma de pago.</li>
              <li>Confirmación del servicio.</li>
            </ol>
            <p>El usuario únicamente debe seleccionar el servicio que desea adquirir y pulsar el botón de compra dispuesto al efecto. De esta forma, dará comienzo el procedimiento de contratación que seguirá siempre los pasos anteriormente indicados para todos los servicios disponibles.</p>
            <p>Una vez seleccionado el servicio, la cantidad, los impuestos aplicables, el precio total y el medio de pago, la plataforma mostrará al usuario un resumen de la contratación realizada, junto a las condiciones de contratación aplicables, que en todo caso deberán ser expresamente aceptadas por el usuario para poder seguir el proceso de contratación.</p>
            <p>Una vez marcada la casilla de aceptación de las condiciones de contratación, en caso de haber seleccionado como forma de pago alguno de los medios electrónicos, el usuario será directamente redireccionado a la plataforma de pago externa correspondiente para realizar el pago, sin que https://www.shootandrun.es tenga posibilidad de acceder en ningún momento a los datos de tarjetas de crédito y/o sistemas de pago del usuario.</p>
            <p>La seguridad del procedimiento de pago se encuentra garantizada por parte de la entidad financiera.</p>
            <p>Una vez finalizada la contratación del servicio, se mostrará una pantalla resumen de la contratación realizada.</p>
            <p>En caso de haberse seleccionado el pago mediante tarjeta de crédito, éste se llevará a cabo a través de la TPV del banco, plataforma completamente ajena e independiente del prestador.</p>
            <p>En el plazo máximo de 24 horas, el contratante del servicio recibirá un correo electrónico en el que se mostrará toda la información relativa al servicio contratado. Este documento es la confirmación de que la contratación se ha realizado con éxito, siendo válida como medio de acreditación para cualquier tipo de reclamación, siempre y cuando se adjunte el justificante del pago correspondiente.</p>
            <p>El prestador informa al usuario de que todas las contrataciones realizadas quedarán registradas en un fichero para el control y gestión de contrataciones, en el que quedarán reflejados junto a la información de los servicios contratados, información adicional para garantizar la seguridad y evidencia de la correcta realización del procedimiento.</p>

            <h4 className="text-foreground font-medium">3. DERECHO DE DESISTIMIENTO DE LA CONTRATACIÓN</h4>
            <p>De conformidad con lo dispuesto en el Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes complementarias, junto con el artículo 45 de la Ley 7/1996, del Comercio Minorista, el usuario tiene derecho a desistir del contrato durante el plazo de desde el momento en que se ha contratado el servicio.</p>
            <p>Para ejercer el derecho al desistimiento, el usuario simplemente deberá solicitarlo por escrito a cualquiera de las direcciones mencionadas a continuación, indicando expresamente su solicitud de ejercicio del derecho de desistimiento:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dirección Postal: C/ Independencia, 31. – 30820 – Alcantarilla (Murcia)</li>
              <li>Correo electrónico: hola@shootandrun.es</li>
            </ul>
            <p>En cualquier caso, corresponde al consumidor y usuario probar que ha ejercitado su derecho de desistimiento conforme a lo dispuesto en este capítulo.</p>
            <p>Una vez recibida la solicitud de ejercicio del derecho de desistimiento, procederemos a restituir la cantidad económica abonada (sin que en ningún caso se incluyan los gastos de envío y de gestión que se hubieran podido abonar inicialmente) en el plazo máximo de 14 días naturales desde el momento de la recepción del desistimiento y siempre a través del medio utilizado para abonar el servicio, o en su defecto mediante transferencia bancaria.</p>
            <p>El ejercicio del derecho de desistimiento requiere en todo momento que el usuario no haya consumido o disfrutado de ninguno de los servicios contratados. En caso de que hubiera consumido alguno de dichos servicios, no será posible ejercer el derecho de desistimiento.</p>

            <h3 className="text-foreground font-semibold pt-2">OBLIGACIONES DEL USUARIO</h3>
            <p>El usuario, se compromete durante la vigencia del presente contrato a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>No utilizar la plataforma o cualquiera de los elementos que la integren, para desarrollar operaciones de tiempo compartido, constituirse en proveedor de servicios de aplicaciones software en la medida en que estuvieren orientados a hacer posible el acceso de terceros a la plataforma o a cualquiera de sus componentes, a través de operaciones de alquiler, servicios administrativos o cualesquiera otros de análoga consideración, compartiéndolos o poniéndolos a disposición de terceros.</li>
              <li>No someter la plataforma o cualesquiera de sus elementos, a actividades encaminadas, directa o indirectamente a la descompilación de su software, que impliquen su sometimiento a operaciones de naturaleza inversa a las que determinaron su construcción o que, en último término, constituyan o puedan constituir operaciones de ingeniería inversa, descompilación o desensamblado.</li>
              <li>No publicar la plataforma, ni utilizarla como sistema de gestión e intercambio de información y/o documentación ilegal, contraria a la moral o al orden público, contraria a los derechos de autor y/o de propiedad industrial.</li>
              <li>No someter a la plataforma a cargas de trabajo orientadas a la desestabilización de la misma, encontrándose entre éstas, ataques de denegación de servicio (DDoS) o situaciones semejantes.</li>
              <li>No realizar actos de ingeniería inversa, toma de requisitos y demás actividades encaminadas a desarrollar una plataforma online idéntica o semejante.</li>
              <li>No traducir, adaptar, mejorar, transformar, modificar ni corregir la plataforma o cualquiera de los elementos que la integren.</li>
              <li>No retirar, suprimir, alterar, manipular ni en modo alguno modificar aquellas notas, leyendas, indicaciones o símbolos de propiedad intelectual o industrial.</li>
              <li>Aceptar que https://www.shootandrun.es pueda introducir en el sitio web publicidad contextualizada o no.</li>
              <li>Abonar las cantidades económicas expresamente indicadas en el presente contrato en tiempo y forma.</li>
              <li>Poner en conocimiento del prestador cualquier hecho o situación que pudiera poner en riesgo la seguridad en el acceso por parte de usuarios autorizados.</li>
              <li>Queda prohibido forzar fallos o buscar brechas de seguridad en la plataforma.</li>
            </ul>

            <h3 className="text-foreground font-semibold pt-2">GARANTÍAS Y RESPONSABILIDADES</h3>
            <p>Estamos profundamente comprometidos con que nuestros servicios funcionen correctamente y conforme a las condiciones acordadas con nuestros usuarios. No obstante, en ocasiones es posible que se produzcan, especialmente por la intervención de terceros mal intencionados, situaciones que pudieran provocar responsabilidades.</p>
            <p>En este sentido, a continuación os indicamos aquellas situaciones en las que no nos hacemos responsables de las actuaciones de los usuarios, asumiendo éstos todas las responsabilidades derivadas:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>En caso de que aparezca publicada en la plataforma información que no hubiera sido alojada por nuestra parte o que en su caso hubiera sido publicada por un tercero ajeno a la organización.</li>
              <li>En caso de que la plataforma no se encuentre operativa por razones técnicas imputables a terceros o causas imprevisibles y/o de fuerza mayor.</li>
              <li>En caso de que el usuario almacene o cualquier tercero, difunda, publique o distribuya en la plataforma cualquier tipo de material difamatorio, injurioso, discriminatorio, que incite a la violencia o que vaya contra la moral, el orden público, los derechos fundamentales, las libertas públicas, el honor, la intimidad o la imagen de terceros.</li>
              <li>En caso de que el usuario o cualquier tercero utilice la plataforma para introducir datos, virus, código malicioso, hardware o cualquier otro instrumento o dispositivo electrónico o físico, y se causen daños a los sistemas de otros usuarios.</li>
            </ul>
            <p>Los servicios puestos a disposición y comercializados a través de https://www.shootandrun.es son provistos por parte de terceras compañías ajenas y completamente independientes del prestador. Por ello, https://www.shootandrun.es no se hace responsable en caso de los fallos puntuales en la continuidad del servicio o en su caso en la falta de disponibilidad puntual del mismo.</p>
            <p>En caso de que los servicios contratados por parte del usuario no se encuentren disponibles durante un plazo de más de 72 horas desde el momento de la notificación de la incidencia, el usuario queda facultado para solicitar al prestador la rescisión del presente contrato y la devolución de las cantidades económicas correspondientes a los servicios no disfrutados.</p>

            <h3 className="text-foreground font-semibold pt-2">DERECHOS DE PROPIEDAD INTELECTUAL E INDUSTRIAL</h3>
            <h4 className="text-foreground font-medium">1. RELATIVOS A LA PLATAFORMA ONLINE</h4>
            <p>El prestador garantiza al usuario que es el legítimo propietario de la plataforma y que ésta no se encuentra inmersa en ningún tipo de disputa legal previa a la firma del presente contrato.</p>
            <p>El usuario reconoce expresamente que el prestador ostenta todo derecho, título e interés sobre la plataforma y los desarrollos informáticos asociados al servicio, así como sobre todos sus módulos, modificaciones y actualizaciones y sobre cualquier elemento y/o funcionalidad que fuera desarrollada sobre la misma.</p>
            <p>La estructura, características, códigos, métodos de trabajo, sistemas de información e intercambio de la misma, herramientas de desarrollo, know-how, metodologías, procesos, tecnologías o algoritmos que constituyan y/o puedan constituir la plataforma, son propiedad exclusiva del prestador, encontrándose debidamente protegidos por las leyes nacionales e internacionales de propiedad intelectual y/o industrial.</p>

            <h4 className="text-foreground font-medium">2. RELATIVOS A LOS CONTENIDOS E INFORMACIÓN DE LOS USUARIOS</h4>
            <p>Todos los contenidos e informaciones publicadas o gestionados por parte de los usuarios en la plataforma son propiedad exclusiva de éste, siendo https://www.shootandrun.es un mero prestador de servicios de la sociedad de la información encargado del almacenamiento de datos.</p>

            <h3 className="text-foreground font-semibold pt-2">CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS</h3>
            <p>De conformidad con lo dispuesto por el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos, todos los datos de carácter personal facilitados durante la utilización de la plataforma y durante la prestación de los servicios serán tratados de conformidad con lo dispuesto en la Política de Privacidad, que todo usuario debe aceptar expresamente y de forma previa para poder registrarse.</p>

            <h3 className="text-foreground font-semibold pt-2">CONDICIONES TEMPORALES</h3>
            <p>Las presentes condiciones entrarán en vigor en la fecha de la contratación del servicio y tendrán una duración de un año, renovándose de forma tácita por períodos anuales.</p>
            <p>Cualquiera de las partes podrá dar por finalizado el presente contrato mediante comunicación expresa y escrita a la otra parte, al menos con 30 días de antelación al inicio del período siguiente.</p>

            <h3 className="text-foreground font-semibold pt-2">CONDICIONES ECONÓMICAS</h3>
            <p>Las tarifas aplicables a cada uno de los servicios ofrecidos a través de la plataforma serán única y exclusivamente aquellas que se encuentren publicadas en la plataforma online, siendo éstas las únicamente válidas, salvo error tipográfico o de transcripción.</p>
            <p>Todos los servicios contratados serán debidamente facturados y abonados de forma previa a la prestación de los servicios o a mes vencido, dependiendo de la modalidad de contratación empleada.</p>
            <p>Todas las tarifas se verán incrementadas con el importe correspondiente a los impuestos vigentes en la fecha de emisión de la factura, quedando debidamente reflejados en el resumen de cada compra.</p>

            <h3 className="text-foreground font-semibold pt-2">SERVICIO DE ATENCIÓN AL USUARIO Y SERVICIO TÉCNICO</h3>
            <ul className="space-y-1">
              <li><strong>Horario:</strong> 9:00 a 14:00 h.</li>
              <li><strong>Teléfono:</strong> +34 606323053</li>
              <li><strong>Email:</strong> hola@shootandrun.es</li>
            </ul>
            <p>Salvo disposición particular en contrario, el servicio de atención al usuario será exclusivamente prestado en castellano.</p>

            <h3 className="text-foreground font-semibold pt-2">EXTINCIÓN DEL CONTRATO</h3>
            <p>El presente contrato puede ser extinguido siempre que se produzca alguna de las siguientes circunstancias:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Incumplimiento de las obligaciones dispuestas en el presente contrato.</li>
              <li>Por el transcurso de su plazo de duración, siempre que alguna de las partes hubiera manifestado expresamente con al menos 30 días de antelación su voluntad de no renovar automáticamente el contrato.</li>
              <li>La declaración de concurso de acreedores de la otra parte.</li>
              <li>En caso de que no se abonen conforme a los plazos y forma acordados las cantidades económicas correspondientes.</li>
              <li>La disolución, liquidación o pérdida de personalidad jurídica de alguna de las partes.</li>
              <li>Cualquier cambio o variación sustancial de las condiciones esenciales.</li>
            </ul>

            <h3 className="text-foreground font-semibold pt-2">RESOLUCIÓN EXTRAJUDICIAL DE CONFLICTOS</h3>
            <p>Asimismo, en los términos que se recogen en el artículo 14 del Reglamento UE 524/2013, sobre resolución de litigios en materia de consumo, se proporciona un enlace directo a la plataforma de resolución de litigios en línea: https://ec.europa.eu/consumers/odr/main/index.cfm</p>

            <h3 className="text-foreground font-semibold pt-2">LEY APLICABLE Y JURISDICCIÓN</h3>
            <p>Para cualquier controversia o conflicto que pudiera surgir, derivado de estos términos o condiciones, resultará de aplicación la Ley Española. La resolución de los conflictos judiciales se someterá a la competencia de los Juzgados y Tribunales del domicilio del usuario o cliente.</p>

            <p className="pt-4 text-xs text-muted-foreground/70">REV: 20.3009</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
