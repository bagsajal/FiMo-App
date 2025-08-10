"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Layers, Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Tower {
  id: string
  number: string
  coordinates: { lat: number; lng: number }
  status: "good" | "fair" | "poor" | "critical"
  lastInspection: string
  workOrderId?: string
}

export default function MapView() {
  const [towers, setTowers] = useState<Tower[]>([])
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null)
  const [mapFilter, setMapFilter] = useState("all")

  useEffect(() => {
    // Mock tower data
    const mockTowers: Tower[] = [
      {
        id: "1",
        number: "T-145",
        coordinates: { lat: 40.7128, lng: -74.006 },
        status: "good",
        lastInspection: "2024-01-10",
        workOrderId: "WO-001",
      },
      {
        id: "2",
        number: "T-132",
        coordinates: { lat: 40.7589, lng: -73.9851 },
        status: "critical",
        lastInspection: "2024-01-11",
        workOrderId: "WO-002",
      },
      {
        id: "3",
        number: "T-089",
        coordinates: { lat: 40.7505, lng: -73.9934 },
        status: "fair",
        lastInspection: "2024-01-08",
        workOrderId: "WO-004",
      },
      {
        id: "4",
        number: "T-156",
        coordinates: { lat: 40.7831, lng: -73.9712 },
        status: "good",
        lastInspection: "2024-01-09",
      },
    ]
    setTowers(mockTowers)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4" />
      case "fair":
        return <Clock className="h-4 w-4" />
      case "poor":
        return <AlertTriangle className="h-4 w-4" />
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredTowers = towers.filter((tower) => mapFilter === "all" || tower.status === mapFilter)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Transmission Line Map
          </CardTitle>
          <CardDescription>Interactive map showing tower locations and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={mapFilter} onValueChange={setMapFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Towers</SelectItem>
                <SelectItem value="good">Good Condition</SelectItem>
                <SelectItem value="fair">Fair Condition</SelectItem>
                <SelectItem value="poor">Poor Condition</SelectItem>
                <SelectItem value="critical">Critical Issues</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button variant="outline">
              <Layers className="h-4 w-4 mr-2" />
              Toggle Layers
            </Button>
          </div>

          {/* Simulated Map Area */}
          <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
              {/* Map background pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ccc" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Tower markers */}
              {filteredTowers.map((tower, index) => (
                <div
                  key={tower.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                    selectedTower?.id === tower.id ? "scale-125" : "hover:scale-110"
                  } transition-transform`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                  onClick={() => setSelectedTower(tower)}
                >
                  <div
                    className={`w-6 h-6 rounded-full ${getStatusColor(tower.status)} border-2 border-white shadow-lg flex items-center justify-center`}
                  >
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap">
                    {tower.number}
                  </div>
                </div>
              ))}

              {/* Transmission lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 20% 30% Q 35% 40% 50% 50% T 80% 70%"
                  stroke="#374151"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tower Details Panel */}
      {selectedTower && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tower {selectedTower.number}</span>
              <Badge className={`${getStatusColor(selectedTower.status)} text-white`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(selectedTower.status)}
                  {selectedTower.status.toUpperCase()}
                </div>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Location Details</h4>
                <p className="text-sm text-gray-600">
                  Coordinates: {selectedTower.coordinates.lat.toFixed(4)}, {selectedTower.coordinates.lng.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600">Last Inspection: {selectedTower.lastInspection}</p>
                {selectedTower.workOrderId && (
                  <p className="text-sm text-gray-600">Work Order: {selectedTower.workOrderId}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {selectedTower.workOrderId && (
                  <Button variant="outline" size="sm">
                    Start Inspection
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Good Condition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Fair Condition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm">Poor Condition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">Critical Issues</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
