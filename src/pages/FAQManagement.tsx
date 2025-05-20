
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FAQ } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Grip, 
  MoreVertical, 
  Plus, 
  Search, 
  Trash, 
  Save, 
  X 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";

const generateMockFAQs = (): FAQ[] => {
  const categories = [
    "General",
    "Bookings",
    "Services",
    "Payments",
    "Workers",
    "Account"
  ];

  return [
    {
      id: "faq-1",
      question: "How do I book a service?",
      answer: "You can book a service by navigating to the bookings page, selecting your preferred service type, date, time, and location. Then, you can choose from available service providers and confirm your booking by making a payment.",
      category: "Bookings",
      order: 1,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-2",
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, UPI, net banking, and wallet payments. Cash payments are also accepted for certain services.",
      category: "Payments",
      order: 2,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-3",
      question: "How can I reschedule my booking?",
      answer: "You can reschedule your booking through your account dashboard. Navigate to the 'My Bookings' section, find the booking you want to reschedule, and click the 'Reschedule' button. Please note that rescheduling must be done at least 24 hours before the scheduled service time.",
      category: "Bookings",
      order: 3,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-4",
      question: "What if I'm not satisfied with the service?",
      answer: "Your satisfaction is our priority. If you're not satisfied with the service provided, please contact our customer support within 24 hours of service completion. We'll address your concerns and provide appropriate solutions, which may include service redo or partial/full refunds based on the situation.",
      category: "Services",
      order: 4,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-5",
      question: "How are your service providers verified?",
      answer: "All our service providers undergo a rigorous verification process. This includes background checks, skill assessments, and training sessions. We verify their identity documents, address proofs, and previous work experience before they join our platform.",
      category: "Workers",
      order: 5,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-6",
      question: "How do I create an account?",
      answer: "Creating an account is simple. Click on the 'Sign Up' button on the top right of our website or app. You can register using your email, phone number, or social media accounts. Complete the required information and verify your contact details to activate your account.",
      category: "Account",
      order: 6,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-7",
      question: "What is your cancellation policy?",
      answer: "You can cancel your booking for free up to 24 hours before the scheduled service time. Cancellations made within 24 hours of the service may incur a partial charge. If a service provider has already been dispatched, a cancellation fee will apply.",
      category: "Bookings",
      order: 7,
      isActive: true,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    },
    {
      id: "faq-8",
      question: "Do you offer any subscription plans?",
      answer: "Yes, we offer various subscription plans that provide regular services at discounted rates. You can choose from weekly, bi-weekly, or monthly service schedules. Subscribers also enjoy priority booking, dedicated service providers, and special offers.",
      category: "General",
      order: 8,
      isActive: false,
      createdAt: "2024-03-15T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z"
    }
  ];
};

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>(generateMockFAQs());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    isActive: true
  });
  const [editFormData, setEditFormData] = useState<{
    id: string;
    question: string;
    answer: string;
    category: string;
    isActive: boolean;
  } | null>(null);
  
  const { toast } = useToast();
  
  const categories = [
    "General",
    "Bookings",
    "Services",
    "Payments",
    "Workers",
    "Account"
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreateFAQ = () => {
    if (!formData.question || !formData.answer) {
      toast({
        title: "Missing Fields",
        description: "Please fill in both question and answer fields",
        variant: "destructive",
      });
      return;
    }

    const newFAQ: FAQ = {
      id: `faq-${Math.floor(Math.random() * 1000)}`,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      order: faqs.length + 1,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFaqs([...faqs, newFAQ]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Success",
      description: "FAQ has been created successfully",
    });
  };

  const handleDeleteFAQ = () => {
    if (!faqToDelete) return;
    
    setFaqs(faqs.filter(faq => faq.id !== faqToDelete));
    setIsDeleteDialogOpen(false);
    setFaqToDelete(null);
    
    toast({
      title: "Success",
      description: "FAQ has been deleted successfully",
    });
  };

  const startEditingFAQ = (faq: FAQ) => {
    setEditingFaqId(faq.id);
    setEditFormData({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive
    });
  };

  const saveEditedFAQ = () => {
    if (!editFormData || !editFormData.question || !editFormData.answer) {
      toast({
        title: "Error",
        description: "Question and answer cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const updatedFaqs = faqs.map(faq => 
      faq.id === editFormData.id 
        ? {
            ...faq,
            question: editFormData.question,
            answer: editFormData.answer,
            category: editFormData.category,
            isActive: editFormData.isActive,
            updatedAt: new Date().toISOString()
          }
        : faq
    );
    
    setFaqs(updatedFaqs);
    setEditingFaqId(null);
    setEditFormData(null);
    
    toast({
      title: "Success",
      description: "FAQ has been updated successfully",
    });
  };

  const cancelEditing = () => {
    setEditingFaqId(null);
    setEditFormData(null);
  };

  const toggleFAQStatus = (id: string) => {
    const updatedFaqs = faqs.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    );
    setFaqs(updatedFaqs);
    
    const faq = faqs.find(f => f.id === id);
    toast({
      title: faq?.isActive ? "FAQ Deactivated" : "FAQ Activated",
      description: `The FAQ has been ${faq?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "General",
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add New FAQ
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All FAQs</CardTitle>
              <CardDescription>Manage frequently asked questions and their answers</CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-auto">
                <Search size={16} className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-10 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No FAQs found. Try changing your search or add a new FAQ.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className={`border rounded-md ${!faq.isActive && 'opacity-70'}`}>
                  {editingFaqId === faq.id ? (
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`edit-question-${faq.id}`}>Question</Label>
                        <Input
                          id={`edit-question-${faq.id}`}
                          value={editFormData?.question}
                          onChange={(e) => setEditFormData({...editFormData!, question: e.target.value})}
                          placeholder="Enter question"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-answer-${faq.id}`}>Answer</Label>
                        <Textarea
                          id={`edit-answer-${faq.id}`}
                          value={editFormData?.answer}
                          onChange={(e) => setEditFormData({...editFormData!, answer: e.target.value})}
                          placeholder="Enter answer"
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edit-category-${faq.id}`}>Category</Label>
                        <Select 
                          value={editFormData?.category} 
                          onValueChange={(value) => setEditFormData({...editFormData!, category: value})}
                        >
                          <SelectTrigger id={`edit-category-${faq.id}`}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`edit-active-${faq.id}`}
                          checked={editFormData?.isActive}
                          onCheckedChange={(checked) => setEditFormData({...editFormData!, isActive: checked})}
                        />
                        <Label htmlFor={`edit-active-${faq.id}`}>Active</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm" onClick={cancelEditing}>
                          <X size={16} className="mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={saveEditedFAQ}>
                          <Save size={16} className="mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center space-x-3 text-left">
                          <Grip size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium">{faq.question}</div>
                            <div className="text-xs text-muted-foreground">
                              Category: <span className="font-medium">{faq.category}</span> · 
                              Status: <span className={`font-medium ${faq.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                {faq.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="border-t pt-3 mt-0">
                          <p className="text-sm">{faq.answer}</p>
                          
                          <div className="flex justify-end items-center mt-3 space-x-2">
                            <Button variant="outline" size="sm" onClick={() => startEditingFAQ(faq)}>
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleFAQStatus(faq.id)}>
                                  {faq.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setFaqToDelete(faq.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </AccordionContent>
                    </>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
      
      {/* Add FAQ Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
            <DialogDescription>
              Create a new frequently asked question and its answer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question <span className="text-red-500">*</span></Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                placeholder="Enter the question"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="answer">Answer <span className="text-red-500">*</span></Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                placeholder="Enter the answer"
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateFAQ}>
              Add FAQ
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
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteFAQ}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
