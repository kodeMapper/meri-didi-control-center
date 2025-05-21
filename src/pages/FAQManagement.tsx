
import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FAQ } from '@/types';

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New FAQ</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label htmlFor="question" className="text-sm font-medium">Question</label>
                <Input id="question" placeholder="Enter the question" />
              </div>
              <div>
                <label htmlFor="answer" className="text-sm font-medium">Answer</label>
                <textarea 
                  id="answer" 
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Enter the answer"
                ></textarea>
              </div>
              <div>
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input id="category" placeholder="General" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save FAQ</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border p-2 rounded-md">
            <div className="flex justify-between items-center">
              <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
            <AccordionContent className="pt-2 pb-4">
              <p>{faq.answer}</p>
              <div className="text-sm text-gray-500 mt-2">
                Category: {faq.category}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
