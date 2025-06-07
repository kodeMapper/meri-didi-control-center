/**
 * Worker ID Mapping Debug Tool
 * This file creates a simple web component that can be added to the app
 * to help debug worker ID mapping issues between frontend and backend.
 */
import { useState, useEffect } from "react";
import { WorkerAPI } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function WorkerIdMappingDebugTool() {
  const [mappings, setMappings] = useState<{
    workerIdMap: Record<string, string>,
    backendIdMap: Record<string, string>
  }>({ workerIdMap: {}, backendIdMap: {} });

  const [allWorkers, setAllWorkers] = useState<any[]>([]);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const refreshMappings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await WorkerAPI.syncWorkerMappings();
      const currentMappings = WorkerAPI.getIdMappings();
      setMappings(currentMappings);
      
      // Also fetch all workers to compare
      const workers = await WorkerAPI.getAllWorkers();
      setAllWorkers(workers);
      
      // Check for any pending changes
      try {
        const pendingChangesJson = localStorage.getItem('pendingWorkerChanges');
        if (pendingChangesJson) {
          const changes = JSON.parse(pendingChangesJson);
          setPendingChanges(changes || []);
        } else {
          setPendingChanges([]);
        }
      } catch (storageError) {
        console.error("Error reading pending changes:", storageError);
        setPendingChanges([]);
      }
    } catch (error) {
      console.error("Error refreshing mappings:", error);
      setError("Failed to refresh mappings. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    refreshMappings();
  }, []);
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm" 
          className="fixed bottom-4 right-4 z-50 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200 flex gap-2 items-center"
        >
          🔍 Debug IDs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-4">Worker ID Mapping Debugger</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between">
            <div className="space-x-2">
              <Button 
                onClick={refreshMappings} 
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh Mappings"}
              </Button>
              
              <Button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const result = await WorkerAPI.syncPendingWorkerChanges();
                    alert(`Synced ${result.success} changes, ${result.failed} failed`);
                    await refreshMappings();
                  } catch (error) {
                    alert(`Sync error: ${error.message}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                variant="outline"
                disabled={isLoading}
              >
                Sync Pending Changes
              </Button>
            </div>
            
            <Button 
              onClick={() => {
                WorkerAPI.clearMappings();
                refreshMappings();
              }}
              variant="outline"
              disabled={isLoading}
            >
              Clear & Reinitialize
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-300">
              {error}
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium mb-2">All Workers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Frontend ID</TableHead>
                  <TableHead>Backend ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allWorkers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell>{worker.fullName}</TableCell>
                    <TableCell>{worker.id}</TableCell>
                    <TableCell>
                      {mappings.backendIdMap[worker.id] || "?"}
                      {mappings.backendIdMap[worker.id] ? 
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-800">Mapped</Badge> :
                        <Badge variant="outline" className="ml-2 bg-red-50 text-red-800">Missing</Badge>
                      }
                    </TableCell>
                    <TableCell>{worker.phone}</TableCell>
                    <TableCell>
                      <Badge className={
                        worker.status === "Active" ? "bg-green-100 text-green-800" :
                        worker.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        worker.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }>
                        {worker.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Phone → Frontend ID</h3>
              <div className="border rounded-md overflow-auto max-h-60 p-4">
                <pre className="text-sm">
                  {JSON.stringify(mappings.workerIdMap, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Frontend ID → Backend ID</h3>
              <div className="border rounded-md overflow-auto max-h-60 p-4">
                <pre className="text-sm">
                  {JSON.stringify(mappings.backendIdMap, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Add section for pending changes */}
          {pendingChanges.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Pending Changes</h3>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="mb-2 text-yellow-800">
                  {pendingChanges.length} pending worker changes waiting to be synced
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Religion</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingChanges.map((change, index) => (
                      <TableRow key={index}>
                        <TableCell>{change.workerId}</TableCell>
                        <TableCell>
                          <Badge className={
                            change.status === 'Active' ? 'bg-green-500' : 
                            change.status === 'Inactive' ? 'bg-gray-500' :
                            change.status === 'Rejected' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }>
                            {change.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{change.religion || 'Hindu'}</TableCell>
                        <TableCell>{new Date(change.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p>
              <strong>How this works:</strong> The frontend assigns consistent IDs to workers based on phone numbers. 
              These IDs are then mapped to backend IDs for API calls.
            </p>
            <p className="mt-2">
              <strong>If you're seeing mapping issues:</strong> Try clicking "Clear & Reinitialize" to rebuild the mappings.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
