// GDPR / LOPDGDD legal footer for all outbound emails.
// Bilingual (Spanish + English) text supplied by the data controller.

const GDPR_MARKER = "<!--gdpr-footer-v1-->";

export const gdprFooterHtml = `${"<!--gdpr-footer-v1-->"}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;border-top:1px solid #e5e5e5;background:#fafafa;">
  <tr>
    <td style="padding:18px 24px;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.5;color:#888;">
      <p style="margin:0 0 10px;">
        Este mensaje va dirigido, de manera exclusiva, a su destinatario y puede contener información confidencial y sujeta al secreto profesional, cuya divulgación no está permitida por Ley. En caso de haber recibido este mensaje por error, le rogamos que de forma inmediata, nos lo comunique mediante correo electrónico remitido a nuestra atención y proceda a su eliminación, así como a la de cualquier documento adjunto al mismo. Asimismo, le comunicamos que la distribución, copia o utilización de este mensaje, o de cualquier documento adjunto al mismo, cualquiera que fuera su finalidad, están prohibidas por ley.
      </p>
      <p style="margin:0 0 10px;">
        En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), le informamos que el Responsable del tratamiento es Francisco Jiménez Asensio, con NIF 52806442Y. Estos datos personales serán tratados con la finalidad de mantener el contacto y la comunicación. Puede ejercer los derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición, de manera gratuita mediante correo electrónico a <a href="mailto:rgpd@shootandrun.es" style="color:#888;text-decoration:underline;">rgpd@shootandrun.es</a>.
      </p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:12px 0;">
      <p style="margin:0 0 10px;">
        This message and its contents may contain confidential information and its non-authorised use is prohibited by law. If you are not the intended recipient of this email, please advise this fact using the same, or other mode, and delete this message and its contents from your system without copying, forwarding or revealing the contents of the message to any other person. In addition, we inform you that the distribution, copy or use of this message and its attached documents with any purpose are prohibited by law.
      </p>
      <p style="margin:0;">
        In order to comply with General Data Protection Regulation (GDPR), you can exercise right of access, rectification, erasure, restriction of processing, portability and object, sending an e-mail to: <a href="mailto:rgpd@shootandrun.es" style="color:#888;text-decoration:underline;">rgpd@shootandrun.es</a> or written communication to the following address: Avda. Fernando III El Santo, 24, 30820 - Alcantarilla (Murcia).
      </p>
    </td>
  </tr>
</table>
`;

export const gdprFooterText = `
---
Este mensaje va dirigido, de manera exclusiva, a su destinatario y puede contener información confidencial y sujeta al secreto profesional. Si lo ha recibido por error, comuníquenoslo y elimínelo. En cumplimiento del RGPD (UE) 2016/679 y la LOPDGDD 3/2018, el Responsable del tratamiento es Francisco Jiménez Asensio (NIF 52806442Y). Ejercite sus derechos en rgpd@shootandrun.es.

This message may contain confidential information. If you are not the intended recipient, please delete it. Under GDPR you may exercise your rights at rgpd@shootandrun.es or Avda. Fernando III El Santo, 24, 30820 - Alcantarilla (Murcia).
`;

/**
 * Idempotently appends the GDPR legal footer to an HTML email body.
 * If the marker is already present, returns the html unchanged.
 * Inserts before </body> when present, otherwise appends at the end.
 */
export function appendGdprFooter(html: string): string {
  if (!html) return gdprFooterHtml;
  if (html.includes(GDPR_MARKER)) return html;
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${gdprFooterHtml}</body>`);
  }
  return html + gdprFooterHtml;
}

