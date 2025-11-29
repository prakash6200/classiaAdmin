"use client"

import { useEffect, useState } from "react"
import { useMutualFundContext, MutualFund } from "@/lib/api/mf-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Eye, TrendingUp, TrendingDown, BarChart3, PieChart, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function MutualFundPage() {
  const { hasPermission } = useAuth()
  const { mutualFunds, pagination, loading, error, fetchMutualFunds, updateMutualFund } = useMutualFundContext()

  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (hasPermission("mf:read")) fetchMutualFunds(1, 10)
  }, [hasPermission, fetchMutualFunds])

  const handleToggleStatus = async (mfId: number, currentStatus: boolean) => {
    setUpdating(true)
    try {
      await updateMutualFund(mfId, !currentStatus)
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  const getChangeColor = (change: string | null) => {
    if (!change) return "text-gray-400"
    const value = parseFloat(change)
    if (value > 0) return "text-green-400"
    if (value < 0) return "text-red-400"
    return "text-gray-400"
  }

  const getChangeIcon = (change: string | null) => {
    if (!change) return null
    const value = parseFloat(change)
    if (value > 0) return <TrendingUp className="h-3 w-3" />
    if (value < 0) return <TrendingDown className="h-3 w-3" />
    return null
  }

  const getCategoryName = (fund: MutualFund): string => {
    if (!fund.category) return "N/A"
    
    // If it's a string, return it
    if (typeof fund.category === "string") return fund.category
    
    // If it's an object with category property
    if (typeof fund.category === "object" && fund.category !== null) {
      if ("category" in fund.category && typeof fund.category.category === "string") {
        return fund.category.category
      }
    }
    
    return "N/A"
  }

  const getFundManagers = (fund: MutualFund) => {
    if (!fund.fundManagers) return []
    
    // Handle array format
    if (Array.isArray(fund.fundManagers)) {
      return fund.fundManagers
    }
    
    // Handle object with fund_management array
    if (typeof fund.fundManagers === "object" && "fund_management" in fund.fundManagers) {
      return fund.fundManagers.fund_management || []
    }
    
    return []
  }

  const getHoldingsArray = (fund: MutualFund) => {
    if (!fund.holdings) return []
    
    // Handle array format
    if (Array.isArray(fund.holdings)) {
      return fund.holdings
    }
    
    // Handle object with portfolio array
    if (typeof fund.holdings === "object" && "portfolio" in fund.holdings) {
      return fund.holdings.portfolio || []
    }
    
    return []
  }

  const getHoldingWeight = (holding: any) => {
    if (holding.weight_) return `${holding.weight_}%`
    if (holding.weight) return `${holding.weight}%`
    if (holding.assets) return holding.assets
    return "N/A"
  }

  if (!hasPermission("mf:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Mutual Funds" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Mutual Fund Management" }]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Mutual Fund Management</h1>
            <p className="text-gray-400">View and manage all mutual fund schemes</p>
          </div>
          <Button onClick={() => fetchMutualFunds(1, 10)} variant="outline" disabled={loading}>
            <Loader2 className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">{error}</div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Total Schemes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#d7b56d]">{pagination.totalRecords}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Current Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {pagination.currentPage} / {pagination.totalPages}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Funds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">
                {mutualFunds.filter((mf) => !mf.isDeleted).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">All Mutual Fund Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d7b56d]" />
              </div>
            ) : mutualFunds.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No mutual funds found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">ID</TableHead>
                      <TableHead className="text-gray-300">AMC</TableHead>
                      <TableHead className="text-gray-300">Scheme Name</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">1D</TableHead>
                      <TableHead className="text-gray-300">1W</TableHead>
                      <TableHead className="text-gray-300">1M</TableHead>
                      <TableHead className="text-gray-300">1Y</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mutualFunds.map((fund) => (
                      <TableRow key={fund.id} className="hover:bg-[#1a1a2e]/50">
                        <TableCell className="font-mono text-sm text-[#d7b56d]">#{fund.id}</TableCell>
                        <TableCell className="text-white font-medium">{fund.amc || "N/A"}</TableCell>
                        <TableCell className="max-w-xs truncate text-gray-300">{fund.scheamName || "N/A"}</TableCell>
                        <TableCell>
                          <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border border-[#d7b56d]/40">
                            {getCategoryName(fund)}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-medium ${getChangeColor(fund.dayChange)}`}>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(fund.dayChange)}
                            {fund.dayChange || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className={`font-medium ${getChangeColor(fund.weekChange)}`}>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(fund.weekChange)}
                            {fund.weekChange || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className={`font-medium ${getChangeColor(fund.monthChange)}`}>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(fund.monthChange)}
                            {fund.monthChange || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className={`font-medium ${getChangeColor(fund.oneYearChange)}`}>
                          <div className="flex items-center gap-1">
                            {getChangeIcon(fund.oneYearChange)}
                            {fund.oneYearChange || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={!fund.isDeleted}
                            onCheckedChange={() => handleToggleStatus(fund.id, !fund.isDeleted)}
                            disabled={updating}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedFund(fund)}
                            className="text-[#d7b56d] hover:bg-[#1a1a2e]"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Showing {(pagination.currentPage - 1) * 10 + 1}–
            {Math.min(pagination.currentPage * 10, pagination.totalRecords)} of {pagination.totalRecords}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchMutualFunds(pagination.currentPage - 1, 10)}
              disabled={pagination.currentPage === 1 || loading}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchMutualFunds(pagination.currentPage + 1, 10)}
              disabled={pagination.currentPage >= pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedFund} onOpenChange={() => setSelectedFund(null)}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border-[#d7b56d]/20 max-w-6xl max-h-[90vh] overflow-y-auto">
            {selectedFund && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white text-2xl">{selectedFund.scheamName}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {selectedFund.amc} • Code: {selectedFund.scheamCode}
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-[#1a1a2e]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="holdings">Holdings</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Fund Managers */}
                    <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                      <CardHeader>
                        <CardTitle className="text-white">Fund Managers</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {getFundManagers(selectedFund).length > 0 ? (
                          getFundManagers(selectedFund).map((manager: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-[#0f0f1a]/50 rounded-lg">
                              <span className="text-white font-medium">{manager.name}</span>
                              <span className="text-gray-400 text-sm">
                                {manager.tenure || `${manager.from || manager.start_date} - ${manager.to || manager.end_date}`}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-4">No fund manager information available</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Category */}
                    <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                      <CardHeader>
                        <CardTitle className="text-white">Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="text-lg px-4 py-2 bg-[#d7b56d]/20 text-[#d7b56d] border border-[#d7b56d]/40">
                          {getCategoryName(selectedFund)}
                        </Badge>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Day Change</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.dayChange)}`}>
                            {selectedFund.dayChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Week Change</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.weekChange)}`}>
                            {selectedFund.weekChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">Month Change</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.monthChange)}`}>
                            {selectedFund.monthChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">6 Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.sixMonthChange)}`}>
                            {selectedFund.sixMonthChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">1 Year</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.oneYearChange)}`}>
                            {selectedFund.oneYearChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">3 Years</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.threeYearsChange)}`}>
                            {selectedFund.threeYearsChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">5 Years</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.fiveYearsChange)}`}>
                            {selectedFund.fiveYearsChange || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-gray-400">All Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedFund.allTime)}`}>
                            {selectedFund.allTime || "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="holdings" className="space-y-4 mt-4">
                    <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                      <CardHeader>
                        <CardTitle className="text-white">Portfolio Holdings</CardTitle>
                        {selectedFund.holdings && 
                         typeof selectedFund.holdings === 'object' && 
                         !Array.isArray(selectedFund.holdings) &&
                         'as_on_date' in selectedFund.holdings && (
                          <p className="text-sm text-gray-400">As on: {selectedFund.holdings.as_on_date}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        {getHoldingsArray(selectedFund).length > 0 ? (
                          <div className="max-h-96 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-gray-300">Name</TableHead>
                                  <TableHead className="text-gray-300">Sector</TableHead>
                                  <TableHead className="text-gray-300">Instrument</TableHead>
                                  <TableHead className="text-gray-300">Weight</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getHoldingsArray(selectedFund).slice(0, 30).map((holding: any, i: number) => (
                                  <TableRow key={i}>
                                    <TableCell className="text-white">{holding.name || "N/A"}</TableCell>
                                    <TableCell className="text-gray-300">{holding.sector || "N/A"}</TableCell>
                                    <TableCell className="text-gray-400 text-sm">{holding.instrument || "N/A"}</TableCell>
                                    <TableCell className="text-[#d7b56d] font-medium">
                                      {getHoldingWeight(holding)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-center py-8">No holdings data available</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4 mt-4">
                    {selectedFund.analysis ? (
                      <>
                        {/* Fund Size */}
                        {selectedFund.analysis.fund_size && (
                          <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                            <CardHeader>
                              <CardTitle className="text-white">Fund Size</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-3xl font-bold text-[#d7b56d]">{selectedFund.analysis.fund_size}</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Advanced Ratios */}
                        {/* {(selectedFund.analysis.holding_analysis_report?.advanced_ratios || selectedFund.analysis.advanced_ratios) && (
                          <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                            <CardHeader>
                              <CardTitle className="text-white">Advanced Ratios</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(
                                  selectedFund.analysis.holding_analysis_report?.advanced_ratios || 
                                  selectedFund.analysis.advanced_ratios || {}
                                ).map(([key, value]) => (
                                  <div key={key} className="p-3 bg-[#0f0f1a]/50 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase mb-1">{key.replace(/_/g, " ")}</p>
                                    <p className="text-xl font-bold text-white">{value || "N/A"}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )} */}

                        {/* Sector Allocation */}
                        {/* {(selectedFund.analysis.holding_analysis_report?.debt_sector_allocation || 
                          selectedFund.analysis.debt_sector_allocation) && (
                          <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                            <CardHeader>
                              <CardTitle className="text-white">Debt Sector Allocation</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {Object.entries(
                                  selectedFund.analysis.holding_analysis_report?.debt_sector_allocation || 
                                  selectedFund.analysis.debt_sector_allocation || {}
                                ).map(([key, value]) => (
                                  <div key={key} className="flex justify-between items-center p-2 bg-[#0f0f1a]/50 rounded">
                                    <span className="text-white capitalize">{key.replace(/_/g, " ")}</span>
                                    <span className="text-[#d7b56d] font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )} */}

                        {/* Asset Split */}
                        {/* {(selectedFund.analysis.holding_analysis_report?.equity_debt_cash_split || 
                          selectedFund.analysis.equity_debt_cash_split) && (
                          <Card className="bg-[#1a1a2e]/50 border-[#d7b56d]/20">
                            <CardHeader>
                              <CardTitle className="text-white">Asset Allocation</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-3 gap-4">
                                {Object.entries(
                                  selectedFund.analysis.holding_analysis_report?.equity_debt_cash_split || 
                                  selectedFund.analysis.equity_debt_cash_split || {}
                                ).map(([key, value]) => (
                                  <div key={key} className="text-center p-4 bg-[#0f0f1a]/50 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase mb-1">{key}</p>
                                    <p className="text-2xl font-bold text-[#d7b56d]">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )} */}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-400">No analysis data available</div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}