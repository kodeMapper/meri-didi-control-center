
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BookingFilters } from '@/types';

interface BookingFiltersProps {
  onFiltersChange: (filters: BookingFilters) => void;
}

export function BookingFiltersBar({ onFiltersChange }: BookingFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [serviceType, setServiceType] = useState<string>("all");
  const [paymentMode, setPaymentMode] = useState<string>("all");
  const [location, setLocation] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    onFiltersChange({
      dateRange: {
        from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : '',
        to: dateTo ? format(dateTo, 'yyyy-MM-dd') : '',
      },
      serviceType,
      paymentMode,
      location,
      searchQuery,
    });
  }, [dateFrom, dateTo, serviceType, paymentMode, location, searchQuery, onFiltersChange]);

  const resetFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setServiceType("all");
    setPaymentMode("all");
    setLocation("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom && dateTo
                  ? `${format(dateFrom, 'MMM d')} - ${format(dateTo, 'MMM d')}`
                  : "Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{
                  from: dateFrom as Date,
                  to: dateTo as Date,
                }}
                onSelect={(range) => {
                  setDateFrom(range?.from);
                  setDateTo(range?.to);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Service Type */}
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="Deep House Cleaning">Deep House Cleaning</SelectItem>
              <SelectItem value="Office Cleaning">Office Cleaning</SelectItem>
              <SelectItem value="Party Catering">Party Catering</SelectItem>
              <SelectItem value="Driver Service">Driver Service</SelectItem>
              <SelectItem value="Home Cooking">Home Cooking</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Mode */}
          <Select value={paymentMode} onValueChange={setPaymentMode}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="Wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={location || "all"} onValueChange={setLocation}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Bangalore">Bangalore</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
              <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              <SelectItem value="Kolkata">Kolkata</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
