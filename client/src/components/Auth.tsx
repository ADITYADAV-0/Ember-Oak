import { GoogleLogin } from "@react-oauth/google";
import { useState, useRef, useEffect } from 'react'
import { RESTAURANT_NAME } from '../mockData'
import type { User, AuthMode } from '../types'
import { authApi } from '../services/api'

interface AuthProps {
  onSuccess: (user: User, role: 'customer' | 'staff') => void
  onBack: () => void
  initialMode?: AuthMode
}

type AuthStep = 'form' | 'otp' | 'success'

const MOCK_OTP = '847291'

export default function Auth({ onSuccess, onBack, initialMode = 'login' }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [step, setStep] = useState<AuthStep>('form')
  const [isStaff, setIsStaff] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    if (mode === 'register' && !name) { setError('Please enter your name.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep('otp')
    setCountdown(30)
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    const user: User = {
      id: 'g001',
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      role: isStaff ? 'waiter' : 'customer',
      loyaltyPoints: isStaff ? 0 : 680,
      joinDate: '2026-11-15',
      avatar: 'AR',
    }
    onSuccess(user, isStaff ? 'staff' : 'customer')
  }

  const handleOtpChange = (index: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 1)
    const next = [...otp]
    next[index] = v
    setOtp(next)
    if (v && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const entered = otp.join('')
    if (entered.length < 6) { setError('Please enter the 6-digit code.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    if (entered !== MOCK_OTP) {
      setError(`Invalid code. (Hint: use ${MOCK_OTP})`)
      return
    }
    setStep('success')
    await new Promise(r => setTimeout(r, 800))
    const user: User = {
      id: isStaff ? 'm001' : 'u001',
      name: name || (isStaff ? 'Marcus Chen' : 'Priya Sharma'),
      email: email || (isStaff ? 'marcus@emberandoak.com' : 'priya@example.com'),
      role: isStaff ? 'manager' : 'customer',
      loyaltyPoints: isStaff ? 0 : 1240,
      joinDate: '2023-08-15',
      avatar: name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : (isStaff ? 'MC' : 'PS'),
    }
    onSuccess(user, isStaff ? 'staff' : 'customer')
  }

  const prefillHint = (type: 'customer' | 'staff') => {
    if (type === 'customer') {
      setEmail('priya@example.com')
      setPassword('password123')
      setName('Priya Sharma')
      setIsStaff(false)
    } else {
      setEmail('marcus@emberandoak.com')
      setPassword('staffpass')
      setName('Marcus Chen')
      setIsStaff(true)
    }
  }

  return (
    <div className="min-h-screen bg-espresso flex" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Left panel - visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=1200&fit=crop&auto=format"
          alt="Ember & Oak interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <button onClick={onBack} className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors w-fit">
            <span>←</span>
            <span className="text-sm">Back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-ember text-2xl">◈</span>
              <span className="font-display text-cream text-2xl">{RESTAURANT_NAME}</span>
            </div>
            <blockquote className="font-display text-cream text-3xl leading-tight italic mb-4">
              "Great service is not about speed. It's about making every moment feel effortless."
            </blockquote>
            <cite className="text-cream/50 text-sm not-italic">— Isabelle Fontaine, Head Chef</cite>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['MC', 'IF', 'AO', 'RP'].map(init => (
                <div key={init} className="w-8 h-8 bg-ember rounded-full border-2 border-espresso flex items-center justify-center text-xs text-cream font-medium">
                  {init}
                </div>
              ))}
            </div>
            <span className="text-cream/50 text-sm">8 staff currently on duty</span>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile back */}
          <button onClick={onBack} className="lg:hidden flex items-center gap-2 text-cream/40 hover:text-cream/70 transition-colors mb-8 text-sm">
            ← Back to home
          </button>

          {step === 'form' && (
            <div className="animate-fade-in">
              {/* Role toggle */}
              <div className="flex gap-1 bg-bark p-1 rounded-xl mb-8">
                <button
                  onClick={() => setIsStaff(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isStaff ? 'bg-flame text-cream shadow' : 'text-cream/40 hover:text-cream/70'}`}
                >
                  Guest Login
                </button>
                <button
                  onClick={() => setIsStaff(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isStaff ? 'bg-ember text-cream shadow' : 'text-cream/40 hover:text-cream/70'}`}
                >
                  Staff Login
                </button>
              </div>

              <h1 className="font-display text-cream text-3xl mb-2">
                {mode === 'login' ? 'Welcome back.' : 'Create account.'}
              </h1>
              <p className="text-cream/40 text-sm mb-8">
                {mode === 'login'
                  ? `Sign in to your ${isStaff ? 'staff' : 'guest'} account.`
                  : 'Join Ember & Oak and start earning rewards.'}
              </p>

              {/* Quick fill hints */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => prefillHint('customer')}
                  className="text-xs bg-bark text-ember/70 hover:text-ember border border-ember/20 px-3 py-1.5 rounded-lg transition-colors font-mono-data"
                >
                  Demo: Guest
                </button>
                <button
                  onClick={() => prefillHint('staff')}
                  className="text-xs bg-bark text-ember/70 hover:text-ember border border-ember/20 px-3 py-1.5 rounded-lg transition-colors font-mono-data"
                >
                  Demo: Staff
                </button>
              </div>

              {/* Google OAuth */}
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    if (credentialResponse.credential) {
                      setLoading(true);
                      const res = await authApi.googleLogin(credentialResponse.credential, isStaff);
                      setLoading(false);
                      onSuccess(res.user, isStaff ? 'staff' : 'customer');
                    } else {
                      handleGoogleAuth();
                    }
                  } catch (err: any) {
                    setLoading(false);
                    // Fallback to client mock google auth if backend offline
                    handleGoogleAuth();
                  }
                }}
                onError={() => {
                  console.log("Google Login Failed");
                  handleGoogleAuth();
                }}
              />

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-bark" />
                <span className="text-cream/30 text-xs uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-bark" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-cream/50 text-xs mb-1.5 uppercase tracking-wider font-mono-data">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-bark border border-dusk text-cream placeholder-cream/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-ember transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-cream/50 text-xs mb-1.5 uppercase tracking-wider font-mono-data">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-bark border border-dusk text-cream placeholder-cream/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-ember transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-cream/50 text-xs mb-1.5 uppercase tracking-wider font-mono-data">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bark border border-dusk text-cream placeholder-cream/20 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-ember transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-crimson/20 border border-crimson/30 text-cream/70 text-sm px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-flame text-cream font-semibold py-3 rounded-xl text-sm hover:bg-ember transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin-slow" />
                      Sending OTP…
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <p className="text-center text-cream/30 text-sm mt-6">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                  className="text-ember hover:text-ember-light transition-colors"
                >
                  {mode === 'login' ? 'Register' : 'Sign in'}
                </button>
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div className="animate-fade-in">
              <div className="w-14 h-14 bg-bark border border-ember/30 rounded-2xl flex items-center justify-center text-2xl text-ember mb-6">
                ✉
              </div>
              <h2 className="font-display text-cream text-3xl mb-2">Check your email.</h2>
              <p className="text-cream/40 text-sm mb-2">
                We sent a 6-digit code to <span className="text-cream/70">{email}</span>
              </p>
              <p className="text-ember/60 text-xs font-mono-data mb-8">Demo hint: use code {MOCK_OTP}</p>

              <div className="flex gap-3 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    maxLength={1}
                    className="w-12 h-14 bg-bark border border-dusk text-cream text-center text-xl font-mono-data rounded-xl focus:outline-none focus:border-ember transition-colors"
                  />
                ))}
              </div>

              {error && (
                <div className="bg-crimson/20 border border-crimson/30 text-cream/70 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-flame text-cream font-semibold py-3 rounded-xl text-sm hover:bg-ember transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin-slow" />
                    Verifying…
                  </>
                ) : 'Verify & Continue'}
              </button>

              <div className="text-center">
                {countdown > 0 ? (
                  <span className="text-cream/30 text-sm">Resend in {countdown}s</span>
                ) : (
                  <button
                    onClick={() => { setCountdown(30); setError('') }}
                    className="text-ember text-sm hover:text-ember-light transition-colors"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '']); setError('') }}
                className="mt-4 text-cream/30 text-sm hover:text-cream/50 transition-colors w-full text-center">
                ← Use a different email
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="animate-fade-in text-center">
              <div className="w-16 h-16 bg-sage/20 border border-sage/40 rounded-full flex items-center justify-center text-3xl text-sage mx-auto mb-6">
                ✓
              </div>
              <h2 className="font-display text-cream text-3xl mb-2">Verified!</h2>
              <p className="text-cream/40">Taking you in…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
