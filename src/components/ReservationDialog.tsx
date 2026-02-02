import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import ReservationForm from './ReservationForm';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReservationDialog = ({ open, onOpenChange }: ReservationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red bg-clip-text text-transparent">
            Reservar Experiencia
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <ReservationForm onClose={() => onOpenChange(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
