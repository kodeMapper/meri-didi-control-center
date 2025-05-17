
import { WorkerRegistrationForm } from "@/components/worker/WorkerRegistrationForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function WorkerRegistration() {
  const navigate = useNavigate();
  
  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="text-gray-600"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Worker Registration</h1>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <WorkerRegistrationForm />
      </div>
    </div>
  );
}

export default WorkerRegistration;
