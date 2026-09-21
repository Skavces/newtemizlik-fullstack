'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ShieldOff, CheckCircle, User, Lock, Eye, EyeOff, ChevronRight, ArrowLeft } from 'lucide-react'
import {
  get2faSetup, confirm2faSetup, get2faStatus, remove2fa, changeCredentials, logout,
} from '@/lib/panelApi'
import { isApiError } from '@/lib/errors'
import type { TwoFaSetup, TwoFaStatus } from '@/types/api'

function SuccessMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(127,191,58,0.1)', color: 'var(--color-primary)' }}>
      <CheckCircle size={15} /> {msg}
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(231,76,60,0.08)', color: '#e74c3c' }}>{msg}</p>
}

// 429 (3/dk limit) için özel mesaj — renel'de bu ayrım yok, backend'in
// changeCredentials'a koyduğu sıkı throttle burada açıkça gösteriliyor.
function describeError(err: unknown, fallback: string): string {
  if (isApiError(err) && err.status === 429) return 'Çok fazla deneme yapıldı. Bir dakika bekleyip tekrar deneyin.'
  return err instanceof Error ? err.message : fallback
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  autoComplete: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg px-3 py-2.5 pr-10 text-sm outline-none"
        style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
      />
      <button type="button" onClick={() => setShow((v) => !v)} className="absolute top-1/2 right-3 -translate-y-1/2" style={{ color: 'var(--text-faint)' }} tabIndex={-1}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

type CredStep = 'select' | 'form' | '2fa'
type CredType = 'username' | 'password' | null

function HesapBilgileri({ twoFaEnabled, onDone }: { twoFaEnabled: boolean; onDone: () => void }) {
  const [step, setStep] = useState<CredStep>('select')
  const [type, setType] = useState<CredType>(null)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function reset() {
    setStep('select')
    setType(null)
    setNewUsername('')
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPassword('')
    setOtpCode('')
    setError('')
  }

  function handleSelect(t: CredType) {
    setType(t)
    setError('')
    setStep('form')
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (type === 'password') {
      if (newPassword !== confirmPassword) { setError('Yeni şifreler eşleşmiyor'); return }
      if (newPassword.length < 8) { setError('Şifre en az 8 karakter olmalıdır'); return }
    }
    if (twoFaEnabled) setStep('2fa')
    else doChange()
  }

  async function doChange(code?: string) {
    setError('')
    setLoading(true)
    try {
      await changeCredentials({
        currentPassword,
        newUsername: type === 'username' ? newUsername : undefined,
        newPassword: type === 'password' ? newPassword : undefined,
        totpCode: code,
      })
      onDone()
    } catch (err) {
      setError(describeError(err, 'Değişiklik başarısız oldu.'))
      if (twoFaEnabled) setStep('2fa')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpSubmit(e: FormEvent) {
    e.preventDefault()
    if (otpCode.length !== 6) return
    doChange(otpCode)
  }

  if (step === 'select') {
    return (
      <div className="space-y-3">
        <button
          onClick={() => handleSelect('username')}
          className="flex w-full items-center justify-between rounded-xl px-5 py-4"
          style={{ background: 'var(--bg-alt)' }}
        >
          <div className="flex items-center gap-3">
            <User size={18} style={{ color: 'var(--color-primary)' }} />
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Kullanıcı Adı</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Giriş için kullandığınız ad</p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-faint)' }} />
        </button>

        <button
          onClick={() => handleSelect('password')}
          className="flex w-full items-center justify-between rounded-xl px-5 py-4"
          style={{ background: 'var(--bg-alt)' }}
        >
          <div className="flex items-center gap-3">
            <Lock size={18} style={{ color: 'var(--color-primary)' }} />
            <div className="text-left">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Şifre</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Hesap giriş şifreniz</p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-faint)' }} />
        </button>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <button type="button" onClick={reset} className="mb-1 flex items-center gap-1 text-sm" style={{ color: 'var(--text-faint)' }}>
          <ArrowLeft size={14} /> Geri
        </button>

        <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {type === 'username' ? 'Kullanıcı Adını Değiştir' : 'Şifreyi Değiştir'}
        </p>

        {type === 'username' && (
          <div>
            <label className="mb-1 block text-xs" style={{ color: 'var(--text-muted)' }}>Yeni Kullanıcı Adı</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="yeni_kullanici"
              minLength={3}
              maxLength={50}
              pattern="[a-zA-Z0-9_-]+"
              autoComplete="off"
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
            />
          </div>
        )}

        {type === 'password' && (
          <>
            <div>
              <label className="mb-1 block text-xs" style={{ color: 'var(--text-muted)' }}>Yeni Şifre</label>
              <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="En az 8 karakter" autoComplete="new-password" />
            </div>
            <div>
              <label className="mb-1 block text-xs" style={{ color: 'var(--text-muted)' }}>Yeni Şifre (Tekrar)</label>
              <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Şifreyi tekrar girin" autoComplete="new-password" />
            </div>
          </>
        )}

        <div>
          <label className="mb-1 block text-xs" style={{ color: 'var(--text-muted)' }}>Mevcut Şifre</label>
          <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mevcut şifreniz" autoComplete="current-password" />
        </div>

        {error && <ErrorMsg msg={error} />}

        <button type="submit" className="w-full rounded-lg py-2.5 text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>
          {twoFaEnabled ? 'Devam Et' : 'Değiştir'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleOtpSubmit} className="space-y-5">
      <button type="button" onClick={() => { setStep('form'); setOtpCode(''); setError('') }} className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-faint)' }}>
        <ArrowLeft size={14} /> Geri
      </button>

      <div className="py-2 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'rgba(127,191,58,0.1)' }}>
          <ShieldCheck size={26} style={{ color: 'var(--color-primary)' }} />
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>İki Faktörlü Doğrulama</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>Değişikliği onaylamak için authenticator kodunu girin</p>
      </div>

      <input
        type="text"
        inputMode="numeric"
        pattern="\d{6}"
        maxLength={6}
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
        placeholder="000000"
        required
        autoFocus
        className="w-full rounded-lg py-3 text-center font-mono text-2xl outline-none"
        style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)', letterSpacing: '0.5em' }}
      />

      {error && <ErrorMsg msg={error} />}

      <button
        type="submit"
        disabled={loading || otpCode.length !== 6}
        className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
        style={{ background: 'var(--color-primary)' }}
      >
        {loading ? 'Doğrulanıyor...' : 'Onayla ve Değiştir'}
      </button>
    </form>
  )
}

export default function GuvenlikPage() {
  const router = useRouter()
  const [twoFaStatus, setTwoFaStatus] = useState<TwoFaStatus | null>(null)
  const [setup, setSetup] = useState<TwoFaSetup | null>(null)
  const [tfaCode, setTfaCode] = useState('')
  const [tfaError, setTfaError] = useState('')
  const [tfaSuccess, setTfaSuccess] = useState('')
  const [tfaLoading, setTfaLoading] = useState(false)
  const [credSuccess, setCredSuccess] = useState('')
  const [removeMode, setRemoveMode] = useState(false)
  const [removeCode, setRemoveCode] = useState('')
  const [removePassword, setRemovePassword] = useState('')

  useEffect(() => {
    get2faStatus().then(setTwoFaStatus)
  }, [])

  function handleCredentialDone() {
    setCredSuccess('Bilgiler değiştirildi. Tekrar giriş yapın...')
    setTimeout(() => {
      logout().finally(() => router.push('/nt-panel/giris'))
    }, 2000)
  }

  async function startSetup() {
    setTfaError('')
    setTfaLoading(true)
    try {
      setSetup(await get2faSetup())
    } catch {
      setTfaError('QR kodu üretilemedi.')
    } finally {
      setTfaLoading(false)
    }
  }

  async function handleConfirm2FA(e: FormEvent) {
    e.preventDefault()
    if (!setup) return
    setTfaError('')
    setTfaLoading(true)
    try {
      await confirm2faSetup({ secret: setup.secret, code: tfaCode })
      setTfaSuccess('2FA başarıyla etkinleştirildi!')
      setSetup(null)
      setTfaCode('')
      setTwoFaStatus({ enabled: true })
    } catch (err) {
      setTfaError(describeError(err, 'Kod doğrulanamadı.'))
      setTfaCode('')
    } finally {
      setTfaLoading(false)
    }
  }

  async function handleRemove2FA(e: FormEvent) {
    e.preventDefault()
    setTfaLoading(true)
    setTfaError('')
    try {
      await remove2fa({ code: removeCode, currentPassword: removePassword })
      setTwoFaStatus({ enabled: false })
      setSetup(null)
      setRemoveMode(false)
      setRemoveCode('')
      setRemovePassword('')
      setTfaSuccess('2FA devre dışı bırakıldı.')
    } catch (err) {
      setTfaError(describeError(err, '2FA kaldırılamadı.'))
      setRemoveCode('')
    } finally {
      setTfaLoading(false)
    }
  }

  if (!twoFaStatus) {
    return <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>Yükleniyor...</div>
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Güvenlik</h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>Hesap ve giriş ayarlarınızı yönetin</p>
      </div>

      {credSuccess && <SuccessMsg msg={credSuccess} />}

      <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Hesap Bilgilerini Değiştir</p>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--text-faint)' }}>
            {twoFaStatus.enabled ? 'Değişiklikler 2FA kodu ile onaylanır' : 'Mevcut şifre doğrulaması gereklidir'}
          </p>
        </div>
        <div className="px-6 py-5">
          <HesapBilgileri twoFaEnabled={twoFaStatus.enabled} onDone={handleCredentialDone} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>İki Faktörlü Doğrulama</p>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-faint)' }}>Authenticator uygulamasıyla hesabınızı koruyun</p>
          </div>
          {twoFaStatus.enabled ? (
            <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ color: 'var(--color-primary)', background: 'rgba(127,191,58,0.1)' }}>Aktif</span>
          ) : (
            <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ color: 'var(--text-muted)', background: 'var(--bg-alt)' }}>Devre Dışı</span>
          )}
        </div>

        <div className="space-y-4 px-6 py-5">
          {tfaSuccess && <SuccessMsg msg={tfaSuccess} />}

          <div className="flex items-center gap-3">
            {twoFaStatus.enabled ? (
              <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
            ) : (
              <ShieldOff size={20} style={{ color: 'var(--text-faint)' }} />
            )}
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {twoFaStatus.enabled ? 'Giriş yaparken 6 haneli kod gerekiyor' : 'Hesabınız ek koruma olmadan açık'}
            </p>
          </div>

          {!setup && !removeMode && (
            twoFaStatus.enabled ? (
              <button onClick={() => { setRemoveMode(true); setTfaError('') }} disabled={tfaLoading} className="text-sm font-medium disabled:opacity-40" style={{ color: '#e74c3c' }}>
                Devre Dışı Bırak
              </button>
            ) : (
              <button
                onClick={startSetup}
                disabled={tfaLoading}
                className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                style={{ background: 'var(--color-primary)' }}
              >
                {tfaLoading ? 'Yükleniyor...' : "2FA'yı Etkinleştir"}
              </button>
            )
          )}

          {removeMode && (
            <form onSubmit={handleRemove2FA} className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Devre dışı bırakmak için şifrenizi ve authenticator kodunuzu girin
              </p>
              <input
                type="password"
                autoComplete="current-password"
                required
                autoFocus
                value={removePassword}
                onChange={(e) => setRemovePassword(e.target.value)}
                placeholder="Mevcut şifreniz"
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)' }}
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={removeCode}
                onChange={(e) => setRemoveCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                className="w-full rounded-lg px-3 py-2.5 text-center font-mono text-xl outline-none"
                style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)', letterSpacing: '0.5em' }}
              />
              {tfaError && <ErrorMsg msg={tfaError} />}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setRemoveMode(false); setRemoveCode(''); setRemovePassword(''); setTfaError('') }}
                  className="flex-1 rounded-lg py-2.5 text-sm"
                  style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={tfaLoading || removeCode.length !== 6 || !removePassword}
                  className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                  style={{ background: '#e74c3c' }}
                >
                  {tfaLoading ? 'Kaldırılıyor...' : 'Devre Dışı Bırak'}
                </button>
              </div>
            </form>
          )}

          {setup && (
            <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>1. QR kodu tarayın</p>
                <p className="mb-3 text-xs" style={{ color: 'var(--text-faint)' }}>Google Authenticator veya Authy kullanın</p>
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data: URI (base64 QR code), next/image can't optimize it */}
                  <img src={setup.qrCodeUrl} alt="QR Code" className="h-44 w-44 rounded-xl" style={{ border: '1px solid var(--border-subtle)' }} />
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs" style={{ color: 'var(--text-muted)' }}>Manuel giriş kodu</p>
                <p className="rounded-lg px-3 py-2 text-center font-mono text-sm tracking-widest select-all" style={{ background: 'var(--bg-alt)', color: 'var(--text-secondary)' }}>
                  {setup.secret}
                </p>
              </div>
              <form onSubmit={handleConfirm2FA} className="space-y-3">
                <div>
                  <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>2. Kodu doğrulayın</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={tfaCode}
                    onChange={(e) => setTfaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    required
                    autoFocus
                    className="w-full rounded-lg py-2.5 text-center font-mono text-xl outline-none"
                    style={{ border: '1.5px solid var(--border-subtle)', background: 'var(--bg-body)', color: 'var(--text-primary)', letterSpacing: '0.5em' }}
                  />
                </div>
                {tfaError && <ErrorMsg msg={tfaError} />}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setSetup(null); setTfaError(''); setTfaCode('') }}
                    className="flex-1 rounded-lg py-2.5 text-sm"
                    style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={tfaLoading || tfaCode.length !== 6}
                    className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {tfaLoading ? 'Doğrulanıyor...' : 'Onayla'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tfaError && !setup && !removeMode && <ErrorMsg msg={tfaError} />}
        </div>
      </div>
    </div>
  )
}
