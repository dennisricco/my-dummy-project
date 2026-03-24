# Implementation Plan: UI Enhancement

## Overview

Serangkaian perbaikan UI/UX pada komponen yang sudah ada — visual hierarchy, kepadatan konten, reduksi animasi, date separator, empty state, custom tooltip, dan perbaikan theming. Semua perubahan bersifat lokalisasi per file tanpa perubahan arsitektur.

## Tasks

- [x] 1. Perbaikan CSS custom properties di globals.css
  - [x] 1.1 Update nilai `--text-muted` dark mode dari `#7dd3fc` menjadi `#94a3b8`
    - Ganti di blok `:root` di `app/globals.css`
    - _Requirements: 8.1, 8.2_
  - [x] 1.2 Rewrite blok `[data-theme="light"]` dengan warna terang yang benar
    - `--bg-primary`: `#f8fafc`, `--bg-secondary`: `#f1f5f9`, `--text-primary`: `#0f172a`, `--text-muted`: `#64748b`, dan semua variabel lain sesuai design doc
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 8.3_
  - [x] 1.3 Unit test: verifikasi nilai CSS custom properties
    - Test `--text-muted` dark mode bukan `#7dd3fc`
    - Test `--bg-primary` light mode memiliki lightness ≥ 90%
    - Test `--text-primary` light mode adalah warna gelap
    - _Requirements: 7.1, 7.2, 8.2_

- [x] 2. ThemeToggle icon Sun/Moon di NavBar
  - [x] 2.1 Ganti ikon `Settings` dengan `Sun`/`Moon` kondisional berdasarkan `theme` state
    - Import `Sun` dan `Moon` dari lucide-react, hapus import `Settings`
    - Render `<Sun>` saat `theme === 'dark'`, `<Moon>` saat `theme === 'light'`
    - Tambahkan `data-testid="icon-sun"` dan `data-testid="icon-moon"` pada masing-masing ikon
    - _Requirements: 7.4_
  - [x] 2.2 Write property test untuk ThemeToggle icon (Property 7)
    - **Property 7: ThemeToggle menampilkan ikon yang sesuai state**
    - **Validates: Requirements 7.4**

- [x] 3. Custom tooltip pada NavBar
  - [x] 3.1 Implementasi tooltip custom dengan Framer Motion per nav item
    - Tambahkan state `hoveredItem: string | null` di komponen NavBar
    - Hapus atribut `title` native dari semua nav items dan ThemeToggle button
    - Render `<AnimatePresence>` + tooltip `<motion.div>` dengan `initial={{ opacity: 0, x: -8 }}`, `animate={{ opacity: 1, x: 0 }}`, `transition={{ duration: 0.15 }}`
    - Tooltip diposisikan absolut di sisi kanan ikon, styling glass-panel (backdrop-blur, border tipis, bg semi-transparan)
    - Gunakan `onMouseEnter`/`onMouseLeave` untuk kontrol hover state
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 3.2 Write property test untuk tooltip NavBar (Property 6)
    - **Property 6: Tooltip NavBar mengikuti hover state**
    - **Validates: Requirements 6.1, 6.4, 6.5**

- [x] 4. Visual hierarchy SidebarHeader
  - [x] 4.1 Tambahkan gradient accent line dan perkuat tipografi di `Sidebar/index.tsx`
    - Ganti `border-b` biasa dengan gradient underline: `backgroundImage: 'linear-gradient(to right, var(--accent-primary), transparent)'`
    - Perbesar font judul dan perkuat weight agar kontras terhadap ChatList
    - Pertahankan padding dan alignment konsisten
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 5. Empty state ChatList dengan query aktif
  - [x] 5.1 Update empty state di `Sidebar/ChatList.tsx` untuk menampilkan query pencarian
    - Ganti teks `"No chats found"` dengan `Tidak ada hasil untuk "[searchQuery]"`
    - Perbesar ikon dan sesuaikan styling dengan design system futuristik
    - Tambahkan `data-testid="empty-state"` pada container empty state
    - _Requirements: 5.1, 5.2, 5.4_
  - [x] 5.2 Write property test untuk empty state ChatList (Property 4)
    - **Property 4: Empty state ChatList menampilkan query aktif**
    - **Validates: Requirements 5.1, 5.2**
  - [x] 5.3 Write property test untuk restore ChatList (Property 5)
    - **Property 5: ChatList kembali normal saat query dikosongkan**
    - **Validates: Requirements 5.3**

- [x] 6. Checkpoint — Pastikan semua perubahan CSS dan komponen Sidebar/NavBar terintegrasi
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Komponen DateSeparator baru
  - [x] 7.1 Buat file `app/components/ChatWindow/DateSeparator.tsx`
    - Terima prop `date: Date`
    - Implementasi fungsi `isSameCalendarDay(a, b)` dan `getDateLabel(date)` — handle `Invalid Date` dengan return string kosong tanpa throw
    - Styling: teks kecil terpusat dengan garis horizontal di kiri dan kanan, warna `--text-muted`
    - Tambahkan `data-testid="date-separator"` pada root element
    - Export `isSameCalendarDay` dan `getDateLabel` untuk keperluan testing
    - _Requirements: 4.2, 4.3_
  - [x] 7.2 Write unit tests untuk `getDateLabel`
    - `getDateLabel(today)` → `"Today"`
    - `getDateLabel(yesterday)` → `"Yesterday"`
    - `getDateLabel(new Date('2020-01-01'))` → string non-kosong
    - `getDateLabel(new Date('invalid'))` → string fallback tanpa throw
    - _Requirements: 4.2_
  - [x] 7.3 Write property test untuk `getDateLabel` (Property 3)
    - **Property 3: Label DateSeparator sesuai tanggal relatif**
    - **Validates: Requirements 4.2**

- [x] 8. Integrasi DateSeparator ke MessageList
  - [x] 8.1 Modifikasi `app/components/ChatWindow/MessageList.tsx` untuk merender DateSeparator
    - Import `DateSeparator`, `isSameCalendarDay` dari `DateSeparator.tsx`
    - Tambahkan logika: sebelum setiap pesan, cek apakah tanggal kalendernya berbeda dari pesan sebelumnya — jika ya, render `<DateSeparator date={msg.timestamp} />`
    - Jika semua pesan dari hari yang sama, tidak ada DateSeparator yang dirender
    - _Requirements: 4.1, 4.4_
  - [x] 8.2 Write property test untuk DateSeparator placement (Property 2)
    - **Property 2: DateSeparator muncul tepat di setiap transisi hari kalender**
    - **Validates: Requirements 4.1, 4.4**

- [x] 9. Checkpoint — Pastikan DateSeparator muncul dengan benar di MessageList
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Reduksi OrbitRing di WelcomeScreen
  - [x] 10.1 Hapus satu OrbitRing dan turunkan opacity OrbitRing yang tersisa di `WelcomeScreen.tsx`
    - Hapus `<motion.div>` OrbitRing kedua (yang `scale-150`)
    - Pada OrbitRing yang tersisa, set opacity ≤ 0.2 via Tailwind class atau inline style
    - Tambahkan `data-testid="orbit-ring"` pada OrbitRing yang tersisa
    - Pertahankan durasi floating animation ≥ 5 detik (saat ini 6s, tidak perlu diubah)
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 10.2 Write unit test: tepat 1 OrbitRing dirender
    - Test `screen.getAllByTestId('orbit-ring').length === 1`
    - _Requirements: 3.1_
  - [x] 10.3 Write property test untuk OrbitRing opacity (Property 8)
    - **Property 8: OrbitRing opacity tidak melebihi batas**
    - **Validates: Requirements 3.2**

- [x] 11. Kepadatan konten AIProfile panel
  - [x] 11.1 Tambahkan 2 stat baris tambahan dan seksi Quick Actions di `AIProfile/index.tsx`
    - Tambahkan baris "Response Time" dan "Uptime" → total 6 baris stat
    - Tambahkan seksi "Quick Actions" dengan 3 tombol: New Chat, Export, Settings (gunakan ikon lucide-react)
    - Implementasi placeholder state proporsional saat tidak ada chat dipilih (bukan whitespace kosong)
    - Pastikan komponen tetap scrollable secara vertikal (`overflow-y-auto` sudah ada)
    - Tambahkan `data-testid` yang sesuai untuk testing
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 11.2 Write property test untuk AIProfile bot content (Property 1)
    - **Property 1: AIProfile bot menampilkan konten yang cukup**
    - **Validates: Requirements 2.1, 2.2**
  - [x] 11.3 Write unit tests untuk AIProfile states
    - Test: tanpa chat dipilih → placeholder state dirender
    - Test: non-bot chat → tidak menampilkan bot stats
    - _Requirements: 2.3_

- [x] 12. Final checkpoint — Pastikan semua tests pass dan semua komponen terintegrasi
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Property tests menggunakan fast-check — install dulu dengan `npm install --save-dev fast-check`
- Urutan task dirancang incremental: CSS → NavBar → Sidebar → ChatWindow → WelcomeScreen → AIProfile
