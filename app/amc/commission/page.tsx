"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Copy, Trash2, Calculator } from "lucide-react"

interface CommissionRule {
  id: string
  fundCategory: string
  transactionType: string
  tier: string
  minAmount: number
  maxAmount: number
  rate: number
  status: "active" | "inactive"
}

const mockCommissionRules: CommissionRule[] = [
  {
    id: "1",
    fundCategory: "Equity",
    transactionType: "Purchase",
    tier: "Tier 1",
    minAmount: 0,
    maxAmount: 100000,
    rate: 2.5,
    status: "active",
  },
  {
    id: "2",
    fundCategory: "Equity",
    transactionType: "Purchase",
    tier: "Tier 2",
    minAmount: 100001,
    maxAmount: 500000,
    rate: 2.0,
    status: "active",
  },
  {
    id: "3",
    fundCategory: "Debt",
    transactionType: "Purchase",
    tier: "Tier 1",
    minAmount: 0,
    maxAmount: 100000,
    rate: 1.5,
    status: "active",
  },
]

export default function CommissionSetupPage() {
  const { hasPermission } = useAuth()
  const [rules, setRules] = useState<CommissionRule[]>(mockCommissionRules)
  const [selectedAMC, setSelectedAMC] = useState("")
  const [newRule, setNewRule] = useState({
    fundCategory: "",
    transactionType: "",
    tier: "",
    minAmount: 0,
    maxAmount: 0,
    rate: 0,
  })
  const [simulationData, setSimulationData] = useState({
    amount: 100000,
    fundCategory: "Equity",
    transactionType: "Purchase",
  })

  const calculateCommission = (amount: number, category: string, type: string) => {
    const applicableRule = rules.find(
      (rule) =>
        rule.fundCategory === category &&
        rule.transactionType === type &&
        amount >= rule.minAmount &&
        amount <= rule.maxAmount &&
        rule.status === "active",
    )

    if (applicableRule) {
      return (amount * applicableRule.rate) / 100
    }
    return 0
  }

  const addRule = () => {
    const rule: CommissionRule = {
      id: Date.now().toString(),
      ...newRule,
      status: "active",
    }
    setRules([...rules, rule])
    setNewRule({
      fundCategory: "",
      transactionType: "",
      tier: "",
      minAmount: 0,
      maxAmount: 0,
      rate: 0,
    })
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const cloneFromAMC = () => {
    // Mock cloning logic
    alert("Commission rules cloned successfully!")
  }

  if (!hasPermission("amc:commission")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "Commission Setup" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to setup commissions.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "AMC Management", href: "/amc" }, { label: "Commission Setup" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Commission Setup</h2>
            <p className="text-muted-foreground">Configure commission rules for AMCs</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={cloneFromAMC}>
              <Copy className="h-4 w-4 mr-2" />
              Clone from AMC
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>

        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rules">Commission Rules</TabsTrigger>
            <TabsTrigger value="simulator">Commission Simulator</TabsTrigger>
            <TabsTrigger value="preview">Preview Table</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            {/* AMC Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select AMC</CardTitle>
                <CardDescription>Choose the AMC to configure commission rules</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedAMC} onValueChange={setSelectedAMC}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AMC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hdfc">HDFC Asset Management</SelectItem>
                    <SelectItem value="icici">ICICI Prudential AMC</SelectItem>
                    <SelectItem value="sbi">SBI Mutual Fund</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Add New Rule */}
            <Card>
              <CardHeader>
                <CardTitle>Add Commission Rule</CardTitle>
                <CardDescription>Create a new commission rule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Fund Category</Label>
                    <Select
                      value={newRule.fundCategory}
                      onValueChange={(value) => setNewRule({ ...newRule, fundCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equity">Equity</SelectItem>
                        <SelectItem value="Debt">Debt</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="ELSS">ELSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select
                      value={newRule.transactionType}
                      onValueChange={(value) => setNewRule({ ...newRule, transactionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="SIP">SIP</SelectItem>
                        <SelectItem value="Redemption">Redemption</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tier</Label>
                    <Select value={newRule.tier} onValueChange={(value) => setNewRule({ ...newRule, tier: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tier 1">Tier 1</SelectItem>
                        <SelectItem value="Tier 2">Tier 2</SelectItem>
                        <SelectItem value="Tier 3">Tier 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newRule.rate}
                      onChange={(e) => setNewRule({ ...newRule, rate: Number.parseFloat(e.target.value) })}
                      placeholder="2.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Min Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newRule.minAmount}
                      onChange={(e) => setNewRule({ ...newRule, minAmount: Number.parseInt(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Amount (₹)</Label>
                    <Input
                      type="number"
                      value={newRule.maxAmount}
                      onChange={(e) => setNewRule({ ...newRule, maxAmount: Number.parseInt(e.target.value) })}
                      placeholder="100000"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button onClick={addRule} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Commission Rules</CardTitle>
                <CardDescription>Manage current commission rules</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fund Category</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Amount Range</TableHead>
                      <TableHead>Rate (%)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.fundCategory}</TableCell>
                        <TableCell>{rule.transactionType}</TableCell>
                        <TableCell>{rule.tier}</TableCell>
                        <TableCell>
                          ₹{rule.minAmount.toLocaleString()} - ₹{rule.maxAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>{rule.rate}%</TableCell>
                        <TableCell>
                          <Badge variant={rule.status === "active" ? "default" : "secondary"}>{rule.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Simulator</CardTitle>
                <CardDescription>Calculate commission for different scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Investment Amount (₹)</Label>
                    <Input
                      type="number"
                      value={simulationData.amount}
                      onChange={(e) =>
                        setSimulationData({ ...simulationData, amount: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fund Category</Label>
                    <Select
                      value={simulationData.fundCategory}
                      onValueChange={(value) => setSimulationData({ ...simulationData, fundCategory: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equity">Equity</SelectItem>
                        <SelectItem value="Debt">Debt</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select
                      value={simulationData.transactionType}
                      onValueChange={(value) => setSimulationData({ ...simulationData, transactionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="SIP">SIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Calculated Commission</p>
                      <p className="text-2xl font-bold">
                        ₹
                        {calculateCommission(
                          simulationData.amount,
                          simulationData.fundCategory,
                          simulationData.transactionType,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Preview Table</CardTitle>
                <CardDescription>Preview of all commission rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Equity Funds</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Amount Range</TableHead>
                          <TableHead>Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>₹0 - ₹1L</TableCell>
                          <TableCell>2.5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>₹1L - ₹5L</TableCell>
                          <TableCell>2.0%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>₹5L+</TableCell>
                          <TableCell>1.5%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Debt Funds</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Amount Range</TableHead>
                          <TableHead>Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>₹0 - ₹1L</TableCell>
                          <TableCell>1.5%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>₹1L - ₹5L</TableCell>
                          <TableCell>1.0%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>₹5L+</TableCell>
                          <TableCell>0.75%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
