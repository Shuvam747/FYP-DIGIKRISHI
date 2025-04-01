import { VerificationRequests } from "../component/approve";


export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Requests</h2>
          <VerificationRequests />
        </div>
      </div>
    </div>
  )
}
