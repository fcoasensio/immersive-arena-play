import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts } from '@/pages/Blog';

interface BlogArticleLayoutProps {
  slug: string;
  children: React.ReactNode;
}

const BlogArticleLayout = ({ slug, children }: BlogArticleLayoutProps) => {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;

  return (
    <>
      <Helmet>
        <title>{post.title} | Blog Shoot and Run</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://shootandrunweb.lovable.app/blog/${post.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 overflow-hidden">
          <div className="absolute inset-0">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/blog" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-neon-blue transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Volver al blog
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-body uppercase tracking-wider bg-neon-blue/20 text-neon-blue border border-neon-blue/30 mb-4">
                {post.category}
              </span>
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm font-body text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} de lectura</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <article className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto font-body text-base md:text-lg text-muted-foreground leading-relaxed space-y-6"
            >
              {children}
            </motion.div>
          </div>
        </article>

        {/* CTA */}
        <section className="py-12 md:py-16 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-xl md:text-3xl font-bold text-foreground mb-4">
              ¿Te ha gustado el artículo?
            </h2>
            <p className="font-body text-muted-foreground mb-6 max-w-lg mx-auto">
              Reserva tu experiencia de laser tag o realidad virtual en Shoot and Run.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glow" size="lg" asChild>
                <Link to="/reservar">Reservar ahora</Link>
              </Button>
              <Button variant="neon" size="lg" asChild>
                <a href="https://wa.me/34606323053" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default BlogArticleLayout;
