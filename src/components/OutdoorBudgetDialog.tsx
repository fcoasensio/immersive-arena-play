import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import OutdoorBudgetForm from './OutdoorBudgetForm';

interface OutdoorBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutdoorBudgetDialog = ({ open, onOpenChange }: OutdoorBudgetDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red bg-clip-text text-transparent">
            Presupuesto Outdoor
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <OutdoorBudgetForm onClose={() => onOpenChange(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OutdoorBudgetDialog;
