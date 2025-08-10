"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  FileText,
  Bell,
  Download,
  Upload
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WorkOrder {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "draft" | "submitted" | "approved" | "rejected" | "in-progress" | "completed" | "cancelled"
  assignee: string
  approver: string
  location: string
  towerNumber: string
  dueDate: string
  createdDate: string
  createdBy: string
  approvalComments?: string
  estimatedHours: number
  requiredSkills: string[]
  attachments: string[]
  approvalChain: ApprovalStep[]
}

interface ApprovalStep {
  id: string
  approverRole: string
  approverName: string
  status: "pending" | "approved" | "rejected"
  comments?: string
  timestamp?: string
  order: number
}

interface Notification {
  id: string
  type: "work_order_created" | "work_order_approved" | "work_order_rejected" | "work_order_assigned" | "deadline_approaching"
  title: string
  message: string
  workOrderId: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

export default function WorkOrderManagement() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("list")
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [newWorkOrder, setNewWorkOrder] = useState<Partial<WorkOrder>>({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    location: "",
    towerNumber: "",
    dueDate: "",
    estimatedHours: 0,
    requiredSkills: [],
    attachments: []
  })

  useEffect(() => {
    loadWorkOrders()
    loadNotifications()
    // Set up periodic sync for offline data
    const syncInterval = setInterval(syncOfflineData, 30000) // Sync every 30 seconds
    return () => clearInterval(syncInterval)
  }, [])

  const loadWorkOrders = () => {
    // Load from localStorage for offline capability
    const stored = localStorage.getItem("workOrders")
    if (stored) {
      setWorkOrders(JSON.parse(stored))
    } else {
      // Initialize with sample data
      const sampleWorkOrders: WorkOrder[] = [
        {
          id: "WO-001",
          title: "Routine Inspection - Tower T-145",
          description: "Monthly routine inspection of transmission tower T-145 including structural integrity check",
          priority: "medium",
          status: "approved",
          assignee: "John Smith",
          approver: "Mike Johnson",
          location: "Grid Section A, Mile 12.5",
          towerNumber: "T-145",
          dueDate: "2024-01-15",
          createdDate: "2024-01-10",
          createdBy: "Sarah Wilson",
          estimatedHours: 4,
          requiredSkills: ["Tower Inspection", "Safety Protocols"],
          attachments: [],
          approvalChain: [
            {
              id: "1",
              approverRole: "Supervisor",
              approverName: "Mike Johnson",
              status: "approved",
              comments: "Approved for routine maintenance",
              timestamp: "2024-01-10T10:30:00Z",
              order: 1
            }
          ]
        },
        {
          id: "WO-002",
          title: "Emergency Repair - Tower T-132",
          description: "Critical structural damage detected, immediate repair required",
          priority: "critical",
          status: "in-progress",
          assignee: "Sarah Johnson",
          approver: "David Brown",
          location: "Grid Section B, Mile 8.2",
          towerNumber: "T-132",
          dueDate: "2024-01-12",
          createdDate: "2024-01-11",
          createdBy: "Emergency System",
          estimatedHours: 8,
          requiredSkills: ["Emergency Repair", "Structural Engineering", "Safety Protocols"],
          attachments: ["damage_report.pdf"],
          approvalChain: [
            {
              id: "1",
              approverRole: "Emergency Coordinator",
              approverName: "David Brown",
              status: "approved",
              comments: "Emergency approval granted - proceed immediately",
              timestamp: "2024-01-11T14:15:00Z",
              order: 1
            }
          ]
        }
      ]
      setWorkOrders(sampleWorkOrders)
      localStorage.setItem("workOrders", JSON.stringify(sampleWorkOrders))
    }
  }

  const loadNotifications = () => {
    const stored = localStorage.getItem("notifications")
    if (stored) {
      setNotifications(JSON.parse(stored))
    } else {
      const sampleNotifications: Notification[] = [
        {
          id: "N-001",
          type: "work_order_created",
          title: "New Work Order Created",
          message: "Work Order WO-003 has been created and requires approval",
          workOrderId: "WO-003",
          timestamp: "2024-01-13T09:00:00Z",
          read: false,
          priority: "medium"
        },
        {
          id: "N-002",
          type: "deadline_approaching",
          title: "Deadline Approaching",
          message: "Work Order WO-001 is due in 2 days",
          workOrderId: "WO-001",
          timestamp: "2024-01-13T08:00:00Z",
          read: false,
          priority: "high"
        }
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem("notifications", JSON.stringify(sampleNotifications))
    }
  }

  const syncOfflineData = async () => {
    // Check if online
    if (navigator.onLine) {
      try {
        // Sync pending work orders
        const pendingWorkOrders = workOrders.filter(wo => wo.status === "draft")
        if (pendingWorkOrders.length > 0) {
          // In a real app, this would sync with the server
          console.log("Syncing pending work orders:", pendingWorkOrders)
        }
      } catch (error) {
        console.error("Sync failed:", error)
      }
    }
  }

  const createWorkOrder = () => {
    const workOrder: WorkOrder = {
      ...newWorkOrder as WorkOrder,
      id: `WO-${Date.now()}`,
      status: "draft",
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: "Current User", // In real app, get from auth
      approvalChain: [
        {
          id: "1",
          approverRole: "Supervisor",
          approverName: "Pending Assignment",
          status: "pending",
          order: 1
        }
      ]
    }

    const updatedWorkOrders = [...workOrders, workOrder]
    setWorkOrders(updatedWorkOrders)
    localStorage.setItem("workOrders", JSON.stringify(updatedWorkOrders))

    // Create notification
    const notification: Notification = {
      id: `N-${Date.now()}`,
      type: "work_order_created",
      title: "Work Order Created",
      message: `Work Order ${workOrder.id} has been created`,
      workOrderId: workOrder.id,
      timestamp: new Date().toISOString(),
      read: false,
      priority: workOrder.priority === "critical" ? "high" : "medium"
    }

    const updatedNotifications = [...notifications, notification]
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

    setIsCreateDialogOpen(false)
    setNewWorkOrder({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      location: "",
      towerNumber: "",
      dueDate: "",
      estimatedHours: 0,
      requiredSkills: [],
      attachments: []
    })
  }

  const submitForApproval = (workOrderId: string) => {
    const updatedWorkOrders = workOrders.map(wo => 
      wo.id === workOrderId ? { ...wo, status: "submitted" as const } : wo
    )
    setWorkOrders(updatedWorkOrders)
    localStorage.setItem("workOrders", JSON.stringify(updatedWorkOrders))

    // Create notification for approver
    const notification: Notification = {
      id: `N-${Date.now()}`,
      type: "work_order_created",
      title: "Approval Required",
      message: `Work Order ${workOrderId} requires your approval`,
      workOrderId,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "high"
    }

    const updatedNotifications = [...notifications, notification]
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const approveWorkOrder = (workOrderId: string, comments: string) => {
    const updatedWorkOrders = workOrders.map(wo => {
      if (wo.id === workOrderId) {
        const updatedApprovalChain = wo.approvalChain.map(step => 
          step.status === "pending" ? {
            ...step,
            status: "approved" as const,
            comments,
            timestamp: new Date().toISOString()
          } : step
        )
        return {
          ...wo,
          status: "approved" as const,
          approvalComments: comments,
          approvalChain: updatedApprovalChain
        }
      }
      return wo
    })
    setWorkOrders(updatedWorkOrders)
    localStorage.setItem("workOrders", JSON.stringify(updatedWorkOrders))
    setIsApprovalDialogOpen(false)
  }

  const rejectWorkOrder = (workOrderId: string, comments: string) => {
    const updatedWorkOrders = workOrders.map(wo => {
      if (wo.id === workOrderId) {
        const updatedApprovalChain = wo.approvalChain.map(step => 
          step.status === "pending" ? {
            ...step,
            status: "rejected" as const,
            comments,
            timestamp: new Date().toISOString()
          } : step
        )
        return {
          ...wo,
          status: "rejected" as const,
          approvalComments: comments,
          approvalChain: updatedApprovalChain
        }
      }
      return wo
    })
    setWorkOrders(updatedWorkOrders)
    localStorage.setItem("workOrders", JSON.stringify(updatedWorkOrders))
    setIsApprovalDialogOpen(false)
  }

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800"
      case "submitted": return "bg-blue-100 text-blue-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "in-progress": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Work Order Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Work Orders</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
          </TabsTrigger>
          <TabsTrigger value="offline">Offline Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {workOrders.map((workOrder) => (
            <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                    <CardDescription>{workOrder.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(workOrder.priority)}>
                      {workOrder.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(workOrder.status)}>
                      {workOrder.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{workOrder.assignee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{workOrder.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Due: {workOrder.dueDate}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {workOrder.status === "draft" && (
                    <Button 
                      size="sm" 
                      onClick={() => submitForApproval(workOrder.id)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Approval
                    </Button>
                  )}
                  {workOrder.status === "submitted" && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedWorkOrder(workOrder)
                        setIsApprovalDialogOpen(true)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          {workOrders.filter(wo => wo.status === "submitted").map((workOrder) => (
            <Card key={workOrder.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                    <CardDescription>Requires approval from: {workOrder.approver}</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">PENDING APPROVAL</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <p className="text-sm">{workOrder.priority}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Estimated Hours</Label>
                      <p className="text-sm">{workOrder.estimatedHours}h</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedWorkOrder(workOrder)
                        setIsApprovalDialogOpen(true)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setSelectedWorkOrder(workOrder)
                        setIsApprovalDialogOpen(true)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all ${
                !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="offline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offline Data Management</CardTitle>
              <CardDescription>
                Manage offline work orders and sync with server when connection is available
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium">Draft Work Orders</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {workOrders.filter(wo => wo.status === "draft").length}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium">Pending Sync</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {workOrders.filter(wo => wo.status === "draft").length}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium">Connection Status</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {navigator.onLine ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={syncOfflineData}>
                  <Upload className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download for Offline
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Work Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Work Order</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new work order for tower inspection
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newWorkOrder.title}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, title: e.target.value})}
                  placeholder="Work order title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="towerNumber">Tower Number</Label>
                <Input
                  id="towerNumber"
                  value={newWorkOrder.towerNumber}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, towerNumber: e.target.value})}
                  placeholder="T-001"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newWorkOrder.description}
                onChange={(e) => setNewWorkOrder({...newWorkOrder, description: e.target.value})}
                placeholder="Detailed description of the work to be performed"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newWorkOrder.priority} 
                  onValueChange={(value) => setNewWorkOrder({...newWorkOrder, priority: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={newWorkOrder.assignee}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, assignee: e.target.value})}
                  placeholder="Assigned technician"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newWorkOrder.dueDate}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newWorkOrder.location}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, location: e.target.value})}
                  placeholder="Grid section and coordinates"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={newWorkOrder.estimatedHours}
                  onChange={(e) => setNewWorkOrder({...newWorkOrder, estimatedHours: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createWorkOrder}>
                Create Work Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Work Order Approval</DialogTitle>
            <DialogDescription>
              Review and approve or reject the work order: {selectedWorkOrder?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea
                  placeholder="Add approval comments..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsApprovalDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => rejectWorkOrder(selectedWorkOrder.id, "Rejected by approver")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => approveWorkOrder(selectedWorkOrder.id, "Approved by approver")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}