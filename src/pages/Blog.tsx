import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroBg from '@/assets/hero-bg.jpg';
import laserCard from '@/assets/recursos/cumpleanos-laser-tag.jpg';
import vrCard from '@/assets/recursos/eventos-empresa-laser-tag.jpg';
import laserEquip from '@/assets/recursos/laser-tag-outdoor-evento.jpg';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'top-5-planes-cumpleanos-murcia',
    title: 'Top 5 planes para cumpleaños en Murcia',
    excerpt: 'Descubre las mejores opciones para celebrar un cumpleaños infantil o de adolescentes en la Región de Murcia. Desde laser tag hasta experiencias de realidad virtual.',
    image: laserCard,
    date: '2026-04-01',
    readTime: '6 min',
    category: 'Cumpleaños',
  },
  {
    slug: 'laser-tag-vs-paintball-cual-elegir',
    title: 'Laser tag vs paintball: cuál elegir',
    excerpt: 'Comparamos ambas actividades punto por punto: dolor, precio, edad mínima, seguridad y diversión. ¿Cuál es la mejor opción para tu grupo?',
    image: laserEquip,
    date: '2026-03-25',
    readTime: '5 min',
    category: 'Guías',
  },
  {
    slug: 'ideas-eventos-empresa-murcia',
    title: 'Ideas para eventos de empresa en Murcia',
    excerpt: 'Las mejores actividades de team building y eventos corporativos en Murcia. Fortalece tu equipo con experiencias que combinan diversión y trabajo en equipo.',
    image: vrCard,
    date: '2026-03-18',
    readTime: '7 min',
    category: 'Empresas',
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Blog | Shoot and Run - Laser Tag y VR en Murcia</title>
        <meta name="description" content="Blog de Shoot and Run: artículos sobre laser tag, realidad virtual, cumpleaños, eventos de empresa y planes de ocio en Murcia." />
        <link rel="canonical" href="https://shootandrunweb.lovable.app/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block font-body text-sm uppercase tracking-widest text-neon-blue mb-4">Blog</span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                Noticias y <span className="text-neon-blue text-glow-blue">Consejos</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground max-w-2xl">
                Artículos sobre laser tag, realidad virtual, planes de ocio y eventos en Murcia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {blogPosts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block h-full">
                    <div className="h-full rounded-xl border border-border bg-card/50 overflow-hidden hover:border-neon-blue/40 transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-body uppercase tracking-wider bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-xs font-body text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                        </div>
                        <h2 className="font-display text-lg font-bold text-foreground group-hover:text-neon-blue transition-colors mb-3">
                          {post.title}
                        </h2>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1 font-body text-sm text-neon-blue group-hover:gap-2 transition-all">
                          Leer más <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
