"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Database, AlertCircle, CheckCircle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface OfflineData {
  inspections: any[]
  workOrders: any[]
  lastSync: string
}

export default function OfflineManager() {
  const [offlineData, setOfflineData] = useState<OfflineData>({
    inspections: [],
    workOrders: [],
    lastSync: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle")

  useEffect(() => {
    loadOfflineData()
  }, [])

  const loadOfflineData = () => {
    const inspections = JSON.parse(localStorage.getItem("offlineInspections") || "[]")
    const workOrders = JSON.parse(localStorage.getItem("offlineWorkOrders") || "[]")
    const lastSync = localStorage.getItem("lastSync") || ""

    setOfflineData({
      inspections,
      workOrders,
      lastSync,
    })
  }

  const downloadForOffline = async () => {
    setSyncStatus("syncing")

    // Simulate downloading data for offline use
    setTimeout(() => {
      const mockWorkOrders = [
        {
          id: "WO-001",
          title: "Routine Inspection - Tower T-145",
          status: "pending",
          downloadedAt: new Date().toISOString(),
        },
        {
          id: "WO-002",
          title: "Emergency Repair - Tower T-132",
          status: "in-progress",
          downloadedAt: new Date().toISOString(),
        },
      ]

      localStorage.setItem("offlineWorkOrders", JSON.stringify(mockWorkOrders))
      localStorage.setItem("lastSync", new Date().toISOString())

      loadOfflineData()
      setSyncStatus("success")

      setTimeout(() => setSyncStatus("idle"), 2000)
    }, 2000)
  }

  const syncToServer = async () => {
    setSyncStatus("syncing")

    // Simulate syncing offline data to server
    setTimeout(() => {
      // Clear offline inspections after successful sync
      localStorage.setItem("offlineInspections", "[]")
      localStorage.setItem("lastSync", new Date().toISOString())

      loadOfflineData()
      setSyncStatus("success")

      setTimeout(() => setSyncStatus("idle"), 2000)
    }, 2000)
  }

  const clearOfflineData = () => {
    localStorage.removeItem("offlineInspections")
    localStorage.removeItem("offlineWorkOrders")
    localStorage.removeItem("lastSync")
    loadOfflineData()
  }

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <Clock className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Syncing..."
      case "success":
        return "Synced"
      case "error":
        return "Error"
      default:
        return "Offline Data"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {getSyncStatusIcon()}
          <span className="ml-2">{getSyncStatusText()}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Offline Data Management</DialogTitle>
          <DialogDescription>Manage your offline work orders and inspections</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Offline Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Offline Storage Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Work Orders:</span>
                <Badge variant="secondary">{offlineData.workOrders.length} items</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Draft Inspections:</span>
                <Badge variant="secondary">{offlineData.inspections.length} items</Badge>
              </div>
              {offlineData.lastSync && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Sync:</span>
                  <span className="text-xs text-gray-500">{new Date(offlineData.lastSync).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button onClick={downloadForOffline} disabled={syncStatus === "syncing"} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download for Offline
            </Button>

            <Button
              onClick={syncToServer}
              disabled={syncStatus === "syncing" || offlineData.inspections.length === 0}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync to Server ({offlineData.inspections.length})
            </Button>

            <Button onClick={clearOfflineData} variant="destructive" size="sm" className="w-full">
              Clear Offline Data
            </Button>
          </div>

          {/* Offline Inspections List */}
          {offlineData.inspections.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Pending Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {offlineData.inspections.map((inspection, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="truncate">{inspection.towerNumber || `Inspection ${index + 1}`}</span>
                      <Badge variant="outline" className="text-xs">
                        Draft
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
