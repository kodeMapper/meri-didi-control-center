
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LocationMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
}

export function LocationMapDialog({ open, onOpenChange, address }: LocationMapDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Encode the address for the Google Maps URL
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
          <DialogDescription>{address}</DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading map...</div>
            </div>
          )}
          <iframe
            src={mapSrc}
            className="w-full h-full border-0 rounded-md"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={() => window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')}
            className="mt-2"
          >
            Open in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
