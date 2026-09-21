'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { login, verify2fa } from '@/lib/panelApi'
import { isApiError } from '@/lib/errors'

const REMEMBER_KEY = 'nt-panel-remember-user'

type Step = 'credentials' | '2fa'

export default function GirisPage() {
  const [step, setStep] = useState<Step>('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [preAuthToken, setPreAuthToken] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)

  const otpInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsername(saved)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemember(true)
    }
  }, [])

  useEffect(() => {
    if (step === '2fa') otpInputRef.current?.focus()
  }, [step])

  function handleRateLimit() {
    setRateLimited(true)
    setError('Çok fazla başarısız deneme. 1 dakika bekleyip tekrar deneyin.')
    setTimeout(() => {
      setRateLimited(false)
      setError('')
    }, 60000)
  }

  function persistRememberedUser() {
    if (remember) window.localStorage.setItem(REMEMBER_KEY, username)
    else window.localStorage.removeItem(REMEMBER_KEY)
  }

  async function handleCredentials(e: FormEvent) {
    e.preventDefault()
    if (rateLimited) return
    setError('')
    setLoading(true)
    try {
      const data = await login({ username, password, rememberMe: remember })
      if ('requires2fa' in data && data.requires2fa) {
        setPreAuthToken(data.preAuthToken)
        setStep('2fa')
      } else {
        persistRememberedUser()
        window.location.href = '/nt-panel'
      }
    } catch (err) {
      if (isApiError(err) && err.status === 429) handleRateLimit()
      else setError('Kullanıcı adı veya şifre hatalı.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify2fa(e: FormEvent) {
    e.preventDefault()
    if (rateLimited) return
    setError('')
    setLoading(true)
    try {
      await verify2fa({ preAuthToken, code: otpCode })
      persistRememberedUser()
      window.location.href = '/nt-panel'
    } catch (err) {
      if (isApiError(err) && err.status === 429) handleRateLimit()
      else {
        setError('Geçersiz kod. Tekrar deneyin.')
        setOtpCode('')
        otpInputRef.current?.focus()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--bg-alt)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-lg"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="mb-8 flex flex-col items-center">
          <Image src="/logo.png" alt="New Temizlik" width={1080} height={1015} className="h-16 w-auto object-contain" />
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Yönetim Paneli
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm outline-none"
                  style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Beni hatırla
              </span>
            </label>

            {error && (
              <p className="rounded-lg px-3 py-2 text-sm" style={{ color: '#e74c3c', background: 'rgba(231,76,60,0.08)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || rateLimited}
              className="w-full rounded-lg py-2.5 font-bold text-white transition-opacity disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}
            >
              {loading ? 'Giriş yapılıyor...' : rateLimited ? 'Lütfen bekleyin...' : 'Giriş Yap'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2fa} className="space-y-4">
            <div className="mb-2 flex flex-col items-center text-center">
              <div className="mb-3 rounded-full p-3" style={{ background: 'rgba(127,191,58,0.1)' }}>
                <ShieldCheck size={24} style={{ color: 'var(--color-primary)' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                İki Faktörlü Doğrulama
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>
                Authenticator uygulamanızdaki 6 haneli kodu girin
              </p>
            </div>

            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full rounded-lg py-3 text-center font-mono text-2xl outline-none"
              style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)', letterSpacing: '0.5em' }}
              required
            />

            {error && (
              <p className="rounded-lg px-3 py-2 text-sm" style={{ color: '#e74c3c', background: 'rgba(231,76,60,0.08)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || rateLimited || otpCode.length !== 6}
              className="w-full rounded-lg py-2.5 font-bold text-white transition-opacity disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}
            >
              {loading ? 'Doğrulanıyor...' : rateLimited ? 'Lütfen bekleyin...' : 'Doğrula'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('credentials')
                setError('')
                setOtpCode('')
              }}
              className="w-full text-sm"
              style={{ color: 'var(--text-faint)' }}
            >
              ← Geri dön
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
