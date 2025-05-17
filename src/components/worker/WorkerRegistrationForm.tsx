
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { WorkerService } from '@/services/mockDatabase';

enum RegistrationStep {
  PersonalInfo = 1,
  ProfessionalDetails = 2,
  Documents = 3,
}

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
});

const professionalDetailsSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  experience: z.string().min(1, 'Experience is required'),
  availability: z.string().min(1, 'Availability is required'),
  idType: z.string().min(1, 'ID type is required'),
  idNumber: z.string().min(1, 'ID number is required'),
  about: z.string().min(1, 'About section is required'),
});

const documentsSchema = z.object({
  idProof: z.any(),
  photo: z.any(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type ProfessionalDetailsFormData = z.infer<typeof professionalDetailsSchema>;
type DocumentsFormData = z.infer<typeof documentsSchema>;

export function WorkerRegistrationForm() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.PersonalInfo);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(null);
  const [professionalDetails, setProfessionalDetails] = useState<ProfessionalDetailsFormData | null>(null);
  const { toast } = useToast();

  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      gender: '',
    },
  });

  const professionalDetailsForm = useForm<ProfessionalDetailsFormData>({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
      serviceType: '',
      experience: '',
      availability: '',
      idType: '',
      idNumber: '',
      about: '',
    },
  });

  const documentsForm = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {},
  });

  const handlePersonalInfoSubmit = (data: PersonalInfoFormData) => {
    setPersonalInfo(data);
    setCurrentStep(RegistrationStep.ProfessionalDetails);
  };

  const handleProfessionalDetailsSubmit = (data: ProfessionalDetailsFormData) => {
    setProfessionalDetails(data);
    setCurrentStep(RegistrationStep.Documents);
  };

  const handleDocumentsSubmit = (data: DocumentsFormData) => {
    if (!personalInfo || !professionalDetails) {
      return;
    }

    // Create the worker with all the collected data
    try {
      WorkerService.create({
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city as any,
        gender: personalInfo.gender as any,
        dateOfBirth: format(personalInfo.dateOfBirth, 'yyyy-MM-dd'),
        serviceType: professionalDetails.serviceType as any,
        experience: parseInt(professionalDetails.experience),
        availability: professionalDetails.availability as any,
        idType: professionalDetails.idType as any,
        idNumber: professionalDetails.idNumber,
        about: professionalDetails.about,
        skills: [],
        status: 'Pending',
      });

      toast({
        title: "Registration Successful",
        description: "Your application has been submitted successfully.",
      });

      // Reset forms and go back to first step
      personalInfoForm.reset();
      professionalDetailsForm.reset();
      documentsForm.reset();
      setPersonalInfo(null);
      setProfessionalDetails(null);
      setCurrentStep(RegistrationStep.PersonalInfo);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was a problem submitting your application.",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    if (currentStep === RegistrationStep.ProfessionalDetails) {
      setCurrentStep(RegistrationStep.PersonalInfo);
    } else if (currentStep === RegistrationStep.Documents) {
      setCurrentStep(RegistrationStep.ProfessionalDetails);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Worker Registration</h1>
      <p className="text-center text-gray-600 mb-8">Join Meri Didi as a service professional</p>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
        <div 
          className="bg-primary h-2 rounded-full transition-all"
          style={{ 
            width: `${(currentStep / Object.keys(RegistrationStep).length * 2) * 100}%`,
          }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-8">
        <div className={`flex flex-col items-center ${currentStep === RegistrationStep.PersonalInfo ? 'text-primary font-medium' : 'text-gray-500'}`}>
          Personal Info
        </div>
        <div className={`flex flex-col items-center ${currentStep === RegistrationStep.ProfessionalDetails ? 'text-primary font-medium' : 'text-gray-500'}`}>
          Professional Details
        </div>
        <div className={`flex flex-col items-center ${currentStep === RegistrationStep.Documents ? 'text-primary font-medium' : 'text-gray-500'}`}>
          Documents
        </div>
      </div>

      {/* Forms */}
      {currentStep === RegistrationStep.PersonalInfo && (
        <Form {...personalInfoForm}>
          <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-6">
            <FormField
              control={personalInfoForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={personalInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={personalInfoForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={personalInfoForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={personalInfoForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={personalInfoForm.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === RegistrationStep.ProfessionalDetails && (
        <Form {...professionalDetailsForm}>
          <form onSubmit={professionalDetailsForm.handleSubmit(handleProfessionalDetailsSubmit)} className="space-y-6">
            <FormField
              control={professionalDetailsForm.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Cooking">Cooking</SelectItem>
                      <SelectItem value="Driving">Driving</SelectItem>
                      <SelectItem value="Sweeping">Sweeping</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={professionalDetailsForm.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={professionalDetailsForm.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Full-Time">Full-Time</SelectItem>
                        <SelectItem value="Part-Time">Part-Time</SelectItem>
                        <SelectItem value="Weekends Only">Weekends Only</SelectItem>
                        <SelectItem value="Weekdays Only">Weekdays Only</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={professionalDetailsForm.control}
                name="idType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                        <SelectItem value="PAN Card">PAN Card</SelectItem>
                        <SelectItem value="Driving License">Driving License</SelectItem>
                        <SelectItem value="Voter ID">Voter ID</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={professionalDetailsForm.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your ID number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={professionalDetailsForm.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Yourself</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your skills, experience, and why you want to join Meri Didi"
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                Previous
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === RegistrationStep.Documents && (
        <Form {...documentsForm}>
          <form onSubmit={documentsForm.handleSubmit(handleDocumentsSubmit)} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Upload Documents</h3>
              <p className="text-sm text-gray-500 mb-6">
                Please upload clear images of your ID and a recent photograph
              </p>

              <div className="space-y-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Upload ID Proof</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      (Aadhar Card, PAN Card, etc. as selected above)
                    </p>
                  </div>
                  <Button className="mt-4" variant="outline">
                    Select File
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8 text-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Upload Recent Photograph</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      (A clear, passport-size photo with white background)
                    </p>
                  </div>
                  <Button className="mt-4" variant="outline">
                    Select File
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                Previous
              </Button>
              <Button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
