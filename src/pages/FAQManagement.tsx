
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FAQ } from '@/types';
import { Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'What services do you offer?',
      answer: 'We offer a wide range of household services including cleaning, cooking, and more.',
      category: 'General',
      isActive: true,
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      question: 'How do I book a service?',
      answer: 'You can book a service through our mobile app or website by selecting the service you need and choosing an available time slot.',
      category: 'Booking',
      isActive: true,
      order: 2,
      createdAt: new Date().toISOString(),
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'General'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (category: string) => {
    setFormData({
      ...formData,
      category
    });
  };

  const handleAddFaq = () => {
    if (!formData.question || !formData.answer || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newFaq: FAQ = {
      id: Math.random().toString(36).substring(2, 11),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      isActive: true,
      order: faqs.length + 1,
      createdAt: new Date().toISOString(),
    };

    setFaqs([...faqs, newFaq]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("FAQ added successfully");
  };

  const handleEditClick = (faq: FAQ) => {
    setSelectedFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateFaq = () => {
    if (!selectedFaq || !formData.question || !formData.answer) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedFaqs = faqs.map(faq => 
      faq.id === selectedFaq.id 
        ? { 
            ...faq, 
            question: formData.question!, 
            answer: formData.answer!,
            category: formData.category || faq.category 
          } 
        : faq
    );

    setFaqs(updatedFaqs);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("FAQ updated successfully");
  };

  const handleDeleteClick = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteFaq = () => {
    if (!selectedFaq) return;
    
    const updatedFaqs = faqs.filter(faq => faq.id !== selectedFaq.id);
    setFaqs(updatedFaqs);
    setIsDeleteDialogOpen(false);
    toast.success("FAQ deleted successfully");
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'General'
    });
    setSelectedFaq(null);
  };

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="question">Question *</Label>
                <Input 
                  id="question" 
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the question" 
                />
              </div>
              <div>
                <Label htmlFor="answer">Answer *</Label>
                <Textarea 
                  id="answer" 
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                  placeholder="Enter the answer"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Booking">Booking</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddFaq}>
                  Save FAQ
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No FAQs found</h3>
          <p className="text-gray-500 mt-2">Add a new FAQ to get started</p>
          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add New FAQ
          </Button>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border p-2 rounded-md">
              <div className="flex justify-between items-center">
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <div className="flex gap-2 mr-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(faq);
                    }}
                  >
                    <Edit2 size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(faq);
                    }}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              <AccordionContent className="pt-2 pb-4">
                <p>{faq.answer}</p>
                <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                  <span>Category: {faq.category}</span>
                  <span>Added: {new Date(faq.createdAt).toLocaleDateString()}</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Edit FAQ Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-question">Question *</Label>
              <Input 
                id="edit-question" 
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Enter the question" 
              />
            </div>
            <div>
              <Label htmlFor="edit-answer">Answer *</Label>
              <Textarea 
                id="edit-answer" 
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                className="min-h-[100px]"
                placeholder="Enter the answer"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Booking">Booking</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateFaq}>
                Update FAQ
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete FAQ Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this FAQ?</p>
            {selectedFaq && (
              <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                <p className="font-medium">{selectedFaq.question}</p>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500">This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedFaq(null);
              }}
            >
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
