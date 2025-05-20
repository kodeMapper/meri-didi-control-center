
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceType, City } from "@/types";
import { Search, Calendar, MapPin, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface BookingFiltersProps {
  onFilterChange: (filters: BookingFilters) => void;
}

export interface BookingFilters {
  search: string;
  serviceType: string;
  city: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

export function BookingFilters({ onFilterChange }: BookingFiltersProps) {
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [city, setCity] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    updateFilters({ search: e.target.value });
  };

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    updateFilters({ serviceType: value });
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    updateFilters({ city: value });
  };

  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    updateFilters({ dateFrom: date });
  };

  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    updateFilters({ dateTo: date });
  };

  const updateFilters = (newFilters: Partial<BookingFilters>) => {
    onFilterChange({
      search,
      serviceType,
      city,
      dateFrom,
      dateTo,
      ...newFilters
    });
  };

  const resetFilters = () => {
    setSearch("");
    setServiceType("");
    setCity("");
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange({
      search: "",
      serviceType: "",
      city: "",
      dateFrom: undefined,
      dateTo: undefined
    });
    setIsFiltersOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer or worker name, ID..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Type</label>
                  <Select value={serviceType} onValueChange={handleServiceTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Services</SelectItem>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Cooking">Cooking</SelectItem>
                      <SelectItem value="Driving">Driving</SelectItem>
                      <SelectItem value="Sweeping">Sweeping</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Select value={city} onValueChange={handleCityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Cities</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date From</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={handleDateFromChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date To</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={handleDateToChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={resetFilters}>Reset</Button>
                  <Button onClick={() => setIsFiltersOpen(false)}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {(serviceType || city || dateFrom || dateTo) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {serviceType && (
            <div className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1">
              <span>Service: {serviceType}</span>
              <button onClick={() => handleServiceTypeChange("")} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
          )}
          {city && (
            <div className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1">
              <span>City: {city}</span>
              <button onClick={() => handleCityChange("")} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
          )}
          {dateFrom && (
            <div className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1">
              <span>From: {format(dateFrom, "PP")}</span>
              <button onClick={() => handleDateFromChange(undefined)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
          )}
          {dateTo && (
            <div className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1">
              <span>To: {format(dateTo, "PP")}</span>
              <button onClick={() => handleDateToChange(undefined)} className="text-gray-500 hover:text-gray-700">×</button>
            </div>
          )}
          {(serviceType || city || dateFrom || dateTo) && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
