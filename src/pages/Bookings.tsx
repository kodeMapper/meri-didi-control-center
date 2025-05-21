import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { BookingFiltersBar } from "@/components/bookings/BookingFilters";
import { BookingFilters } from "@/types";

const testBookings = [
	// All
	{
		id: "1",
		customer: "Amit Sharma",
		service: "Cleaning",
		date: "2025-05-20",
		time: "10:00 AM",
		status: "Pending",
		payment: "Cash",
		amount: 500,
		location: "Delhi",
		reason: "",
	},
	{
		id: "2",
		customer: "Priya Singh",
		service: "Cooking",
		date: "2025-05-21",
		time: "2:00 PM",
		status: "Confirmed",
		payment: "UPI",
		amount: 700,
		location: "Noida",
		reason: "",
	},
	{
		id: "3",
		customer: "Rahul Verma",
		service: "Driving",
		date: "2025-05-22",
		time: "9:00 AM",
		status: "Completed",
		payment: "Card",
		amount: 1200,
		location: "Gurgaon",
		reason: "",
	},
	// Cancelled
	{
		id: "4",
		customer: "Sunita Yadav",
		service: "Cleaning",
		date: "2025-05-23",
		time: "11:00 AM",
		status: "Cancelled",
		payment: "Cash",
		amount: 400,
		location: "Delhi",
		reason: "Worker unavailable",
	},
	{
		id: "5",
		customer: "Vikas Kumar",
		service: "Cooking",
		date: "2025-05-24",
		time: "1:00 PM",
		status: "Cancelled",
		payment: "UPI",
		amount: 600,
		location: "Noida",
		reason: "Customer changed mind",
	},
];

function filterBookings(status: string) {
	if (status === "all") return testBookings;
	return testBookings.filter((b) => b.status.toLowerCase() === status);
}

export default function BookingsPage() {
	const [filters, setFilters] = useState({});
	const [bookings, setBookings] = useState(testBookings);

	const handleEdit = (id: string) => {
		alert(`Edit booking ${id}`);
	};
	const handleDelete = (id: string) => {
		setBookings((prev) => prev.filter((b) => b.id !== id));
	};
	const handleRefund = (id: string) => {
		alert(`Refund initiated for booking ${id}`);
	};

	const renderTable = (status: string) => {
		const filtered =
			status === "all"
				? bookings
				: bookings.filter((b) => b.status.toLowerCase() === status);
		return (
			<div className="overflow-x-auto">
				<table className="min-w-full text-sm rounded-lg overflow-hidden bg-white shadow">
					<thead className="bg-yellow-100">
						<tr>
							<th className="px-4 py-2 text-left font-semibold">Customer</th>
							<th className="px-4 py-2 text-left font-semibold">Service</th>
							<th className="px-4 py-2 text-left font-semibold">Date</th>
							<th className="px-4 py-2 text-left font-semibold">Time</th>
							<th className="px-4 py-2 text-left font-semibold">Location</th>
							<th className="px-4 py-2 text-left font-semibold">Payment</th>
							<th className="px-4 py-2 text-left font-semibold">Amount</th>
							{status === "cancelled" && (
								<th className="px-4 py-2 text-left font-semibold">Reason</th>
							)}
							<th className="px-4 py-2 text-left font-semibold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filtered.length === 0 ? (
							<tr>
								<td
									colSpan={status === "cancelled" ? 9 : 8}
									className="text-center py-6 text-gray-500"
								>
									No bookings found
								</td>
							</tr>
						) : (
							filtered.map((b) => (
								<tr key={b.id} className="hover:bg-yellow-50 transition">
									<td className="px-4 py-2">{b.customer}</td>
									<td className="px-4 py-2">{b.service}</td>
									<td className="px-4 py-2">{b.date}</td>
									<td className="px-4 py-2">{b.time}</td>
									<td className="px-4 py-2">{b.location}</td>
									<td className="px-4 py-2">{b.payment}</td>
									<td className="px-4 py-2 font-medium text-yellow-700">
										₹{b.amount}
									</td>
									{status === "cancelled" && (
										<td className="px-4 py-2 text-red-600">{b.reason}</td>
									)}
									<td className="px-4 py-2 flex gap-2">
										<Button
											size="icon"
											variant="ghost"
											className="hover:bg-yellow-200 text-yellow-700"
											onClick={() => handleEdit(b.id)}
										>
											<Pencil size={16} />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="hover:bg-red-100 text-red-600"
											onClick={() => handleDelete(b.id)}
										>
											<Trash2 size={16} />
										</Button>
										{status === "cancelled" && (
											<Button
												size="icon"
												variant="ghost"
												className="hover:bg-yellow-200 text-yellow-700"
												onClick={() => handleRefund(b.id)}
												title="Refund"
											>
												<RotateCcw size={16} />
											</Button>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<div className="w-full max-w-[1400px] mx-0 p-6 pt-4">
			{/* Header */}
			<div className="bg-white rounded-xl shadow-sm px-6 py-4 mb-6 border-b border-yellow-200">
				<h1 className="text-2xl font-bold text-yellow-700">Manage Bookings</h1>
			</div>

			{/* Filters */}
			<Card className="mb-8 p-4 shadow-md bg-yellow-50 border border-yellow-100">
				<BookingFiltersBar onFiltersChange={() => {}} />
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="all" className="w-full">
				<TabsList className="mb-4 flex gap-2 bg-yellow-100 rounded-full p-1 shadow-inner">
					<TabsTrigger
						value="all"
						className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-yellow-400 data-[state=active]:text-white transition"
					>
						All Bookings
					</TabsTrigger>
					<TabsTrigger
						value="pending"
						className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-yellow-400 data-[state=active]:text-white transition"
					>
						Pending
					</TabsTrigger>
					<TabsTrigger
						value="confirmed"
						className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-yellow-400 data-[state=active]:text-white transition"
					>
						Confirmed
					</TabsTrigger>
					<TabsTrigger
						value="completed"
						className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-yellow-400 data-[state=active]:text-white transition"
					>
						Completed
					</TabsTrigger>
					<TabsTrigger
						value="cancelled"
						className="rounded-full px-5 py-2 font-semibold data-[state=active]:bg-red-400 data-[state=active]:text-white transition"
					>
						Cancelled
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all">
					<Card className="p-0 shadow-md border border-yellow-100">
						{renderTable("all")}
					</Card>
				</TabsContent>
				<TabsContent value="pending">
					<Card className="p-0 shadow-md border border-yellow-100">
						{renderTable("pending")}
					</Card>
				</TabsContent>
				<TabsContent value="confirmed">
					<Card className="p-0 shadow-md border border-yellow-100">
						{renderTable("confirmed")}
					</Card>
				</TabsContent>
				<TabsContent value="completed">
					<Card className="p-0 shadow-md border border-yellow-100">
						{renderTable("completed")}
					</Card>
				</TabsContent>
				<TabsContent value="cancelled">
					<Card className="p-0 shadow-md border border-red-100">
						{renderTable("cancelled")}
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
