/**
 * Worker ID Verifier
 * 
 * This component allows users to verify and test worker ID mappings
 * to ensure status changes are applied to the correct worker.
 */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkerAPI } from "@/services/api-service";
import { Worker } from "@/types";

export function WorkerIdVerifier() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  // State for critical ID verification
  const [criticalIdVerification, setCriticalIdVerification] = useState<any>(null);

  // Load workers on mount
  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      // First sync ID mappings
      await WorkerAPI.syncWorkerMappings();
      
      // Verify critical worker IDs
      const criticalVerification = await WorkerAPI.verifyCriticalWorkerIds();
      setCriticalIdVerification(criticalVerification);
      
      // Then load workers
      const allWorkers = await WorkerAPI.getAllWorkers();
      setWorkers(allWorkers);
    } catch (err) {
      setError("Failed to load workers: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testStatusChange = async (worker: Worker) => {
    if (!worker) return;
    
    // Start with test result entry
    setTestResults(prev => ({
      ...prev,
      [worker.id]: { success: false, message: "Testing status change..." }
    }));
    
    try {
      // Get current status
      const currentStatus = worker.status;
      
      // Choose a different status
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      
      // Log the attempt
      console.log(`Testing status change for ${worker.fullName} (ID: ${worker.id}) from ${currentStatus} to ${newStatus}`);
      
      // Try to update status
      const success = await WorkerAPI.updateWorkerStatus(worker.id, newStatus, worker.religion);
      
      if (!success) {
        throw new Error("API returned false for status update");
      }
      
      // Get updated workers to verify the change
      await WorkerAPI.syncWorkerMappings();
      const updatedWorkers = await WorkerAPI.getAllWorkers();
      const updatedWorker = updatedWorkers.find(w => w.id === worker.id);
      
      if (!updatedWorker) {
        throw new Error("Could not find worker after status update");
      }
      
      if (updatedWorker.status !== newStatus) {
        throw new Error(`Status did not change as expected. Still ${updatedWorker.status}`);
      }
      
      // Success - now change it back
      console.log(`Reverting status for ${worker.fullName} back to ${currentStatus}`);
      const revertSuccess = await WorkerAPI.updateWorkerStatus(worker.id, currentStatus, worker.religion);
      
      if (!revertSuccess) {
        throw new Error("Failed to revert status back to original");
      }
      
      // Final verification
      await WorkerAPI.syncWorkerMappings();
      const finalWorkers = await WorkerAPI.getAllWorkers();
      const finalWorker = finalWorkers.find(w => w.id === worker.id);
      
      if (!finalWorker || finalWorker.status !== currentStatus) {
        throw new Error(`Failed to revert status back to ${currentStatus}`);
      }
      
      // All successful
      setTestResults(prev => ({
        ...prev,
        [worker.id]: { 
          success: true, 
          message: `Successfully changed status to ${newStatus} and back to ${currentStatus}` 
        }
      }));
      
      setWorkers(finalWorkers);
    } catch (error) {
      console.error(`Status change test failed for ${worker.fullName}:`, error);
      setTestResults(prev => ({
        ...prev,
        [worker.id]: { 
          success: false, 
          message: `Test failed: ${(error as Error).message}` 
        }
      }));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Worker ID Verification</span>
          <Button 
            onClick={loadWorkers}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? "Loading..." : "Refresh Workers"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          Test Result
                        </th>
                        <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {workers.map((worker) => (
                        <tr key={worker.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                            {worker.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {worker.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            <Badge
                              className={
                                worker.status === "Active"
                                  ? "bg-green-500"
                                  : worker.status === "Inactive"
                                  ? "bg-gray-500"
                                  : worker.status === "Pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }
                            >
                              {worker.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {testResults[worker.id] ? (
                              <div className={testResults[worker.id].success ? "text-green-600" : "text-red-600"}>
                                {testResults[worker.id].message}
                              </div>
                            ) : (
                              <span className="text-gray-400">Not tested</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <Button
                              size="sm"
                              onClick={() => testStatusChange(worker)}
                              disabled={loading || testResults[worker.id]?.message === "Testing status change..."}
                            >
                              Test Status Change
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {workers.length === 0 && !loading && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No workers found</p>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Loading workers...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-medium">Critical Workers Verification</h3>
            {criticalIdVerification && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                <div className="text-sm font-medium mb-2">
                  Status: {criticalIdVerification.success ? 
                    <span className="text-green-600">✓ Verification Successful</span> : 
                    <span className="text-red-600">✗ Verification Failed</span>
                  }
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* String Worker */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="font-medium">String Worker</div>
                    {criticalIdVerification.string ? (
                      <>
                        <div className="text-xs text-gray-500">Frontend ID: string_2345678</div>
                        <div className="text-xs text-gray-500">Backend ID: {criticalIdVerification.string.id}</div>
                        <div className="text-xs text-gray-500">Status: {criticalIdVerification.string.status}</div>
                        <div className={`text-xs mt-1 ${criticalIdVerification.string.id === '1' ? 'text-green-600' : 'text-red-600 font-medium'}`}>
                          {criticalIdVerification.string.id === '1' ? '✓ Correct Mapping' : '✗ Incorrect Mapping (should be 1)'}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-red-600">Not found</div>
                    )}
                  </div>
                  
                  {/* Yadhnika Worker */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="font-medium">Yadhnika Worker</div>
                    {criticalIdVerification.yadhnika ? (
                      <>
                        <div className="text-xs text-gray-500">Frontend ID: yadhnika_9620393109</div>
                        <div className="text-xs text-gray-500">Backend ID: {criticalIdVerification.yadhnika.id}</div>
                        <div className="text-xs text-gray-500">Status: {criticalIdVerification.yadhnika.status}</div>
                        <div className={`text-xs mt-1 ${criticalIdVerification.yadhnika.id === '2' ? 'text-green-600' : 'text-red-600 font-medium'}`}>
                          {criticalIdVerification.yadhnika.id === '2' ? '✓ Correct Mapping' : '✗ Incorrect Mapping (should be 2)'}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-red-600">Not found</div>
                    )}
                  </div>
                  
                  {/* Tabtabidam Worker */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="font-medium">Tabtabidam Worker</div>
                    {criticalIdVerification.tabtabidam ? (
                      <>
                        <div className="text-xs text-gray-500">Frontend ID: tabtabidam_456123789</div>
                        <div className="text-xs text-gray-500">Backend ID: {criticalIdVerification.tabtabidam.id}</div>
                        <div className="text-xs text-gray-500">Status: {criticalIdVerification.tabtabidam.status}</div>
                        <div className={`text-xs mt-1 ${criticalIdVerification.tabtabidam.id === '3' ? 'text-green-600' : 'text-red-600 font-medium'}`}>
                          {criticalIdVerification.tabtabidam.id === '3' ? '✓ Correct Mapping' : '✗ Incorrect Mapping (should be 3)'}
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-red-600">Not found</div>
                    )}
                  </div>
                </div>
                
                {/* Backend data verification */}
                {criticalIdVerification.backendData && (
                  <div className="bg-gray-100 p-3 rounded text-xs">
                    <div className="font-medium mb-1">Backend Database Records:</div>
                    <div>ID 1: {criticalIdVerification.backendData.id1}</div>
                    <div>ID 2: {criticalIdVerification.backendData.id2}</div>
                    <div>ID 3: {criticalIdVerification.backendData.id3}</div>
                  </div>
                )}
              </div>
            )}

            <h3 className="text-lg font-medium mt-6">ID Mapping Debug Info</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-60">
              {JSON.stringify(WorkerAPI.getIdMappings(), null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
