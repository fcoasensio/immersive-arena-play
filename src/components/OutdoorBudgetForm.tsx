import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, MapPin, Users, FileText, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OUTDOOR_EMAIL = 'outdoor@shootandrun.es';

const outdoorSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  company: z.string().optional(),
  location: z.string().min(2, 'Indica la ubicación del evento'),
  number_of_people: z.string().min(1, 'Selecciona el número de personas'),
  event_type: z.enum(['birthday', 'corporate', 'school', 'team_building', 'festival', 'other'], { required_error: 'Selecciona el tipo de evento' }),
  details: z.string().optional(),
});

type OutdoorFormData = z.infer<typeof outdoorSchema>;

const peopleOptions = [
  '10-20', '20-30', '30-50', '50-100', '100+'
];

interface OutdoorBudgetFormProps {
  onClose: () => void;
}

const OutdoorBudgetForm = ({ onClose }: OutdoorBudgetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<OutdoorFormData>({
    resolver: zodResolver(outdoorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      number_of_people: '',
      event_type: undefined,
      details: '',
    },
  });

  const onSubmit = async (data: OutdoorFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-outdoor-budget-notification', {
        body: {
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone,
          company: data.company || '',
          location: data.location,
          numberOfPeople: data.number_of_people,
          eventType: data.event_type,
          details: data.details || '',
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('¡Solicitud de presupuesto enviada!');

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">
          ¡Solicitud Enviada!
        </h3>
        <p className="text-muted-foreground">
          Nos pondremos en contacto contigo lo antes posible con un presupuesto personalizado.
        </p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-neon-blue" />
            Información de Contacto
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+34 600 000 000" {...field} className="bg-background/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@email.com" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa / Organización (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la empresa" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-neon-purple" />
            Detalles del Evento Outdoor
          </h3>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación del evento</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad, zona o dirección" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="number_of_people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número estimado de personas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="¿Cuántos sois?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {peopleOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt} personas
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de evento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="birthday">🎂 Cumpleaños</SelectItem>
                      <SelectItem value="corporate">💼 Evento corporativo</SelectItem>
                      <SelectItem value="school">🏫 Centro educativo</SelectItem>
                      <SelectItem value="team_building">🤝 Team Building</SelectItem>
                      <SelectItem value="festival">🎪 Festival / Feria</SelectItem>
                      <SelectItem value="other">✨ Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Details */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalles adicionales (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos sobre tu evento: fecha aproximada, necesidades especiales, espacio disponible..."
                  className="bg-background/50 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center italic">
          Una vez recibida tu solicitud, el equipo de Shoot&Run te enviará un presupuesto personalizado sin compromiso.
        </p>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="hero"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Solicitud'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OutdoorBudgetForm;
