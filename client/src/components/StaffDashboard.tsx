import { useState } from 'react'
import {
  orders as initialOrders,
  tables as initialTables,
  inventory,
  staff,
  weeklyRevenue,
  topDishes,
  aiInsights,
  customerList,
  reservations,
  RESTAURANT_NAME,
} from '../mockData'
import type { User, StaffTab, Order, TableData, AIInsight } from '../types'

interface StaffDashboardProps {
  user: User
  onLogout: () => void
}

// ─── Shared helpers ────────────────────────────────────────────
function StatCard({ label, value, sub, color = 'text-ember' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-bark border border-dusk rounded-2xl p-5">
      <p className="text-cream/40 text-xs uppercase tracking-widest font-mono-data mb-2">{label}</p>
      <p className={`font-display text-3xl mb-1 ${color}`}>{value}</p>
      {sub && <p className="text-cream/30 text-xs">{sub}</p>}
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'on-duty': 'bg-sage',
    'off-duty': 'bg-dusk',
    'break': 'bg-copper',
    available: 'bg-sage',
    occupied: 'bg-flame',
    reserved: 'bg-ember',
    cleaning: 'bg-copper',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-dusk'} flex-shrink-0`} />
}

// ─── Overview Panel ─────────────────────────────────────────────
function OverviewPanel({ orders }: { orders: Order[] }) {
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length
  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
  const occupancy = Math.round((initialTables.filter(t => t.status === 'occupied').length / initialTables.length) * 100)

  const recentOrders = orders.slice(0, 4)

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-cream text-2xl mb-0.5">Good evening, Marcus.</h1>
        <p className="text-cream/40 text-sm font-mono-data">Friday, 15 November 2026 · Service active</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Orders" value={String(activeOrders)} sub={`${pendingCount} awaiting confirmation`} />
        <StatCard label="Table Occupancy" value={`${occupancy}%`} sub={`${initialTables.filter(t => t.status === 'occupied').length} of ${initialTables.length} tables`} color="text-ember-light" />
        <StatCard label="Tonight's Revenue" value={`$${(revenue + 2840).toLocaleString()}`} sub="Paid + open tabs" color="text-sage" />
        <StatCard label="Avg. Order Time" value="18 min" sub="4 min faster than avg" color="text-cream" />
      </div>

      {/* Recent orders */}
      <div className="bg-bark border border-dusk rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dusk">
          <h2 className="text-cream font-semibold">Live Orders</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-sage rounded-full animate-pulse-soft" />
            <span className="text-cream/30 text-xs font-mono-data">Updating live</span>
          </div>
        </div>
        <div className="divide-y divide-dusk">
          {recentOrders.map(order => (
            <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-dusk/30 transition-colors">
              <div className="w-10 h-10 bg-dusk rounded-xl flex items-center justify-center text-cream/50 font-mono-data text-sm flex-shrink-0">
                {order.tableNumber ? `T${order.tableNumber}` : 'TO'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream font-medium text-sm truncate">{order.customerName}</p>
                <p className="text-cream/30 text-xs">{order.items.length} items · ${order.total}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  order.status === 'pending' ? 'bg-copper/20 text-copper' :
                  order.status === 'preparing' ? 'bg-ember/20 text-ember' :
                  order.status === 'ready' ? 'bg-sage/20 text-sage' :
                  order.status === 'confirmed' ? 'bg-cream/10 text-cream/50' :
                  'bg-dusk text-cream/30'
                }`}>
                  {order.status}
                </span>
                {order.estimatedMinutes > 0 && (
                  <p className="text-cream/20 text-xs mt-0.5 font-mono-data">{order.estimatedMinutes}m left</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table status grid mini */}
      <div className="bg-bark border border-dusk rounded-2xl p-5">
        <h2 className="text-cream font-semibold mb-4">Table Overview</h2>
        <div className="grid grid-cols-6 gap-2">
          {initialTables.map(t => (
            <div
              key={t.id}
              title={`Table ${t.number} — ${t.status}${t.reservation ? ` (${t.reservation.name})` : ''}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-mono-data cursor-default transition-all ${
                t.status === 'occupied' ? 'bg-flame/20 text-flame border border-flame/30' :
                t.status === 'reserved' ? 'bg-ember/20 text-ember border border-ember/30' :
                t.status === 'cleaning' ? 'bg-copper/20 text-copper border border-copper/30' :
                'bg-dusk text-cream/30 border border-dusk'
              }`}
            >
              {t.number}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          {[['occupied', 'bg-flame/20 text-flame', 'Occupied'], ['reserved', 'bg-ember/20 text-ember', 'Reserved'], ['cleaning', 'bg-copper/20 text-copper', 'Cleaning'], ['available', 'bg-dusk text-cream/30', 'Available']].map(([, cls, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-cream/30">
              <span className={`w-3 h-3 rounded ${cls}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Tonight's reservations */}
      <div className="bg-bark border border-dusk rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dusk">
          <h2 className="text-cream font-semibold">Tonight's Reservations</h2>
        </div>
        <div className="divide-y divide-dusk">
          {reservations.slice(0, 3).map(r => (
            <div key={r.id} className="px-5 py-4 flex items-center gap-4">
              <div className="text-cream/30 font-mono-data text-sm w-12 flex-shrink-0">{r.time}</div>
              <div className="flex-1">
                <p className="text-cream font-medium text-sm">{r.customerName}</p>
                {r.specialRequests && <p className="text-cream/30 text-xs truncate">{r.specialRequests}</p>}
              </div>
              <div className="text-right">
                <p className="text-cream/50 text-sm">{r.partySize} guests</p>
                <span className={`text-xs font-medium ${r.status === 'confirmed' ? 'text-sage' : r.status === 'seated' ? 'text-ember' : 'text-copper'}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Orders Panel (Kanban) ──────────────────────────────────────
function OrdersPanel({ orders, setOrders }: { orders: Order[]; setOrders: (o: Order[]) => void }) {
  const columns: { key: Order['status']; label: string; color: string }[] = [
    { key: 'pending', label: 'Pending', color: 'text-copper' },
    { key: 'confirmed', label: 'Confirmed', color: 'text-cream/60' },
    { key: 'preparing', label: 'Preparing', color: 'text-ember' },
    { key: 'ready', label: 'Ready', color: 'text-sage' },
    { key: 'delivered', label: 'Delivered', color: 'text-cream/30' },
  ]

  const advanceOrder = (orderId: string) => {
    setOrders(orders.map(o => {
      if (o.id !== orderId) return o
      const next: Record<Order['status'], Order['status']> = {
        pending: 'confirmed',
        confirmed: 'preparing',
        preparing: 'ready',
        ready: 'delivered',
        delivered: 'delivered',
        cancelled: 'cancelled',
      }
      return { ...o, status: next[o.status], estimatedMinutes: Math.max(0, o.estimatedMinutes - 10) }
    }))
  }

  const cancelOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o))
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-cream text-2xl">Orders</h1>
        <button className="bg-flame text-cream text-sm px-4 py-2 rounded-xl hover:bg-ember transition-colors font-medium">
          + New Order
        </button>
      </div>
      <div className="kanban-scroll flex gap-4 pb-4 min-h-[500px]">
        {columns.map(col => {
          const colOrders = orders.filter(o => o.status === col.key)
          return (
            <div key={col.key} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3">
                <h2 className={`font-semibold text-sm uppercase tracking-wider font-mono-data ${col.color}`}>{col.label}</h2>
                <span className="bg-dusk text-cream/30 text-xs w-5 h-5 rounded-full flex items-center justify-center font-mono-data">
                  {colOrders.length}
                </span>
              </div>
              <div className="space-y-3">
                {colOrders.map(order => (
                  <div key={order.id} className="bg-bark border border-dusk rounded-2xl p-4 hover:border-ember/30 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-cream font-semibold text-sm">{order.customerName}</p>
                        <p className="text-cream/30 text-xs font-mono-data">
                          {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway'} · #{order.id}
                        </p>
                      </div>
                      <span className="font-mono-data text-ember text-sm">${order.total}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-cream/50">×{item.quantity} {item.name}</span>
                        </div>
                      ))}
                    </div>
                    {order.estimatedMinutes > 0 && col.key !== 'delivered' && (
                      <div className="flex items-center gap-1.5 text-xs text-copper/70 mb-3">
                        <span>⏱</span>
                        <span>{order.estimatedMinutes} min est.</span>
                      </div>
                    )}
                    {col.key !== 'delivered' && col.key !== 'cancelled' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => advanceOrder(order.id)}
                          className="flex-1 bg-ember/20 text-ember text-xs py-1.5 rounded-lg hover:bg-ember/30 transition-colors font-medium"
                        >
                          {col.key === 'pending' ? 'Confirm' : col.key === 'confirmed' ? 'Start Cooking' : col.key === 'preparing' ? 'Mark Ready' : 'Deliver'}
                        </button>
                        {col.key === 'pending' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="bg-dusk text-cream/30 text-xs px-2 rounded-lg hover:bg-crimson/20 hover:text-crimson transition-colors"
                          >✕</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {colOrders.length === 0 && (
                  <div className="border-2 border-dashed border-dusk rounded-2xl py-8 text-center text-cream/20 text-xs">
                    No orders
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tables Panel ───────────────────────────────────────────────
function TablesPanel({ tables, setTables }: { tables: TableData[]; setTables: (t: TableData[]) => void }) {
  const [selectedZone, setSelectedZone] = useState<'all' | 'indoor' | 'outdoor' | 'private'>('all')

  const filtered = selectedZone === 'all' ? tables : tables.filter(t => t.zone === selectedZone)

  const markCleaning = (id: string) => setTables(tables.map(t => t.id === id ? { ...t, status: 'cleaning' } : t))
  const markAvailable = (id: string) => setTables(tables.map(t => t.id === id ? { ...t, status: 'available', seatedAt: undefined, orderId: undefined } : t))

  const byStatus = (s: TableData['status']) => tables.filter(t => t.status === s).length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-cream text-2xl">Tables</h1>
        <div className="flex gap-2">
          {(['all', 'indoor', 'outdoor', 'private'] as const).map(z => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${selectedZone === z ? 'bg-ember text-cream' : 'bg-dusk text-cream/40 hover:text-cream/70'}`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Available', count: byStatus('available'), color: 'text-sage border-sage/30 bg-sage/10' },
          { label: 'Occupied', count: byStatus('occupied'), color: 'text-flame border-flame/30 bg-flame/10' },
          { label: 'Reserved', count: byStatus('reserved'), color: 'text-ember border-ember/30 bg-ember/10' },
          { label: 'Cleaning', count: byStatus('cleaning'), color: 'text-copper border-copper/30 bg-copper/10' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`border rounded-xl p-3 text-center ${color}`}>
            <p className="text-2xl font-display mb-0.5">{count}</p>
            <p className="text-xs opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Table floor map */}
      <div className="bg-bark border border-dusk rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(table => (
            <div
              key={table.id}
              className={`border rounded-2xl p-4 transition-all hover:scale-[1.01] ${
                table.status === 'occupied' ? 'bg-flame/10 border-flame/30' :
                table.status === 'reserved' ? 'bg-ember/10 border-ember/30' :
                table.status === 'cleaning' ? 'bg-copper/10 border-copper/30' :
                'bg-dusk/50 border-dusk hover:border-sage/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-data text-cream font-medium">T{table.number}</span>
                <StatusDot status={table.status} />
              </div>
              <p className="text-cream/40 text-xs mb-1">{table.capacity} seats · {table.zone}</p>
              {table.reservation && (
                <p className="text-ember text-xs truncate mb-1">{table.reservation.name}</p>
              )}
              {table.seatedAt && <p className="text-cream/30 text-xs font-mono-data">Seated {table.seatedAt}</p>}
              {table.status === 'occupied' && (
                <button onClick={() => markCleaning(table.id)} className="mt-2 w-full text-xs bg-dusk text-cream/40 py-1 rounded-lg hover:bg-copper/20 hover:text-copper transition-colors">
                  → Cleaning
                </button>
              )}
              {table.status === 'cleaning' && (
                <button onClick={() => markAvailable(table.id)} className="mt-2 w-full text-xs bg-dusk text-cream/40 py-1 rounded-lg hover:bg-sage/20 hover:text-sage transition-colors">
                  → Available
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Inventory Panel ────────────────────────────────────────────
function InventoryPanel() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'critical'>('all')

  const items = inventory.filter(item => {
    const searchMatch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const level = item.currentStock / item.maxStock
    if (filter === 'low') return searchMatch && level < 0.4
    if (filter === 'critical') return searchMatch && item.currentStock <= item.minStock
    return searchMatch
  })

  const getStockLevel = (item: typeof inventory[0]) => {
    const pct = item.currentStock / item.maxStock
    if (item.currentStock <= item.minStock) return { pct, color: 'bg-crimson', text: 'text-crimson', label: 'Critical' }
    if (pct < 0.4) return { pct, color: 'bg-copper', text: 'text-copper', label: 'Low' }
    return { pct, color: 'bg-sage', text: 'text-sage', label: 'OK' }
  }

  const criticalCount = inventory.filter(i => i.currentStock <= i.minStock).length
  const lowCount = inventory.filter(i => i.currentStock / i.maxStock < 0.4 && i.currentStock > i.minStock).length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-cream text-2xl">Inventory</h1>
        <button className="bg-flame text-cream text-sm px-4 py-2 rounded-xl hover:bg-ember transition-colors font-medium">
          + Restock Order
        </button>
      </div>

      {/* Alerts */}
      {criticalCount > 0 && (
        <div className="bg-crimson/10 border border-crimson/30 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <span className="text-crimson text-xl flex-shrink-0">⚠</span>
          <div>
            <p className="text-cream font-semibold text-sm">{criticalCount} item{criticalCount > 1 ? 's' : ''} critically low</p>
            <p className="text-cream/40 text-xs">Below minimum stock threshold — reorder immediately.</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search inventory…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-bark border border-dusk text-cream placeholder-cream/20 pl-4 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-ember transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['low', `Low (${lowCount})`], ['critical', `Critical (${criticalCount})`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`text-xs px-3 py-2 rounded-xl font-medium transition-all ${filter === key ? 'bg-ember text-cream' : 'bg-bark border border-dusk text-cream/40 hover:text-cream/70'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-bark border border-dusk rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-dusk text-xs text-cream/30 uppercase tracking-widest font-mono-data">
          <span>Item</span>
          <span className="w-24 text-right">Stock</span>
          <span className="w-28">Level</span>
          <span className="w-20 text-right">Cost/unit</span>
          <span className="w-20 text-right">Status</span>
        </div>
        <div className="divide-y divide-dusk">
          {items.map(item => {
            const { pct, color, text, label } = getStockLevel(item)
            return (
              <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-dusk/30 transition-colors">
                <div>
                  <p className="text-cream font-medium text-sm">{item.name}</p>
                  <p className="text-cream/30 text-xs">{item.category} · {item.supplier}</p>
                  {item.expiryDays && item.expiryDays <= 2 && (
                    <p className="text-crimson text-xs mt-0.5">Expires in {item.expiryDays} day{item.expiryDays > 1 ? 's' : ''}</p>
                  )}
                </div>
                <div className="w-24 text-right">
                  <span className={`font-mono-data text-sm ${text}`}>{item.currentStock}</span>
                  <span className="text-cream/20 text-xs"> / {item.maxStock} {item.unit}</span>
                </div>
                <div className="w-28">
                  <div className="w-full h-1.5 bg-dusk rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min(pct * 100, 100)}%` }} />
                  </div>
                  <div className="text-xs text-cream/20 mt-0.5 font-mono-data">{Math.round(pct * 100)}%</div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-cream/50 text-sm font-mono-data">${item.costPerUnit}</span>
                </div>
                <div className="w-20 text-right">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                    label === 'Critical' ? 'bg-crimson/20 text-crimson' :
                    label === 'Low' ? 'bg-copper/20 text-copper' :
                    'bg-sage/10 text-sage'
                  }`}>{label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Staff Panel ────────────────────────────────────────────────
function StaffPanel() {
  const onDuty = staff.filter(s => s.status === 'on-duty').length
  const onBreak = staff.filter(s => s.status === 'break').length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-cream text-2xl">Staff</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-sage bg-sage/10 px-3 py-1.5 rounded-full font-mono-data">{onDuty} on duty</span>
          <span className="text-xs text-copper bg-copper/10 px-3 py-1.5 rounded-full font-mono-data">{onBreak} on break</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {staff.map(member => (
          <div key={member.id} className="bg-bark border border-dusk rounded-2xl p-5 hover:border-ember/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-ember/20 rounded-full flex items-center justify-center text-ember font-semibold flex-shrink-0">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream font-semibold truncate">{member.name}</p>
                <p className="text-cream/40 text-sm">{member.role}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusDot status={member.status} />
                <span className={`text-xs capitalize font-medium ${member.status === 'on-duty' ? 'text-sage' : member.status === 'break' ? 'text-copper' : 'text-cream/30'}`}>
                  {member.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center border-t border-dusk pt-4">
              <div>
                <p className="text-xs text-cream/30 mb-0.5">Shift</p>
                <p className="text-cream/70 text-xs font-mono-data">{member.shift}</p>
              </div>
              <div>
                <p className="text-xs text-cream/30 mb-0.5">Hours/Wk</p>
                <p className="text-ember text-sm font-mono-data">{member.hoursThisWeek}h</p>
              </div>
              <div>
                <p className="text-xs text-cream/30 mb-0.5">Rating</p>
                <p className="text-ember text-sm">{'★'.repeat(Math.floor(member.rating))}<span className="text-cream/20">{'★'.repeat(5 - Math.floor(member.rating))}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Customers Panel ────────────────────────────────────────────
function CustomersPanel() {
  const [search, setSearch] = useState('')
  const filtered = customerList.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search)
  )
  const tierColors: Record<string, string> = {
    Platinum: 'text-cream bg-cream/10',
    Gold: 'text-ember bg-ember/10',
    Silver: 'text-sand bg-sand/10',
    Bronze: 'text-copper bg-copper/10',
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-cream text-2xl">Customers</h1>
        <span className="text-cream/30 text-sm font-mono-data">{customerList.length} total</span>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search customers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-bark border border-dusk text-cream placeholder-cream/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-ember transition-colors"
        />
      </div>
      <div className="bg-bark border border-dusk rounded-2xl overflow-hidden">
        <div className="divide-y divide-dusk">
          {filtered.map(c => (
            <div key={c.id} className="px-5 py-4 flex items-center gap-4 hover:bg-dusk/30 transition-colors">
              <div className="w-10 h-10 bg-ember/20 rounded-full flex items-center justify-center text-ember text-sm font-semibold flex-shrink-0">
                {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream font-medium text-sm">{c.name}</p>
                <p className="text-cream/30 text-xs">{c.email}</p>
                {c.dietary.length > 0 && (
                  <p className="text-sage/60 text-xs mt-0.5">{c.dietary.join(', ')}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-ember font-mono-data text-sm">${c.totalSpend.toLocaleString()}</p>
                <p className="text-cream/30 text-xs">{c.visits} visits</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${tierColors[c.loyaltyTier] || 'text-cream/30 bg-dusk'}`}>
                {c.loyaltyTier}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Analytics Panel ────────────────────────────────────────────
function AnalyticsPanel() {
  const maxTotal = Math.max(...weeklyRevenue.map(d => d.total))
  const totalRevenue = weeklyRevenue.reduce((s, d) => s + d.total, 0)
  const avgPerDay = totalRevenue / 7
  const bestDay = weeklyRevenue.reduce((best, d) => d.total > best.total ? d : best)

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-cream text-2xl">Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Weekly Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}k`} sub="Last 7 days" />
        <StatCard label="Avg Daily" value={`$${(avgPerDay / 1000).toFixed(1)}k`} sub="Per service" color="text-ember-light" />
        <StatCard label="Best Day" value={bestDay.day} sub={`$${bestDay.total.toLocaleString()}`} color="text-sage" />
      </div>

      {/* Revenue chart */}
      <div className="bg-bark border border-dusk rounded-2xl p-6">
        <h2 className="text-cream font-semibold mb-5">Weekly Revenue — Lunch vs Dinner</h2>
        <div className="flex items-end gap-3 h-48">
          {weeklyRevenue.map(d => {
            const lunchH = (d.lunch / maxTotal) * 180
            const dinnerH = (d.dinner / maxTotal) * 180
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 w-full justify-center" style={{ height: 180 }}>
                  <div className="w-1/2 rounded-t-sm bg-ember/40 transition-all hover:bg-ember/60" style={{ height: lunchH }} title={`Lunch $${d.lunch.toLocaleString()}`} />
                  <div className="w-1/2 rounded-t-sm bg-flame/70 transition-all hover:bg-flame" style={{ height: dinnerH }} title={`Dinner $${d.dinner.toLocaleString()}`} />
                </div>
                <span className="text-cream/30 text-xs font-mono-data">{d.day}</span>
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-cream/40"><span className="w-3 h-2 rounded-sm bg-ember/40 inline-block" />Lunch</div>
          <div className="flex items-center gap-1.5 text-xs text-cream/40"><span className="w-3 h-2 rounded-sm bg-flame/70 inline-block" />Dinner</div>
        </div>
      </div>

      {/* Top dishes */}
      <div className="bg-bark border border-dusk rounded-2xl p-6">
        <h2 className="text-cream font-semibold mb-5">Top Performing Dishes</h2>
        <div className="space-y-4">
          {topDishes.map((dish, i) => {
            const maxOrders = Math.max(...topDishes.map(d => d.orders))
            return (
              <div key={dish.name} className="flex items-center gap-4">
                <span className="text-cream/20 font-mono-data text-sm w-4 flex-shrink-0">0{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-cream text-sm font-medium">{dish.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono-data ${dish.growth > 10 ? 'text-sage' : 'text-cream/40'}`}>+{dish.growth}%</span>
                      <span className="text-ember font-mono-data text-sm">${dish.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-dusk rounded-full">
                    <div
                      className="h-full bg-ember rounded-full transition-all"
                      style={{ width: `${(dish.orders / maxOrders) * 100}%` }}
                    />
                  </div>
                  <span className="text-cream/20 text-xs font-mono-data">{dish.orders} orders this week</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Peak hours heatmap */}
      <div className="bg-bark border border-dusk rounded-2xl p-6">
        <h2 className="text-cream font-semibold mb-5">Peak Hours Heatmap</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="flex gap-1 mb-1">
              <div className="w-8 flex-shrink-0" />
              {['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'].map(h => (
                <div key={h} className="flex-1 text-center text-xs text-cream/20 font-mono-data">{h}</div>
              ))}
            </div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, di) => {
              const intensities = [0.1, 0.1, 0.05, 0.02, 0.05, 0.2, 0.6, 0.9, 0.85, 0.7, 0.4]
              const dayMult = [0.6, 0.6, 0.7, 0.8, 1.0, 1.2, 1.0][di]
              return (
                <div key={day} className="flex gap-1 mb-1">
                  <div className="w-8 text-xs text-cream/30 font-mono-data flex items-center">{day}</div>
                  {intensities.map((val, hi) => {
                    const intensity = Math.min(val * dayMult, 1)
                    return (
                      <div
                        key={hi}
                        className="flex-1 h-8 rounded transition-all cursor-default"
                        style={{ background: `rgba(212, 133, 42, ${intensity})` }}
                        title={`${day} ${12 + hi}:00 — ${Math.round(intensity * 100)}% busy`}
                      />
                    )
                  })}
                </div>
              )
            })}
            <div className="flex gap-2 items-center mt-3">
              <span className="text-xs text-cream/20">Less busy</span>
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
                  <div key={v} className="w-6 h-3 rounded-sm" style={{ background: `rgba(212, 133, 42, ${v})` }} />
                ))}
              </div>
              <span className="text-xs text-cream/20">Peak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AI Insights Panel ──────────────────────────────────────────
function AIPanel() {
  const [dismissed, setDismissed] = useState<string[]>([])

  const typeIcons: Record<AIInsight['type'], string> = {
    alert: '⚠',
    prediction: '◈',
    recommendation: '◉',
    trend: '↗',
  }
  const impactColors: Record<AIInsight['impact'], string> = {
    high: 'border-crimson/40 bg-crimson/5',
    medium: 'border-ember/30 bg-ember/5',
    low: 'border-dusk bg-bark/50',
  }
  const impactBadge: Record<AIInsight['impact'], string> = {
    high: 'bg-crimson/20 text-crimson',
    medium: 'bg-ember/20 text-ember',
    low: 'bg-dusk text-cream/30',
  }

  const visible = aiInsights.filter(i => !dismissed.includes(i.id))

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-cream text-2xl mb-1">AI Insights</h1>
        <p className="text-cream/30 text-sm">Powered by service history, reservations, and inventory data.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-crimson/10 border border-crimson/30 rounded-2xl p-4 text-center">
          <p className="text-3xl font-display text-crimson mb-1">{aiInsights.filter(i => i.impact === 'high').length}</p>
          <p className="text-crimson/70 text-xs uppercase tracking-wider font-mono-data">High Impact</p>
        </div>
        <div className="bg-ember/10 border border-ember/30 rounded-2xl p-4 text-center">
          <p className="text-3xl font-display text-ember mb-1">{aiInsights.filter(i => i.impact === 'medium').length}</p>
          <p className="text-ember/70 text-xs uppercase tracking-wider font-mono-data">Medium</p>
        </div>
        <div className="bg-bark border border-dusk rounded-2xl p-4 text-center">
          <p className="text-3xl font-display text-cream/30 mb-1">{aiInsights.filter(i => i.impact === 'low').length}</p>
          <p className="text-cream/20 text-xs uppercase tracking-wider font-mono-data">Informational</p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        {visible.map(insight => (
          <div key={insight.id} className={`border rounded-2xl p-5 ${impactColors[insight.impact]}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${impactColors[insight.impact].includes('crimson') ? 'bg-crimson/20' : 'bg-ember/20'}`}>
                {typeIcons[insight.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-cream font-semibold text-sm leading-tight">{insight.title}</h3>
                  <button onClick={() => setDismissed(d => [...d, insight.id])} className="text-cream/20 hover:text-cream/50 transition-colors flex-shrink-0 text-lg">×</button>
                </div>
                <p className="text-cream/50 text-xs leading-relaxed mb-3">{insight.description}</p>

                {insight.confidence && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-cream/30 font-mono-data">Confidence</span>
                    <div className="flex-1 h-1 bg-dusk rounded-full overflow-hidden max-w-32">
                      <div className="h-full bg-ember rounded-full" style={{ width: `${insight.confidence}%` }} />
                    </div>
                    <span className="text-ember text-xs font-mono-data">{insight.confidence}%</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${impactBadge[insight.impact]}`}>
                    {insight.impact} impact
                  </span>
                  <span className="text-xs text-cream/20 font-mono-data bg-dusk px-2 py-0.5 rounded-full">{insight.category}</span>
                  {insight.actionable && insight.action && (
                    <button className="ml-auto text-xs bg-ember/20 text-ember px-3 py-1 rounded-lg hover:bg-ember/30 transition-colors font-medium">
                      {insight.action.slice(0, 24)}…
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="text-center py-16 text-cream/20">
            <div className="text-4xl mb-3">◈</div>
            <p className="font-medium">All insights reviewed.</p>
            <p className="text-sm mt-1">New insights will appear as the service progresses.</p>
          </div>
        )}
      </div>

      {/* AI chat stub */}
      <div className="bg-bark border border-dusk rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-ember">◈</span>
          <h3 className="text-cream font-semibold text-sm">Ask the AI Assistant</h3>
        </div>
        <div className="bg-dusk rounded-xl px-4 py-3 mb-3 text-cream/30 text-sm italic">
          "What should I order from Greenfields this week?" or "Which tables are most profitable on Friday nights?"
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about tonight's service…"
            className="flex-1 bg-dusk border border-bark text-cream placeholder-cream/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-ember transition-colors"
          />
          <button className="bg-ember text-cream px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-flame transition-colors">
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Staff Dashboard Shell ───────────────────────────────────────
export default function StaffDashboard({ user, onLogout }: StaffDashboardProps) {
  const [tab, setTab] = useState<StaffTab>('overview')
  const [orders, setOrders] = useState(initialOrders)
  const [tables, setTables] = useState<TableData[]>(initialTables)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems: { key: StaffTab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '◈' },
    { key: 'orders', label: 'Orders', icon: '⊞' },
    { key: 'tables', label: 'Tables', icon: '⊟' },
    { key: 'inventory', label: 'Inventory', icon: '◫' },
    { key: 'staff', label: 'Staff', icon: '◎' },
    { key: 'customers', label: 'Customers', icon: '◷' },
    { key: 'analytics', label: 'Analytics', icon: '◉' },
    { key: 'ai', label: 'AI Insights', icon: '◈' },
  ]

  const activeAlerts = aiInsights.filter(i => i.impact === 'high').length

  return (
    <div className="min-h-screen bg-espresso flex" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 bottom-0 z-50 w-56 bg-bark border-r border-dusk flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-dusk">
          <div className="flex items-center gap-2">
            <span className="text-ember">◈</span>
            <span className="font-display text-cream text-sm tracking-tight">{RESTAURANT_NAME}</span>
          </div>
          <div className="text-cream/25 text-xs mt-1 font-mono-data">Staff Portal</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === key
                  ? 'bg-ember/15 text-ember border border-ember/20'
                  : 'text-cream/40 hover:text-cream/70 hover:bg-dusk/50'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
              {key === 'ai' && activeAlerts > 0 && (
                <span className="ml-auto bg-crimson text-cream text-xs w-4 h-4 rounded-full flex items-center justify-center font-mono-data">
                  {activeAlerts}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-dusk">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-ember rounded-full flex items-center justify-center text-cream text-xs font-semibold flex-shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-cream text-xs font-medium truncate">{user.name}</p>
              <p className="text-cream/30 text-xs capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-xs text-cream/25 hover:text-cream/50 transition-colors text-left px-1"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-espresso/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-dusk glass-dark sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-cream/40 hover:text-cream transition-colors text-xl"
          >
            ☰
          </button>
          <h1 className="text-cream/60 text-sm font-medium capitalize flex-1">
            {navItems.find(n => n.key === tab)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-cream/30 bg-dusk px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse-soft" />
              <span className="font-mono-data">Live</span>
            </div>
            <div className="text-xs text-cream/30 font-mono-data hidden md:block">
              {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        {/* Panel content */}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          {tab === 'overview' && <OverviewPanel orders={orders} />}
          {tab === 'orders' && <OrdersPanel orders={orders} setOrders={setOrders} />}
          {tab === 'tables' && <TablesPanel tables={tables} setTables={setTables} />}
          {tab === 'inventory' && <InventoryPanel />}
          {tab === 'staff' && <StaffPanel />}
          {tab === 'customers' && <CustomersPanel />}
          {tab === 'analytics' && <AnalyticsPanel />}
          {tab === 'ai' && <AIPanel />}
        </main>
      </div>
    </div>
  )
}
