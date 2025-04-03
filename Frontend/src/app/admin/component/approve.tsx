"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle, XCircle, AlertCircle, User, FileText } from "lucide-react"

export enum ROLE {
    FARMER = "FARMER",
    GENERAL = "GENERAL",
    ADMIN = "ADMIN",
    EXPERT = "EXPERT",
  }

type RequestStatus = "pending" | "approved" | "rejected"
type UserRole = "EXPERT" | "ADMIN" | "GENERAL" | "FARMER"

interface User {
  _id: string
  username: string
  email: string
  phone?: string
  role: UserRole
  isVerified: boolean
  profilePicture?: string
  description: string
}

interface VerifyRequest {
  _id: string
  user: User
  role: UserRole
  verifyStatus: RequestStatus
  govtDocument: string
  createdAt: string
  updatedAt: string
}

export function VerificationRequests() {
  const [requests, setRequests] = useState<VerifyRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<VerifyRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<VerifyRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter((request) => request.verifyStatus.toLowerCase() === activeTab))
    }
  }, [activeTab, requests])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:4000/api/v1/user/admin/verifyRequestFromStatus", {
        credentials: "include",
      })
      const data = await response.json()
      setRequests(data.requests)
      setFilteredRequests(data.requests)
    } catch (error) {
      console.log("Error fetching verification requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const viewRequest = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/user/admin/verifyRequest/${id}`, {
        credentials: "include",
      })
      const data = await response.json()
      setSelectedRequest(data.request)
      setOpenDialog(true)
    } catch (error) {
      console.log("Error fetching verification request details:", error)
    }
  }

const updateRequestStatus = async (id: string, status: RequestStatus) => {
    setIsUpdating(true);
    try {
        const response = await fetch(`http://localhost:4000/api/v1/user/admin/verifyRequest/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ verifyStatus: status }), // Keep lowercase
        });

        if (response.ok) {
            // Update local state
            const updatedRequests = requests?.map((request) =>
                request._id === id ? { ...request, verifyStatus: status } : request
            );
            setRequests(updatedRequests);

            // Close dialog and refresh
            setOpenDialog(false);
            setSelectedRequest(null);
            fetchRequests(); // Refresh the list
        } else {
            console.log("Failed to update request status");
        }
    } catch (error) {
        console.log("Error updating verification request:", error);
    } finally {
        setIsUpdating(false);
    }
};

  const updateDeclineStatus = async (id: string, status: RequestStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`http://localhost:4000/api/v1/user/admin/declineRequest/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verifyStatus: status }),
      })

      if (response.ok) {
        // Update local state
        const updatedRequests = requests?.map((request) =>
          request._id === id ? { ...request, verifyStatus: status } : request,
        )
        setRequests(updatedRequests)

        // Close dialog and refresh
        setOpenDialog(false)
        setSelectedRequest(null)
      } else {
        console.log("Failed to update request status")
      }
    } catch (error) {
      console.log("Error updating verification request:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const approveRequest = (id: string) => {
    updateRequestStatus(id, "approved"); // Lowercase to match enum
}

const declineRequest = (id: string) => {
    updateRequestStatus(id, "rejected"); // Lowercase to match enum
}

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <Button variant="outline" onClick={fetchRequests} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          <VerificationRequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            onViewRequest={viewRequest}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            onApprove={approveRequest}
            onDecline={declineRequest}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <VerificationRequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            onViewRequest={viewRequest}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            onApprove={approveRequest}
            onDecline={declineRequest}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <VerificationRequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            onViewRequest={viewRequest}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            onApprove={approveRequest}
            onDecline={declineRequest}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <VerificationRequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            onViewRequest={viewRequest}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            onApprove={approveRequest}
            onDecline={declineRequest}
          />
        </TabsContent>
      </Tabs>

      {/* Request Detail Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl">
          {selectedRequest ? (
            <>
              <DialogHeader>
                <DialogTitle>Verification Request Details</DialogTitle>
                <DialogDescription>Submitted on {formatDate(selectedRequest.createdAt)}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={selectedRequest.user.profilePicture || ""}
                          alt={selectedRequest.user.username}
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedRequest.user.username}</p>
                        <p className="text-sm text-muted-foreground">{selectedRequest.user.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Role:</span>
                        <span className="text-sm font-medium">{selectedRequest.user.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Requested Role:</span>
                        <span className="text-sm font-medium">{selectedRequest.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span>{getStatusBadge(selectedRequest.verifyStatus)}</span>
                      </div>
                      {selectedRequest.user.phone && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Phone:</span>
                          <span className="text-sm font-medium">{selectedRequest.user.phone}</span>
                        </div>
                      )}
                    </div>

                    {selectedRequest.user.description && (
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">Description:</p>
                        <p className="text-sm mt-1">{selectedRequest.user.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Document Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm">Government ID Document</p>
                    </div>

                    {selectedRequest.govtDocument && (
                      <div className="border rounded-md p-2 bg-gray-50">
                        <a
                          href={`http://localhost:4000/uploads/${selectedRequest.govtDocument}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Document
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {selectedRequest.verifyStatus === "pending" && (
                <div className="flex justify-end space-x-3 mt-4">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => declineRequest(selectedRequest._id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveRequest(selectedRequest._id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Sub-component for the requests table
function VerificationRequestsTable({
  requests,
  isLoading,
  onViewRequest,
  getStatusBadge,
  formatDate,
  onApprove,
  onDecline,
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (requests?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p>No verification requests found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left font-medium">User</th>
              <th className="py-3 px-4 text-left font-medium">Requested Role</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Date</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((request) => (
              <tr key={request._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.user.profilePicture || ""} alt={request.user.username} />
                      <AvatarFallback>{request.user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.user.username}</p>
                      <p className="text-xs text-muted-foreground">{request.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{request.role}</td>
                <td className="py-3 px-4">{getStatusBadge(request.verifyStatus)}</td>
                <td className="py-3 px-4">{formatDate(request.createdAt)}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onViewRequest(request._id)}>
                      View
                    </Button>
                    {request.verifyStatus === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDecline(request._id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onApprove(request._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

