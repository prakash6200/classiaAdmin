"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface CourseContent {
  id: number
  title: string
  description: string
  createdAt: string
  updatedAt: string
  courseId: number
  isDeleted: boolean
}

export interface CourseEnrollment {
  id: number
  userId: number
  userName?: string // Fallback if User object is empty
  courseId: number
  courseTitle?: string // Fallback if Course object is empty
  status: "ENROLLED" | "COMPLETED" | "PENDING"
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  title: string
  description: string
  author: string
  duration: number // in hours
  status: "ACTIVE" | "INACTIVE" | "DRAFT"
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  enrollmentCount?: number // Computed
}

interface Pagination {
  limit: number
  page: number
  total: number
}

interface CourseContextType {
  // Courses
  courses: Course[]
  coursePagination: Pagination
  courseLoading: boolean
  courseError: string | null
  fetchCourses: (page?: number, limit?: number) => Promise<void>
  createCourse: (data: { title: string; description: string; author: string; duration: number }) => Promise<void>

  // Content
  contents: CourseContent[]
  contentPagination: Pagination
  contentLoading: boolean
  contentError: string | null
  fetchContent: (courseId: number, page?: number, limit?: number) => Promise<void>
  createContent: (courseId: number, data: { title: string; description: string }) => Promise<void>

  // Enrollments
  enrollments: CourseEnrollment[]
  enrollmentPagination: Pagination
  enrollmentLoading: boolean
  enrollmentError: string | null
  fetchEnrollments: (courseId: number, page?: number, limit?: number) => Promise<void>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([])
  const [coursePagination, setCoursePagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseError, setCourseError] = useState<string | null>(null)

  const [contents, setContents] = useState<CourseContent[]>([])
  const [contentPagination, setContentPagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [contentLoading, setContentLoading] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [enrollmentPagination, setEnrollmentPagination] = useState<Pagination>({ limit: 10, page: 1, total: 0 })
  const [enrollmentLoading, setEnrollmentLoading] = useState(false)
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("jockey-token") : null

  // ── COURSES ─────────────────────────────────────
  const fetchCourses = useCallback(
    async (page = 1, limit = 10) => {
      if (!token) return
      setCourseLoading(true)
      setCourseError(null)

      try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        const res = await fetch(`https://goapi.classiacapital.com/course/list?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message)

        const mapped = data.data.courses.map((c: any) => ({
          id: c.ID,
          title: c.title,
          description: c.description,
          author: c.author,
          duration: c.duration,
          status: c.status,
          createdAt: c.CreatedAt,
          updatedAt: c.UpdatedAt,
          isDeleted: c.IsDeleted,
        }))

        setCourses(mapped)
        setCoursePagination(data.data.pagination)
      } catch (e) {
        setCourseError(e instanceof Error ? e.message : "Failed to load courses")
      } finally {
        setCourseLoading(false)
      }
    },
    [token]
  )

  const createCourse = useCallback(
    async (data: { title: string; description: string; author: string; duration: number }) => {
      if (!token) throw new Error("Missing token")
      setCourseLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("title", data.title)
        form.append("description", data.description)
        form.append("author", data.author)
        form.append("duration", data.duration.toString())

        const res = await fetch("https://goapi.classiacapital.com/course/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to create course")

        await fetchCourses(1, 10)
      } catch (e) {
        setCourseError(e instanceof Error ? e.message : "Create failed")
        throw e
      } finally {
        setCourseLoading(false)
      }
    },
    [token, fetchCourses]
  )

  // ── CONTENT ─────────────────────────────────────
  const fetchContent = useCallback(
    async (courseId: number, page = 1, limit = 10) => {
      if (!token) return
      setContentLoading(true)
      setContentError(null)

      try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        const res = await fetch(`https://goapi.classiacapital.com/course/${courseId}/content?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message)

        const mapped = data.data.contents.map((c: any) => ({
          id: c.ID,
          title: c.title,
          description: c.description,
          createdAt: c.CreatedAt,
          updatedAt: c.UpdatedAt,
          courseId: c.course_id,
          isDeleted: c.IsDeleted,
        }))

        setContents(mapped)
        setContentPagination(data.data.pagination)
      } catch (e) {
        setContentError(e instanceof Error ? e.message : "Failed to load content")
      } finally {
        setContentLoading(false)
      }
    },
    [token]
  )

  const createContent = useCallback(
    async (courseId: number, data: { title: string; description: string }) => {
      if (!token) throw new Error("Missing token")
      setContentLoading(true)

      try {
        const form = new URLSearchParams()
        form.append("title", data.title)
        form.append("description", data.description)

        const res = await fetch(`https://goapi.classiacapital.com/course/${courseId}/content`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
          body: form,
        })

        const result = await res.json()
        if (!result.status) throw new Error(result.message || "Failed to create content")

        await fetchContent(courseId, 1, 10)
      } catch (e) {
        setContentError(e instanceof Error ? e.message : "Create failed")
        throw e
      } finally {
        setContentLoading(false)
      }
    },
    [token, fetchContent]
  )

  // ── ENROLLMENTS ─────────────────────────────────────
  const fetchEnrollments = useCallback(
    async (courseId: number, page = 1, limit = 10) => {
      if (!token) return
      setEnrollmentLoading(true)
      setEnrollmentError(null)

      try {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        const res = await fetch(`https://goapi.classiacapital.com/course/${courseId}/enrollment?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (!data.status) throw new Error(data.message)

        const mapped = data.data.enrollments.map((e: any) => ({
          id: e.ID,
          userId: e.user_id,
          userName: e.User?.Name || `User ${e.user_id}`, // Fallback
          courseId: e.course_id,
          courseTitle: e.Course?.title || "Course", // Fallback
          status: e.status,
          createdAt: e.CreatedAt,
          updatedAt: e.UpdatedAt,
        }))

        setEnrollments(mapped)
        setEnrollmentPagination(data.data.pagination)
      } catch (e) {
        setEnrollmentError(e instanceof Error ? e.message : "Failed to load enrollments")
      } finally {
        setEnrollmentLoading(false)
      }
    },
    [token]
  )

  return (
    <CourseContext.Provider
      value={{
        // Courses
        courses,
        coursePagination,
        courseLoading,
        courseError,
        fetchCourses,
        createCourse,
        // Content
        contents,
        contentPagination,
        contentLoading,
        contentError,
        fetchContent,
        createContent,
        // Enrollments
        enrollments,
        enrollmentPagination,
        enrollmentLoading,
        enrollmentError,
        fetchEnrollments,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export const useCourseContext = () => {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error("useCourseContext must be used within a CourseProvider")
  return ctx
}