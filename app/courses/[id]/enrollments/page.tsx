"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useCourseContext } from "@/lib/api/course-context"
import { useAuth } from "@/lib/api/auth-context"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Loader2, Users } from "lucide-react"
import Link from "next/link"

export default function CourseEnrollmentsPage() {
  const params = useParams()
  const courseId = Number(params.id)
  const { hasPermission } = useAuth()
  const {
    enrollments,
    enrollmentPagination,
    enrollmentLoading,
    enrollmentError,
    fetchEnrollments,
  } = useCourseContext()

  useEffect(() => {
    fetchEnrollments(courseId, 1, 10)
  }, [courseId, fetchEnrollments])

  if (!hasPermission("course:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Courses" }, { label: "Enrollments" }]}>
        <div className="p-8 text-center text-red-400">Access Denied</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: "Courses", href: "/courses" },
      { label: `Course ${courseId}`, href: `/courses/${courseId}/content` },
      { label: "Enrollments" }
    ]}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Course Enrollments</h1>
            <p className="text-gray-400">Track student progress and engagement</p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/courses/${courseId}/content`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Content
            </Link>
          </Button>
        </div>

        {/* Error */}
        {enrollmentError && (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300">
            {enrollmentError}
          </div>
        )}

        {/* Enrollments Table */}
        <Card className="bg-[#0f0f1a]/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white">Student Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollmentLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#d7b56d]" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Student</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Enrolled</TableHead>
                      <TableHead className="text-gray-300">Progress</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id} className="hover:bg-[#1a1a2e]/50">
                        <TableCell>
                          <div className="text-white font-medium">{enrollment.userName}</div>
                          <div className="text-sm text-gray-400">ID: {enrollment.userId}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              enrollment.status === "ENROLLED"
                                ? "bg-blue-900/50 text-blue-300"
                                : enrollment.status === "COMPLETED"
                                  ? "bg-green-900/50 text-green-300"
                                  : "bg-yellow-900/50 text-yellow-300"
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(enrollment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-[#d7b56d] h-2 rounded-full transition-all"
                              style={{ width: "60%" }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">60% Complete</div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Progress
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {enrollments.length === 0 && !enrollmentLoading && (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No enrollments yet.</p>
                    <p className="text-sm">Share this course to get students enrolled.</p>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                  <span>
                    Showing {(enrollmentPagination.page - 1) * enrollmentPagination.limit + 1}–{" "}
                    {Math.min(enrollmentPagination.page * enrollmentPagination.limit, enrollmentPagination.total)} of{" "}
                    {enrollmentPagination.total}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchEnrollments(courseId, enrollmentPagination.page - 1, enrollmentPagination.limit)}
                      disabled={enrollmentPagination.page === 1 || enrollmentLoading}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchEnrollments(courseId, enrollmentPagination.page + 1, enrollmentPagination.limit)}
                      disabled={enrollmentPagination.page * enrollmentPagination.limit >= enrollmentPagination.total || enrollmentLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}