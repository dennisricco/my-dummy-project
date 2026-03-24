'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Camera, X, Sun, Moon, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import {
  toggleMode,
  validateEmail,
  validatePasswordMin,
  validatePasswordMatch,
  validateRequired,
  type Mode,
} from './validation';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
};

const avatarPopVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 20 },
  },
};

// ─── InputField ───────────────────────────────────────────────────────────────

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  icon: Icon,
  rightSlot,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  rightSlot?: React.ReactNode;
  placeholder?: string;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium auth-label pl-1">
        {label}
      </label>
      <div className="relative flex items-center">
        <motion.div
          className="absolute left-4 pointer-events-none z-10"
          animate={{
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? 'var(--accent-primary)' : undefined,
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={18} className="auth-icon" />
        </motion.div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="auth-input w-full pl-12 pr-12 py-3.5 rounded-xl text-base outline-none"
        />
        {rightSlot && (
          <div className="absolute right-4 flex items-center z-10">{rightSlot}</div>
        )}
      </div>
      {error && (
        <motion.p
          id={`${id}-error`}
          className="auth-input-error"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

// ─── PasswordField ────────────────────────────────────────────────────────────

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <InputField
      id={id}
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      icon={Lock}
      placeholder={placeholder}
      error={error}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="auth-icon hover:opacity-80 transition-opacity p-1 -mr-1"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}

// ─── AvatarUpload ─────────────────────────────────────────────────────────────

function AvatarUpload({
  preview,
  onSelect,
  onRemove,
}: {
  preview: string | null;
  onSelect: (url: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onSelect(URL.createObjectURL(file));
    },
    [onSelect]
  );

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 py-1">
      <div className="relative">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              variants={avatarPopVariants}
              initial="hidden"
              animate="visible"
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-(--accent-primary) shadow-lg"
              />
              <button
                type="button"
                onClick={onRemove}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                aria-label="Remove photo"
              >
                <X size={11} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="placeholder"
              type="button"
              onClick={() => inputRef.current?.click()}
              variants={avatarPopVariants}
              initial="hidden"
              animate="visible"
              exit={{ scale: 0.5, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full auth-avatar-placeholder flex flex-col items-center justify-center gap-1.5 cursor-pointer"
              aria-label="Upload profile photo"
            >
              <User size={22} className="auth-icon" />
              <Camera size={12} className="auth-icon opacity-60" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs auth-link"
        >
          Change photo
        </button>
      ) : (
        <span className="text-xs auth-muted">Set Photo (Optional)</span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        aria-hidden="true"
      />
    </motion.div>
  );
}

// ─── GoogleLoginButton ────────────────────────────────────────────────────────

function GoogleLoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      variants={itemVariants}
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="auth-google-btn"
      aria-label="Continue with Google"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span className="font-medium">Continue with Google</span>
    </motion.button>
  );
}

// ─── EmailDivider ─────────────────────────────────────────────────────────────

function EmailDivider() {
  return (
    <motion.div variants={itemVariants} className="auth-email-divider">
      <span>Or continue with email address</span>
    </motion.div>
  );
}

// ─── CTAButton ────────────────────────────────────────────────────────────────

function CTAButton({
  label,
  loading,
  disabled,
}: {
  label: string;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <motion.button
      variants={itemVariants}
      type="submit"
      disabled={disabled || loading}
      whileHover={!loading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      className="auth-btn-primary w-full py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={18} aria-hidden="true" />
        </motion.div>
      )}
      <span>
        {loading
          ? label === 'Sign In'
            ? 'Signing in…'
            : 'Creating account…'
          : label}
      </span>
    </motion.button>
  );
}

// ─── AuthToggleLink ───────────────────────────────────────────────────────────

function AuthToggleLink({
  mode,
  onToggle,
}: {
  mode: Mode;
  onToggle: () => void;
}) {
  return (
    <p className="text-xs md:text-sm auth-muted text-right">
      {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
      <button
        type="button"
        onClick={onToggle}
        className="auth-link font-semibold"
      >
        {mode === 'login' ? 'Sign up' : 'Sign in'}
      </button>
    </p>
  );
}

// ─── ThemeToggle ──────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useChatStore();
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="auth-theme-toggle w-9 h-9 flex items-center justify-center rounded-full"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <Moon size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <Sun size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────

function LoginForm({ onSubmit }: { onSubmit: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email) ?? validateRequired(email);
    const passwordErr = validateRequired(password);
    const newErrors = { email: emailErr ?? undefined, password: passwordErr ?? undefined };
    setErrors(newErrors);
    if (emailErr || passwordErr) return;
    setLoading(true);
    onSubmit();
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-md px-2"
      noValidate
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-semibold auth-heading">Sign in</h1>
        <p className="text-sm auth-muted mt-1.5">Welcome back</p>
      </motion.div>

      <GoogleLoginButton />
      <EmailDivider />

      <div className="flex flex-col gap-4">
        <InputField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
          placeholder="••••••••"
          error={errors.password}
        />
      </div>

      <CTAButton label="Sign In" loading={loading} />
    </motion.form>
  );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────

function RegisterForm({ onSubmit }: { onSubmit: () => void }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usernameErr = validateRequired(username);
    const emailErr = validateEmail(email) ?? validateRequired(email);
    const passwordErr = validatePasswordMin(password) ?? validateRequired(password);
    const confirmErr = validatePasswordMatch(password, confirm) ?? validateRequired(confirm);
    const newErrors = {
      username: usernameErr ?? undefined,
      email: emailErr ?? undefined,
      password: passwordErr ?? undefined,
      confirm: confirmErr ?? undefined,
    };
    setErrors(newErrors);
    if (usernameErr || emailErr || passwordErr || confirmErr) return;
    setLoading(true);
    onSubmit();
  };

  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full max-w-md px-2"
      noValidate
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-semibold auth-heading">Create account</h1>
        <p className="text-sm auth-muted mt-1.5">Join us today</p>
      </motion.div>

      <GoogleLoginButton />
      <EmailDivider />

      <AvatarUpload
        preview={avatar}
        onSelect={setAvatar}
        onRemove={() => setAvatar(null)}
      />

      <div className="flex flex-col gap-4">
        <InputField
          id="reg-username"
          label="Username"
          type="text"
          value={username}
          onChange={(v) => { setUsername(v); setErrors((e) => ({ ...e, username: undefined })); }}
          icon={User}
          placeholder="yourname"
          error={errors.username}
        />
        <InputField
          id="reg-email"
          label="Email"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <PasswordField
          id="reg-password"
          label="Password"
          value={password}
          onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
          placeholder="••••••••"
          error={errors.password}
        />
        <PasswordField
          id="reg-confirm"
          label="Confirm Password"
          value={confirm}
          onChange={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: undefined })); }}
          placeholder="••••••••"
          error={errors.confirm}
        />
      </div>

      <CTAButton label="Create Account" loading={loading} />
    </motion.form>
  );
}

// ─── IllustrationCard ─────────────────────────────────────────────────────────

function IllustrationCard() {
  return (
    <div className="auth-illustration-card" aria-hidden="true">
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="110" cy="110" r="80" fill="rgba(14,165,233,0.08)" />
        <circle cx="110" cy="110" r="55" fill="rgba(14,165,233,0.12)" />
        <circle cx="110" cy="110" r="30" fill="rgba(14,165,233,0.18)" />
        <rect x="70" y="70" width="80" height="80" rx="16" fill="rgba(14,165,233,0.15)" transform="rotate(15 110 110)" />
        <rect x="82" y="82" width="56" height="56" rx="12" fill="rgba(14,165,233,0.2)" transform="rotate(30 110 110)" />
        <circle cx="110" cy="110" r="12" fill="rgba(14,165,233,0.5)" />
        <circle cx="60" cy="75" r="8" fill="rgba(14,165,233,0.25)" />
        <circle cx="160" cy="145" r="6" fill="rgba(14,165,233,0.2)" />
        <circle cx="155" cy="65" r="10" fill="rgba(99,102,241,0.2)" />
        <circle cx="65" cy="150" r="7" fill="rgba(99,102,241,0.15)" />
      </svg>
    </div>
  );
}

// ─── LeftPanel ────────────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <motion.div
      className="auth-left-panel"
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
    >
      <IllustrationCard />
      <div className="text-center px-4">
        <p className="text-xl md:text-2xl font-bold auth-heading">ChatApp</p>
        <p className="text-sm md:text-base auth-muted mt-1">Connect, chat, and collaborate.</p>
      </div>
    </motion.div>
  );
}

// ─── SuccessOverlay ───────────────────────────────────────────────────────────

function SuccessOverlay() {
  return (
    <motion.div
      key="success"
      className="fixed inset-0 flex items-center justify-center auth-success-bg z-50"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      data-testid="success-overlay"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full auth-success-icon flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold auth-heading">You&apos;re in</p>
          <p className="text-sm auth-muted mt-1">Redirecting to dashboard…</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── LoginPage ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [submitted, setSubmitted] = useState(false);
  const { setIsAuthenticated, isAuthenticated } = useChatStore();

  // Detect mobile (< 768px) for conditional LeftPanel render
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const handleSubmit = () => setSubmitted(true);

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      setIsAuthenticated(true);
      router.push('/');
    }, 1200);
    return () => clearTimeout(timer);
  }, [submitted, router, setIsAuthenticated]);

  const handleToggle = () => setMode((m) => toggleMode(m));

  return (
    <AnimatePresence>
      {submitted ? (
        <SuccessOverlay key="success" />
      ) : (
        <motion.div
          key="auth"
          className="auth-page-scroll"
          style={{ background: 'var(--bg-primary)' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.3 }}
        >
          {/* SplitLayout */}
          <motion.div
            className="auth-split-layout w-full"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            {/* LeftPanel — conditional render on desktop only */}
            {!isMobile && <LeftPanel />}

            {/* RightPanel */}
            <div className="auth-right-panel">
              {/* Header row */}
              <div className="absolute top-4 right-4 flex items-center gap-2 md:gap-3 flex-wrap justify-end max-w-full px-2">
                <AuthToggleLink mode={mode} onToggle={handleToggle} />
                <ThemeToggle />
              </div>

              {/* Form area with slide animation */}
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="w-full flex justify-center"
                  >
                    <LoginForm onSubmit={handleSubmit} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="w-full flex justify-center"
                  >
                    <RegisterForm onSubmit={handleSubmit} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
