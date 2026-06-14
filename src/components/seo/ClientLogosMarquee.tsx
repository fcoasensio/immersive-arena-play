import { type CSSProperties } from 'react';

/**
 * Marquee infinito en escala de grises con los nombres de empresas
 * que han confiado en shootandrun. Los "logos" son versiones
 * tipográficas monocromas para evitar problemas de uso de marca.
 */

type Client = {
  name: string;
  /** Texto principal mostrado como wordmark */
  label: string;
  /** Texto secundario opcional (p.ej. ciudad) */
  sub?: string;
  /** Clases tipográficas que evocan la identidad visual de la marca */
  className?: string;
  /** Estilo inline para tracking/peso especial */
  style?: CSSProperties;
};

const CLIENTS: Client[] = [
  { name: 'Decathlon Almería', label: 'DECATHLON', sub: 'ALMERÍA', className: 'font-display font-black italic tracking-tight' },
  { name: 'Decathlon Toledo', label: 'DECATHLON', sub: 'TOLEDO', className: 'font-display font-black italic tracking-tight' },
  { name: 'Abundantia Investments', label: 'Abundantia', sub: 'INVESTMENTS', className: 'font-serif italic font-light tracking-wide' },
  { name: 'Citromur', label: 'CITROMUR', className: 'font-display font-bold tracking-[0.2em]' },
  { name: 'Asegrícola', label: 'ASEGRÍCOLA', className: 'font-body font-semibold tracking-[0.15em]' },
  { name: 'Verisure', label: 'verisure', className: 'font-body font-bold lowercase tracking-tight text-[1.6em]' },
  { name: 'EPAM NEORIS', label: 'EPAM', sub: 'NEORIS', className: 'font-display font-black tracking-tight' },
  { name: 'Skynet Systems', label: 'SKYNET', sub: 'SYSTEMS', className: 'font-display font-bold tracking-[0.25em]' },
  { name: 'SIM Seguridad', label: 'SIM', sub: 'SEGURIDAD', className: 'font-display font-black tracking-tight' },
  { name: 'Lidl', label: 'Lidl', className: 'font-display font-black italic tracking-tight text-[1.6em]' },
];

const Logo = ({ client }: { client: Client }) => (
  <div
    className="flex items-center justify-center h-16 px-10 shrink-0 text-foreground/50 hover:text-foreground transition-colors duration-300"
    aria-label={client.name}
    translate="no"
  >
    <div className={`flex flex-col items-center leading-none ${client.className ?? ''}`} style={client.style}>
      <span className="text-xl md:text-2xl">{client.label}</span>
      {client.sub && (
        <span className="text-[0.6em] tracking-[0.3em] font-normal mt-1 opacity-80">{client.sub}</span>
      )}
    </div>
  </div>
);

const ClientLogosMarquee = () => {
  // Duplicamos la lista para conseguir un scroll continuo sin saltos
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section
      aria-label="Empresas que han confiado en nosotros"
      className="py-4"
    >
      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
        Empresas que ya han <span className="text-neon-blue">confiado en nosotros</span>
      </h2>

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {items.map((client, i) => (
            <Logo key={`${client.name}-${i}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosMarquee;
