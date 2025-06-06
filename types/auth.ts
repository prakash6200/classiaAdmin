export interface User {
  id: string
  name: string
  email: string
  mobile?: string
  role: string
  permissions: string[]
  avatar?: string
  amcId?: string
  distributorId?: string
  mainBalance?: number
}

export interface AuthContextType {
  user: User | null
  login: (emailOrMobile: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}