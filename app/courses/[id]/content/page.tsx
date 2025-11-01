"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useCourseContext } from "@/lib/api/course-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash, BookOpen, ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CourseContentPage() {
  const params = useParams()
  const courseId = Number(params.id)
  const { hasPermission } = useAuth()
  const {
    contents,
    contentPagination,
    contentLoading,
    contentError,
    fetchContent,
    createContent,
  } = useCourseContext()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newContent, setNewContent] = useState({ title: "", description: "" })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchContent(courseId, 1, 10)
  }, [courseId, fetchContent])

  const handleCreateContent = async () => {
    setCreating(true)
    try {
      await createContent(courseId, newContent)
      setNewContent({ title: "", description: "" })
      setShowCreateDialog(false)
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  if (!hasPermission("course:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Courses" }, { label: "Content" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: "Courses", href: "/courses" },
      { label: `Course ${courseId}` }
    ]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Course Content</h1>
            <p className="text-gray-400">Manage modules for this course</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/courses">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
            </Button>
            {hasPermission("course:create") && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {contentError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
            {contentError}
          </div>
        )}

        {/* Content Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Course Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d7b56d]" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Module Title</TableHead>
                      <TableHead className="text-gray-300">Description</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((content) => (
                      <TableRow key={content.id} className="hover:bg-[#1a1a2e]/50">
                        <TableCell className="text-white font-medium">{content.title}</TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          {content.description}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(content.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {contents.length === 0 && !contentLoading && (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content modules yet.</p>
                    <p className="text-sm">Create your first module to get started.</p>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                  <span>
                    Showing {(contentPagination.page - 1) * contentPagination.limit + 1}–{" "}
                    {Math.min(contentPagination.page * contentPagination.limit, contentPagination.total)} of{" "}
                    {contentPagination.total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchContent(courseId, contentPagination.page - 1, contentPagination.limit)}
                      disabled={contentPagination.page === 1 || contentLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchContent(courseId, contentPagination.page + 1, contentPagination.limit)}
                      disabled={contentPagination.page * contentPagination.limit >= contentPagination.total || contentLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create Content Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Add Course Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Module Title</label>
                <Input
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="e.g., Introduction to Mutual Funds"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <Input
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  placeholder="Brief module description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateContent} disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}