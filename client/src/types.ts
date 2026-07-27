export type AppView = 'landing' | 'auth' | 'customer' | 'staff'
export type CustomerTab = 'menu' | 'reserve' | 'orders' | 'profile'
export type StaffTab = 'overview' | 'orders' | 'tables' | 'inventory' | 'staff' | 'customers' | 'analytics' | 'ai'
export type AuthMode = 'login' | 'register'
export type UserRole = 'customer' | 'manager' | 'chef' | 'waiter' | 'host'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  loyaltyPoints: number
  joinDate: string
  avatar: string
  preferences?: string[]
  dietary?: string[]
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  available: boolean
  dietary: string[]
  prepTime: number
  rating: number
  reviews: number
  popular?: boolean
  spicy?: boolean
  new?: boolean
}

export interface TableData {
  id: string
  number: number
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'cleaning'
  zone: 'indoor' | 'outdoor' | 'private'
  reservation?: {
    name: string
    time: string
    party: number
    phone?: string
  }
  orderId?: string
  seatedAt?: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  tableNumber?: number
  customerId: string
  customerName: string
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  total: number
  createdAt: string
  estimatedMinutes: number
  type: 'dine-in' | 'takeaway'
  notes?: string
  paymentStatus: 'unpaid' | 'paid'
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  costPerUnit: number
  supplier: string
  lastRestocked: string
  expiryDays?: number
}

export interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  shift: string
  status: 'on-duty' | 'off-duty' | 'break'
  phone: string
  rating: number
  startDate: string
  hoursThisWeek: number
  avatar: string
}

export interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  tableId?: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'seated'
  specialRequests?: string
}

export interface AIInsight {
  id: string
  type: 'prediction' | 'recommendation' | 'alert' | 'trend'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: string
  actionable: boolean
  action?: string
  confidence?: number
  createdAt: string
}
