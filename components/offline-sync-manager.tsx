"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  RefreshCw,
  HardDrive,
  Cloud
} from "lucide-react"

interface SyncStatus {
  isOnline: boolean
  lastSync: string | null
  pendingUploads: number
  pendingDownloads: number
  syncInProgress: boolean
  syncProgress: number
  errors: string[]
}

interface OfflineData {
  workOrders: any[]
  inspections: any[]
  attachments: any[]
  totalSize: number
}

export default function OfflineSyncManager() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: localStorage.getItem("lastSyncTime"),
    pendingUploads: 0,
    pendingDownloads: 0,
    syncInProgress: false,
    syncProgress: 0,
    errors: []
  })

  const [offlineData, setOfflineData] = useState<OfflineData>({
    workOrders: [],
    inspections: [],
    attachments: [],
    totalSize: 0
  })

  const [autoSync, setAutoSync] = useState(true)

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }))
      if (autoSync) {
        performSync()
      }
    }

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load offline data
    loadOfflineData()

    // Set up periodic sync check
    const syncInterval = setInterval(() => {
      if (syncStatus.isOnline && autoSync && !syncStatus.syncInProgress) {
        checkForPendingSync()
      }
    }, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(syncInterval)
    }
  }, [autoSync, syncStatus.isOnline, syncStatus.syncInProgress])

  const loadOfflineData = () => {
    try {
      const workOrders = JSON.parse(localStorage.getItem("offlineWorkOrders") || "[]")
      const inspections = JSON.parse(localStorage.getItem("offlineInspections") || "[]")
      const attachments = JSON.parse(localStorage.getItem("offlineAttachments") || "[]")
      
      // Calculate approximate storage size
      const totalSize = new Blob([
        JSON.stringify(workOrders),
        JSON.stringify(inspections),
        JSON.stringify(attachments)
      ]).size

      setOfflineData({
        workOrders,
        inspections,
        attachments,
        totalSize
      })

      // Count pending uploads
      const pendingUploads = workOrders.filter((wo: any) => wo.syncStatus === "pending").length +
                           inspections.filter((ins: any) => ins.syncStatus === "pending").length

      setSyncStatus(prev => ({ ...prev, pendingUploads }))
    } catch (error) {
      console.error("Error loading offline data:", error)
    }
  }

  const checkForPendingSync = () => {
    const pendingCount = offlineData.workOrders.filter(wo => wo.syncStatus === "pending").length +
                        offlineData.inspections.filter(ins => ins.syncStatus === "pending").length

    if (pendingCount > 0) {
      performSync()
    }
  }

  const performSync = async () => {
    if (syncStatus.syncInProgress) return

    setSyncStatus(prev => ({ ...prev, syncInProgress: true, syncProgress: 0, errors: [] }))

    try {
      // Simulate sync process
      const totalItems = syncStatus.pendingUploads + syncStatus.pendingDownloads
      let processedItems = 0

      // Upload pending work orders
      for (const workOrder of offlineData.workOrders.filter(wo => wo.syncStatus === "pending")) {
        await simulateUpload(workOrder, "work-order")
        processedItems++
        setSyncStatus(prev => ({ 
          ...prev, 
          syncProgress: Math.round((processedItems / totalItems) * 100) 
        }))
      }

      // Upload pending inspections
      for (const inspection of offlineData.inspections.filter(ins => ins.syncStatus === "pending")) {
        await simulateUpload(inspection, "inspection")
        processedItems++
        setSyncStatus(prev => ({ 
          ...prev, 
          syncProgress: Math.round((processedItems / totalItems) * 100) 
        }))
      }

      // Download new data
      await simulateDownload()

      // Update sync status
      const now = new Date().toISOString()
      localStorage.setItem("lastSyncTime", now)
      
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        syncProgress: 100,
        lastSync: now,
        pendingUploads: 0
      }))

      // Reload offline data
      loadOfflineData()

    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        errors: [...prev.errors, `Sync failed: ${error}`]
      }))
    }
  }

  const simulateUpload = async (data: any, type: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mark as synced
    if (type === "work-order") {
      const workOrders = offlineData.workOrders.map(wo => 
        wo.id === data.id ? { ...wo, syncStatus: "synced", lastSyncTime: new Date().toISOString() } : wo
      )
      localStorage.setItem("offlineWorkOrders", JSON.stringify(workOrders))
    } else if (type === "inspection") {
      const inspections = offlineData.inspections.map(ins => 
        ins.id === data.id ? { ...ins, syncStatus: "synced", lastSyncTime: new Date().toISOString() } : ins
      )
      localStorage.setItem("offlineInspections", JSON.stringify(inspections))
    }
  }

  const simulateDownload = async () => {
    // Simulate downloading new work orders from server
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, this would fetch from the server
    const newWorkOrders = [
      {
        id: `WO-${Date.now()}`,
        title: "New Server Work Order",
        description: "Downloaded from server",
        status: "assigned",
        syncStatus: "synced",
        downloadedAt: new Date().toISOString()
      }
    ]

    const existingWorkOrders = JSON.parse(localStorage.getItem("offlineWorkOrders") || "[]")
    const updatedWorkOrders = [...existingWorkOrders, ...newWorkOrders]
    localStorage.setItem("offlineWorkOrders", JSON.stringify(updatedWorkOrders))
  }

  const downloadForOffline = async () => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true, syncProgress: 0 }))

    try {
      // Simulate downloading work orders for offline use
      const workOrdersToDownload = [
        {
          id: "WO-OFFLINE-001",
          title: "Offline Work Order 1",
          description: "Downloaded for offline use",
          status: "pending",
          syncStatus: "synced",
          downloadedAt: new Date().toISOString()
        },
        {
          id: "WO-OFFLINE-002",
          title: "Offline Work Order 2",
          description: "Downloaded for offline use",
          status: "pending",
          syncStatus: "synced",
          downloadedAt: new Date().toISOString()
        }
      ]

      for (let i = 0; i < workOrdersToDownload.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSyncStatus(prev => ({ 
          ...prev, 
          syncProgress: Math.round(((i + 1) / workOrdersToDownload.length) * 100) 
        }))
      }

      const existingWorkOrders = JSON.parse(localStorage.getItem("offlineWorkOrders") || "[]")
      const updatedWorkOrders = [...existingWorkOrders, ...workOrdersToDownload]
      localStorage.setItem("offlineWorkOrders", JSON.stringify(updatedWorkOrders))

      setSyncStatus(prev => ({ ...prev, syncInProgress: false, syncProgress: 100 }))
      loadOfflineData()

    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        errors: [...prev.errors, `Download failed: ${error}`]
      }))
    }
  }

  const clearOfflineData = () => {
    localStorage.removeItem("offlineWorkOrders")
    localStorage.removeItem("offlineInspections")
    localStorage.removeItem("offlineAttachments")
    loadOfflineData()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Offline Sync Manager</h2>
        <div className="flex items-center gap-2">
          {syncStatus.isOnline ? (
            <Badge className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Sync Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Uploads</p>
                <p className="text-2xl font-bold text-orange-600">{syncStatus.pendingUploads}</p>
              </div>
              <Upload className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline Data</p>
                <p className="text-2xl font-bold text-blue-600">
                  {offlineData.workOrders.length + offlineData.inspections.length}
                </p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-purple-600">{formatBytes(offlineData.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-sm font-bold text-green-600">
                  {syncStatus.lastSync 
                    ? new Date(syncStatus.lastSync).toLocaleString()
                    : "Never"
                  }
                </p>
              </div>
              <Cloud className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Progress */}
      {syncStatus.syncInProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Sync in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={syncStatus.syncProgress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              {syncStatus.syncProgress}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sync Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Actions</CardTitle>
          <CardDescription>
            Manage your offline data and synchronization settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={performSync}
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
            
            <Button 
              variant="outline"
              onClick={downloadForOffline}
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
            >
              <Download className="h-4 w-4 mr-2" />
              Download for Offline
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setAutoSync(!autoSync)}
            >
              <CheckCircle className={`h-4 w-4 mr-2 ${autoSync ? "text-green-600" : "text-gray-400"}`} />
              Auto Sync: {autoSync ? "On" : "Off"}
            </Button>
            
            <Button 
              variant="destructive"
              onClick={clearOfflineData}
            >
              Clear Offline Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Data Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Work Orders</CardTitle>
            <CardDescription>{offlineData.workOrders.length} items stored offline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {offlineData.workOrders.slice(0, 5).map((wo, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{wo.title || wo.id}</p>
                    <p className="text-xs text-gray-500">{wo.status}</p>
                  </div>
                  <Badge 
                    className={
                      wo.syncStatus === "synced" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-orange-100 text-orange-800"
                    }
                  >
                    {wo.syncStatus === "synced" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {wo.syncStatus || "pending"}
                  </Badge>
                </div>
              ))}
              {offlineData.workOrders.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{offlineData.workOrders.length - 5} more items
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspections</CardTitle>
            <CardDescription>{offlineData.inspections.length} items stored offline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {offlineData.inspections.slice(0, 5).map((ins, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{ins.towerNumber || ins.id}</p>
                    <p className="text-xs text-gray-500">{ins.status}</p>
                  </div>
                  <Badge 
                    className={
                      ins.syncStatus === "synced" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-orange-100 text-orange-800"
                    }
                  >
                    {ins.syncStatus === "synced" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {ins.syncStatus || "pending"}
                  </Badge>
                </div>
              ))}
              {offlineData.inspections.length === 0 && (
                <p className="text-sm text-gray-500 text-center">No offline inspections</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Errors */}
      {syncStatus.errors.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Sync Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncStatus.errors.map((error, index) => (
                <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}