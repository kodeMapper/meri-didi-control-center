import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, Download, MoreVertical, Edit, Trash2, UserPlus, Mail, MessageSquare, RefreshCw, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Customer, City } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Sample customers data
const initialCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Mumbai",
    city: "Mumbai",
    joiningDate: "2024-12-05",
    status: "Active",
    totalBookings: 15,
    subscriptionPlan: "Standard",
    lastActivity: "2025-05-15"
  },
  {
    id: "cust-002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 9876543211",
    address: "456 Park Avenue, Delhi",
    city: "Delhi",
    joiningDate: "2024-11-15",
    status: "Active",
    totalBookings: 8,
    subscriptionPlan: "Premium",
    lastActivity: "2025-05-18"
  },
  {
    id: "cust-003",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 9876543212",
    address: "789 Garden Road, Bangalore",
    city: "Bangalore",
    joiningDate: "2025-01-20",
    status: "Active",
    totalBookings: 3,
    subscriptionPlan: "Basic",
    lastActivity: "2025-05-10"
  },
  {
    id: "cust-004",
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    phone: "+91 9876543213",
    address: "101 Hill View, Chennai",
    city: "Chennai",
    joiningDate: "2025-02-10",
    status: "Inactive",
    totalBookings: 1,
    subscriptionPlan: "Trial",
    lastActivity: "2025-03-05"
  },
  {
    id: "cust-005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91 9876543214",
    address: "202 Lake View, Kolkata",
    city: "Kolkata",
    joiningDate: "2024-12-20",
    status: "Active",
    totalBookings: 12,
    subscriptionPlan: "Premium",
    lastActivity: "2025-05-17"
  },
  {
    id: "cust-006",
    name: "Meera Reddy",
    email: "meera.reddy@example.com",
    phone: "+91 9876543215",
    address: "303 Ocean Front, Hyderabad",
    city: "Hyderabad",
    joiningDate: "2025-03-01",
    status: "Inactive",
    totalBookings: 0,
    subscriptionPlan: "Basic",
    lastActivity: "2025-03-01"
  }
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Filter customers based on search and filters
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        !searchQuery ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);
      
      const matchesCity = cityFilter === "all" || customer.city === cityFilter;
      const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
      const matchesSubscription = subscriptionFilter === "all" || customer.subscriptionPlan === subscriptionFilter;
      
      return matchesSearch && matchesCity && matchesStatus && matchesSubscription;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      if (sortConfig.key === 'totalBookings' || sortConfig.key === 'joiningDate' || sortConfig.key === 'lastActivity') {
        const valueA = sortConfig.key === 'totalBookings' ? a[sortConfig.key] : new Date(a[sortConfig.key]).getTime();
        const valueB = sortConfig.key === 'totalBookings' ? b[sortConfig.key] : new Date(b[sortConfig.key]).getTime();
        
        return sortConfig.direction === 'ascending' 
          ? (valueA > valueB ? 1 : -1)
          : (valueA < valueB ? 1 : -1);
      }
      
      const valueA = a[sortConfig.key]?.toString().toLowerCase() || '';
      const valueB = b[sortConfig.key]?.toString().toLowerCase() || '';
      
      return sortConfig.direction === 'ascending' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      
      toast({
        title: "Refreshed",
        description: "Customer data has been refreshed",
      });
    }, 1000);
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    setCustomers(customers.filter(customer => customer.id !== selectedCustomer));
    setSelectedCustomers(selectedCustomers.filter(id => id !== selectedCustomer));
    
    toast({
      title: "Customer Deleted",
      description: "Customer has been deleted successfully",
    });
    
    setSelectedCustomer(null);
    setIsDeleteDialogOpen(false);
  };

  const handleMultipleDelete = () => {
    setCustomers(customers.filter(customer => !selectedCustomers.includes(customer.id)));
    
    toast({
      title: "Customers Deleted",
      description: `${selectedCustomers.length} customers have been deleted`,
    });
    
    setSelectedCustomers([]);
  };

  const handleUpdateStatus = (customerId: string, newStatus: 'Active' | 'Inactive') => {
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: newStatus } 
        : customer
    ));
    
    toast({
      title: "Status Updated",
      description: `Customer status updated to ${newStatus}`,
    });
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      // If all are selected, unselect all
      setSelectedCustomers([]);
    } else {
      // Otherwise select all visible customers
      setSelectedCustomers(paginatedCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleSort = (key: keyof Customer) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting customer data as ${format.toUpperCase()}`,
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCityFilter("all");
    setStatusFilter("all");
    setSubscriptionFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={16} />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="flex items-center gap-2">
            <UserPlus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset filters">
                <Filter size={16} />
              </Button>
            </div>
          </div>
          
          {selectedCustomers.length > 0 && (
            <div className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
              <span className="text-sm font-medium ml-2">
                {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-sm h-8">
                  <Mail size={14} className="mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="text-sm h-8">
                  <MessageSquare size={14} className="mr-1" />
                  SMS
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="text-sm h-8"
                  onClick={handleMultipleDelete}
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={
                        paginatedCustomers.length > 0 && 
                        selectedCustomers.length === paginatedCustomers.length
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all customers"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortConfig?.key === 'name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => handleSort('city')}
                  >
                    City
                    {sortConfig?.key === 'city' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => handleSort('joiningDate')}
                  >
                    Join Date
                    {sortConfig?.key === 'joiningDate' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortConfig?.key === 'status' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => handleSort('subscriptionPlan')}
                  >
                    Plan
                    {sortConfig?.key === 'subscriptionPlan' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors text-right"
                    onClick={() => handleSort('totalBookings')}
                  >
                    Bookings
                    {sortConfig?.key === 'totalBookings' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/60 transition-colors"
                    onClick={() => handleSort('lastActivity')}
                  >
                    Last Activity
                    {sortConfig?.key === 'lastActivity' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/30">
                      <TableCell>
                        <Checkbox 
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={() => handleSelectCustomer(customer.id)}
                          aria-label={`Select ${customer.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.city}</TableCell>
                      <TableCell>
                        {new Date(customer.joiningDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={customer.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            customer.subscriptionPlan === "Premium" ? "border-purple-500 text-purple-600" : 
                            customer.subscriptionPlan === "Standard" ? "border-blue-500 text-blue-600" :
                            customer.subscriptionPlan === "Basic" ? "border-green-500 text-green-600" :
                            "border-gray-500 text-gray-600"
                          }
                        >
                          {customer.subscriptionPlan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{customer.totalBookings}</TableCell>
                      <TableCell>
                        {new Date(customer.lastActivity).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {/* View details */}}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* Edit functionality */}}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(customer.id, customer.status === "Active" ? "Inactive" : "Active")}>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Mark as {customer.status === "Active" ? "Inactive" : "Active"}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setSelectedCustomer(customer.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCustomers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Rows per page</p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, i, array) => {
                    // Add ellipsis
                    if (i > 0 && array[i] - array[i - 1] > 1) {
                      return [
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>,
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ];
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this customer? This action cannot be undone and will remove all customer data.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
