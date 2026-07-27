import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { menuItems, inventory, orders, staff, tables, weeklyRevenue, RESTAURANT_NAME } from '../mockData'
import type { AppView } from '../types'

interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  time: string
  chips?: string[]
}

interface AIChatBotProps {
  view: AppView
  userName?: string
}

// ─── AI brain (keyword matcher + scripted responses) ──────────────
function getResponse(input: string, view: AppView, userName?: string): { content: string; chips?: string[] } {
  const q = input.toLowerCase()
  const name = userName ? userName.split(' ')[0] : 'there'
  const isStaff = view === 'staff'

  // ── Staff queries ──
  if (isStaff) {
    if (q.match(/stock|inventory|low|critical|restock/)) {
      const critical = inventory.filter(i => i.currentStock <= i.minStock)
      const low = inventory.filter(i => i.currentStock / i.maxStock < 0.4 && i.currentStock > i.minStock)
      return {
        content: `🔴 **${critical.length} critical** items below minimum:\n${critical.map(i => `• ${i.name}: ${i.currentStock} ${i.unit} (min ${i.minStock})`).join('\n')}\n\n🟡 **${low.length} low stock** items:\n${low.map(i => `• ${i.name}: ${Math.round(i.currentStock / i.maxStock * 100)}%`).join('\n')}`,
        chips: ['Order from suppliers', 'View full inventory', 'Set restock alert'],
      }
    }
    if (q.match(/order|pending|kitchen|prepar/)) {
      const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
      const pending = orders.filter(o => o.status === 'pending')
      return {
        content: `📋 **${active.length} active orders** right now.\n\n• Pending confirmation: **${pending.length}**\n• In kitchen: **${orders.filter(o => o.status === 'preparing').length}**\n• Ready to serve: **${orders.filter(o => o.status === 'ready').length}**\n\nTotal order value tonight: **$${active.reduce((s, o) => s + o.total, 0).toLocaleString()}**`,
        chips: ['View orders board', 'Confirm pending orders', 'Kitchen status'],
      }
    }
    if (q.match(/revenue|sales|money|earning|profit/)) {
      const total = weeklyRevenue.reduce((s, d) => s + d.total, 0)
      const best = weeklyRevenue.reduce((b, d) => d.total > b.total ? d : b)
      return {
        content: `💰 **Weekly Revenue: $${total.toLocaleString()}**\n\n• Best day: **${best.day}** — $${best.total.toLocaleString()}\n• Avg/day: **$${Math.round(total / 7).toLocaleString()}**\n• Tonight (est.): **$${(3240).toLocaleString()}** (in progress)\n\nDinner drives ~68% of weekly revenue. Friday evening is your peak.`,
        chips: ['Full analytics', 'Download report', 'Compare to last week'],
      }
    }
    if (q.match(/staff|who|duty|shift|team/)) {
      const onDuty = staff.filter(s => s.status === 'on-duty')
      return {
        content: `👥 **${onDuty.length} staff on duty** right now:\n${onDuty.map(s => `• ${s.name} — ${s.role} (${s.shift})`).join('\n')}\n\n1 on break: **Tom Nakamura**\nAll departments covered.`,
        chips: ['View full roster', 'Send team message', 'Adjust shift'],
      }
    }
    if (q.match(/table|seat|occupan|floor/)) {
      const occupied = tables.filter(t => t.status === 'occupied').length
      const available = tables.filter(t => t.status === 'available').map(t => `T${t.number}`).join(', ')
      const pct = Math.round((occupied / tables.length) * 100)
      return {
        content: `🪑 **Table occupancy: ${pct}%** (${occupied} of ${tables.length} tables active)\n\n• Occupied: ${occupied} tables\n• Reserved: ${tables.filter(t => t.status === 'reserved').length} tables\n• Available: ${available}\n• Cleaning: T8\n\nEstimated 2 tables freeing up in ~25 min.`,
        chips: ['View floor plan', 'Seat next guest', 'Reservations'],
      }
    }
    if (q.match(/ai|insight|predict|forecast|recommend/)) {
      return {
        content: `◈ **Top AI Insights right now:**\n\n1. 🔴 Scallops critical — below service threshold for tonight\n2. 📈 Saturday ribeye demand +34% predicted\n3. 💡 Friday peak pricing could add ~$1,800/week\n4. 📊 Vegan menu orders up 28% month-over-month\n5. 👥 Sunday lunch understaffed vs 6:1 target\n\nAll 6 insights available in the AI panel.`,
        chips: ['View AI panel', 'Dismiss alerts', 'Act on top insight'],
      }
    }
    // Staff fallback
    return {
      content: `Hi ${name}! I'm your operations assistant. Here's what I can help with:\n\n• **Inventory** — stock levels, reorder alerts\n• **Orders** — live kitchen status, pending count\n• **Revenue** — tonight's sales, weekly analytics\n• **Staff** — who's on duty, shift gaps\n• **Tables** — occupancy, next available\n• **AI Insights** — predictions, recommendations\n\nWhat do you need?`,
      chips: ['Check inventory', 'Order status', "Tonight's revenue", "Who's on shift"],
    }
  }

  // ── Customer queries ──
  if (q.match(/hello|hi|hey|good|start/)) {
    return {
      content: `Welcome to ${RESTAURANT_NAME}, ${name}! 🍽️\n\nI'm your dining concierge. I can help you explore the menu, find dishes that match your taste, book a table, or track your order. What would you like?`,
      chips: ['See the menu', 'Book a table', 'My order status', 'Recommendations'],
    }
  }
  if (q.match(/vegan|plant|vegetarian|gluten|dairy|nut|allerg|diet/)) {
    const vegan = menuItems.filter(m => m.dietary.includes('Vegan') && m.available)
    const veg = menuItems.filter(m => m.dietary.includes('Vegetarian') && m.available && !m.dietary.includes('Vegan'))
    const gf = menuItems.filter(m => m.dietary.includes('Gluten-free') && m.available)
    if (q.includes('vegan')) return { content: `🌱 We have **${vegan.length} vegan dishes** available tonight:\n\n${vegan.map(m => `• **${m.name}** — $${m.price}`).join('\n')}\n\nAll clearly marked on the menu with dietary badges.`, chips: ['Show me the menu', 'Book a table', 'More questions'] }
    if (q.match(/veg|plant/)) return { content: `🥗 **${veg.length + vegan.length} vegetarian options** available, including ${vegan.length} vegan dishes. Highlights:\n\n${[...vegan, ...veg].slice(0, 4).map(m => `• ${m.name} — $${m.price}`).join('\n')}`, chips: ['View full menu', 'Book a table'] }
    return { content: `✅ We have **${gf.length} gluten-free** options tonight. Our kitchen takes allergen management seriously. For severe allergies, please mention it in your reservation notes and we'll prep your meal in a dedicated space.`, chips: ['View menu', 'Book with dietary note'] }
  }
  if (q.match(/menu|food|dish|eat|starter|main|dessert|drink|cocktail/)) {
    const popular = menuItems.filter(m => m.popular && m.available)
    return {
      content: `🍽️ **Tonight's highlights:**\n\n${popular.map(m => `• **${m.name}** — $${m.price} ⭐ ${m.rating}`).join('\n')}\n\nWe have 14 dishes across Starters, Mains, Desserts & Drinks. The **Dry-Aged Ribeye** and **Valrhona Fondant** are our most-ordered tonight.`,
      chips: ['See full menu', 'I want a recommendation', 'Book a table'],
    }
  }
  if (q.match(/recommend|suggest|what should|best|popular|favourite/)) {
    return {
      content: `◈ **My picks for you tonight:**\n\n1. **Burrata & Heirloom Tomato** ($18) — Perfect starter, customers adore it\n2. **Dry-Aged Ribeye** ($58) — Our most-reviewed dish, 5.0 stars\n3. **Valrhona Chocolate Fondant** ($14) — The dessert everyone orders twice\n4. **Ember Old Fashioned** ($16) — Cocktail of the month\n\n*Pair the ribeye with our Sommelier's Wine Pairing for the complete experience.*`,
      chips: ['Reserve a table', 'See full menu', 'Vegan options'],
    }
  }
  if (q.match(/book|reserv|table|seat|availab|tonight|tomorrow|when/)) {
    return {
      content: `📅 **Available tonight:**\n\n• 18:30 — Indoor (4 seats)\n• 19:00 — Outdoor terrace (2 or 4 seats)\n• 20:00 — Indoor (2 seats)\n• 20:30 — Private dining (up to 8)\n\nFriday evenings fill fast — I'd recommend booking now. Takes under 30 seconds!`,
      chips: ['Book 18:30', 'Book 19:00', 'Book for tomorrow', 'See all times'],
    }
  }
  if (q.match(/order|track|status|kitchen|where|ready|deliver/)) {
    const order = orders[0]
    return {
      content: `⏱️ **Your current order:**\n\nStatus: **In Kitchen** 🔥\nEstimated wait: **~${order.estimatedMinutes} minutes**\n\nItems being prepared:\n${order.items.map(i => `• ${i.name}`).join('\n')}\n\nOur kitchen team is on it! You'll be notified when it's ready.`,
      chips: ['See full order', 'Notify me when ready', 'Request update'],
    }
  }
  if (q.match(/price|cost|how much|expensive|cheap|affordable/)) {
    return {
      content: `💳 **Price guide:**\n\n• Starters: $9–$24\n• Mains: $28–$58\n• Desserts: $9–$14\n• Cocktails: $13–$16\n• Wine pairing: $48 (4 courses)\n\nWe offer a **set menu** from 18:00–19:00 at $65/person (3 courses). Great value for the quality!`,
      chips: ['View full menu', 'Book early dinner', 'Any vegetarian mains?'],
    }
  }
  if (q.match(/hour|open|time|close|when.*open|when.*close/)) {
    return {
      content: `🕐 **Opening Hours:**\n\n• Lunch: Tuesday–Sunday, 12:00–15:00\n• Dinner: Tuesday–Sunday, 17:30–22:30\n• Kitchen closes: 21:30\n• Bar closes: 23:00\n\nClosed Mondays (private events only). Last reservations taken at 21:00.`,
      chips: ['Book a table', 'See tonight\'s menu', 'Contact us'],
    }
  }
  if (q.match(/location|address|where|find|park|direction/)) {
    return {
      content: `📍 **Ember & Oak**\n42 Harbour Lane, The Rocks\nSydney NSW 2000\n\n🚇 Nearest station: Circular Quay (5 min walk)\n🚗 Parking: Grosvenor St NCP (validated for 2h)\n🚢 Water taxi: King Street Wharf stop\n\nBinoculars not needed — we're hard to miss.`,
      chips: ['Get directions', 'Book a table', 'Call us'],
    }
  }
  if (q.match(/loyalty|point|reward|tier|gold|silver|platinum/)) {
    return {
      content: `⭐ **Your Ember & Oak Loyalty:**\n\nYou earn **1 point per $1 spent**.\n\n• Bronze (0–499 pts): Priority booking\n• Silver (500–999 pts): 10% off drinks\n• Gold (1,000–1,999 pts): Free dessert monthly\n• Platinum (2,000+ pts): Chef's table access, complimentary amuse-bouche\n\nPoints update automatically after each visit — no card needed.`,
      chips: ['Check my points', 'Book to earn more', 'Redeem points'],
    }
  }
  if (q.match(/wifi|password|internet|connect/)) {
    return {
      content: `📶 **Guest WiFi:**\nNetwork: **EmberOak_Guest**\nPassword: **goodfood2026**\n\nEnjoy complimentary high-speed internet throughout the restaurant and terrace.`,
      chips: ['Thanks!', 'Any other questions?'],
    }
  }
  if (q.match(/thank|great|perfect|awesome|love|amazing/)) {
    return {
      content: `You're very welcome! Enjoy your evening at ${RESTAURANT_NAME}. If you need anything during your meal — menu questions, more drinks, or help with the bill — just ask. Bon appétit! 🥂`,
      chips: ['See the menu', 'Book another table'],
    }
  }

  // Default fallback
  return {
    content: `I'd love to help! As your ${RESTAURANT_NAME} concierge, I can assist with:\n\n🍽️ **Menu** — dishes, dietary info, recommendations\n📅 **Reservations** — check availability, book a table\n⏱️ **Orders** — track your meal, request changes\n📍 **Info** — hours, location, WiFi, pricing\n⭐ **Loyalty** — points balance, tier benefits\n\nWhat can I do for you?`,
    chips: ['Today\'s menu', 'Book a table', 'Track my order', 'Recommendations'],
  }
}

// ─── Quick suggestion chips by context ────────────────────────────
function getInitialChips(view: AppView): string[] {
  if (view === 'staff') return ['Check inventory', 'Order status', "Tonight's revenue", 'Who\'s on shift']
  if (view === 'customer') return ['See the menu', 'Book a table', 'My order status', 'Recommend something']
  return ['View menu', 'Book a table', 'Operating hours', 'Location & parking']
}

function getWelcome(view: AppView, userName?: string): Message {
  const name = userName ? userName.split(' ')[0] : null
  const isStaff = view === 'staff'
  return {
    id: 'welcome',
    role: 'bot',
    content: isStaff
      ? `Hi ${name || 'there'}! I'm your **operations assistant**. Ask me about inventory, orders, revenue, staff, or AI insights. I'm synced with tonight's live data.`
      : `Hello${name ? ` ${name}` : ''}! Welcome to **${RESTAURANT_NAME}**. I'm your dining concierge — here to help you choose dishes, book a table, or track your order. What can I do for you?`,
    time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
    chips: getInitialChips(view),
  }
}

// ─── Component ────────────────────────────────────────────────────
export default function AIChatBot({ view, userName }: AIChatBotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([getWelcome(view, userName)])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [hasOpened, setHasOpened] = useState(false)
  const [minimised, setMinimised] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isStaff = view === 'staff'

  useEffect(() => {
    if (open) {
      setUnread(0)
      setHasOpened(true)
      setMinimised(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing, open])

  // Proactive nudge after 8s
  useEffect(() => {
    if (hasOpened) return
    const t = setTimeout(() => {
      if (!open) setUnread(1)
    }, 8000)
    return () => clearTimeout(t)
  }, [hasOpened, open])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, time: now }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const delay = 600 + Math.random() * 900
    await new Promise(r => setTimeout(r, delay))

    const { content, chips } = getResponse(text, view, userName)
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content,
      time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      chips,
    }
    setTyping(false)
    setMessages(prev => [...prev, botMsg])
    if (!open) setUnread(u => u + 1)
  }, [view, userName, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleChip = (chip: string) => sendMessage(chip)

  const clearChat = () => setMessages([getWelcome(view, userName)])

  // Render markdown-lite: bold, newlines, bullets
  const renderContent = (text: string) => {
    const parts = text.split('\n').map((line, i) => {
      const boldParsed = line.split(/\*\*(.*?)\*\*/).map((seg, j) =>
        j % 2 === 1 ? <strong key={j} className="font-semibold">{seg}</strong> : seg
      )
      return (
        <p key={i} className={`${i > 0 ? 'mt-1' : ''} leading-relaxed`}>
          {boldParsed}
        </p>
      )
    })
    return parts
  }

  const accentBg = isStaff ? 'bg-ember' : 'bg-flame'
  const accentHover = isStaff ? 'hover:bg-ember-light' : 'hover:bg-espresso'
  const panelBg = isStaff ? 'bg-bark border-dusk' : 'bg-cream border-sand'
  const headerBg = isStaff ? 'bg-espresso border-b border-dusk' : 'bg-espresso border-b border-bark'
  const userBubble = 'bg-flame text-cream'
  const botBubble = isStaff ? 'bg-dusk text-cream border border-dusk/50' : 'bg-white text-espresso border border-sand shadow-sm'
  const chipStyle = isStaff
    ? 'bg-bark border border-ember/30 text-ember/80 hover:bg-ember/20 hover:text-ember'
    : 'bg-white border border-sand text-walnut hover:border-flame hover:text-flame shadow-sm'
  const inputBg = isStaff
    ? 'bg-dusk border-bark text-cream placeholder-cream/20 focus:border-ember'
    : 'bg-white border-sand text-espresso placeholder-walnut/40 focus:border-flame'
  const launcherBottom = view === 'customer' ? 'bottom-24' : 'bottom-5'
  const panelBottom = view === 'customer' ? 'bottom-28' : 'bottom-24'

  const chatWidget = (
    <>
      {/* Chat panel */}
      {open && !minimised && (
        <div className={`fixed ${panelBottom} right-4 sm:right-6 z-9999 w-[min(380px,calc(100vw-2rem))] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-float-up ${panelBg}`}
          style={{ maxHeight: 'min(600px, calc(100vh - 110px))' }}>

          {/* Header */}
          <div className={`flex items-center gap-3 px-5 py-4 ${headerBg}`}>
            <div className={`w-9 h-9 rounded-full ${accentBg} flex items-center justify-center text-cream text-sm shrink-0 relative`}>
              <span>◈</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-sage rounded-full border-2 border-espresso" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-cream font-semibold text-sm">{RESTAURANT_NAME} AI</p>
              <p className="text-cream/40 text-xs">{isStaff ? 'Operations Assistant' : 'Dining Concierge'} · Online</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="w-7 h-7 flex items-center justify-center text-cream/30 hover:text-cream/60 transition-colors rounded-lg hover:bg-white/5 text-xs"
              >↺</button>
              <button
                onClick={() => setMinimised(true)}
                title="Minimise"
                className="w-7 h-7 flex items-center justify-center text-cream/30 hover:text-cream/60 transition-colors rounded-lg hover:bg-white/5"
              >—</button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-cream/30 hover:text-cream/60 transition-colors rounded-lg hover:bg-white/5 text-lg leading-none"
              >×</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                {msg.role === 'bot' && (
                  <div className={`w-7 h-7 rounded-full ${accentBg} flex items-center justify-center text-cream text-xs shrink-0 mr-2 mt-0.5`}>◈</div>
                )}
                <div className="max-w-[82%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? `${userBubble} rounded-br-sm` : `${botBubble} rounded-bl-sm`}`}>
                    <div className="space-y-0.5">
                      {renderContent(msg.content)}
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'} ${isStaff ? 'text-cream/20' : 'text-walnut/30'}`}>
                    {msg.time}
                  </p>
                  {/* Chips */}
                  {msg.chips && msg.role === 'bot' && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.chips.map(chip => (
                        <button
                          key={chip}
                          onClick={() => handleChip(chip)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${chipStyle}`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-end gap-2 animate-fade-in">
                <div className={`w-7 h-7 rounded-full ${accentBg} flex items-center justify-center text-cream text-xs shrink-0`}>◈</div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${botBubble}`}>
                  <div className="flex gap-1 items-center h-4">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={`px-4 py-3 border-t ${isStaff ? 'border-dusk bg-bark' : 'border-sand bg-cream/80 backdrop-blur-sm'}`}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isStaff ? 'Ask about inventory, orders, revenue…' : 'Ask about the menu, book a table…'}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none transition-colors ${inputBg}`}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-cream transition-all shrink-0 ${accentBg} ${accentHover} disabled:opacity-40`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Minimised pill */}
      {open && minimised && (
        <button
          onClick={() => setMinimised(false)}
          className={`fixed ${panelBottom} right-4 sm:right-6 z-9999 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl animate-float-up ${accentBg} text-cream`}
        >
          <span className="text-sm">◈</span>
          <span className="text-sm font-medium">{RESTAURANT_NAME} AI</span>
          <span className="w-2 h-2 bg-sage rounded-full animate-pulse-soft" />
        </button>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed ${launcherBottom} right-4 sm:right-6 z-9999 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${accentBg} text-cream relative`}
        aria-label="Open AI Chat"
      >
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-crimson text-cream text-xs font-mono-data rounded-full flex items-center justify-center border-2 border-cream">
            {unread}
          </span>
        )}
        {/* Ripple ring when unread */}
        {!open && unread > 0 && <span className="chat-ripple absolute inset-0 rounded-full pointer-events-none" />}

        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="12" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
      </button>
    </>
  )

  return createPortal(chatWidget, document.body)
}
