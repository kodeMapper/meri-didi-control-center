
import { WorkerRegistrationForm } from "@/components/worker/WorkerRegistrationForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function WorkerRegistration() {
  const navigate = useNavigate();
  
  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Worker Registration</h1>
        <Button 
          variant="outline" 
          className="text-gray-600"
          onClick={() => navigate(-1)}
        >
          Back to Dashboard
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <WorkerRegistrationForm />
      </div>
    </div>
  );
}

export default WorkerRegistration;
