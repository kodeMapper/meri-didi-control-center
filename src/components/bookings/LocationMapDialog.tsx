
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface LocationMapDialogProps {
  open: boolean;
  onClose: () => void;
  address: string;
}

export function LocationMapDialog({ open, onClose, address }: LocationMapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Location Map</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <div className="bg-gray-100 rounded-md h-[300px] flex items-center justify-center">
            <p className="text-gray-500">Map would be displayed here for address: {address}</p>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Address: {address}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
