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
import { Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { WorkerService } from '@/services/mockDatabase';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { WorkerStatus, ServiceType } from '@/types';

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
  idProof: z.any().optional(),
  photo: z.any().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type ProfessionalDetailsFormData = z.infer<typeof professionalDetailsSchema>;
type DocumentsFormData = z.infer<typeof documentsSchema>;

export function WorkerRegistrationForm() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.PersonalInfo);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(null);
  const [professionalDetails, setProfessionalDetails] = useState<ProfessionalDetailsFormData | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleIdProofChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setIdProofFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIdProofPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFileToSupabase = async (file: File, path: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('worker-documents')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      // Generate a public URL for the file
      const { data: urlData } = await supabase.storage
        .from('worker-documents')
        .getPublicUrl(filePath);

      return urlData?.publicUrl || null;
    } catch (error) {
      console.error('Error in file upload:', error);
      return null;
    }
  };

  const handleDocumentsSubmit = async (data: DocumentsFormData) => {
    if (!personalInfo || !professionalDetails) {
      toast({
        title: "Form Error",
        description: "Please complete all sections of the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload documents to Supabase
      let idProofUrl = null;
      let photoUrl = null;
      
      if (idProofFile) {
        idProofUrl = await uploadFileToSupabase(idProofFile, 'id-proofs');
      }
      
      if (photoFile) {
        photoUrl = await uploadFileToSupabase(photoFile, 'photos');
      }

      // Create the worker object with all required fields
      const workerData = {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        gender: personalInfo.gender,
        dateOfBirth: format(personalInfo.dateOfBirth, 'yyyy-MM-dd'),
        serviceType: professionalDetails.serviceType as ServiceType,
        experience: parseInt(professionalDetails.experience),
        availability: professionalDetails.availability,
        idType: professionalDetails.idType,
        idNumber: professionalDetails.idNumber,
        about: professionalDetails.about,
        skills: [] as string[],
        status: "Pending" as WorkerStatus,
        rating: 0,
        totalBookings: 0,
        completionRate: 0,
        joiningDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        idProofUrl,
        photoUrl
      };

      // Save to local mock database for compatibility
      const worker = WorkerService.create(workerData);

      // Save worker data to Supabase
      const { error } = await supabase
        .from('worker_applications')
        .insert([{
          full_name: personalInfo.fullName,
          email: personalInfo.email,
          phone: personalInfo.phone,
          address: personalInfo.address,
          city: personalInfo.city,
          gender: personalInfo.gender,
          date_of_birth: format(personalInfo.dateOfBirth, 'yyyy-MM-dd'),
          service_type: professionalDetails.serviceType,
          experience: parseInt(professionalDetails.experience),
          availability: professionalDetails.availability,
          id_type: professionalDetails.idType,
          id_number: professionalDetails.idNumber,
          about: professionalDetails.about,
          id_proof_url: idProofUrl,
          photo_url: photoUrl,
          status: 'Pending',
          skills: [],
        }]);

      if (error) {
        console.error('Error saving to Supabase:', error);
        toast({
          title: "Database Error",
          description: `Error saving to database: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Your application has been submitted and saved to the database.",
        });

        // Reset forms and go back to first step
        personalInfoForm.reset();
        professionalDetailsForm.reset();
        documentsForm.reset();
        setPersonalInfo(null);
        setProfessionalDetails(null);
        setIdProofFile(null);
        setPhotoFile(null);
        setIdProofPreview(null);
        setPhotoPreview(null);
        setCurrentStep(RegistrationStep.PersonalInfo);
        
        // Navigate to dashboard or worker management
        navigate("/worker-management");
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was a problem submitting your application.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          className="bg-yellow-500 h-2 rounded-full transition-all"
          style={{ 
            width: `${(currentStep / Object.keys(RegistrationStep).length * 2) * 100}%`,
          }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-8">
        <div className={`flex flex-col items-center ${currentStep === RegistrationStep.PersonalInfo ? 'text-yellow-500 font-medium' : 'text-gray-500'}`}>
          Personal Info
        </div>
        <div className={`flex flex-col items-center ${currentStep === RegistrationStep.ProfessionalDetails ? 'text-yellow-500 font-medium' : 'text-gray-500'}`}>
          Professional Details
        </div>
        <div className={`flex flex-col items-center ${currentStep === RegistrationStep.Documents ? 'text-yellow-500 font-medium' : 'text-gray-500'}`}>
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
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
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
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
                  {idProofPreview ? (
                    <div className="relative mb-4">
                      <img 
                        src={idProofPreview} 
                        alt="ID Proof Preview" 
                        className="mx-auto max-h-40 object-contain rounded-md" 
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="absolute top-2 right-2 bg-red-100 text-red-600 border-red-200 h-6 w-6 p-1 rounded-full"
                        onClick={() => {
                          setIdProofFile(null);
                          setIdProofPreview(null);
                        }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <div className="mx-auto h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-yellow-600" />
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Upload ID Proof</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      (Aadhar Card, PAN Card, etc. as selected above)
                    </p>
                  </div>
                  
                  <input 
                    type="file" 
                    id="idProof"
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleIdProofChange}
                  />
                  <label htmlFor="idProof">
                    <Button 
                      type="button" 
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black" 
                      onClick={() => document.getElementById('idProof')?.click()}
                    >
                      {idProofFile ? 'Change File' : 'Select File'}
                    </Button>
                  </label>
                  
                  {idProofFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      {idProofFile.name} ({Math.round(idProofFile.size / 1024)} KB)
                    </p>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {photoPreview ? (
                    <div className="relative mb-4">
                      <img 
                        src={photoPreview} 
                        alt="Photo Preview" 
                        className="mx-auto max-h-40 object-contain rounded-md" 
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm" 
                        className="absolute top-2 right-2 bg-red-100 text-red-600 border-red-200 h-6 w-6 p-1 rounded-full"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ) : (
                    <div className="mx-auto h-16 w-16 bg-yellow-50 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-yellow-600" />
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Upload Recent Photo</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      (Clear photograph of yourself)
                    </p>
                  </div>
                  
                  <input 
                    type="file" 
                    id="photo"
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="photo">
                    <Button 
                      type="button" 
                      className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black" 
                      onClick={() => document.getElementById('photo')?.click()}
                    >
                      {photoFile ? 'Change Photo' : 'Select Photo'}
                    </Button>
                  </label>
                  
                  {photoFile && (
                    <p className="mt-2 text-sm text-gray-500">
                      {photoFile.name} ({Math.round(photoFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={goBack}>
                Previous
              </Button>
              <Button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
