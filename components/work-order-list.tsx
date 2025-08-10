"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, User, AlertTriangle, CheckCircle, Clock, Search, Filter, Download, Eye } from "lucide-react"

interface WorkOrder {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  assignee: string
  location: string
  coordinates: { lat: number; lng: number }
  dueDate: string
  createdDate: string
  towerNumber: string
  lineSection: string
}

interface WorkOrderListProps {
  searchTerm: string
}

export default function WorkOrderList({ searchTerm }: WorkOrderListProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<WorkOrder[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    // Simulate loading work orders from local storage or API
    const mockWorkOrders: WorkOrder[] = [
      {
        id: "WO-001",
        title: "Routine Inspection - Tower T-145",
        description: "Monthly routine inspection of transmission tower T-145 including structural integrity check",
        priority: "medium",
        status: "pending",
        assignee: "John Smith",
        location: "Grid Section A, Mile 12.5",
        coordinates: { lat: 40.7128, lng: -74.006 },
        dueDate: "2024-01-15",
        createdDate: "2024-01-10",
        towerNumber: "T-145",
        lineSection: "Section A",
      },
      {
        id: "WO-002",
        title: "Emergency Repair - Tower T-132",
        description: "Critical structural damage detected, immediate repair required",
        priority: "critical",
        status: "in-progress",
        assignee: "Sarah Johnson",
        location: "Grid Section B, Mile 8.2",
        coordinates: { lat: 40.7589, lng: -73.9851 },
        dueDate: "2024-01-12",
        createdDate: "2024-01-11",
        towerNumber: "T-132",
        lineSection: "Section B",
      },
      {
        id: "WO-003",
        title: "Vegetation Management - Line Corridor",
        description: "Tree trimming and vegetation clearance along transmission corridor",
        priority: "low",
        status: "completed",
        assignee: "Mike Wilson",
        location: "Grid Section C, Mile 15-18",
        coordinates: { lat: 40.7831, lng: -73.9712 },
        dueDate: "2024-01-08",
        createdDate: "2024-01-05",
        towerNumber: "Multiple",
        lineSection: "Section C",
      },
      {
        id: "WO-004",
        title: "Insulator Replacement - Tower T-089",
        description: "Replace damaged insulators on tower T-089",
        priority: "high",
        status: "pending",
        assignee: "David Brown",
        location: "Grid Section D, Mile 22.1",
        coordinates: { lat: 40.7505, lng: -73.9934 },
        dueDate: "2024-01-16",
        createdDate: "2024-01-12",
        towerNumber: "T-089",
        lineSection: "Section D",
      },
    ]

    setWorkOrders(mockWorkOrders)
    setFilteredOrders(mockWorkOrders)
  }, [])

  useEffect(() => {
    let filtered = workOrders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.towerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((order) => order.priority === priorityFilter)
    }

    setFilteredOrders(filtered)
  }, [workOrders, searchTerm, statusFilter, priorityFilter])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <Calendar className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search work orders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {}} // Controlled by parent
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{order.title}</CardTitle>
                  <CardDescription>{order.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(order.priority)}>{order.priority.toUpperCase()}</Badge>
                  <Badge className={getStatusColor(order.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.replace("-", " ").toUpperCase()}
                    </div>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{order.assignee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{order.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Due: {order.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tower: {order.towerNumber}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {order.status === "pending" && <Button size="sm">Start Inspection</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No work orders found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
