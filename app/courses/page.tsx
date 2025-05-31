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
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  BookOpen,
  Users,
  Star,
  Clock,
  Play,
  Edit,
  Archive,
  Eye,
  TrendingUp,
  Award,
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  category: "basic" | "intermediate" | "advanced" | "compliance"
  status: "active" | "draft" | "archived"
  duration: number // in minutes
  chapters: number
  enrolledUsers: number
  completionRate: number
  rating: number
  totalRatings: number
  createdDate: string
  lastUpdated: string
  instructor: string
  tags: string[]
  thumbnail?: string
  isRequired: boolean
  targetRoles: string[]
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Mutual Fund Basics",
    description: "Comprehensive introduction to mutual funds, types, and investment strategies",
    category: "basic",
    status: "active",
    duration: 120,
    chapters: 8,
    enrolledUsers: 245,
    completionRate: 87,
    rating: 4.6,
    totalRatings: 156,
    createdDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    instructor: "Dr. Rajesh Sharma",
    tags: ["mutual funds", "basics", "investment"],
    isRequired: true,
    targetRoles: ["distributor", "amc"],
  },
  {
    id: "2",
    title: "KYC Compliance & Documentation",
    description: "Understanding KYC requirements, documentation process, and regulatory compliance",
    category: "compliance",
    status: "active",
    duration: 90,
    chapters: 6,
    enrolledUsers: 189,
    completionRate: 92,
    rating: 4.8,
    totalRatings: 134,
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-25",
    instructor: "Adv. Priya Patel",
    tags: ["kyc", "compliance", "documentation"],
    isRequired: true,
    targetRoles: ["distributor"],
  },
  {
    id: "3",
    title: "Advanced Portfolio Management",
    description: "Advanced strategies for portfolio construction, risk management, and optimization",
    category: "advanced",
    status: "active",
    duration: 180,
    chapters: 12,
    enrolledUsers: 78,
    completionRate: 65,
    rating: 4.4,
    totalRatings: 45,
    createdDate: "2024-01-05",
    lastUpdated: "2024-01-18",
    instructor: "CA Amit Kumar",
    tags: ["portfolio", "advanced", "risk management"],
    isRequired: false,
    targetRoles: ["amc", "admin"],
  },
  {
    id: "4",
    title: "Digital Platform Training",
    description: "Complete guide to using the digital investment platform and tools",
    category: "basic",
    status: "draft",
    duration: 60,
    chapters: 4,
    enrolledUsers: 0,
    completionRate: 0,
    rating: 0,
    totalRatings: 0,
    createdDate: "2024-01-28",
    lastUpdated: "2024-01-28",
    instructor: "Tech Team",
    tags: ["platform", "digital", "tools"],
    isRequired: false,
    targetRoles: ["distributor", "amc"],
  },
]

export default function AllCoursesPage() {
  const { hasPermission } = useAuth()
  const [courses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [targetRoleFilter, setTargetRoleFilter] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter
    const matchesRole = targetRoleFilter === "all" || course.targetRoles.includes(targetRoleFilter)

    return matchesSearch && matchesStatus && matchesCategory && matchesRole
  })

  const getStatusBadge = (status: Course["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: Course["category"]) => {
    const colors = {
      basic: "bg-blue-100 text-blue-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
      compliance: "bg-purple-100 text-purple-800",
    }

    return <Badge className={colors[category]}>{category.toUpperCase()}</Badge>
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (!hasPermission("course:read")) {
    return (
      <AuthenticatedLayout breadcrumbs={[{ label: "Courses & Certification" }, { label: "All Courses" }]}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view courses.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: "Courses & Certification" }, { label: "All Courses" }]}>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Courses</h2>
            <p className="text-muted-foreground">Manage training courses and educational content</p>
          </div>
          {hasPermission("course:create") && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">
                {courses.filter((c) => c.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.enrolledUsers, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">User satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Role</Label>
                <Select value={targetRoleFilter} onValueChange={setTargetRoleFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="amc">AMC</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Course Library</CardTitle>
            <CardDescription>Manage all training courses and educational content</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center">
                          {course.title}
                          {course.isRequired && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{course.instructor}</div>
                        <div className="flex flex-wrap gap-1">
                          {course.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(course.category)}</TableCell>
                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDuration(course.duration)}
                      </div>
                      <div className="text-sm text-muted-foreground">{course.chapters} chapters</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{course.enrolledUsers}</div>
                      <div className="text-sm text-muted-foreground">users</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{course.completionRate}%</span>
                        </div>
                        <Progress value={course.completionRate} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{course.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">({course.totalRatings})</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No ratings</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(course.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="h-4 w-4 mr-2" />
                            Preview Course
                          </DropdownMenuItem>
                          {hasPermission("course:update") && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Enrollments
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Award className="h-4 w-4 mr-2" />
                            View Certificates
                          </DropdownMenuItem>
                          {hasPermission("course:update") && (
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Course
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
