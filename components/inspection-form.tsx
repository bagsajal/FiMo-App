"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, Save, Upload, AlertTriangle, FileText, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InspectionForm() {
  const [formData, setFormData] = useState({
    workOrderId: "",
    towerNumber: "",
    inspectorName: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    weatherConditions: "",
    overallCondition: "",
    structuralIntegrity: "",
    foundationCondition: "",
    conductorCondition: "",
    insulatorCondition: "",
    hardwareCondition: "",
    groundingCondition: "",
    vegetationClearance: "",
    accessRoadCondition: "",
    observations: "",
    recommendations: "",
    criticalIssues: false,
    requiresFollowUp: false,
    photos: [] as File[],
  })

  const [activeSection, setActiveSection] = useState("basic")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }))
  }

  const saveOffline = () => {
    // Save to local storage for offline capability
    const savedInspections = JSON.parse(localStorage.getItem("offlineInspections") || "[]")
    const newInspection = {
      ...formData,
      id: Date.now().toString(),
      status: "draft",
      savedAt: new Date().toISOString(),
    }
    savedInspections.push(newInspection)
    localStorage.setItem("offlineInspections", JSON.stringify(savedInspections))
    alert("Inspection saved offline successfully!")
  }

  const submitInspection = () => {
    // In a real app, this would sync with the server
    console.log("Submitting inspection:", formData)
    alert("Inspection submitted successfully!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tower Inspection Form
          </CardTitle>
          <CardDescription>Complete inspection details for transmission line towers</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="structural">Structural</TabsTrigger>
          <TabsTrigger value="electrical">Electrical</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workOrderId">Work Order ID</Label>
                  <Input
                    id="workOrderId"
                    value={formData.workOrderId}
                    onChange={(e) => handleInputChange("workOrderId", e.target.value)}
                    placeholder="WO-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="towerNumber">Tower Number</Label>
                  <Input
                    id="towerNumber"
                    value={formData.towerNumber}
                    onChange={(e) => handleInputChange("towerNumber", e.target.value)}
                    placeholder="T-145"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectorName">Inspector Name</Label>
                  <Input
                    id="inspectorName"
                    value={formData.inspectorName}
                    onChange={(e) => handleInputChange("inspectorName", e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">Inspection Date</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => handleInputChange("inspectionDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weatherConditions">Weather Conditions</Label>
                <Select
                  value={formData.weatherConditions}
                  onValueChange={(value) => handleInputChange("weatherConditions", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="cloudy">Cloudy</SelectItem>
                    <SelectItem value="rainy">Rainy</SelectItem>
                    <SelectItem value="windy">Windy</SelectItem>
                    <SelectItem value="stormy">Stormy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Overall Tower Condition</Label>
                <RadioGroup
                  value={formData.overallCondition}
                  onValueChange={(value) => handleInputChange("overallCondition", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="excellent" />
                    <Label htmlFor="excellent">Excellent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="fair" />
                    <Label htmlFor="fair">Fair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="poor" />
                    <Label htmlFor="poor">Poor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical">Critical</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structural" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Structural Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Structural Integrity</Label>
                  <Select
                    value={formData.structuralIntegrity}
                    onValueChange={(value) => handleInputChange("structuralIntegrity", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Foundation Condition</Label>
                  <Select
                    value={formData.foundationCondition}
                    onValueChange={(value) => handleInputChange("foundationCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Hardware Condition</Label>
                  <Select
                    value={formData.hardwareCondition}
                    onValueChange={(value) => handleInputChange("hardwareCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Access Road Condition</Label>
                  <Select
                    value={formData.accessRoadCondition}
                    onValueChange={(value) => handleInputChange("accessRoadCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electrical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Electrical Components
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Conductor Condition</Label>
                  <Select
                    value={formData.conductorCondition}
                    onValueChange={(value) => handleInputChange("conductorCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Insulator Condition</Label>
                  <Select
                    value={formData.insulatorCondition}
                    onValueChange={(value) => handleInputChange("insulatorCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grounding Condition</Label>
                  <Select
                    value={formData.groundingCondition}
                    onValueChange={(value) => handleInputChange("groundingCondition", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Vegetation Clearance</Label>
                  <Select
                    value={formData.vegetationClearance}
                    onValueChange={(value) => handleInputChange("vegetationClearance", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clearance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adequate">Adequate</SelectItem>
                      <SelectItem value="marginal">Marginal</SelectItem>
                      <SelectItem value="inadequate">Inadequate</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observations">Detailed Observations</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange("observations", e.target.value)}
                  placeholder="Describe any specific observations, defects, or concerns..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  value={formData.recommendations}
                  onChange={(e) => handleInputChange("recommendations", e.target.value)}
                  placeholder="Provide recommendations for maintenance, repairs, or follow-up actions..."
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="criticalIssues"
                    checked={formData.criticalIssues}
                    onCheckedChange={(checked) => handleInputChange("criticalIssues", checked)}
                  />
                  <Label htmlFor="criticalIssues" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Critical issues identified requiring immediate attention
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresFollowUp"
                    checked={formData.requiresFollowUp}
                    onCheckedChange={(checked) => handleInputChange("requiresFollowUp", checked)}
                  />
                  <Label htmlFor="requiresFollowUp">Requires follow-up inspection</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo Documentation</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Upload inspection photos</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button variant="outline" onClick={() => document.getElementById("photo-upload")?.click()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
                {formData.photos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{formData.photos.length} photo(s) selected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={saveOffline} className="flex-1 bg-transparent">
              <Save className="h-4 w-4 mr-2" />
              Save Offline
            </Button>
            <Button onClick={submitInspection} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Submit Inspection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
