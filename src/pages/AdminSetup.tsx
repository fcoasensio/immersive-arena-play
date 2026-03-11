import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if any admin exists
    supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('role', 'admin')
      .then(({ count }) => {
        if (count && count > 0) setHasAdmin(true);
        setChecking(false);
      });
  }, []);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('No se pudo crear el usuario');

      // Assign admin role via edge function (uses JWT to identify caller)
      const { error: roleError } = await supabase.functions.invoke('assign-admin-role');

      if (roleError) throw roleError;

      toast.success('¡Cuenta de administrador creada! Iniciando sesión...');
      
      // Sign in
      await supabase.auth.signInWithPassword({ email, password });
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardContent className="py-12 text-center">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-foreground font-semibold">Ya existe un administrador.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/login')}>
              Ir al login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display text-foreground">Configuración Inicial</CardTitle>
          <CardDescription>Crea la primera cuenta de administrador</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email del administrador</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-background/50" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando...</> : 'Crear cuenta admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
