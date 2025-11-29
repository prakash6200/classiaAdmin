"use client"

import { useEffect, useState } from "react"
import { useContactContext, ContactForm } from "@/lib/api/contact-context"
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
import { Loader2, Eye, Trash2, Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const { hasPermission } = useAuth()
  const { contacts, pagination, loading, error, fetchContacts, deleteContact } = useContactContext()

  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (hasPermission("contact:read")) fetchContacts(1, 10)
  }, [hasPermission, fetchContacts])

  const handleDelete = async (contactId: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return
    setDeleting(true)
    try {
      await deleteContact(contactId)
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  if (!hasPermission("contact:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Contact" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Contact List" }]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Contact List</h1>
            <p className="text-gray-400">View and manage user contact submissions</p>
          </div>
          <Button onClick={() => fetchContacts(1, 10)} variant="outline" disabled={loading}>
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
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{pagination.totalRecords}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Current Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">
                {pagination.currentPage} of {pagination.totalPages}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Per Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{pagination.sizePerPage}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">All Contact Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d7b56d]" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No contact form found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Mobile</TableHead>
                    <TableHead className="text-gray-300">Reason</TableHead>
                    <TableHead className="text-gray-300">Submitted</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-[#1a1a2e]/50">
                      <TableCell className="font-mono text-sm text-[#d7b56d]">#{contact.id}</TableCell>
                      <TableCell className="text-white">{contact.name}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{contact.email}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{contact.mobile}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#d7b56d]/20 text-[#d7b56d] border border-[#d7b56d]/40">
                          {contact.reason.replace(/-/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedContact(contact)}
                            className="text-[#d7b56d] hover:bg-[#1a1a2e]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(contact.id)}
                            disabled={deleting}
                            className="text-red-400 hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
            Showing {(pagination.currentPage - 1) * pagination.sizePerPage + 1}–
            {Math.min(pagination.currentPage * pagination.sizePerPage, pagination.totalRecords)} of{" "}
            {pagination.totalRecords}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchContacts(pagination.currentPage - 1, pagination.sizePerPage)}
              disabled={pagination.currentPage === 1 || loading}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchContacts(pagination.currentPage + 1, pagination.sizePerPage)}
              disabled={pagination.currentPage >= pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border-[#d7b56d]/20 max-w-2xl">
            {selectedContact && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">Contact Details</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Submitted on {new Date(selectedContact.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  {/* Personal Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 uppercase">Name</p>
                      <p className="text-white font-medium">{selectedContact.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 uppercase">Reason</p>
                      <Badge className="bg-[#d7b56d]/20 text-[#d7b56d]">
                        {selectedContact.reason.replace(/-/g, " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 p-4 bg-[#1a1a2e]/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#d7b56d]" />
                      <span className="text-white">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#d7b56d]" />
                      <span className="text-white">{selectedContact.mobile}</span>
                    </div>
                    {(selectedContact.country || selectedContact.address) && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-[#d7b56d] mt-1" />
                        <div className="text-white">
                          {selectedContact.address && <p>{selectedContact.address}</p>}
                          {selectedContact.country && <p>{selectedContact.country}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 uppercase">Message</p>
                    <div className="p-4 bg-[#1a1a2e]/50 rounded-lg">
                      <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="uppercase">Created:</span>{" "}
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="uppercase">Updated:</span>{" "}
                      {new Date(selectedContact.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}