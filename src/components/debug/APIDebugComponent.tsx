import React, { useState, useEffect } from 'react';
import { WorkerAPI } from '@/services/api-service';
import { Worker } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Bug } from 'lucide-react';

export function APIDebugComponent() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [error, setError] = useState<string>('');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setLoading(true);
    setError('');
    addTestResult('Testing API connection...');
    
    try {
      const isConnected = await WorkerAPI.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      addTestResult(`API connection: ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
    } catch (err) {
      setConnectionStatus('disconnected');
      setError(`Connection test failed: ${err}`);
      addTestResult(`❌ Connection test failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async () => {
    setLoading(true);
    setError('');
    addTestResult('Loading workers from API...');
    
    try {
      const allWorkers = await WorkerAPI.getAllWorkers();
      setWorkers(allWorkers);
      addTestResult(`✅ Loaded ${allWorkers.length} workers from API`);
      
      // Log worker details
      allWorkers.forEach(worker => {
        addTestResult(`  - ${worker.fullName} (ID: ${worker.id}, Status: ${worker.status}, Service: ${worker.serviceType})`);
      });
    } catch (err) {
      setError(`Failed to load workers: ${err}`);
      addTestResult(`❌ Failed to load workers: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const testStatusUpdate = async () => {
    if (workers.length === 0) {
      addTestResult('❌ No workers available for status update test');
      return;
    }
    
    const testWorker = workers[0];
    const originalStatus = testWorker.status;
    const newStatus = originalStatus === 'Active' ? 'Pending' : 'Active';
    
    setLoading(true);
    addTestResult(`Testing status update for ${testWorker.fullName} (ID: ${testWorker.id})`);
    addTestResult(`  Changing status from ${originalStatus} to ${newStatus}...`);
    
    try {
      // Update status
      const success = await WorkerAPI.updateWorkerStatus(testWorker.id, newStatus as any);
      if (success) {
        addTestResult(`✅ Status update successful`);
        
        // Reload workers to verify
        const updatedWorkers = await WorkerAPI.getAllWorkers();
        const updatedWorker = updatedWorkers.find(w => w.id === testWorker.id);
        if (updatedWorker && updatedWorker.status === newStatus) {
          addTestResult(`✅ Verification successful: Status is now ${updatedWorker.status}`);
          
          // Restore original status
          addTestResult(`Restoring original status...`);
          await WorkerAPI.updateWorkerStatus(testWorker.id, originalStatus as any);
          addTestResult(`✅ Status restored to ${originalStatus}`);
          
          // Reload workers
          await loadWorkers();
        } else {
          addTestResult(`❌ Verification failed: Status not updated correctly`);
        }
      } else {
        addTestResult(`❌ Status update failed`);
      }
    } catch (err) {
      addTestResult(`❌ Status update error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    await testConnection();
    if (connectionStatus === 'connected') {
      await loadWorkers();
      await testStatusUpdate();
    }
  };

  return (
    <Card className="p-4 m-4 border-dashed border-2 border-blue-200 bg-blue-50/30">
      {/* Header with minimize/expand button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-800">API Integration Debug Panel</h2>
          <Badge variant="secondary" className="text-xs">
            Development Only
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
        >
          {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {/* Minimized state - show only status */}
      {isMinimized && (
        <div className="flex gap-2 items-center">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            API: {connectionStatus}
          </Badge>
          {workers.length > 0 && (
            <Badge variant="secondary">
              {workers.length} workers loaded
            </Badge>
          )}
          <span className="text-sm text-gray-600">Click to expand test panel</span>
        </div>
      )}

      {/* Expanded state - show full debug panel */}
      {!isMinimized && (
        <>
          <div className="flex gap-2 mb-4">
            <Button onClick={testConnection} disabled={loading} size="sm">
              Test Connection
            </Button>
            <Button onClick={loadWorkers} disabled={loading} size="sm">
              Load Workers
            </Button>
            <Button onClick={testStatusUpdate} disabled={loading || workers.length === 0} size="sm">
              Test Status Update
            </Button>
            <Button onClick={runAllTests} disabled={loading} size="sm">
              Run All Tests
            </Button>
          </div>
          
          <div className="mb-4">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              API Status: {connectionStatus}
            </Badge>
            {workers.length > 0 && (
              <Badge className="ml-2">
                Workers Loaded: {workers.length}
              </Badge>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              Error: {error}
            </div>
          )}
          
          {workers.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Current Workers:</h3>
              <div className="space-y-2">
                {workers.map(worker => (
                  <div key={worker.id} className="p-2 bg-gray-50 rounded text-sm">
                    <strong>{worker.fullName}</strong> (ID: {worker.id}) - 
                    <Badge className="ml-2" variant={worker.status === 'Active' ? 'default' : 'secondary'}>
                      {worker.status}
                    </Badge>
                    <span className="ml-2 text-gray-600">{worker.serviceType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {testResults.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Test Log:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm max-h-60 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
