import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, User, Mail, Phone, Users, Gamepad2, PartyPopper, Sparkles, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ADMIN_EMAIL = 'info@shootandrun.es'; // Email donde recibirás las notificaciones

const reservationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  reservation_date: z.date({ required_error: 'Selecciona una fecha' }),
  reservation_time: z.string().min(1, 'Selecciona una hora'),
  number_of_people: z.string().min(1, 'Selecciona el número de personas'),
  activity_type: z.enum(['laser_tag', 'vr', 'both'], { required_error: 'Selecciona una actividad' }),
  event_type: z.enum(['casual', 'birthday', 'corporate', 'team_building', 'other'], { required_error: 'Selecciona el tipo de evento' }),
  extras: z.array(z.string()).default([]),
  special_requests: z.string().optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const timeSlots = [
  '10:00', '11:00', '12:00', '13:00', '14:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const extrasOptions = [
  { id: 'snacks', label: 'Snacks y bebidas', icon: '🍿' },
  { id: 'photos', label: 'Sesión de fotos', icon: '📸' },
  { id: 'private_session', label: 'Sesión privada', icon: '🚪' },
  { id: 'diploma', label: 'Diploma para ganador', icon: '🏆' },
  { id: 'video_invitation', label: 'Videoinvitación', icon: '🎬' },
];

interface ReservationFormProps {
  onClose: () => void;
}

const ReservationForm = ({ onClose }: ReservationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      number_of_people: '2',
      activity_type: 'both',
      event_type: 'casual',
      extras: [],
      special_requests: '',
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Insert reservation into database
      const { data: reservation, error: dbError } = await supabase
        .from('reservations')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          reservation_date: format(data.reservation_date, 'yyyy-MM-dd'),
          reservation_time: data.reservation_time,
          number_of_people: parseInt(data.number_of_people),
          activity_type: data.activity_type,
          event_type: data.event_type,
          extras: data.extras,
          special_requests: data.special_requests || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Send notification emails
      const { error: emailError } = await supabase.functions.invoke('send-reservation-notification', {
        body: {
          adminEmail: ADMIN_EMAIL,
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone,
          reservationDate: format(data.reservation_date, 'yyyy-MM-dd'),
          reservationTime: data.reservation_time,
          numberOfPeople: parseInt(data.number_of_people),
          activityType: data.activity_type,
          eventType: data.event_type,
          extras: data.extras,
          specialRequests: data.special_requests,
          reservationId: reservation.id,
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the reservation if email fails
      }

      setIsSuccess(true);
      toast.success('¡Reserva realizada con éxito!');
      
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al realizar la reserva. Inténtalo de nuevo.');
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
          ¡Reserva Confirmada!
        </h3>
        <p className="text-muted-foreground">
          Te hemos enviado un email con los detalles de tu reserva.
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
        </div>

        {/* Reservation Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-neon-purple" />
            Detalles de la Reserva
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="reservation_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-background/50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reservation_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Selecciona hora" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="number_of_people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de personas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="¿Cuántos sois?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'persona' : 'personas'}
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
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actividad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Elige actividad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="laser_tag">🔫 Laser Tag</SelectItem>
                      <SelectItem value="vr">🥽 Realidad Virtual</SelectItem>
                      <SelectItem value="both">🎮 Laser Tag + VR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Event Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-neon-red" />
            Tipo de Evento
          </h3>
          
          <FormField
            control={form.control}
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="¿Qué celebras?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="casual">😎 Visita casual</SelectItem>
                    <SelectItem value="birthday">🎂 Cumpleaños</SelectItem>
                    <SelectItem value="corporate">💼 Evento corporativo</SelectItem>
                    <SelectItem value="team_building">🤝 Team Building</SelectItem>
                    <SelectItem value="other">✨ Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Extras */}
        <div className="space-y-4">
          <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-blue" />
            Extras (opcional)
          </h3>
          
          <FormField
            control={form.control}
            name="extras"
            render={() => (
              <FormItem>
                <div className="grid sm:grid-cols-2 gap-3">
                  {extrasOptions.map((extra) => (
                    <FormField
                      key={extra.id}
                      control={form.control}
                      name="extras"
                      render={({ field }) => (
                        <FormItem
                          key={extra.id}
                          className="flex items-center space-x-3 space-y-0 p-3 rounded-lg bg-background/30 border border-border hover:border-neon-blue/50 transition-colors cursor-pointer"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(extra.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, extra.id])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== extra.id)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                            <span>{extra.icon}</span>
                            {extra.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Special Requests */}
        <FormField
          control={form.control}
          name="special_requests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peticiones especiales (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="¿Algo que debamos saber? Alergias, necesidades especiales, etc."
                  className="bg-background/50 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
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
                Reservando...
              </>
            ) : (
              'Confirmar Reserva'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReservationForm;
