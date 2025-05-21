import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CITIES, ServiceType, PaymentMode, BookingFilters as BookingFiltersType } from "@/types";
import { Search, X, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BookingFiltersProps {
  dateRange: { from: string; to: string };
  serviceType: string;
  paymentMode: string;
  location: string;
  searchQuery: string;
  onFilterChange: (filters: BookingFiltersType) => void;
  onSearch: (query: string) => void;
}

export function BookingFilters({ 
  dateRange, 
  serviceType,
  paymentMode,
  location,
  searchQuery,
  onFilterChange,
  onSearch
}: BookingFiltersProps) {
  const [localDateRange, setLocalDateRange] = useState<{ from: string, to: string }>(dateRange);
  const [localServiceType, setLocalServiceType] = useState<string>(serviceType);
  const [localPaymentMode, setLocalPaymentMode] = useState<string>(paymentMode);
  const [localLocation, setLocalLocation] = useState<string>(location);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  
  // Service types
  const serviceTypes: ServiceType[] = ["Cleaning", "Cooking", "Driving", "Sweeping", "Landscaping"];
  
  // Payment modes
  const paymentModes: PaymentMode[] = ["Cash", "Online", "Wallet", "Card", "UPI"];
  
  // Cities
  const cities = CITIES;

  useEffect(() => {
    setLocalDateRange(dateRange);
    setLocalServiceType(serviceType);
    setLocalPaymentMode(paymentMode);
    setLocalLocation(location);
    setLocalSearchQuery(searchQuery);
  }, [dateRange, serviceType, paymentMode, location, searchQuery]);

  const handleApplyFilters = () => {
    onFilterChange({
      dateRange: localDateRange,
      serviceType: localServiceType,
      paymentMode: localPaymentMode,
      location: localLocation,
      searchQuery: localSearchQuery
    });
    setIsFiltersOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: { from: "", to: "" },
      serviceType: "all",
      paymentMode: "all",
      location: "all",
      searchQuery: ""
    };
    
    setLocalDateRange(resetFilters.dateRange);
    setLocalServiceType(resetFilters.serviceType);
    setLocalPaymentMode(resetFilters.paymentMode);
    setLocalLocation(resetFilters.location);
    setLocalSearchQuery("");
    
    onFilterChange(resetFilters);
    onSearch("");
    setIsFiltersOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setLocalDateRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            placeholder="Search bookings by customer name, worker, service..."
            className="pl-10 pr-20 w-full"
            value={localSearchQuery}
            onChange={e => setLocalSearchQuery(e.target.value)}
          />
          {localSearchQuery && (
            <button 
              type="button" 
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setLocalSearchQuery("");
                onSearch("");
              }}
            >
              <X size={16} />
            </button>
          )}
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                type="button"
              >
                <Filter size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] md:w-[500px] lg:w-[600px] p-4" align="end">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Bookings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate">From Date</Label>
                    <Input
                      id="fromDate"
                      type="date"
                      value={localDateRange.from}
                      onChange={e => handleDateChange('from', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="toDate">To Date</Label>
                    <Input
                      id="toDate"
                      type="date"
                      value={localDateRange.to}
                      onChange={e => handleDateChange('to', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select 
                      value={localServiceType} 
                      onValueChange={setLocalServiceType}
                    >
                      <SelectTrigger id="serviceType">
                        <SelectValue placeholder="All Service Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Service Types</SelectItem>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select 
                      value={localPaymentMode} 
                      onValueChange={setLocalPaymentMode}
                    >
                      <SelectTrigger id="paymentMode">
                        <SelectValue placeholder="All Payment Modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payment Modes</SelectItem>
                        {paymentModes.map((mode) => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select 
                    value={localLocation} 
                    onValueChange={setLocalLocation}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleApplyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </form>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {localDateRange.from && localDateRange.to && (
          <Badge onRemove={() => {
            setLocalDateRange({ from: '', to: '' });
            onFilterChange({
              dateRange: { from: '', to: '' },
              serviceType: localServiceType,
              paymentMode: localPaymentMode,
              location: localLocation,
              searchQuery: localSearchQuery
            });
          }}>
            {new Date(localDateRange.from).toLocaleDateString()} - {new Date(localDateRange.to).toLocaleDateString()}
          </Badge>
        )}
        
        {localServiceType !== "all" && (
          <Badge onRemove={() => {
            setLocalServiceType("all");
            onFilterChange({
              dateRange: localDateRange,
              serviceType: "all",
              paymentMode: localPaymentMode,
              location: localLocation,
              searchQuery: localSearchQuery
            });
          }}>
            Service: {localServiceType}
          </Badge>
        )}
        
        {localPaymentMode !== "all" && (
          <Badge onRemove={() => {
            setLocalPaymentMode("all");
            onFilterChange({
              dateRange: localDateRange,
              serviceType: localServiceType,
              paymentMode: "all",
              location: localLocation,
              searchQuery: localSearchQuery
            });
          }}>
            Payment: {localPaymentMode}
          </Badge>
        )}
        
        {localLocation !== "all" && (
          <Badge onRemove={() => {
            setLocalLocation("all");
            onFilterChange({
              dateRange: localDateRange,
              serviceType: localServiceType,
              paymentMode: localPaymentMode,
              location: "all",
              searchQuery: localSearchQuery
            });
          }}>
            Location: {localLocation}
          </Badge>
        )}
        
        {(localDateRange.from || localServiceType !== "all" || localPaymentMode !== "all" || localLocation !== "all") && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleResetFilters}
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  onRemove: () => void;
}

function Badge({ children, onRemove }: BadgeProps) {
  return (
    <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
      {children}
      <button type="button" onClick={onRemove} className="text-gray-500 hover:text-gray-700">
        <X size={14} />
      </button>
    </div>
  );
}
