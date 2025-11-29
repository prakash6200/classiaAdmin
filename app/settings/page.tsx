"use client"

import { useEffect, useState } from "react"
import { useSettingsContext } from "@/lib/api/settings-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Settings as SettingsIcon,
  Smartphone,
  Apple,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle2,
  Wrench,
  Download,
  Shield
} from "lucide-react"

export default function SettingsPage() {
  const { hasPermission } = useAuth()
  const { settings, loading, error, fetchSettings, updateSettings } = useSettingsContext()

  const [formData, setFormData] = useState({
    app_maintenance: false,
    force_update: false,
    ios_latest_version: "",
    android_latest_version: "",
  })

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (hasPermission("settings:read")) {
      fetchSettings()
    }
  }, [hasPermission, fetchSettings])

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      await updateSettings(formData)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!hasPermission("settings:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Settings" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Settings" }]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d7b56d] to-[#c9a860] flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-white" />
              </div>
              App Management
            </h1>
            <p className="text-gray-400 mt-1">Configure app maintenance and version settings</p>
          </div>
          <Button
            onClick={() => fetchSettings()}
            variant="outline"
            disabled={loading}
            className="border-[#d7b56d]/40 text-[#d7b56d] hover:bg-[#d7b56d]/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Settings updated successfully!
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Maintenance Mode</p>
                  <p className="text-2xl font-bold text-white">
                    {settings?.app_maintenance ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${settings?.app_maintenance ? "bg-red-500/10" : "bg-emerald-500/10"} flex items-center justify-center`}>
                  <Wrench className={`h-6 w-6 ${settings?.app_maintenance ? "text-red-400" : "text-emerald-400"}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Force Update</p>
                  <p className="text-2xl font-bold text-white">
                    {settings?.force_update ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-xl ${settings?.force_update ? "bg-yellow-500/10" : "bg-gray-500/10"} flex items-center justify-center`}>
                  <Download className={`h-6 w-6 ${settings?.force_update ? "text-yellow-400" : "text-gray-400"}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">App Status</p>
                  <p className="text-2xl font-bold text-white">Live</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Card */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Manage app maintenance mode, force updates, and version requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#d7b56d]" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Maintenance Mode */}
                <div className="p-6 rounded-xl bg-[#1a1a2e]/50 border border-[#d7b56d]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <Label htmlFor="maintenance" className="text-base font-semibold text-white">
                          App Maintenance Mode
                        </Label>
                        <p className="text-sm text-gray-400 mt-1">
                          Enable this to block all users from accessing the app
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="maintenance"
                      checked={formData.app_maintenance}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, app_maintenance: checked })
                      }
                      className="data-[state=checked]:bg-red-500"
                    />
                  </div>
                  {formData.app_maintenance && (
                    <Badge variant="destructive" className="bg-red-900/50 text-red-300">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      App will be unavailable to all users
                    </Badge>
                  )}
                </div>

                {/* Force Update */}
                <div className="p-6 rounded-xl bg-[#1a1a2e]/50 border border-[#d7b56d]/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Download className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <Label htmlFor="force-update" className="text-base font-semibold text-white">
                          Force Update
                        </Label>
                        <p className="text-sm text-gray-400 mt-1">
                          Require users to update to the latest version
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="force-update"
                      checked={formData.force_update}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, force_update: checked })
                      }
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                  {formData.force_update && (
                    <Badge className="bg-yellow-900/50 text-yellow-300">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Users must update to continue using the app
                    </Badge>
                  )}
                </div>

                {/* Version Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* iOS Version */}
                  <div className="p-6 rounded-xl bg-[#1a1a2e]/50 border border-[#d7b56d]/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                        <Apple className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="ios-version" className="text-base font-semibold text-white">
                          iOS Latest Version
                        </Label>
                        <p className="text-sm text-gray-400 mt-1">Current App Store version</p>
                      </div>
                    </div>
                    <Input
                      id="ios-version"
                      type="text"
                      placeholder="e.g., 1.2.6"
                      value={formData.ios_latest_version}
                      onChange={(e) =>
                        setFormData({ ...formData, ios_latest_version: e.target.value })
                      }
                      className="bg-[#0f0f1a]/50 border-[#d7b56d]/20 text-white"
                    />
                  </div>

                  {/* Android Version */}
                  <div className="p-6 rounded-xl bg-[#1a1a2e]/50 border border-[#d7b56d]/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <Label htmlFor="android-version" className="text-base font-semibold text-white">
                          Android Latest Version
                        </Label>
                        <p className="text-sm text-gray-400 mt-1">Current Play Store version</p>
                      </div>
                    </div>
                    <Input
                      id="android-version"
                      type="text"
                      placeholder="e.g., 1.2.2"
                      value={formData.android_latest_version}
                      onChange={(e) =>
                        setFormData({ ...formData, android_latest_version: e.target.value })
                      }
                      className="bg-[#0f0f1a]/50 border-[#d7b56d]/20 text-white"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-[#d7b56d]/10">
                  <Button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="bg-gradient-to-r from-[#d7b56d] to-[#c9a860] hover:opacity-90 text-white font-semibold px-8"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-black">Important Notes</h3>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>Maintenance mode will immediately block all user access to the app</li>
                  <li>Force update will require users to download the latest version before accessing the app</li>
                  <li>Version numbers should match the format: Major.Minor.Patch (e.g., 1.2.3)</li>
                  <li>Changes take effect immediately after saving</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}