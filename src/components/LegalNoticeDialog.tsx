import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactNode } from 'react';

interface LegalNoticeDialogProps {
  children: ReactNode;
}

const LegalNoticeDialog = ({ children }: LegalNoticeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-xl">Aviso Legal</DialogTitle>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 h-[60vh]">
          <div className="font-body text-sm text-muted-foreground space-y-4 pr-4">
            <p>En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), el propietario de la web, le informa de lo siguiente:</p>

            <ul className="space-y-1">
              <li><strong>Denominación social:</strong> Francisco Jiménez Asensio</li>
              <li><strong>NIF:</strong> 52806442Y</li>
              <li><strong>Domicilio:</strong> C/ Independencia, 31, 30820 – Alcantarilla (Murcia)</li>
            </ul>

            <p>Con los límites establecidos en la ley, Francisco Jiménez Asensio no asume ninguna responsabilidad derivada de la falta de veracidad, integridad, actualización y precisión de los datos o informaciones que contienen sus páginas web.</p>

            <p>Los contenidos e información no vinculan a Francisco Jiménez Asensio ni constituyen opiniones, consejos o asesoramiento legal de ningún tipo pues se trata meramente de un servicio ofrecido con carácter informativo y divulgativo.</p>

            <p>Las páginas de Internet de Francisco Jiménez Asensio pueden contener enlaces (links) a otras páginas de terceras partes que Francisco Jiménez Asensio no puede controlar. Por lo tanto, Francisco Jiménez Asensio no puede asumir responsabilidades por el contenido que pueda aparecer en páginas de terceros.</p>

            <p>Los textos, imágenes, sonidos, animaciones, software y el resto de contenidos incluidos en este website son propiedad exclusiva de Francisco Jiménez Asensio o sus licenciantes. Cualquier acto de transmisión, distribución, cesión, reproducción, almacenamiento o comunicación pública total o parcial, deberá contar con el consentimiento expreso de Francisco Jiménez Asensio.</p>

            <p>Asimismo, para acceder a algunos de los servicios que Francisco Jiménez Asensio ofrece a través del sitio web, deberá proporcionar algunos datos de carácter personal. En cumplimiento de lo establecido en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos le informamos que, mediante la cumplimentación de los presentes formularios, sus datos personales quedarán incorporados y serán tratados en los ficheros de Francisco Jiménez Asensio con el fin de poderle prestar y ofrecer nuestros servicios así como para informarle de las mejoras del sitio Web.</p>

            <p>Le informamos también de que tendrá la posibilidad en todo momento de ejercer los derechos de acceso, rectificación, cancelación, oposición, limitación y portabilidad de sus datos de carácter personal, de manera gratuita mediante email a: fcoasensio@gmail.com o en la dirección: C/ Independencia, 31, 30820 – Alcantarilla (Murcia).</p>

            <p className="pt-4 text-xs text-muted-foreground/70">REV: 20.3009</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LegalNoticeDialog;
