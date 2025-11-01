"use client"

import { useEffect, useState } from "react"
import { useSupportContext, Ticket } from "@/lib/api/support-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, MessageCircle, Send, X } from "lucide-react"

export default function SupportPage() {
  const { hasPermission } = useAuth()
  const { tickets, pagination, loading, error, fetchTickets, replyTicket, closeTicket } = useSupportContext()

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replyText, setReplyText] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (hasPermission("support:read")) fetchTickets(1, 20)
  }, [hasPermission, fetchTickets])

  const handleReply = async () => {
    if (!selectedTicket || !replyText.trim()) return
    setSending(true)
    try {
      await replyTicket(selectedTicket.id, replyText)
      setReplyText("")
      setSelectedTicket(null)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  if (!hasPermission("support:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Support" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Support Tickets" }]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
            <p className="text-gray-400">Manage user queries and respond in real-time</p>
          </div>
          <Button onClick={() => fetchTickets(1, 20)} variant="outline" disabled={loading}>
            <Loader2 className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">{error}</div>
        )}

        {/* Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">All Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d7b56d]" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Priority</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Last Updated</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((t) => (
                    <TableRow key={t.id} className="hover:bg-[#1a1a2e]/50">
                      <TableCell className="font-mono text-sm text-[#d7b56d]">#{t.id}</TableCell>
                      <TableCell className="text-white max-w-xs truncate">{t.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={t.status === "OPEN" ? "default" : "secondary"}
                          className={
                            t.status === "OPEN"
                              ? "bg-green-900/50 text-green-300"
                              : t.status === "PENDING"
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-gray-900/50 text-gray-300"
                          }
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            t.priority === "high"
                              ? "bg-red-900/50 text-red-300"
                              : t.priority === "medium"
                                ? "bg-yellow-900/50 text-yellow-300"
                                : "bg-gray-900/50 text-gray-300"
                          }
                        >
                          {t.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 capitalize">{t.category}</TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(t.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTicket(t)}
                            className="text-[#d7b56d] hover:bg-[#1a1a2e]"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          {t.status !== "CLOSED" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => closeTicket(t.id)}
                              disabled={loading}
                              className="text-red-400 hover:bg-red-950/50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>
            Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchTickets(pagination.page - 1, pagination.limit)}
              disabled={pagination.page === 1 || loading}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchTickets(pagination.page + 1, pagination.limit)}
              disabled={pagination.page * pagination.limit >= pagination.total || loading}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Dialog – Fixed Message Rendering */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border-[#d7b56d]/20 max-w-3xl max-h-[85vh] overflow-y-auto">
            {selectedTicket && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Ticket #{selectedTicket.id}: {selectedTicket.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {selectedTicket.category} • Priority: {selectedTicket.priority.toUpperCase()}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4 max-h-96 overflow-y-auto p-2">
                  {selectedTicket.messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet.</p>
                  ) : (
                    selectedTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-lg ${
                            msg.sender === "admin"
                              ? "bg-[#d7b56d]/20 text-[#d7b56d]"
                              : "bg-[#1a1a2e]/70 text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <DialogFooter className="flex-col gap-3">
                  <div className="flex w-full gap-2">
                    <Input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                      onKeyDown={(e) => e.key === "Enter" && handleReply()}
                    />
                    <Button
                      onClick={handleReply}
                      disabled={sending || !replyText.trim()}
                      className="bg-[#d7b56d] hover:bg-[#c9a860]"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  {selectedTicket.status !== "CLOSED" && (
                    <Button
                      onClick={() => closeTicket(selectedTicket.id)}
                      variant="destructive"
                      className="w-full bg-red-900/50 hover:bg-red-800/50"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <X className="h-4 w-4 mr-2" />}
                      Close Ticket
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}