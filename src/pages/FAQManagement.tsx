
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
    // General FAQs
    {
      id: '1',
      question: 'What is Meri Didi and what services do you offer?',
      answer: 'Meri Didi is a trusted home services platform that connects you with verified domestic helpers, maids, and household service professionals. We offer cleaning services, cooking assistance, childcare, elderly care, laundry services, house management, and more.',
      category: 'General',
      isActive: true,
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      question: 'How does Meri Didi ensure the safety and reliability of service providers?',
      answer: 'All our service providers undergo thorough background verification including identity verification, address proof, criminal background checks, and reference checks. We also conduct skill assessments and provide regular training to ensure quality service.',
      category: 'Safety',
      isActive: true,
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      question: 'What areas do you currently serve?',
      answer: 'Meri Didi currently operates in major cities and their surrounding areas. Please check our service availability in your area by entering your pincode on our app or website.',
      category: 'General',
      isActive: true,
      order: 3,
      createdAt: new Date().toISOString(),
    },

    // Booking FAQs
    {
      id: '4',
      question: 'How do I book a service with Meri Didi?',
      answer: 'You can book a service through our mobile app or website. Simply select the service you need, choose your preferred date and time, provide your address details, and confirm your booking. You will receive confirmation within minutes.',
      category: 'Booking',
      isActive: true,
      order: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      question: 'Can I book services for the same day?',
      answer: 'Yes, we offer same-day booking based on availability. For urgent requirements, we recommend booking at least 2-3 hours in advance to ensure we can assign the best available service provider.',
      category: 'Booking',
      isActive: true,
      order: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      question: 'Can I schedule recurring services?',
      answer: 'Absolutely! You can schedule daily, weekly, or monthly recurring services. This is perfect for regular cleaning, cooking, or childcare needs. You can modify or cancel recurring bookings anytime through your account.',
      category: 'Booking',
      isActive: true,
      order: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      question: 'How can I cancel or reschedule my booking?',
      answer: 'You can cancel or reschedule your booking through the app or by calling our customer support. Cancellations made at least 2 hours before the scheduled time are free. Late cancellations may incur a small fee.',
      category: 'Booking',
      isActive: true,
      order: 7,
      createdAt: new Date().toISOString(),
    },

    // Payment FAQs
    {
      id: '8',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards, digital wallets (UPI, Paytm, Google Pay), net banking, and cash payments. You can choose your preferred payment method during booking.',
      category: 'Payment',
      isActive: true,
      order: 8,
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      question: 'When do I need to make the payment?',
      answer: 'For online payments, you can pay during booking or after service completion. For cash payments, you pay directly to the service provider after the work is completed to your satisfaction.',
      category: 'Payment',
      isActive: true,
      order: 9,
      createdAt: new Date().toISOString(),
    },
    {
      id: '10',
      question: 'Are there any hidden charges?',
      answer: 'No, we believe in transparent pricing. All charges including service fees, taxes, and any applicable charges are clearly mentioned during booking. There are no hidden costs.',
      category: 'Payment',
      isActive: true,
      order: 10,
      createdAt: new Date().toISOString(),
    },
    {
      id: '11',
      question: 'Do you offer refunds?',
      answer: 'Yes, if you are not satisfied with the service quality, we offer refunds based on our refund policy. Please contact our customer support within 24 hours of service completion for refund requests.',
      category: 'Payment',
      isActive: true,
      order: 11,
      createdAt: new Date().toISOString(),
    },

    // Services FAQs
    {
      id: '12',
      question: 'What cleaning services do you provide?',
      answer: 'Our cleaning services include deep cleaning, regular house cleaning, kitchen cleaning, bathroom cleaning, floor mopping, dusting, window cleaning, and post-event cleanup. We bring our own cleaning supplies and equipment.',
      category: 'Services',
      isActive: true,
      order: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: '13',
      question: 'Do you provide cooking services?',
      answer: 'Yes, we offer cooking services including daily meal preparation, special occasion cooking, meal planning, and kitchen organization. Our cooks are experienced in various cuisines and dietary requirements.',
      category: 'Services',
      isActive: true,
      order: 13,
      createdAt: new Date().toISOString(),
    },
    {
      id: '14',
      question: 'Do you offer childcare and elderly care services?',
      answer: 'Yes, we provide trained caregivers for children and elderly family members. Our caregivers are experienced, background-verified, and trained in basic first aid. We offer both hourly and full-time care options.',
      category: 'Services',
      isActive: true,
      order: 14,
      createdAt: new Date().toISOString(),
    },
    {
      id: '15',
      question: 'What should I do if the service provider doesn\'t show up?',
      answer: 'If your service provider doesn\'t arrive within 30 minutes of the scheduled time, please contact our customer support immediately. We will either send a replacement or provide a full refund.',
      category: 'Services',
      isActive: true,
      order: 15,
      createdAt: new Date().toISOString(),
    },
    {
      id: '16',
      question: 'Can I request a specific service provider?',
      answer: 'Yes, if you\'ve had a good experience with a particular service provider, you can request them for future bookings. However, availability depends on their schedule and location.',
      category: 'Services',
      isActive: true,
      order: 16,
      createdAt: new Date().toISOString(),
    },

    // Account FAQs
    {
      id: '17',
      question: 'How do I create an account with Meri Didi?',
      answer: 'You can create an account by downloading our mobile app or visiting our website. Simply provide your phone number, verify it with OTP, and complete your profile with basic information.',
      category: 'Account',
      isActive: true,
      order: 17,
      createdAt: new Date().toISOString(),
    },
    {
      id: '18',
      question: 'How can I update my profile information?',
      answer: 'You can update your profile information anytime through the app settings or website account section. You can change your address, contact details, and service preferences.',
      category: 'Account',
      isActive: true,
      order: 18,
      createdAt: new Date().toISOString(),
    },
    {
      id: '19',
      question: 'How do I track my booking status?',
      answer: 'You can track your booking status in real-time through the app. You\'ll receive notifications when your service provider is assigned, when they\'re on the way, and when the service is completed.',
      category: 'Account',
      isActive: true,
      order: 19,
      createdAt: new Date().toISOString(),
    },

    // Safety & Trust FAQs
    {
      id: '20',
      question: 'What safety measures do you have in place?',
      answer: 'We have comprehensive safety measures including background verification of all service providers, real-time tracking, 24/7 customer support, emergency contact system, and insurance coverage for damages.',
      category: 'Safety',
      isActive: true,
      order: 20,
      createdAt: new Date().toISOString(),
    },
    {
      id: '21',
      question: 'What if something gets damaged during the service?',
      answer: 'All our services are covered by insurance. If any damage occurs during the service due to our service provider\'s negligence, we will compensate for the damage as per our insurance policy terms.',
      category: 'Safety',
      isActive: true,
      order: 21,
      createdAt: new Date().toISOString(),
    },
    {
      id: '22',
      question: 'Can I rate and review the service provider?',
      answer: 'Yes, after each service completion, you can rate and review the service provider. Your feedback helps us maintain quality standards and helps other customers make informed decisions.',
      category: 'General',
      isActive: true,
      order: 22,
      createdAt: new Date().toISOString(),
    },

    // Support FAQs
    {
      id: '23',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support through the app chat feature, phone call, email, or WhatsApp. Our support team is available 24/7 to assist you with any queries or concerns.',
      category: 'Support',
      isActive: true,
      order: 23,
      createdAt: new Date().toISOString(),
    },
    {
      id: '24',
      question: 'What if I\'m not satisfied with the service quality?',
      answer: 'If you\'re not satisfied with the service quality, please contact us within 24 hours. We will either send another service provider to redo the work or provide a refund based on the situation.',
      category: 'Support',
      isActive: true,
      order: 24,
      createdAt: new Date().toISOString(),
    },
    {
      id: '25',
      question: 'Do you have a mobile app?',
      answer: 'Yes, we have mobile apps available for both Android and iOS devices. You can download the Meri Didi app from Google Play Store or Apple App Store for a convenient booking experience.',
      category: 'General',
      isActive: true,
      order: 25,
      createdAt: new Date().toISOString(),
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
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
  const filteredFaqs = selectedCategoryFilter === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategoryFilter);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">FAQ Management</h1>
          <p className="text-gray-600 mt-1">Manage frequently asked questions for Meri Didi customers</p>
        </div>
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
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
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

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="category-filter">Filter by Category:</Label>
          <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">
            Showing {filteredFaqs.length} of {faqs.length} FAQs
          </span>
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">
            {selectedCategoryFilter === 'All' ? 'No FAQs found' : `No FAQs found in ${selectedCategoryFilter} category`}
          </h3>
          <p className="text-gray-500 mt-2">
            {selectedCategoryFilter === 'All' ? 'Add a new FAQ to get started' : 'Try selecting a different category or add a new FAQ'}
          </p>
          <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add New FAQ
          </Button>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-4">
          {filteredFaqs.map((faq) => (
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
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
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
