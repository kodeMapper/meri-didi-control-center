import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Customer, City } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Check,
  ChevronDown,
  Download,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash,
  User,
  X
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";

const generateMockCustomers = (): Customer[] => {
  const cities: City[] = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
  const statuses = ["Active", "Inactive"];
  const subscriptionPlans = ["Basic", "Standard", "Premium"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `cust-${i + 1}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `123-456-${1000 + i}`,
    address: `${i + 1} Main St`,
    city: cities[Math.floor(Math.random() * cities.length)],
    joiningDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)] as "Active" | "Inactive",
    totalBookings: Math.floor(Math.random() * 50),
    subscriptionPlan: subscriptionPlans[Math.floor(Math.random() * subscriptionPlans.length)],
    lastActivity: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString().split('T')[0],
  }));
};

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(generateMockCustomers());
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<City | "All">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const { toast } = useToast();

  useEffect(() => {
    applyFilters();
  }, [searchQuery, cityFilter, statusFilter, customers]);

  const applyFilters = () => {
    let results = [...customers];

    if (searchQuery) {
      results = results.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
      );
    }

    if (cityFilter !== "All") {
      results = results.filter(customer => customer.city === cityFilter);
    }

    if (statusFilter !== "All") {
      results = results.filter(customer => customer.status === statusFilter);
    }

    setFilteredCustomers(results);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCityFilterChange = (city: City | "All") => {
    setCityFilter(city);
  };

  const handleStatusFilterChange = (status: "All" | "Active" | "Inactive") => {
    setStatusFilter(status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddCustomer = () => {
    // Placeholder for adding a new customer
    toast({
      title: "Add Customer",
      description: "This feature is under development.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCustomer = () => {
    // Placeholder for editing a customer
    if (selectedCustomer) {
      toast({
        title: "Edit Customer",
        description: `Editing customer ${selectedCustomer.name}. This feature is under development.`,
      });
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      // Placeholder for deleting a customer
      toast({
        title: "Delete Customer",
        description: `Deleting customer with ID ${customerToDelete}. This feature is under development.`,
      });
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Customers Refreshed",
        description: "Customer list has been updated.",
      });
    }, 1000);
  };

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full sm:w-[250px]"
            />
            <Search className="absolute top-2.5 right-2 text-gray-500" size={16} />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filter by City
                  <ChevronDown size={16} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCityFilterChange("All")}>
                  All Cities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Mumbai")}>
                  Mumbai
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Delhi")}>
                  Delhi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Bangalore")}>
                  Bangalore
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Hyderabad")}>
                  Hyderabad
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Chennai")}>
                  Chennai
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Kolkata")}>
                  Kolkata
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Pune")}>
                  Pune
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCityFilterChange("Ahmedabad")}>
                  Ahmedabad
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filter by Status
                  <ChevronDown size={16} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusFilterChange("All")}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilterChange("Active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilterChange("Inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  Export
                  <ChevronDown size={16} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="table" className="w-full" onValueChange={setViewMode}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="table" className="data-[state=active]:bg-muted/50">
              Table View
            </TabsTrigger>
            <TabsTrigger value="grid" className="data-[state=active]:bg-muted/50">
              Grid View
            </TabsTrigger>
          </TabsList>
        
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-6 w-6 text-gray-500" />
            <h3 className="mt-2 text-sm font-semibold text-gray-700">No customers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              It seems we don’t have any customers matching the current{" "}
              <br />
              search or filter options.
            </p>
          </div>
        ) : (
          <TabsContent value="table" className={viewMode === "table" ? "block" : "hidden"}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="px-4 py-3 text-left font-medium">City</th>
                    <th className="px-4 py-3 text-left font-medium">Joining Date</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{customer.name}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.phone}</td>
                      <td className="px-4 py-3">{customer.city}</td>
                      <td className="px-4 py-3">{customer.joiningDate}</td>
                      <td className="px-4 py-3">
                        <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedCustomer(customer);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setCustomerToDelete(customer.id);
                              setIsDeleteDialogOpen(true);
                            }} className="text-red-600 focus:text-red-600">
                              <Trash size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="grid" className={viewMode === "grid" ? "block" : "hidden"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{customer.name}</CardTitle>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                    <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Phone: {customer.phone}</div>
                    <div>City: {customer.city}</div>
                    <div>Joining Date: {customer.joiningDate}</div>
                    <div>Total Bookings: {customer.totalBookings}</div>
                    <div>Subscription: {customer.subscriptionPlan}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        </Tabs>
        
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCustomers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      
      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Sofia Davis" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value="sofia.davis@example.com" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Make changes to the selected customer's details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" defaultValue={selectedCustomer?.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" defaultValue={selectedCustomer?.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={selectedCustomer?.city || "Select a city"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="status" defaultChecked={selectedCustomer?.status === "Active"} />
                <span>Active</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
