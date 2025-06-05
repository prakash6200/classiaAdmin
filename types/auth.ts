export type UserRole = "super_admin" | "admin" | "amc" | "distributor"

export interface User {
  id: string
  name: string
  email: string
  mobile: string,
  role: UserRole
  avatar?: string
  amcId?: string
  distributorId?: string
  permissions: string[]
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}
