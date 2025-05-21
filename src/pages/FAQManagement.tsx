
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FAQ } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Mock data generator
const generateMockFAQs = (): FAQ[] => {
  const categories = ["General", "Booking", "Payment", "Worker", "Services"];
  const faqs: FAQ[] = [
    {
      id: "faq-1",
      question: "How do I book a service?",
      answer:
        "You can book a service through our mobile app or website. Simply select the service you want, choose a date and time, and complete the booking process by making a payment.",
      category: "Booking",
      order: 1,
      isActive: true,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
    {
      id: "faq-2",
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, UPI, net banking, and cash on delivery for certain services.",
      category: "Payment",
      order: 2,
      isActive: true,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
    {
      id: "faq-3",
      question: "How do I cancel a booking?",
      answer:
        "You can cancel a booking through the app or website by going to your bookings and selecting the cancel option. Cancellations made at least 24 hours in advance are eligible for a full refund.",
      category: "Booking",
      order: 3,
      isActive: true,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
    {
      id: "faq-4",
      question: "How are your service providers vetted?",
      answer:
        "All our service providers undergo a thorough background check, skill verification, and training process before being onboarded to our platform.",
      category: "Worker",
      order: 4,
      isActive: true,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
    {
      id: "faq-5",
      question: "What happens if I'm not satisfied with the service?",
      answer:
        "We have a 100% satisfaction guarantee. If you're not happy with the service, you can report it within 24 hours and we'll arrange for a redo or refund as appropriate.",
      category: "Services",
      order: 5,
      isActive: true,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
    {
      id: "faq-6",
      question: "Do you provide service in my area?",
      answer:
        "We currently provide services in major metropolitan cities. You can check service availability in your area by entering your pincode on our app or website.",
      category: "General",
      order: 6,
      isActive: true,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
    {
      id: "faq-7",
      question: "How do I become a service provider?",
      answer:
        "You can apply to become a service provider through our app or website. Click on 'Join as Professional', fill out the application form, and our team will get back to you for verification and onboarding.",
      category: "Worker",
      order: 7,
      isActive: false,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    },
  ];

  // Generate additional mock FAQs
  for (let i = 8; i <= 15; i++) {
    faqs.push({
      id: `faq-${i}`,
      question: `Frequently Asked Question ${i}?`,
      answer: `This is the answer to frequently asked question ${i}. It provides detailed information about the topic.`,
      category: categories[Math.floor(Math.random() * categories.length)],
      order: i,
      isActive: Math.random() > 0.2,
      createdAt: "2023-06-10T10:00:00Z",
      updatedAt: "2023-06-10T10:00:00Z",
    });
  }

  return faqs;
};

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>(generateMockFAQs());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FAQ | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [newFaq, setNewFaq] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
    category: "General",
    isActive: true,
  });

  const { toast } = useToast();

  const categories = ["General", "Booking", "Payment", "Worker", "Services"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast({
        title: "Missing Information",
        description: "Please provide both question and answer",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date().toISOString();
    const newFaqItem: FAQ = {
      id: `faq-${Date.now()}`,
      question: newFaq.question,
      answer: newFaq.answer,
      category: newFaq.category || "General",
      order: faqs.length + 1,
      isActive: newFaq.isActive || true,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    setFaqs([newFaqItem, ...faqs]);
    setIsAddDialogOpen(false);
    setNewFaq({
      question: "",
      answer: "",
      category: "General",
      isActive: true,
    });

    toast({
      title: "FAQ Added",
      description: "New FAQ has been added successfully",
    });
  };

  const handleUpdateFaq = () => {
    if (!faqToEdit) return;

    if (!faqToEdit.question || !faqToEdit.answer) {
      toast({
        title: "Missing Information",
        description: "Please provide both question and answer",
        variant: "destructive",
      });
      return;
    }

    const updatedFaq = {
      ...faqToEdit,
      updatedAt: new Date().toISOString(),
    };

    setFaqs(faqs.map((faq) => (faq.id === updatedFaq.id ? updatedFaq : faq)));
    setIsEditDialogOpen(false);
    setFaqToEdit(null);

    toast({
      title: "FAQ Updated",
      description: "FAQ has been updated successfully",
    });
  };

  const handleDeleteFaq = () => {
    if (!faqToDelete) return;

    setFaqs(faqs.filter((faq) => faq.id !== faqToDelete));
    setIsDeleteDialogOpen(false);
    setFaqToDelete(null);

    toast({
      title: "FAQ Deleted",
      description: "FAQ has been deleted successfully",
    });
  };

  const toggleFaqStatus = (id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
      )
    );

    const faq = faqs.find((f) => f.id === id);
    toast({
      title: faq?.isActive ? "FAQ Deactivated" : "FAQ Activated",
      description: `The FAQ has been ${
        faq?.isActive ? "deactivated" : "activated"
      }.`,
    });
  };

  const toggleExpandFaq = (id: string) => {
    if (expandedFaqs.includes(id)) {
      setExpandedFaqs(expandedFaqs.filter((faqId) => faqId !== id));
    } else {
      setExpandedFaqs([...expandedFaqs, id]);
    }
  };

  const moveUp = (id: string) => {
    const index = faqs.findIndex((faq) => faq.id === id);
    if (index > 0) {
      const newFaqs = [...faqs];
      const temp = { ...newFaqs[index], order: newFaqs[index].order - 1 };
      newFaqs[index] = { ...newFaqs[index - 1], order: newFaqs[index - 1].order + 1 };
      newFaqs[index - 1] = temp;
      setFaqs(newFaqs.sort((a, b) => a.order - b.order));
    }
  };

  const moveDown = (id: string) => {
    const index = faqs.findIndex((faq) => faq.id === id);
    if (index < faqs.length - 1) {
      const newFaqs = [...faqs];
      const temp = { ...newFaqs[index], order: newFaqs[index].order + 1 };
      newFaqs[index] = { ...newFaqs[index + 1], order: newFaqs[index + 1].order - 1 };
      newFaqs[index + 1] = temp;
      setFaqs(newFaqs.sort((a, b) => a.order - b.order));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">FAQ Management</h1>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New FAQ
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Manage FAQs displayed on your website and app
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-auto">
                <Search
                  size={16}
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-10 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No FAQs found. Try changing your search or add a new FAQ.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {filteredFaqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden border">
                  <div
                    className={`p-4 relative ${
                      !faq.isActive && "opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => toggleExpandFaq(faq.id)}
                      >
                        <button className="p-1 hover:bg-gray-100 rounded">
                          {expandedFaqs.includes(faq.id) ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                        <h3 className="font-medium">{faq.question}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={faq.isActive ? "default" : "secondary"}
                          className="mr-2"
                        >
                          {faq.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setFaqToEdit(faq);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit size={14} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFaqStatus(faq.id)}>
                              {faq.isActive ? (
                                <>
                                  <Trash size={14} className="mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Plus size={14} className="mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setFaqToDelete(faq.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <Trash size={14} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveUp(faq.id)}
                            disabled={faq.order === 1}
                          >
                            <ChevronUp size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveDown(faq.id)}
                            disabled={faq.order === faqs.length}
                          >
                            <ChevronDown size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {expandedFaqs.includes(faq.id) && (
                      <div className="mt-2 ml-8 pl-3 border-l-2 border-gray-200">
                        <p className="text-gray-600">{faq.answer}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>Category: {faq.category}</span>
                          <span>•</span>
                          <span>
                            Last updated:{" "}
                            {new Date(faq.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredFaqs.length} of {faqs.length} FAQs
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add FAQ Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
            <DialogDescription>
              Add a new frequently asked question to your website and app.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newFaq.question}
                onChange={(e) =>
                  setNewFaq({ ...newFaq, question: e.target.value })
                }
                placeholder="Enter FAQ question"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newFaq.answer}
                onChange={(e) =>
                  setNewFaq({ ...newFaq, answer: e.target.value })
                }
                placeholder="Enter FAQ answer"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newFaq.category}
                onValueChange={(value) =>
                  setNewFaq({ ...newFaq, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newFaq.isActive}
                onCheckedChange={(checked) =>
                  setNewFaq({ ...newFaq, isActive: checked })
                }
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleAddFaq}>
              Add FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) setFaqToEdit(null);
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>
              Update the frequently asked question.
            </DialogDescription>
          </DialogHeader>

          {faqToEdit && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-question">Question</Label>
                <Input
                  id="edit-question"
                  value={faqToEdit.question}
                  onChange={(e) =>
                    setFaqToEdit({ ...faqToEdit, question: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-answer">Answer</Label>
                <Textarea
                  id="edit-answer"
                  value={faqToEdit.answer}
                  onChange={(e) =>
                    setFaqToEdit({ ...faqToEdit, answer: e.target.value })
                  }
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={faqToEdit.category}
                  onValueChange={(value) =>
                    setFaqToEdit({ ...faqToEdit, category: value })
                  }
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={`edit-${category}`} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={faqToEdit.isActive}
                  onCheckedChange={(checked) =>
                    setFaqToEdit({ ...faqToEdit, isActive: checked })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setFaqToEdit(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateFaq}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFaq}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
