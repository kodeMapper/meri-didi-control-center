import { useState, useEffect } from "react";
import { 
  Edit, 
  Trash2, 
  Search, 
  Plus, 
  Calendar, 
  RefreshCcw, 
  Download, 
  Check,
  Filter, 
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addPromoCode, getPromoCodes, updatePromoCode, deletePromoCode } from "@/lib/supabase";
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  expires_at: string;
  description: string;
  usage_limit: number | null;
  created_at: string;
}

function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<number | "">("");
  const [expiresAt, setExpiresAt] = useState<DateRange | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | "">("");
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("code");
  const [isCopied, setIsCopied] = useState(false);
  const [copiedPromoCode, setCopiedPromoCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const data = await getPromoCodes();
      setPromoCodes(data);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch promo codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromoCode = async () => {
    if (!code || !discount || !expiresAt?.from || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expiresAtFrom = expiresAt.from ? format(expiresAt.from, 'yyyy-MM-dd') : '';
    const expiresAtTo = expiresAt.to ? format(expiresAt.to, 'yyyy-MM-dd') : '';

    if (!expiresAtFrom || !expiresAtTo) {
        toast({
            title: "Error",
            description: "Please select a valid date range",
            variant: "destructive",
        });
        return;
    }

    const expiresAtCombined = `${expiresAtFrom}T00:00:00.000Z`;

    try {
      await addPromoCode({
        code,
        discount: Number(discount),
        expires_at: expiresAtCombined,
        description,
        usage_limit: usageLimit ? Number(usageLimit) : null,
      });
      toast({
        title: "Success",
        description: "Promo code created successfully",
      });
      fetchPromoCodes();
      setOpen(false);
      clearForm();
    } catch (error) {
      console.error("Error creating promo code:", error);
      toast({
        title: "Error",
        description: "Failed to create promo code",
        variant: "destructive",
      });
    }
  };

  const handleEditPromoCode = async () => {
    if (!selectedPromoCode) return;

    if (!code || !discount || !expiresAt?.from || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const expiresAtFrom = expiresAt.from ? format(expiresAt.from, 'yyyy-MM-dd') : '';
    const expiresAtTo = expiresAt.to ? format(expiresAt.to, 'yyyy-MM-dd') : '';

    if (!expiresAtFrom || !expiresAtTo) {
        toast({
            title: "Error",
            description: "Please select a valid date range",
            variant: "destructive",
        });
        return;
    }

    const expiresAtCombined = `${expiresAtFrom}T00:00:00.000Z`;

    try {
      await updatePromoCode(selectedPromoCode.id, {
        code,
        discount: Number(discount),
        expires_at: expiresAtCombined,
        description,
        usage_limit: usageLimit ? Number(usageLimit) : null,
      });
      toast({
        title: "Success",
        description: "Promo code updated successfully",
      });
      fetchPromoCodes();
      setEditOpen(false);
      clearForm();
    } catch (error) {
      console.error("Error updating promo code:", error);
      toast({
        title: "Error",
        description: "Failed to update promo code",
        variant: "destructive",
      });
    }
  };

  const handleDeletePromoCode = async (id: string) => {
    try {
      await deletePromoCode(id);
      toast({
        title: "Success",
        description: "Promo code deleted successfully",
      });
      fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promo code:", error);
      toast({
        title: "Error",
        description: "Failed to delete promo code",
        variant: "destructive",
      });
    }
  };

  const handleOpenEditDialog = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setCode(promoCode.code);
    setDiscount(promoCode.discount);
    setDescription(promoCode.description);
    setUsageLimit(promoCode.usage_limit !== null ? promoCode.usage_limit : "");

    // Parse the expires_at string to create a Date object
    const expiresAtDate = new Date(promoCode.expires_at);

    // Check if the date is valid before setting the state
    if (!isNaN(expiresAtDate.getTime())) {
        setExpiresAt({ from: expiresAtDate, to: expiresAtDate });
    } else {
        console.error("Invalid date format:", promoCode.expires_at);
        setExpiresAt({ from: new Date(), to: new Date() });
    }

    setEditOpen(true);
  };

  const clearForm = () => {
    setCode("");
    setDiscount("");
    setExpiresAt(undefined);
    setDescription("");
    setUsageLimit("");
    setSelectedPromoCode(null);
  };

  const filteredPromoCodes = promoCodes.filter((promoCode) => {
    const searchTerm = searchQuery.toLowerCase();
    if (filterType === "code") {
      return promoCode.code.toLowerCase().includes(searchTerm);
    } else if (filterType === "description") {
      return promoCode.description.toLowerCase().includes(searchTerm);
    }
    return false;
  });

  const handleCopyToClipboard = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode);
    setCopiedPromoCode(promoCode);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setCopiedPromoCode(null);
    }, 2000);
  };

  const handleExport = (format: string) => {
    const dataStr = JSON.stringify(promoCodes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `promo_codes.${format}`;

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Export Successful",
      description: `Promo codes exported as ${format.toUpperCase()}`
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={16} className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search promo codes..."
              className="pl-10 w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code">Code</SelectItem>
              <SelectItem value="description">Description</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter size={16} className="text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                Create Promo Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Promo Code</DialogTitle>
                <DialogDescription>
                  Add a new promo code to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Discount
                  </Label>
                  <Input
                    type="number"
                    id="discount"
                    value={discount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setDiscount("");
                      } else {
                        const num = Number(value);
                        if (!isNaN(num)) {
                          setDiscount(num);
                        }
                      }
                    }}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiresAt" className="text-right">
                    Expires At
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expiresAt?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiresAt?.from ? (
                          expiresAt.to ? (
                            `${format(expiresAt.from, "PPP")} - ${format(
                              expiresAt.to,
                              "PPP"
                            )}`
                          ) : (
                            format(expiresAt.from, "PPP")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="range"
                        defaultMonth={expiresAt?.from}
                        selected={expiresAt}
                        onSelect={setExpiresAt}
                        disabled={{ before: new Date() }}
                        numberOfMonths={2}
                        pagedNavigation
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="usageLimit" className="text-right">
                    Usage Limit
                  </Label>
                  <Input
                    type="number"
                    id="usageLimit"
                    value={usageLimit}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setUsageLimit("");
                      } else {
                        const num = Number(value);
                        if (!isNaN(num)) {
                          setUsageLimit(num);
                        }
                      }
                    }}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => { setOpen(false); clearForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleCreatePromoCode}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {loading ? (
        <p>Loading promo codes...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Usage Limit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {promoCode.code}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyToClipboard(promoCode.code);
                        }}
                      >
                        <Copy size={16} className="text-gray-500" />
                        {copiedPromoCode === promoCode.code && isCopied && (
                          <Check size={12} className="ml-1 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{promoCode.discount}</TableCell>
                  <TableCell>{format(new Date(promoCode.expires_at), "PPP")}</TableCell>
                  <TableCell>{promoCode.description}</TableCell>
                  <TableCell>{promoCode.usage_limit === null ? "Unlimited" : promoCode.usage_limit}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(promoCode)}>
                          <Edit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePromoCode(promoCode.id)}>
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Edit the promo code details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount
              </Label>
              <Input
                type="number"
                id="discount"
                value={discount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setDiscount("");
                  } else {
                    const num = Number(value);
                    if (!isNaN(num)) {
                      setDiscount(num);
                    }
                  }
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiresAt" className="text-right">
                Expires At
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiresAt?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt?.from ? (
                      expiresAt.to ? (
                        `${format(expiresAt.from, "PPP")} - ${format(
                          expiresAt.to,
                          "PPP"
                        )}`
                      ) : (
                        format(expiresAt.from, "PPP")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="range"
                    defaultMonth={expiresAt?.from}
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    disabled={{ before: new Date() }}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usageLimit" className="text-right">
                Usage Limit
              </Label>
              <Input
                type="number"
                id="usageLimit"
                value={usageLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setUsageLimit("");
                  } else {
                    const num = Number(value);
                    if (!isNaN(num)) {
                      setUsageLimit(num);
                    }
                  }
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => { setEditOpen(false); clearForm(); }}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditPromoCode}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PromoCodes;
