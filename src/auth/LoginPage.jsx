import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Lock,
  Mail,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Shield
} from 'lucide-react'
import { loginSuccess } from '../redux/features/auth/authSlice'
import { joinUserRoom } from '../services/authSocket'
import api from '../services/api'

// ─── Forgot Password Modal ─────────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  // Steps: "email" → "otp" → "reset" → "success"
  const [step, setStep] = useState('email')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef([])

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // Auto-focus first OTP box when entering otp step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }, [step])

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  const handleOtpPaste = e => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (!pasted) return
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(next)
    const lastIdx = Math.min(pasted.length, 5)
    otpRefs.current[lastIdx]?.focus()
    e.preventDefault()
  }

  // Step 1 – Send OTP
  const handleSendOtp = async e => {
    e.preventDefault()
    if (!email.trim()) return toast.error('Please enter your email')
    setLoading(true)
    try {
      await api.post('/admin/forget-password', { email: email.trim() })
      toast.success('OTP sent! Check your inbox.')
      setStep('otp')
      setCountdown(60)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return
    setLoading(true)
    try {
      await api.post('/admin/forget-password', { email: email.trim() })
      toast.success('New OTP sent!')
      setOtp(['', '', '', '', '', ''])
      setCountdown(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 – Verify OTP
  const handleVerifyOtp = async e => {
    e.preventDefault()
    const otpStr = otp.join('')
    if (otpStr.length < 6)
      return toast.error('Please enter the complete 6-digit OTP')
    setLoading(true)
    try {
      const res = await api.post('/admin/verify-reset-otp', {
        email,
        otp: otpStr
      })
      setResetToken(res.data.data.resetToken)
      toast.success('OTP verified successfully!')
      setStep('reset')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP')
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } finally {
      setLoading(false)
    }
  }

  // Step 3 – Reset Password
  const handleResetPassword = async e => {
    e.preventDefault()
    if (!newPassword || !confirmPassword)
      return toast.error('Please fill in all fields')
    if (newPassword !== confirmPassword)
      return toast.error('Passwords do not match')
    if (newPassword.length < 8)
      return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      await api.post('/admin/reset-password', {
        email,
        resetToken,
        password: newPassword,
        confirmPassword
      })
      toast.success('Password reset successfully!')
      setStep('success')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const stepMeta = [
    { label: 'Email', done: step !== 'email' },
    { label: 'OTP', done: step === 'reset' || step === 'success' },
    { label: 'Reset', done: step === 'success' }
  ]

  return (
    <div
      className='fp-overlay'
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className='fp-modal'>
        {/* Close button */}
        <button className='fp-close' onClick={onClose} aria-label='Close'>
          ×
        </button>

        {/* Step indicators */}
        {step !== 'success' && (
          <div className='fp-steps'>
            {stepMeta.map((s, i) => (
              <div
                key={i}
                className={`fp-step ${s.done ? 'done' : ''} ${
                  stepMeta.indexOf(
                    stepMeta.find(
                      (_, idx) =>
                        idx === i &&
                        !s.done &&
                        (i === 0
                          ? step === 'email'
                          : i === 1
                          ? step === 'otp'
                          : step === 'reset')
                    ) !== -1
                  )
                    ? ''
                    : ''
                }`}
              >
                <div
                  className={`fp-step-circle ${
                    s.done
                      ? 'fp-step-done'
                      : step === (i === 0 ? 'email' : i === 1 ? 'otp' : 'reset')
                      ? 'fp-step-active'
                      : ''
                  }`}
                >
                  {s.done ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
                </div>
                <span className='fp-step-label'>{s.label}</span>
                {i < 2 && (
                  <div
                    className={`fp-step-line ${
                      s.done ? 'fp-step-line-done' : ''
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Step: Email ─────────────────────────────────── */}
        {step === 'email' && (
          <form className='fp-form' onSubmit={handleSendOtp}>
            <div className='fp-icon-wrap fp-icon-blue'>
              <Mail size={28} />
            </div>
            <h2 className='fp-title'>Forgot Password?</h2>
            <p className='fp-subtitle'>
              Enter your admin email and we'll send you a 6-digit OTP to reset
              your password.
            </p>

            <div className='fp-field'>
              <label className='fp-label'>Admin Email</label>
              <div className='fp-input-wrap'>
                <Mail size={17} className='fp-input-icon' />
                <input
                  type='email'
                  className='fp-input'
                  placeholder='admin@company.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type='submit' className='fp-btn-primary' disabled={loading}>
              {loading ? <span className='fp-spinner' /> : 'Send OTP'}
            </button>

            <button type='button' className='fp-btn-ghost' onClick={onClose}>
              <ArrowLeft size={16} /> Back to Login
            </button>
          </form>
        )}

        {/* ── Step: OTP ───────────────────────────────────── */}
        {step === 'otp' && (
          <form className='fp-form' onSubmit={handleVerifyOtp}>
            <div className='fp-icon-wrap fp-icon-amber'>
              <KeyRound size={28} />
            </div>
            <h2 className='fp-title'>Enter OTP</h2>
            <p className='fp-subtitle'>
              We sent a 6-digit code to{' '}
              <strong className='fp-email-highlight'>{email}</strong>. It
              expires in 10 minutes.
            </p>

            <div className='fp-otp-row' onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => (otpRefs.current[i] = el)}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  className={`fp-otp-box ${digit ? 'fp-otp-filled' : ''}`}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <button
              type='submit'
              className='fp-btn-primary'
              disabled={loading || otp.join('').length < 6}
            >
              {loading ? <span className='fp-spinner' /> : 'Verify OTP'}
            </button>

            <div className='fp-resend-row'>
              <span className='fp-resend-text'>Didn't receive it?</span>
              <button
                type='button'
                className={`fp-resend-btn ${
                  countdown > 0 ? 'fp-resend-disabled' : ''
                }`}
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
              >
                <RefreshCw size={13} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <button
              type='button'
              className='fp-btn-ghost'
              onClick={() => setStep('email')}
            >
              <ArrowLeft size={16} /> Change Email
            </button>
          </form>
        )}

        {/* ── Step: Reset Password ────────────────────────── */}
        {step === 'reset' && (
          <form className='fp-form' onSubmit={handleResetPassword}>
            <div className='fp-icon-wrap fp-icon-green'>
              <Shield size={28} />
            </div>
            <h2 className='fp-title'>Set New Password</h2>
            <p className='fp-subtitle'>
              Create a strong new password for your admin account.
            </p>

            <div className='fp-field'>
              <label className='fp-label'>New Password</label>
              <div className='fp-input-wrap'>
                <Lock size={17} className='fp-input-icon' />
                <input
                  type={showNew ? 'text' : 'password'}
                  className='fp-input fp-input-pr'
                  placeholder='Min. 8 characters'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button
                  type='button'
                  className='fp-eye-btn'
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && (
                <div className='fp-strength-bar'>
                  <div
                    className={`fp-strength-fill fp-strength-${
                      newPassword.length < 8
                        ? 'weak'
                        : newPassword.length < 12
                        ? 'medium'
                        : 'strong'
                    }`}
                  />
                </div>
              )}
            </div>

            <div className='fp-field'>
              <label className='fp-label'>Confirm Password</label>
              <div className='fp-input-wrap'>
                <Lock size={17} className='fp-input-icon' />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`fp-input fp-input-pr ${
                    confirmPassword && newPassword !== confirmPassword
                      ? 'fp-input-error'
                      : ''
                  }`}
                  placeholder='Re-enter password'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  className='fp-eye-btn'
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <span className='fp-error-msg'>Passwords do not match</span>
              )}
            </div>

            <button type='submit' className='fp-btn-primary' disabled={loading}>
              {loading ? <span className='fp-spinner' /> : 'Reset Password'}
            </button>
          </form>
        )}

        {/* ── Step: Success ───────────────────────────────── */}
        {step === 'success' && (
          <div className='fp-form fp-success'>
            <div className='fp-success-icon'>
              <CheckCircle2 size={48} />
            </div>
            <h2 className='fp-title'>Password Reset!</h2>
            <p className='fp-subtitle'>
              Your admin password has been updated successfully. You can now
              sign in with your new password.
            </p>
            <button className='fp-btn-primary' onClick={onClose}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Login Page ───────────────────────────────────────────────────────────
const Login = () => {
  const [roleMode, setRoleMode] = useState('employee')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rehydrated = useSelector(state => state._persist?.rehydrated)
  const { isAuthenticated, role } = useSelector(state => state.auth)

  useEffect(() => {
    if (rehydrated && isAuthenticated) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/bde/dashboard')
    }
  }, [rehydrated, isAuthenticated, role, navigate])

  const onSubmit = async data => {
    setIsLoading(true)
    try {
      const endpoint = roleMode === 'admin' ? '/admin/login' : '/employee/login'
      const payload =
        roleMode === 'admin'
          ? { email: data.email, password: data.password }
          : { officialEmail: data.email, password: data.password }

      const response = await api.post(endpoint, payload)

      if (response.data.success) {
        if (
          roleMode === 'employee' &&
          response.data.data.department !== 'Business Development Executive'
        ) {
          toast.error(
            'Access restricted to Business Development Executives only'
          )
          return
        }

        dispatch(loginSuccess({ user: response.data.data, role: roleMode }))
        joinUserRoom(response.data.data._id)
        toast.success(
          `Welcome back, ${
            response.data.data.firstName || response.data.data.name
          }!`
        )
        navigate(roleMode === 'admin' ? '/admin/dashboard' : '/bde/dashboard')
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Login failed. Please check your credentials.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════════════════════════════
           LOGIN PAGE STYLES
        ═══════════════════════════════════════════════════════════════════ */
        .login-page {
          min-height: 100vh;
          background: #f1f5f4;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(145deg, #18181b, #09090b);
          border: 1px solid #27272a;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04);
          overflow: hidden;
        }

        /* Header */
        .login-header {
          padding: 2.25rem 2rem 1.5rem;
          text-align: center;
          background: linear-gradient(180deg, rgba(16,74,23,0.15) 0%, transparent 100%);
          border-bottom: 1px solid #27272a;
        }
        .login-icon-ring {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(47,124,57,0.12);
          border: 1.5px solid rgba(47,124,57,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: #4ade80;
        }
        .login-title { margin: 0 0 0.35rem; color: #fff; font-size: 1.35rem; font-weight: 700; }
        .login-subtitle { margin: 0; color: #71717a; font-size: 0.825rem; }

        /* Role toggles */
        .role-toggles {
          display: flex;
          gap: 0.5rem;
          padding: 1.25rem 1.75rem 0;
        }
        .role-btn {
          flex: 1;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #27272a;
          background: #27272a;
          color: #a1a1aa;
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }
        .role-btn:hover { border-color: #3f3f46; color: #e4e4e7; }
        .role-btn.active {
          background: linear-gradient(135deg, #104a17, #2f7c39);
          border-color: #2f7c39;
          color: #fff;
          box-shadow: 0 4px 14px rgba(47,124,57,0.3);
        }

        /* Form */
        .login-form { padding: 1.5rem 1.75rem 2rem; display: flex; flex-direction: column; gap: 1.1rem; }
        .form-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-label { color: #a1a1aa; font-size: 0.8rem; font-weight: 500; }
        .form-input-wrap { position: relative; }
        .form-input-icon {
          position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%);
          color: #52525b; pointer-events: none;
        }
        .form-input {
          width: 100%; box-sizing: border-box;
          padding: 0.7rem 0.875rem 0.7rem 2.5rem;
          background: #27272a; border: 1.5px solid #3f3f46; border-radius: 10px;
          color: #f4f4f5; font-size: 0.875rem; font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .form-input::placeholder { color: #52525b; }
        .form-input:focus { border-color: #2f7c39; box-shadow: 0 0 0 3px rgba(47,124,57,0.18); }
        .form-input.pr { padding-right: 2.75rem; }
        .form-eye-btn {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #52525b; padding: 0.2rem;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .form-eye-btn:hover { color: #a1a1aa; }
        .form-error { color: #f87171; font-size: 0.75rem; }

        /* Forgot password link */
        .forgot-link {
          align-self: flex-end; margin-top: -0.4rem;
          background: none; border: none; cursor: pointer;
          color: #4ade80; font-size: 0.775rem; font-family: inherit;
          padding: 0; text-decoration: none; transition: color 0.2s;
        }
        .forgot-link:hover { color: #86efac; text-decoration: underline; }

        /* Submit button */
        .login-btn {
          width: 100%; padding: 0.8rem; border: none; border-radius: 10px;
          background: linear-gradient(135deg, #104a17, #2f7c39);
          color: #fff; font-size: 0.9rem; font-weight: 600; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(47,124,57,0.35); margin-top: 0.25rem;
        }
        .login-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(47,124,57,0.45); }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,0.2); border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ═══════════════════════════════════════════════════════════════════
           FORGOT PASSWORD MODAL STYLES
        ═══════════════════════════════════════════════════════════════════ */
        .fp-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
          animation: fp-fade-in 0.2s ease;
        }
        @keyframes fp-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .fp-modal {
          width: 100%; max-width: 420px;
          background: linear-gradient(160deg, #1c1c1e, #111113);
          border: 1px solid #2d2d30; border-radius: 20px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          padding: 2rem; position: relative;
          animation: fp-slide-up 0.25s ease;
        }
        @keyframes fp-slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .fp-close {
          position: absolute; top: 1rem; right: 1rem;
          width: 30px; height: 30px; border-radius: 50%;
          background: #27272a; border: 1px solid #3f3f46; color: #a1a1aa;
          font-size: 1.1rem; line-height: 1; cursor: pointer; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s;
        }
        .fp-close:hover { background: #3f3f46; color: #fff; }

        /* Steps indicator */
        .fp-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin-bottom: 1.75rem;
        }
        .fp-step { display: flex; align-items: center; gap: 0; }
        .fp-step-circle {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid #3f3f46; color: #52525b; font-size: 0.75rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        .fp-step-active { border-color: #2f7c39; color: #4ade80; background: rgba(47,124,57,0.12); }
        .fp-step-done { border-color: #2f7c39; background: #2f7c39; color: #fff; }
        .fp-step-label { font-size: 0.7rem; color: #71717a; margin: 0 0.5rem; white-space: nowrap; }
        .fp-step-line { width: 28px; height: 2px; background: #27272a; border-radius: 1px; }
        .fp-step-line-done { background: #2f7c39; }

        /* Form layout */
        .fp-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .fp-icon-wrap {
          width: 56px; height: 56px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.5rem;
        }
        .fp-icon-blue { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
        .fp-icon-amber { background: rgba(245,158,11,0.12); color: #fbbf24; border: 1px solid rgba(245,158,11,0.25); }
        .fp-icon-green { background: rgba(47,124,57,0.12); color: #4ade80; border: 1px solid rgba(47,124,57,0.3); }

        .fp-title { margin: 0 0 0.3rem; color: #fff; font-size: 1.2rem; font-weight: 700; text-align: center; }
        .fp-subtitle { margin: 0; color: #71717a; font-size: 0.825rem; text-align: center; line-height: 1.55; }
        .fp-email-highlight { color: #a1a1aa; font-style: normal; }

        .fp-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .fp-label { color: #a1a1aa; font-size: 0.8rem; font-weight: 500; }
        .fp-input-wrap { position: relative; }
        .fp-input-icon {
          position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%);
          color: #52525b; pointer-events: none;
        }
        .fp-input {
          width: 100%; box-sizing: border-box;
          padding: 0.7rem 0.875rem 0.7rem 2.5rem;
          background: #27272a; border: 1.5px solid #3f3f46; border-radius: 10px;
          color: #f4f4f5; font-size: 0.875rem; font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
        }
        .fp-input::placeholder { color: #52525b; }
        .fp-input:focus { border-color: #2f7c39; box-shadow: 0 0 0 3px rgba(47,124,57,0.18); }
        .fp-input-pr { padding-right: 2.75rem; }
        .fp-input-error { border-color: #ef4444 !important; }
        .fp-eye-btn {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #52525b;
          display: flex; align-items: center; transition: color 0.2s;
        }
        .fp-eye-btn:hover { color: #a1a1aa; }
        .fp-error-msg { color: #f87171; font-size: 0.75rem; }

        /* Password strength bar */
        .fp-strength-bar {
          height: 3px; background: #27272a; border-radius: 2px; margin-top: 0.4rem; overflow: hidden;
        }
        .fp-strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
        .fp-strength-weak { width: 33%; background: #ef4444; }
        .fp-strength-medium { width: 66%; background: #f59e0b; }
        .fp-strength-strong { width: 100%; background: #22c55e; }

        /* OTP row */
        .fp-otp-row {
          display: flex; gap: 0.5rem; justify-content: center;
        }
        .fp-otp-box {
          width: 48px; height: 54px; text-align: center;
          background: #27272a; border: 1.5px solid #3f3f46; border-radius: 10px;
          color: #f4f4f5; font-size: 1.3rem; font-weight: 700; font-family: inherit;
          outline: none; transition: all 0.2s; caret-color: #4ade80;
        }
        .fp-otp-box:focus { border-color: #2f7c39; box-shadow: 0 0 0 3px rgba(47,124,57,0.2); background: #1e2a1f; }
        .fp-otp-filled { border-color: #2f7c39; color: #4ade80; }

        /* Resend row */
        .fp-resend-row { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .fp-resend-text { color: #71717a; font-size: 0.8rem; }
        .fp-resend-btn {
          background: none; border: none; cursor: pointer; color: #4ade80; font-size: 0.8rem;
          font-family: inherit; display: flex; align-items: center; gap: 0.3rem; padding: 0;
          transition: color 0.2s; font-weight: 500;
        }
        .fp-resend-btn:hover:not(.fp-resend-disabled) { color: #86efac; }
        .fp-resend-disabled { color: #52525b !important; cursor: not-allowed; }

        /* Buttons */
        .fp-btn-primary {
          width: 100%; padding: 0.8rem; border: none; border-radius: 10px;
          background: linear-gradient(135deg, #104a17, #2f7c39);
          color: #fff; font-size: 0.9rem; font-weight: 600; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 18px rgba(47,124,57,0.3); margin-top: 0.25rem;
        }
        .fp-btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .fp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .fp-btn-ghost {
          width: 100%; padding: 0.65rem; border: 1.5px solid #3f3f46; border-radius: 10px;
          background: transparent; color: #71717a; font-size: 0.825rem; font-weight: 500;
          font-family: inherit; cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 0.4rem; transition: all 0.2s;
        }
        .fp-btn-ghost:hover { border-color: #52525b; color: #a1a1aa; background: #27272a; }
        .fp-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2.5px solid rgba(255,255,255,0.25); border-top-color: #fff;
          animation: spin 0.7s linear infinite; display: inline-block;
        }

        /* Success state */
        .fp-success { align-items: center; text-align: center; }
        .fp-success-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(34,197,94,0.12); border: 2px solid rgba(34,197,94,0.3);
          color: #4ade80; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.5rem; animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes pop-in { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* Responsive */
        @media (max-width: 480px) {
          .fp-otp-box { width: 40px; height: 46px; font-size: 1.1rem; }
          .fp-modal { padding: 1.5rem; }
        }
      `}</style>

      <div className='login-page'>
        <div className='login-card'>
          {/* Header */}
          <div className='login-header'>
            <div className='login-icon-ring'>
              <ShieldCheck size={28} />
            </div>
            <h1 className='login-title'>CRM Portal Login</h1>
            <p className='login-subtitle'>
              Sign in to manage your leads and pipeline
            </p>
          </div>

          {/* Role Toggles */}
          <div className='role-toggles'>
            <button
              type='button'
              className={`role-btn ${roleMode === 'employee' ? 'active' : ''}`}
              onClick={() => setRoleMode('employee')}
            >
              <Users size={15} />
              Employee
            </button>
            <button
              type='button'
              className={`role-btn ${roleMode === 'admin' ? 'active' : ''}`}
              onClick={() => setRoleMode('admin')}
            >
              <Lock size={15} />
              Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
            {/* Email */}
            <div className='form-field'>
              <label className='form-label'>
                {roleMode === 'admin' ? 'Admin Email' : 'Official Email'}
              </label>
              <div className='form-input-wrap'>
                <Mail size={16} className='form-input-icon' />
                <input
                  type='email'
                  {...register('email', { required: 'Email is required' })}
                  className='form-input'
                  placeholder={
                    roleMode === 'admin'
                      ? 'admin@company.com'
                      : 'employee@company.com'
                  }
                />
              </div>
              {errors.email && (
                <span className='form-error'>{errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className='form-field'>
              <label className='form-label'>Password</label>
              <div className='form-input-wrap'>
                <Lock size={16} className='form-input-icon' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  className='form-input pr'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  className='form-eye-btn'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className='form-error'>{errors.password.message}</span>
              )}
            </div>

            {/* Forgot password – Admin only */}
            {roleMode === 'admin' && (
              <button
                type='button'
                className='forgot-link'
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            )}

            <button type='submit' className='login-btn' disabled={isLoading}>
              {isLoading ? <span className='btn-spinner' /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </>
  )
}

export default Login
// 