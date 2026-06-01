import { useState } from 'react'
import { Brain, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) setError(error.message)
      } else {
        const { error } = await signUp(email, password)
        if (error) setError(error.message)
        else { setSuccess('Hesap oluşturuldu. Giriş yapabilirsiniz.'); setMode('login') }
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 flex-shrink-0 bg-white border-r border-[#e8e8e8] p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-[#111]">InterviewPrep</span>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-[#111] leading-snug">
              Mülakata hazırlan,<br />
              <span className="text-emerald-600">kendine güven.</span>
            </h2>
            <p className="mt-3 text-sm text-[#888] leading-relaxed">
              Spaced repetition ile sorularını sistematik biçimde çalış.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Konuları ve soruları düzenle' },
              { label: 'Aralıklı tekrar ile ezber yap' },
              { label: 'İlerlemeyi takip et' },
              { label: 'Mülakat cevaplarını prova et' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                <p className="text-sm text-[#555]">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#ccc]">© 2025 InterviewPrep</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[340px] space-y-5 animate-fade-up">
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-4">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Brain size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-[#111]">InterviewPrep</span>
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#111]">
              {mode === 'login' ? 'Giriş yap' : 'Hesap oluştur'}
            </h1>
            <p className="text-sm text-[#888] mt-0.5">
              {mode === 'login' ? 'Çalışmaya devam et.' : 'Ücretsiz başla.'}
            </p>
          </div>

          <form onSubmit={handle} className="space-y-3.5">
            <Input
              type="email" label="E-posta" placeholder="ad@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              icon={<Mail size={14} />} required autoComplete="email"
            />
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'} label="Şifre"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                icon={<Lock size={14} />} required minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                hint={mode === 'register' ? 'En az 6 karakter' : undefined}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 bottom-2.5 text-[#aaa] hover:text-[#555] transition-colors">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-xs text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 text-xs text-emerald-700">
                {success}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#888]">
            {mode === 'login' ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
