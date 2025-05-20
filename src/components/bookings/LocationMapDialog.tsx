
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check } from "lucide-react";

interface LocationMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
}

export function LocationMapDialog({ open, onOpenChange, address }: LocationMapDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Encode the address for the Google Maps URL
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {address}
            <button 
              onClick={copyToClipboard}
              className="hover:bg-gray-100 p-1 rounded-full"
              title="Copy address"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </DialogDescription>
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
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={copyToClipboard}
            className="flex items-center gap-1"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Address"}
          </Button>
          <Button 
            onClick={openInGoogleMaps}
            className="flex items-center gap-1"
          >
            <ExternalLink size={16} />
            Open in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
