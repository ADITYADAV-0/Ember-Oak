import { useEffect, useRef, useState } from 'react'
import { RESTAURANT_NAME } from '../mockData'
import { useScrollReveal, useCountUp, useParallax } from '../hooks/useScrollReveal'

interface LandingProps {
  onGetStarted: () => void
  onStaffLogin: () => void
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────
function Reveal({ children, direction = 'up', delay = 0, className = '' }: {
  children: React.ReactNode
  direction?: 'up' | 'left' | 'right' | 'scale'
  delay?: number
  className?: string
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal reveal--${direction} ${visible ? 'reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

// Stagger children on scroll
function Stagger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`stagger ${visible ? 'stagger--visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ─── Animated stat counter ────────────────────────────────────────
function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>()
  const count = useCountUp(value, 2000, visible)
  return (
    <div ref={ref} className="text-center reveal reveal--up" style={{ transitionDelay: '0ms' }}>
      <div className="font-display text-ember text-4xl mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-cream/50 text-sm font-medium">{label}</div>
    </div>
  )
}

const features = [
  { icon: '◈', title: 'Live Menu & Availability', description: 'Real-time dish availability updated from the kitchen. No more "sorry, we\'re out of that."' },
  { icon: '◷', title: 'Smart Reservations', description: 'AI-powered table assignment and waitlist management. Intelligent queue optimization for peak hours.' },
  { icon: '◎', title: 'Order Tracking', description: 'End-to-end visibility from order placement to delivery. Live kitchen status, no waving for the waiter.' },
  { icon: '▦', title: 'Operations Dashboard', description: 'Unified staff view for orders, tables, inventory, and billing. Everything in one place.' },
  { icon: '◈', title: 'Inventory Intelligence', description: 'Predictive restocking alerts and waste reduction insights. Know what to order before you run out.' },
  { icon: '◉', title: 'Revenue Analytics', description: 'Peak hours, popular dishes, staff performance. Data-driven decisions for every service.' },
]

const testimonials = [
  { quote: "Since implementing Ember & Oak's platform, our table turnover improved by 23% and guest satisfaction scores are at an all-time high.", author: 'Isabelle Roux', role: 'Owner, Maison Roux Sydney', avatar: 'IR' },
  { quote: "The AI demand forecasting alone saved us $3,200 in food waste last month. The kitchen staff love the live order board.", author: 'David Kim', role: 'Head Chef, Kiln Restaurant', avatar: 'DK' },
]

export default function Landing({ onGetStarted, onStaffLogin }: LandingProps) {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useParallax(0.25)
  const heroContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Hero text reveal on mount
  useEffect(() => {
    const el = heroContentRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.16,1,0.3,1)'
        el.style.opacity = '1'
        el.style.transform = 'none'
      }, 200)
    })
  }, [])

  return (
    <div className="min-h-screen bg-cream" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-light border-b border-sand shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xl transition-colors ${scrolled ? 'text-flame' : 'text-cream'}`}>◈</span>
            <span className={`font-display text-xl tracking-tight transition-colors ${scrolled ? 'text-espresso' : 'text-cream'}`}>{RESTAURANT_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How it works', 'Pricing'].map((item) => (
              <a key={item} href="#" className={`text-sm font-medium transition-colors hover:text-flame ${scrolled ? 'text-walnut' : 'text-cream/80'}`}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onStaffLogin}
              className={`hidden md:block text-sm font-medium transition-colors px-3 py-1.5 ${scrolled ? 'text-walnut hover:text-espresso' : 'text-cream/70 hover:text-cream'}`}
            >
              Staff Login
            </button>
            <button
              onClick={onGetStarted}
              className="text-sm font-semibold bg-flame text-cream px-4 py-2 rounded-full hover:bg-espresso transition-all hover:scale-105 active:scale-95"
            >
              Reserve a Table
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-screen min-h-[640px]">
        <div ref={heroRef} className="absolute inset-0 scale-110">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&h=1200&fit=crop&auto=format"
            alt="Ember & Oak restaurant interior with warm lighting"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/55 via-espresso/40 to-espresso/85" />

        {/* Floating availability badge */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
          <div
            className="inline-flex items-center gap-2 bg-ember/20 border border-ember/30 text-ember-light text-xs font-mono-data tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{ animation: 'floatUp 0.8s 0.6s cubic-bezier(0.34,1.2,0.64,1) both' }}
          >
            <span className="w-1.5 h-1.5 bg-ember rounded-full animate-pulse-soft inline-block" />
            Now serving — live table availability
          </div>
        </div>

        <div ref={heroContentRef} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-cream text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight max-w-4xl mb-6">
            Dining, <em>reimagined</em><br className="hidden md:block" /> from the inside out.
          </h1>
          <p className="text-cream/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            The complete restaurant platform — for guests who want transparency and teams who need efficiency.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{ animation: 'fadeUp 0.8s 0.6s ease both' }}
          >
            <button
              onClick={onGetStarted}
              className="bg-flame text-cream font-semibold px-8 py-4 rounded-full text-base hover:bg-ember transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Book Your Table
            </button>
            <button
              onClick={onStaffLogin}
              className="border border-cream/30 text-cream font-medium px-8 py-4 rounded-full text-base hover:border-cream/60 hover:bg-cream/10 transition-all"
            >
              Staff Dashboard →
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40"
          style={{ animation: 'fadeUp 1s 1.2s ease both' }}>
          <span className="text-xs tracking-widest uppercase font-mono-data">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-cream/30 to-transparent animate-pulse-soft" />
        </div>
      </section>

      {/* ── Stats banner ─────────────────────────────────────────── */}
      <section className="bg-espresso py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedStat value={340} label="Restaurants powered" suffix="+" />
          <AnimatedStat value={2100000} label="Orders processed" suffix="" />
          <AnimatedStat value={23} label="Avg. efficiency gain" suffix="%" />
          <AnimatedStat value={48} label="Guest satisfaction" suffix="★" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-28 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <Reveal direction="left">
              <div className="text-flame text-xs font-mono-data tracking-widest uppercase mb-4">Platform Features</div>
              <h2 className="font-display text-espresso text-4xl md:text-5xl leading-tight mb-4">
                Every problem in restaurant operations,<br />
                <em>solved in one platform.</em>
              </h2>
              <p className="text-walnut text-lg leading-relaxed">
                From the moment a guest discovers your restaurant to the moment they leave a review — every touchpoint, optimised.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-sand rounded-2xl overflow-hidden">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-cream p-8 hover:bg-parchment transition-all group cursor-default hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-3xl text-flame mb-4 group-hover:text-ember transition-colors group-hover:scale-110 transition-transform inline-block">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-espresso text-lg mb-2">{feature.title}</h3>
                <p className="text-walnut text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="py-28 bg-espresso px-6" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-ember text-xs font-mono-data tracking-widest uppercase mb-4">How It Works</div>
              <h2 className="font-display text-cream text-4xl md:text-5xl">Simple. Powerful. Fast.</h2>
            </div>
          </Reveal>

          <Stagger className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Guest discovers & books', desc: 'Browse live menu, check real-time availability, book a table or join the queue — all from their phone.' },
              { step: '02', title: 'Order flows to kitchen', desc: 'Digital orders hit the kitchen display instantly. Staff see status updates in real-time, no paper, no shouting.' },
              { step: '03', title: 'AI learns and improves', desc: 'Every service teaches the system. Demand forecasting, waste reduction, and staffing insights compound over time.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="font-mono-data text-7xl font-medium text-bark select-none mb-4">{step}</div>
                <div className="w-8 h-px bg-ember mb-4" />
                <h3 className="text-cream font-semibold text-xl mb-3">{title}</h3>
                <p className="text-cream/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Visual showcase ───────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          {/* For guests */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-28">
            <Reveal direction="left">
              <div>
                <div className="text-flame text-xs font-mono-data tracking-widest uppercase mb-4">For Guests</div>
                <h2 className="font-display text-espresso text-4xl md:text-5xl leading-tight mb-6">
                  The dining experience starts before you arrive.
                </h2>
                <p className="text-walnut text-lg leading-relaxed mb-8">
                  Browse the full menu with live availability, discover today's specials, book your table, and track your order in real-time.
                </p>
                <ul className="space-y-3">
                  {['Live menu with dietary filters', 'Instant table booking + queue join', 'Order tracking from kitchen to table', 'Personalised dish recommendations'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-walnut">
                      <span className="w-4 h-4 bg-flame rounded-full flex items-center justify-center text-cream text-xs flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-parchment">
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&auto=format"
                  alt="Guests enjoying a meal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />
                {/* Floating card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-cream/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 bg-sage rounded-full animate-pulse-soft" />
                      <span className="text-xs font-mono-data text-walnut uppercase tracking-wider">Order in kitchen</span>
                      <span className="ml-auto text-xs text-flame font-mono-data">~12 min</span>
                    </div>
                    <div className="flex gap-2">
                      {['Preparing', 'Quality check', 'On the way'].map((s, i) => (
                        <div key={s} className={`flex-1 py-1.5 rounded text-xs text-center font-medium transition-all ${i === 0 ? 'bg-flame text-cream' : 'bg-sand text-walnut'}`}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* For management */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal direction="left">
              <div className="order-2 lg:order-1 relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-espresso">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format"
                  alt="Restaurant kitchen operations"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-4 border border-ember/20 rounded-xl" />
                <div className="absolute top-8 left-8 right-8">
                  <div className="glass-dark border border-ember/20 rounded-xl p-4">
                    <div className="text-ember text-xs font-mono-data uppercase tracking-widest mb-3">AI Insight · High confidence</div>
                    <p className="text-cream/80 text-sm leading-relaxed">Saturday ribeye demand predicted +34%. Order 3 kg additional from Greenfields.</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-bark rounded-full h-1.5">
                        <div className="bg-ember h-1.5 rounded-full w-[89%] transition-all" />
                      </div>
                      <span className="text-ember text-xs font-mono-data">89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right">
              <div className="order-1 lg:order-2">
                <div className="text-flame text-xs font-mono-data tracking-widest uppercase mb-4">For Management</div>
                <h2 className="font-display text-espresso text-4xl md:text-5xl leading-tight mb-6">
                  Intelligence built into every decision.
                </h2>
                <p className="text-walnut text-lg leading-relaxed mb-8">
                  AI-powered demand forecasting, inventory prediction, and staffing insights — so you're never caught off guard.
                </p>
                <ul className="space-y-3">
                  {['Predictive stock alerts before you run out', 'Revenue analytics by dish, day, and season', 'Staff scheduling recommendations', 'Automated guest preference profiling'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-walnut">
                      <span className="w-4 h-4 bg-flame rounded-full flex items-center justify-center text-cream text-xs flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-24 bg-parchment px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-flame text-xs font-mono-data tracking-widest uppercase mb-4">Testimonials</div>
              <h2 className="font-display text-espresso text-4xl">Trusted by restaurateurs.</h2>
            </div>
          </Reveal>
          <Stagger className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-cream rounded-2xl p-8 shadow-sm border border-sand hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="text-flame text-3xl mb-4 font-display">"</div>
                <p className="text-espresso text-lg leading-relaxed mb-6 font-display italic">{t.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ember rounded-full flex items-center justify-center text-cream text-sm font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-espresso">{t.author}</div>
                    <div className="text-walnut text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Menu preview strip ────────────────────────────────────── */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="text-flame text-xs font-mono-data tracking-widest uppercase mb-3">On the Menu Tonight</div>
                <h2 className="font-display text-espresso text-4xl">A taste of what awaits.</h2>
              </div>
              <button onClick={onGetStarted} className="hidden md:block text-flame font-medium hover:text-espresso transition-colors text-sm">
                View full menu →
              </button>
            </div>
          </Reveal>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6">
            {[
              { name: 'Burrata & Heirloom Tomato', price: '$18', img: 'photo-1546069901-ba9599a7e63c', tag: 'Starter' },
              { name: 'Oak-Smoked Duck Breast', price: '$42', img: 'photo-1546039907-7fa05f864c02', tag: 'Popular' },
              { name: 'Dry-Aged Ribeye', price: '$58', img: 'photo-1558030006-450675393462', tag: '5.0 ★' },
              { name: 'Valrhona Fondant', price: '$14', img: 'photo-1488477181946-6428a0291777', tag: 'Dessert' },
              { name: 'Ember Old Fashioned', price: '$16', img: 'photo-1551538827-9c037cb4f32a', tag: 'Cocktail' },
              { name: 'Seared Scallops', price: '$24', img: 'photo-1559847844-5315695dadae', tag: 'Starter' },
            ].map(({ name, price, img, tag }, i) => (
              <div
                key={name}
                className="flex-shrink-0 w-52 rounded-2xl overflow-hidden bg-parchment border border-sand hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={onGetStarted}
              >
                <div className="relative h-40 bg-sand overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${img}?w=400&h=300&fit=crop&auto=format`}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-espresso/80 text-cream text-xs px-2 py-0.5 rounded-full font-mono-data">
                    {tag}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-espresso font-medium text-sm leading-tight mb-1">{name}</p>
                  <p className="text-flame font-mono-data font-medium">{price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden bg-espresso">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=800&fit=crop&auto=format"
            alt="Restaurant ambiance"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <Reveal direction="scale">
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="font-display text-cream text-5xl md:text-6xl leading-tight mb-6">
              Ready to transform your restaurant?
            </h2>
            <p className="text-cream/60 text-xl mb-10 leading-relaxed">
              Join 340+ restaurants already running on Ember & Oak. Setup takes under 30 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-flame text-cream font-semibold px-10 py-4 rounded-full text-base hover:bg-ember transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Start for Free
              </button>
              <button
                onClick={onStaffLogin}
                className="border border-cream/30 text-cream font-medium px-10 py-4 rounded-full text-base hover:bg-cream/10 transition-all"
              >
                View Staff Dashboard
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-espresso border-t border-bark py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-ember">◈</span>
                <span className="font-display text-cream">{RESTAURANT_NAME}</span>
              </div>
              <p className="text-cream/30 text-sm leading-relaxed">Farm-to-table dining, elevated by technology.</p>
            </div>
            {[
              { heading: 'Platform', links: ['Features', 'Analytics', 'Integrations', 'Pricing'] },
              { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { heading: 'Support', links: ['Documentation', 'Status', 'Contact', 'Privacy'] },
            ].map(col => (
              <div key={col.heading}>
                <p className="text-cream/50 text-xs uppercase tracking-widest font-mono-data mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-bark">
            <div className="text-cream/25 text-sm font-mono-data">© 2026 {RESTAURANT_NAME} · Platform v2.4</div>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Cookies'].map(link => (
                <a key={link} href="#" className="text-cream/25 text-xs hover:text-cream/50 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
