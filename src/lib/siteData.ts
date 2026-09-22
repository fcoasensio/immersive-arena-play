export const SITE_URL = "https://shootandrun.es";

export const businessData = {
  name: "shootandrun",
  legalName: "Shoot and Run",
  description:
    "Centro de laser tag y realidad virtual Free Roaming para grupos, cumpleaños y eventos en Alcantarilla, Murcia.",
  telephone: "+34606323053",
  email: "reservas@shootandrun.es",
  address: {
    streetAddress: "Avda. Fernando III El Santo, 24",
    postalCode: "30820",
    addressLocality: "Alcantarilla",
    addressRegion: "Murcia",
    addressCountry: "ES",
  },
  geo: { latitude: 37.9693, longitude: -1.2265 },
  social: [
    "https://www.instagram.com/shootandrunlasertag",
    "https://www.facebook.com/shootandrunlasertag/",
  ],
} as const;

export const publicServices = [
  {
    name: "Laser Tag indoor y outdoor",
    path: "/laser-tag-murcia",
    description: "Laser tag para grupos desde 8 años, con hasta 16 jugadores simultáneos en la pista.",
    audience: "Grupos, cumpleaños, despedidas, empresas, centros educativos y ayuntamientos",
  },
  {
    name: "Realidad Virtual Free Roaming",
    path: "/realidad-virtual-murcia",
    description: "Experiencias multijugador desde 12 años, con hasta 12 jugadores simultáneos.",
    audience: "Familias, grupos, cumpleaños y empresas",
  },
  {
    name: "Cumpleaños con Laser Tag",
    path: "/cumpleanos-laser-tag-murcia",
    description: "Cumpleaños organizados desde 8 años con partidas, monitor, menú y zona de merienda.",
    audience: "Cumpleaños infantiles y adolescentes",
  },
  {
    name: "Eventos de empresa y team building",
    path: "/eventos-empresa-laser-tag",
    description: "Actividades adaptadas para cohesión de equipos, celebraciones y jornadas corporativas.",
    audience: "Empresas y organizaciones",
  },
] as const;

export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
