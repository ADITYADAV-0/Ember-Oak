import { useState, useMemo } from 'react'
import { menuItems, menuCategories, RESTAURANT_NAME, orders as mockOrders, reservations } from '../mockData'
import type { User, MenuItem, CustomerTab, Order } from '../types'

interface CustomerAppProps {
  user: User
  onLogout: () => void
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{text}</span>
  )
}

// ─── Menu Tab ───────────────────────────────────────────────
function MenuView() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([])
  const [orderPlaced, setOrderPlaced] = useState(false)

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-free']

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      const catMatch = category === 'All' || item.category === category
      const searchMatch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase())
      const dietMatch = dietaryFilter.length === 0 || dietaryFilter.every(d => item.dietary.includes(d))
      return catMatch && searchMatch && dietMatch
    })
  }, [category, search, dietaryFilter])

  const cartTotal = cart.reduce((sum, { item, qty }) => sum + item.price * qty, 0)
  const cartCount = cart.reduce((sum, { qty }) => sum + qty, 0)

  const addToCart = (item: MenuItem) => {
    if (!item.available) return
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { item, qty: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.item.id !== id))
  }

  const placeOrder = async () => {
    setOrderPlaced(true)
    setTimeout(() => { setCart([]); setCartOpen(false); setOrderPlaced(false) }, 3000)
  }

  const toggleDietary = (d: string) => {
    setDietaryFilter(prev => prev.includes(d) ? prev.filter(f => f !== d) : [...prev, d])
  }

  return (
    <div className="animate-fade-in">
      {/* Search & filters */}
      <div className="sticky top-16 z-10 glass-light border-b border-sand py-4 px-4 -mx-4">
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-walnut/50">🔍</span>
          <input
            type="text"
            placeholder="Search dishes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-parchment border border-sand rounded-xl text-sm text-espresso placeholder-walnut/40 focus:outline-none focus:border-flame transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {menuCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-flame text-cream' : 'bg-parchment text-walnut hover:bg-sand'}`}
            >
              {cat}
            </button>
          ))}
          <div className="flex-shrink-0 w-px bg-sand mx-1" />
          {dietaryOptions.map(d => (
            <button
              key={d}
              onClick={() => toggleDietary(d)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${dietaryFilter.includes(d) ? 'bg-sage/20 border-sage/50 text-sage' : 'border-sand text-walnut/60 hover:border-sand'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {filtered.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl overflow-hidden border border-sand shadow-sm hover:shadow-md transition-all ${!item.available ? 'opacity-60' : ''}`}>
            <div className="relative h-44 bg-parchment overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                {item.popular && <Badge text="Popular" color="bg-flame text-cream" />}
                {item.new && <Badge text="New" color="bg-sage text-cream" />}
                {!item.available && <Badge text="Unavailable" color="bg-espresso/70 text-cream" />}
              </div>
              {item.available && (
                <button
                  onClick={() => addToCart(item)}
                  className="absolute bottom-3 right-3 w-9 h-9 bg-flame text-cream rounded-full flex items-center justify-center text-lg hover:bg-espresso transition-colors shadow-lg"
                >
                  +
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-espresso leading-tight">{item.name}</h3>
                <span className="font-mono-data font-medium text-flame flex-shrink-0">${item.price}</span>
              </div>
              <p className="text-walnut/70 text-xs leading-relaxed mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-walnut/60">
                  <span className="text-ember">★</span>
                  <span>{item.rating}</span>
                  <span className="text-walnut/30">({item.reviews})</span>
                </div>
                <div className="w-1 h-1 bg-sand rounded-full" />
                <div className="flex items-center gap-1 text-xs text-walnut/60">
                  <span>⏱</span>
                  <span>{item.prepTime} min</span>
                </div>
                <div className="flex gap-1 ml-auto">
                  {item.dietary.slice(0, 2).map(d => (
                    <span key={d} className="text-xs text-sage/70 bg-sage/10 px-1.5 py-0.5 rounded">{d.slice(0, 3)}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-20 text-center text-walnut/40">
            <div className="text-4xl mb-3">🍽</div>
            <p className="font-medium">No dishes match your filters.</p>
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-espresso text-cream px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 hover:bg-bark transition-colors z-20"
        >
          <span className="bg-flame text-cream text-xs w-5 h-5 rounded-full flex items-center justify-center font-mono-data">{cartCount}</span>
          <span className="font-medium">View Order</span>
          <span className="font-mono-data text-ember">${cartTotal.toFixed(0)}</span>
        </button>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-espresso/60" onClick={() => setCartOpen(false)} />
          <div className="relative bg-cream w-full sm:max-w-md max-h-[80vh] rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand">
              <h3 className="font-semibold text-espresso">Your Order</h3>
              <button onClick={() => setCartOpen(false)} className="text-walnut/50 hover:text-walnut">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.map(({ item, qty }) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-parchment flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-espresso truncate">{item.name}</p>
                    <p className="text-xs text-walnut/60">×{qty} = <span className="font-mono-data text-flame">${(item.price * qty).toFixed(0)}</span></p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-walnut/30 hover:text-crimson text-lg transition-colors">×</button>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-sand">
              <div className="flex items-center justify-between mb-4">
                <span className="text-walnut">Total</span>
                <span className="font-display text-espresso text-2xl">${cartTotal.toFixed(0)}</span>
              </div>
              {orderPlaced ? (
                <div className="bg-sage/10 border border-sage/30 text-sage text-center py-3 rounded-xl font-medium">
                  ✓ Order sent to kitchen!
                </div>
              ) : (
                <button
                  onClick={placeOrder}
                  className="w-full bg-flame text-cream font-semibold py-3 rounded-xl hover:bg-espresso transition-colors"
                >
                  Place Order — ${cartTotal.toFixed(0)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Reservation Tab ─────────────────────────────────────────
function ReserveView({ user }: { user: User }) {
  const [date, setDate] = useState('2026-11-16')
  const [time, setTime] = useState('19:00')
  const [party, setParty] = useState(2)
  const [zone, setZone] = useState<'any' | 'indoor' | 'outdoor' | 'private'>('any')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const times = ['12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']
  const bookedTimes = ['18:00', '19:30']

  const handleBook = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setConfirmed(true)
  }

  if (confirmed) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-sage/20 border border-sage/40 rounded-full flex items-center justify-center text-3xl text-sage mb-6">✓</div>
        <h2 className="font-display text-espresso text-3xl mb-2">Booking Confirmed!</h2>
        <p className="text-walnut mb-2">Table for <strong>{party}</strong> on <strong>{date}</strong> at <strong>{time}</strong></p>
        <p className="text-walnut/50 text-sm mb-8">Confirmation sent to {user.email}</p>
        <div className="bg-white border border-sand rounded-2xl p-6 text-left max-w-xs w-full mb-6 shadow-sm">
          <div className="text-xs text-walnut/40 uppercase tracking-widest font-mono-data mb-4">Booking Details</div>
          {[
            ['Guest', user.name],
            ['Date', date],
            ['Time', time],
            ['Party Size', `${party} guests`],
            ['Zone', zone === 'any' ? 'Best available' : zone],
            ['Ref #', 'EMB-2026-' + Math.floor(Math.random() * 9000 + 1000)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-sand last:border-0">
              <span className="text-walnut/50 text-sm">{label}</span>
              <span className="text-espresso text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setConfirmed(false)} className="text-flame text-sm hover:text-espresso transition-colors">
          Make another reservation
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-md">
      <h2 className="font-display text-espresso text-2xl mb-1">Reserve a Table</h2>
      <p className="text-walnut/60 text-sm mb-6">Book in seconds. Cancel up to 2 hours before.</p>

      <div className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-walnut uppercase tracking-wider mb-1.5 font-mono-data">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min="2026-11-15"
            className="w-full bg-white border border-sand text-espresso px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-flame transition-colors"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-medium text-walnut uppercase tracking-wider mb-1.5 font-mono-data">Time</label>
          <div className="grid grid-cols-4 gap-2">
            {times.map(t => {
              const booked = bookedTimes.includes(t)
              const selected = time === t
              return (
                <button
                  key={t}
                  onClick={() => !booked && setTime(t)}
                  disabled={booked}
                  className={`py-2 rounded-lg text-sm font-mono-data transition-all ${selected ? 'bg-flame text-cream' : booked ? 'bg-sand/50 text-sand line-through cursor-not-allowed' : 'bg-white border border-sand text-walnut hover:border-flame hover:text-flame'}`}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* Party size */}
        <div>
          <label className="block text-xs font-medium text-walnut uppercase tracking-wider mb-1.5 font-mono-data">Party Size</label>
          <div className="flex items-center gap-4 bg-white border border-sand rounded-xl px-4 py-3">
            <button
              onClick={() => setParty(p => Math.max(1, p - 1))}
              className="w-8 h-8 border border-sand rounded-full flex items-center justify-center text-walnut hover:border-flame hover:text-flame transition-colors text-lg"
            >−</button>
            <span className="flex-1 text-center font-display text-espresso text-2xl">{party}</span>
            <button
              onClick={() => setParty(p => Math.min(12, p + 1))}
              className="w-8 h-8 border border-sand rounded-full flex items-center justify-center text-walnut hover:border-flame hover:text-flame transition-colors text-lg"
            >+</button>
          </div>
        </div>

        {/* Zone preference */}
        <div>
          <label className="block text-xs font-medium text-walnut uppercase tracking-wider mb-1.5 font-mono-data">Seating Preference</label>
          <div className="grid grid-cols-4 gap-2">
            {(['any', 'indoor', 'outdoor', 'private'] as const).map(z => (
              <button
                key={z}
                onClick={() => setZone(z)}
                className={`py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${zone === z ? 'bg-flame text-cream' : 'bg-white border border-sand text-walnut hover:border-flame'}`}
              >
                {z === 'any' ? 'Any' : z}
              </button>
            ))}
          </div>
        </div>

        {/* Special requests */}
        <div>
          <label className="block text-xs font-medium text-walnut uppercase tracking-wider mb-1.5 font-mono-data">Special Requests</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Dietary requirements, occasion, accessibility needs…"
            rows={3}
            className="w-full bg-white border border-sand text-espresso placeholder-walnut/30 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-flame transition-colors resize-none"
          />
        </div>

        {/* AI suggestion */}
        <div className="bg-ember/10 border border-ember/20 rounded-xl p-4 flex gap-3">
          <span className="text-ember text-lg">◈</span>
          <div>
            <p className="text-espresso text-sm font-medium mb-0.5">AI Suggestion</p>
            <p className="text-walnut/70 text-xs">Based on your preferences, 19:00 on {date} offers the best availability. The outdoor terrace is excellent this time of year.</p>
          </div>
        </div>

        <button
          onClick={handleBook}
          disabled={loading}
          className="w-full bg-flame text-cream font-semibold py-3.5 rounded-xl hover:bg-espresso transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin-slow" />Booking…</>
          ) : `Confirm — ${date} at ${time} for ${party}`}
        </button>
      </div>

      {/* Upcoming reservations */}
      {reservations.slice(0, 2).map(r => (
        <div key={r.id} className="mt-3 bg-white border border-sand rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-parchment rounded-lg flex items-center justify-center text-flame text-xl">📅</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-espresso truncate">{r.customerName}</p>
            <p className="text-xs text-walnut/60">{r.date} at {r.time} · Party of {r.partySize}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            r.status === 'confirmed' ? 'bg-sage/10 text-sage' :
            r.status === 'seated' ? 'bg-ember/10 text-ember' :
            'bg-sand text-walnut'
          }`}>{r.status}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Orders Tab ──────────────────────────────────────────────
function OrdersView({ user: _user }: { user: User }) {
  const activeOrder = mockOrders[0]
  const pastOrders = mockOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled')

  const statusSteps: { key: Order['status']; label: string }[] = [
    { key: 'pending', label: 'Order Received' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'In Kitchen' },
    { key: 'ready', label: 'Ready' },
    { key: 'delivered', label: 'Delivered' },
  ]

  const currentStep = statusSteps.findIndex(s => s.key === activeOrder.status)

  return (
    <div className="animate-fade-in">
      {/* Active order */}
      <div className="mb-8">
        <h2 className="font-display text-espresso text-xl mb-4">Current Order</h2>
        <div className="bg-white border border-sand rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-espresso px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-cream/40 font-mono-data uppercase tracking-wider mb-0.5">Order #{activeOrder.id}</div>
              <div className="text-cream font-medium">Table {activeOrder.tableNumber} · Dine-in</div>
            </div>
            <div className="text-right">
              <div className="text-ember font-mono-data text-lg">${activeOrder.total}</div>
              <div className="text-cream/40 text-xs">{activeOrder.items.length} items</div>
            </div>
          </div>

          {/* Status timeline */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-0 mb-1">
              {statusSteps.map((step, i) => {
                const done = i <= currentStep
                const active = i === currentStep
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs transition-all ${
                      done ? (active ? 'bg-flame text-cream animate-pulse-soft' : 'bg-sage text-cream') : 'bg-sand text-walnut/30'
                    }`}>
                      {done && !active ? '✓' : i + 1}
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? 'bg-sage' : 'bg-sand'}`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-1">
              {statusSteps.map((step, i) => (
                <div key={step.key} className={`text-xs text-center ${i === currentStep ? 'text-flame font-medium' : 'text-walnut/40'}`} style={{ flex: i < statusSteps.length - 1 ? '1' : '0', minWidth: i === statusSteps.length - 1 ? 'auto' : undefined }}>
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          {activeOrder.estimatedMinutes > 0 && (
            <div className="mx-6 mb-5 bg-ember/10 border border-ember/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-ember text-lg">⏱</span>
              <div>
                <p className="text-espresso text-sm font-medium">Est. {activeOrder.estimatedMinutes} minutes remaining</p>
                <p className="text-walnut/50 text-xs">Your dishes are being prepared with care.</p>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="px-6 pb-4 space-y-2">
            {activeOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-sand/50 last:border-0">
                <span className="text-walnut/30 font-mono-data text-sm w-4">×{item.quantity}</span>
                <span className="flex-1 text-espresso text-sm">{item.name}</span>
                <span className="text-walnut/60 font-mono-data text-sm">${(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-parchment flex justify-between items-center">
            <span className="text-walnut/60 text-sm">Total (unpaid)</span>
            <span className="font-display text-espresso text-xl">${activeOrder.total}</span>
          </div>
        </div>
      </div>

      {/* Past orders */}
      <div>
        <h2 className="font-display text-espresso text-xl mb-4">Order History</h2>
        <div className="space-y-3">
          {pastOrders.map(order => (
            <div key={order.id} className="bg-white border border-sand rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-flame/30 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${order.status === 'delivered' ? 'bg-sage/10 text-sage' : 'bg-crimson/10 text-crimson'}`}>
                {order.status === 'delivered' ? '✓' : '×'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-espresso">{order.items.map(i => i.name).join(', ').slice(0, 50)}…</p>
                <p className="text-xs text-walnut/50 font-mono-data">{order.createdAt.slice(0, 10)} · {order.type}</p>
              </div>
              <div className="text-right">
                <p className="font-mono-data text-flame">${order.total}</p>
                <p className="text-xs text-walnut/40 capitalize">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Profile Tab ─────────────────────────────────────────────
function ProfileView({ user, onLogout }: { user: User; onLogout: () => void }) {
  const tierThresholds = { Bronze: 500, Silver: 1000, Gold: 2000, Platinum: 5000 }
  const currentTier = user.loyaltyPoints >= 5000 ? 'Platinum' : user.loyaltyPoints >= 2000 ? 'Gold' : user.loyaltyPoints >= 1000 ? 'Silver' : 'Bronze'
  const nextTier = currentTier === 'Silver' ? 'Gold' : currentTier === 'Gold' ? 'Platinum' : null
  const nextThreshold = nextTier ? tierThresholds[nextTier as keyof typeof tierThresholds] : null
  const progress = nextThreshold ? (user.loyaltyPoints / nextThreshold) * 100 : 100

  const tierColors: Record<string, string> = {
    Bronze: 'text-copper bg-copper/10',
    Silver: 'text-walnut/60 bg-sand',
    Gold: 'text-ember bg-ember/10',
    Platinum: 'text-espresso bg-espresso/10',
  }

  const preferences = ['Quiet section preferred', 'Window seat when available', 'Vegetarian menu', 'No nuts']
  const recentDishes = ['Burrata & Heirloom Tomato', 'Valrhona Chocolate Fondant', 'Garden Spritz', 'Oak-Smoked Duck Breast']

  return (
    <div className="animate-fade-in space-y-6">
      {/* Profile card */}
      <div className="bg-white border border-sand rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-flame rounded-full flex items-center justify-center text-cream text-lg font-semibold">
            {user.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-espresso text-lg">{user.name}</h2>
            <p className="text-walnut/60 text-sm">{user.email}</p>
          </div>
          <span className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${tierColors[currentTier] || 'text-walnut bg-sand'}`}>
            {currentTier}
          </span>
        </div>
        <div className="border-t border-sand pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-walnut/50 uppercase tracking-wider font-mono-data">Loyalty Points</span>
            {nextTier && <span className="text-xs text-walnut/40">{nextThreshold! - user.loyaltyPoints} pts to {nextTier}</span>}
          </div>
          <div className="text-3xl font-display text-flame mb-3">{user.loyaltyPoints.toLocaleString()}</div>
          <div className="w-full h-2 bg-parchment rounded-full overflow-hidden">
            <div className="h-full bg-ember rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Visits', value: '24', icon: '🍽' },
          { label: 'Total Spend', value: '$4,820', icon: '💳' },
          { label: 'Avg. Rating Given', value: '4.7★', icon: '⭐' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white border border-sand rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl mb-1">{icon}</div>
            <div className="font-mono-data text-flame font-medium text-base">{value}</div>
            <div className="text-walnut/50 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="bg-white border border-sand rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-espresso mb-3">Your Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {preferences.map(p => (
            <span key={p} className="bg-parchment text-walnut text-xs px-3 py-1.5 rounded-full">{p}</span>
          ))}
          <button className="bg-parchment/50 border border-dashed border-sand text-walnut/40 text-xs px-3 py-1.5 rounded-full hover:border-flame/40 hover:text-flame/60 transition-colors">
            + Add preference
          </button>
        </div>
      </div>

      {/* Favourite dishes */}
      <div className="bg-white border border-sand rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-espresso mb-3">Often Ordered</h3>
        <div className="space-y-2">
          {recentDishes.map(dish => {
            const item = menuItems.find(m => m.name === dish)
            return (
              <div key={dish} className="flex items-center gap-3">
                {item && <img src={item.image} alt={dish} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                <span className="text-sm text-espresso">{dish}</span>
                <span className="ml-auto text-flame text-sm">★</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI personalised picks */}
      <div className="bg-espresso rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-ember">◈</span>
          <h3 className="font-semibold text-cream text-sm">Recommended for You</h3>
        </div>
        <p className="text-cream/40 text-xs mb-3">Based on your order history and dietary preferences</p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {menuItems.filter(m => m.available && m.dietary.includes('Vegetarian')).slice(0, 3).map(item => (
            <div key={item.id} className="flex-shrink-0 w-36 bg-bark rounded-xl overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
              <div className="p-2.5">
                <p className="text-cream text-xs font-medium leading-tight mb-1 line-clamp-2">{item.name}</p>
                <p className="text-ember text-xs font-mono-data">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full border border-sand text-walnut/50 py-3 rounded-xl text-sm hover:border-crimson/30 hover:text-crimson transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}

// ─── Customer App Shell ───────────────────────────────────────
export default function CustomerApp({ user, onLogout }: CustomerAppProps) {
  const [tab, setTab] = useState<CustomerTab>('menu')

  const tabs: { key: CustomerTab; label: string; icon: string }[] = [
    { key: 'menu', label: 'Menu', icon: '🍽' },
    { key: 'reserve', label: 'Reserve', icon: '📅' },
    { key: 'orders', label: 'Orders', icon: '⏱' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-cream" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-light border-b border-sand">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-flame">◈</span>
            <span className="font-display text-espresso">{RESTAURANT_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs bg-ember/10 text-ember px-2.5 py-1 rounded-full font-mono-data">
              {user.loyaltyPoints.toLocaleString()} pts
            </div>
            <div className="w-8 h-8 bg-flame rounded-full flex items-center justify-center text-cream text-xs font-semibold">
              {user.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        {tab === 'menu' && <MenuView />}
        {tab === 'reserve' && <ReserveView user={user} />}
        {tab === 'orders' && <OrdersView user={user} />}
        {tab === 'profile' && <ProfileView user={user} onLogout={onLogout} />}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 glass-light border-t border-sand">
        <div className="max-w-2xl mx-auto px-4 flex">
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${tab === key ? 'text-flame' : 'text-walnut/40 hover:text-walnut'}`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
