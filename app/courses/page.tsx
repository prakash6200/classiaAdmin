"use client"

import { useState, useEffect } from "react"
import { useCourseContext } from "@/lib/api/course-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, BookOpen, Loader2, Users, CheckCircle, FileText, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation" // ← Fixed import
import Link from "next/link"

export default function CoursesPage() {
  const router = useRouter() // ← Correct Next.js App Router
  const { hasPermission } = useAuth()
  const {
    courses,
    coursePagination,
    courseLoading,
    courseError,
    fetchCourses,
    createCourse,
  } = useCourseContext()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    author: "",
    duration: 1,
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (hasPermission("course:read")) fetchCourses(1, 10)
  }, [hasPermission, fetchCourses])

  const handleCreateCourse = async () => {
    setCreating(true)
    try {
      await createCourse(newCourse)
      setNewCourse({ title: "", description: "", author: "", duration: 1 })
      setShowCreateDialog(false)
    } catch (e) {
      console.error(e)
    } finally {
      setCreating(false)
    }
  }

  if (!hasPermission("course:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Courses & Certification" }, { label: "All Courses" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: "Courses & Certification", href: "/courses" },
        { label: "All Courses" }
      ]}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">All Courses</h1>
            <p className="text-gray-300">Manage and explore learning content</p>
          </div>
          {hasPermission("course:create") && (
            <Button onClick={() => setShowCreateDialog(true)} className="bg-[#d7b56d] hover:bg-[#c9a860] text-black">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}
        </div>

        {/* Error */}
        {courseError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
            {courseError}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-[#d7b56d]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {courseLoading ? "..." : coursePagination.total}
              </div>
              <p className="text-xs text-gray-400">All published courses</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {courseLoading
                  ? "..."
                  : courses.filter((c) => c.status === "ACTIVE").length}
              </div>
              <p className="text-xs text-gray-400">Ready for enrollment</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Enrollments</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">150+</div>
              <p className="text-xs text-gray-400">Total students</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl border border-[#d7b56d]/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-white">Course List</CardTitle>
              <Button onClick={() => fetchCourses(1, 10)} variant="outline" disabled={courseLoading} className="text-white border-[#d7b56d]/30">
                <Loader2 className={`h-4 w-4 mr-2 ${courseLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {courseLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-[#d7b56d]" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No courses yet</p>
                <p className="text-sm">Create your first course to get started</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#d7b56d]/10">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Author</TableHead>
                      <TableHead className="text-gray-300">Duration</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id} className="border-b border-[#d7b56d]/10 hover:bg-[#1a1a2e]/50 transition-colors">
                        <TableCell className="text-white font-medium">{course.title}</TableCell>
                        <TableCell className="text-gray-300">{course.author}</TableCell>
                        <TableCell className="text-gray-300">{course.duration}h</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              course.status === "ACTIVE"
                                ? "bg-green-900/50 text-green-300 border-green-700"
                                : course.status === "DRAFT"
                                ? "bg-yellow-900/50 text-yellow-300 border-yellow-700"
                                : "bg-gray-900/50 text-gray-300 border-gray-700"
                            }
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/courses/${course.id}/content`)}
                              className="text-[#d7b56d] hover:bg-[#d7b56d]/10"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Content
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/courses/${course.id}/enrollments`)}
                              className="text-blue-400 hover:bg-blue-950/30"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Enrollments
                            </Button>
                            {hasPermission("course:update") && (
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
                  <span>
                    Showing {(coursePagination.page - 1) * coursePagination.limit + 1}–{" "}
                    {Math.min(coursePagination.page * coursePagination.limit, coursePagination.total)} of{" "}
                    {coursePagination.total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCourses(coursePagination.page - 1, coursePagination.limit)}
                      disabled={coursePagination.page === 1 || courseLoading}
                      className="text-white border-[#d7b56d]/30"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCourses(coursePagination.page + 1, coursePagination.limit)}
                      disabled={coursePagination.page * coursePagination.limit >= coursePagination.total || courseLoading}
                      className="text-white border-[#d7b56d]/30"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create Course Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#0f0f1a]/95 backdrop-blur-xl border border-[#d7b56d]/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <Input
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g., Advanced Mutual Funds"
                  className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <Input
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Brief overview of the course"
                  className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder-gray-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                  <Input
                    value={newCourse.author}
                    onChange={(e) => setNewCourse({ ...newCourse, author: e.target.value })}
                    placeholder="e.g., Prakash Sharma"
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration (hrs)</label>
                  <Input
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: Number(e.target.value) })}
                    min="1"
                    className="bg-[#1a1a2e]/50 border-[#d7b56d]/20 text-white"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="text-white border-[#d7b56d]/30">
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={creating} className="bg-[#d7b56d] hover:bg-[#c9a860] text-black">
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}