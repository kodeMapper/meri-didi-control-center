
import { useState, useEffect } from 'react';
import { Customer, City } from '@/types';
import { Button } from '@/components/ui/button';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'Mumbai',
          totalBookings: 5,
          lastBookingDate: '2025-05-10',
          createdAt: '2025-01-15T10:30:00Z',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Priya Singh',
          email: 'priya@example.com',
          phone: '+9876543210',
          address: '456 Park Avenue',
          city: 'Delhi',
          totalBookings: 3,
          lastBookingDate: '2025-04-22',
          createdAt: '2025-02-10T14:20:00Z',
          status: 'Active'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading customers...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      
      <div className="grid gap-4">
        {customers.map(customer => (
          <div key={customer.id} className="border p-4 rounded-md">
            <h3 className="font-medium">{customer.name}</h3>
            <p>{customer.email}</p>
            <p>{customer.phone}</p>
            <div className="mt-2">
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
