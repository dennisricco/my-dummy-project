# Implementation Plan: Login & Register Redesign

## Overview

Refactor `app/login/page.tsx` dari single-card layout menjadi split-screen layout dua kolom. Tambahkan CSS classes baru di `app/globals.css`. Ekstrak fungsi validasi ke modul terpisah agar dapat diuji secara independen. Tambahkan inline validation, Google login button, EmailDivider, dan SuccessOverlay sesuai design.

## Tasks

- [x] 1. Ekstrak fungsi validasi ke modul terpisah
  - Buat file `app/login/validation.ts` yang mengekspor `toggleMode`, `validateEmail`, `validatePasswordMin`, `validatePasswordMatch`, dan `validateRequired`
  - Implementasikan sesuai `VALIDATION` rules di design document
  - Ekspor juga tipe `Mode = 'login' | 'register'`
  - _Requirements: 7.6, 7.7, 7.8, 7.9, 3.4_

  - [x] 1.1 Write property test untuk toggleMode (Property 1)
    - **Property 1: toggleMode(toggleMode(m)) === m untuk setiap mode**
    - **Validates: Requirements 3.4**
    - Buat `__tests__/login-validation.property.test.ts`
    - Tag komentar: `// Feature: login-register-redesign, Property 1`
    - `numRuns: 100`

  - [x] 1.2 Write property test untuk validateEmail (Property 2 & 3)
    - **Property 2: validateEmail mengembalikan non-null untuk string tanpa "@"**
    - **Property 3: validateEmail mengembalikan null untuk email valid (fc.emailAddress())**
    - **Validates: Requirements 7.7**
    - Tag komentar: `// Feature: login-register-redesign, Property 2` dan `Property 3`
    - `numRuns: 100`

  - [x] 1.3 Write property test untuk validatePasswordMin (Property 4)
    - **Property 4: validatePasswordMin mengembalikan non-null untuk string dengan length < 8**
    - **Validates: Requirements 7.8**
    - Tag komentar: `// Feature: login-register-redesign, Property 4`
    - `numRuns: 100`

  - [x] 1.4 Write property test untuk validatePasswordMatch (Property 5)
    - **Property 5: validatePasswordMatch(a, b) === null jika dan hanya jika a === b**
    - **Validates: Requirements 7.9**
    - Tag komentar: `// Feature: login-register-redesign, Property 5`
    - `numRuns: 100`

  - [x] 1.5 Write property test untuk validateRequired (Property 6)
    - **Property 6: validateRequired mengembalikan non-null untuk string whitespace-only**
    - **Validates: Requirements 7.6**
    - Tag komentar: `// Feature: login-register-redesign, Property 6`
    - `numRuns: 100`

- [x] 2. Tambahkan CSS classes split-screen ke globals.css
  - Tambahkan class `auth-split-layout`, `auth-left-panel`, `auth-right-panel`, `auth-illustration-card`, `auth-google-btn`, `auth-email-divider`, `auth-input-error` ke `app/globals.css`
  - Tambahkan dark mode overrides via `[data-theme="dark"]` untuk semua class baru
  - Background LeftPanel: `#f0ede8` (light) dan override gelap untuk dark mode
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 9.5_

- [x] 3. Refactor LoginPage ke SplitLayout dengan LeftPanel dan RightPanel
  - Modifikasi `app/login/page.tsx`: ganti wrapper `.auth-page-bg.auth-page-scroll` dengan `SplitLayout` (`auth-split-layout`)
  - Implementasikan `LeftPanel` (conditional render hanya jika `!isMobile`, gunakan `useMediaQuery` atau `window.innerWidth >= 768`)
  - `LeftPanel` berisi `IllustrationCard` (SVG dekoratif geometris/abstract) dan teks branding (nama app + tagline)
  - `LeftPanel` mount dengan animasi fade-in dari kiri, delay 150ms setelah RightPanel
  - `RightPanel` selalu dirender, berisi header row (ThemeToggle + AuthToggleLink) dan form area
  - Pindahkan `ThemeToggle` dari `fixed top-4 right-4` ke dalam header row RightPanel
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 10.2, 10.4_

- [x] 4. Implementasikan AuthToggleLink di header RightPanel
  - Buat komponen `AuthToggleLink` dengan props `mode` dan `onToggle`
  - Teks berubah sesuai mode: login → "Don't have an account? Sign up", register → "Already have an account? Sign in"
  - Tempatkan di pojok kanan atas RightPanel dalam header row bersama ThemeToggle
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5. Refactor InputField dengan dukungan error dan update LoginForm/RegisterForm
  - Update `InputField` di `page.tsx`: tambahkan prop `error?: string` dan render `<p className="auth-input-error">` di bawah input jika error ada
  - Update `LoginForm`: import fungsi validasi dari `validation.ts`, jalankan validasi on-submit, tampilkan error inline, tambahkan `GoogleLoginButton` dan `EmailDivider` di atas input fields
  - Update `RegisterForm`: sama seperti LoginForm, validasi semua field (required, email, passwordMin, passwordMatch)
  - Judul/subtitle sesuai requirements: LoginForm → "Sign in" / "Welcome back", RegisterForm → "Create account" / "Join us today"
  - CTAButton menampilkan loading state (spinner + teks berubah) dan `disabled` saat `loading=true`
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 5.1 Write unit tests untuk LoginForm dan RegisterForm
    - Test render LoginForm: semua elemen hadir (email input, password input, Google button, divider, CTA)
    - Test render RegisterForm: semua elemen hadir (username, email, password, confirm, Google button)
    - Test submit LoginForm dengan field kosong → error ditampilkan, tidak ada navigasi
    - Test submit RegisterForm dengan password mismatch → error "Passwords do not match"
    - Buat `__tests__/LoginRegisterForms.test.tsx`
    - _Requirements: 7.6, 7.7, 7.8, 7.9, 8.4_

  - [x] 5.2 Write property test untuk label htmlFor (Property 7)
    - **Property 7: setiap input yang dirender LoginForm/RegisterForm memiliki label dengan htmlFor yang cocok**
    - **Validates: Requirements 9.2**
    - Tag komentar: `// Feature: login-register-redesign, Property 7`
    - Iterasi semua input dalam render output dan verifikasi kehadiran label yang sesuai

- [x] 6. Checkpoint — Pastikan semua tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementasikan SuccessOverlay dan wiring final
  - Pastikan `SuccessOverlay` (sudah ada sebagai inline JSX) tetap berfungsi setelah refactor ke SplitLayout
  - Verifikasi alur: submit valid → `submitted = true` → SuccessOverlay fade-in → 1200ms → `setIsAuthenticated(true)` + `router.push('/')`
  - Verifikasi `useEffect` redirect jika sudah `isAuthenticated` tetap berjalan
  - Pastikan animasi slide horizontal `AnimatePresence` antar mode tetap berfungsi di dalam RightPanel
  - _Requirements: 8.4, 8.5, 10.1, 10.2, 10.3_

  - [x] 7.1 Write unit test untuk SuccessOverlay dan mobile layout
    - Test `SuccessOverlay` muncul setelah submit valid
    - Test `LeftPanel` tidak dirender pada viewport < 768px (mock `window.innerWidth`)
    - _Requirements: 1.4, 2.4, 8.4_

- [x] 8. Final checkpoint — Pastikan semua tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Fungsi validasi diekstrak ke `app/login/validation.ts` agar dapat diuji secara independen tanpa render komponen
- Property tests menggunakan `fast-check` dengan minimum 100 iterasi per property
- Unit tests menggunakan Vitest + Testing Library (sudah terkonfigurasi di project)
