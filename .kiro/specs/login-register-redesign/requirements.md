# Requirements Document

## Introduction

Redesign halaman login dan registrasi pada aplikasi chat Next.js agar mengikuti referensi desain split-screen modern bergaya SaaS/fintech. Layout saat ini menggunakan single card di tengah layar. Target desain baru menggunakan layout dua kolom (split-screen): sisi kiri berisi ilustrasi/panel dekoratif, sisi kanan berisi form interaktif. Keseluruhan feel: clean, minimal, professional, dengan palet warna cream/off-white dan aksen biru solid.

---

## Glossary

- **AuthPage**: Halaman `/login` yang menampilkan form Login atau Register
- **SplitLayout**: Struktur dua kolom (left panel + right panel) yang membentuk layout utama AuthPage
- **LeftPanel**: Sisi kiri SplitLayout yang berisi ilustrasi dekoratif dan branding
- **RightPanel**: Sisi kanan SplitLayout yang berisi form autentikasi
- **LoginForm**: Form dengan field email dan password untuk proses sign in
- **RegisterForm**: Form dengan field nama, email, password, dan konfirmasi password untuk proses sign up
- **SocialLoginButton**: Tombol outlined untuk login via provider pihak ketiga; saat ini hanya satu varian — GoogleLoginButton (login via Google)
- **GoogleLoginButton**: SocialLoginButton khusus untuk provider Google, menampilkan logo Google multicolor
- **EmailDivider**: Elemen pemisah teks "Or continue with email address" antara social login dan form email
- **AuthToggleLink**: Teks/link di header RightPanel untuk berpindah antara mode login dan register
- **CTAButton**: Tombol aksi utama full-width berwarna biru solid di bagian bawah form
- **IllustrationCard**: Card dalam LeftPanel yang menampilkan ilustrasi SVG atau elemen visual dekoratif
- **Theme**: Skema warna aktif yang dikontrol via `data-theme` attribute pada `<html>`
- **SuccessOverlay**: Tampilan full-screen yang muncul setelah form berhasil disubmit sebelum redirect

---

## Requirements

### Requirement 1: Split-Screen Layout

**User Story:** Sebagai pengguna, saya ingin melihat halaman login dengan layout dua kolom yang modern, sehingga tampilan terasa lebih premium dan profesional dibanding card tunggal di tengah.

#### Acceptance Criteria

1. THE AuthPage SHALL merender SplitLayout dengan dua kolom berdampingan pada viewport lebar (≥ 768px).
2. THE LeftPanel SHALL menempati 50% lebar SplitLayout dan menampilkan IllustrationCard dengan background cream/off-white (`#f0ede8` atau serupa).
3. THE RightPanel SHALL menempati 50% lebar SplitLayout dan menampilkan form autentikasi aktif.
4. WHEN viewport lebih sempit dari 768px, THE SplitLayout SHALL menyembunyikan LeftPanel dan menampilkan hanya RightPanel secara full-width.
5. THE SplitLayout SHALL menggunakan background keseluruhan berwarna cream/off-white (`#f0ede8` atau serupa) dengan rounded corners besar (≥ 24px) dan shadow halus.

---

### Requirement 2: Left Panel Ilustrasi

**User Story:** Sebagai pengguna, saya ingin melihat ilustrasi menarik di sisi kiri halaman login, sehingga halaman terasa lebih hidup dan tidak membosankan.

#### Acceptance Criteria

1. THE LeftPanel SHALL menampilkan IllustrationCard dengan rounded corners dan background cream yang kontras terhadap background RightPanel.
2. THE IllustrationCard SHALL menampilkan elemen visual dekoratif (ilustrasi SVG atau placeholder visual) yang mengisi area secara proporsional tanpa overflow.
3. THE LeftPanel SHALL menampilkan nama aplikasi atau tagline sebagai elemen branding yang terlihat jelas.
4. WHEN viewport lebih sempit dari 768px, THE LeftPanel SHALL tidak dirender (conditional render, bukan hanya `display: none`).

---

### Requirement 3: Right Panel Header dengan AuthToggleLink

**User Story:** Sebagai pengguna, saya ingin melihat link untuk berpindah antara login dan register di bagian atas form, sehingga saya dapat dengan mudah menavigasi tanpa harus scroll ke bawah.

#### Acceptance Criteria

1. THE RightPanel SHALL menampilkan AuthToggleLink di pojok kanan atas area form.
2. WHEN mode aktif adalah login, THE AuthToggleLink SHALL menampilkan teks "Don't have an account? Sign up" dengan kata "Sign up" sebagai elemen yang dapat diklik.
3. WHEN mode aktif adalah register, THE AuthToggleLink SHALL menampilkan teks "Already have an account? Sign in" dengan kata "Sign in" sebagai elemen yang dapat diklik.
4. WHEN AuthToggleLink diklik, THE AuthPage SHALL beralih ke mode yang berlawanan dengan animasi transisi slide horizontal.

---

### Requirement 4: Judul dan Subtitle Form

**User Story:** Sebagai pengguna, saya ingin melihat judul yang jelas dan subtitle deskriptif di atas form, sehingga saya langsung memahami konteks halaman yang sedang saya lihat.

#### Acceptance Criteria

1. WHEN mode aktif adalah login, THE LoginForm SHALL menampilkan judul "Sign in" dengan font bold/semibold berukuran minimal 24px.
2. WHEN mode aktif adalah login, THE LoginForm SHALL menampilkan subtitle "Welcome back" di bawah judul dengan ukuran font lebih kecil dan warna muted.
3. WHEN mode aktif adalah register, THE RegisterForm SHALL menampilkan judul "Create account" dengan font bold/semibold berukuran minimal 24px.
4. WHEN mode aktif adalah register, THE RegisterForm SHALL menampilkan subtitle "Join us today" di bawah judul dengan ukuran font lebih kecil dan warna muted.

---

### Requirement 5: Social Login Buttons

**User Story:** Sebagai pengguna, saya ingin melihat tombol login sosial (Google) yang mudah ditemukan, sehingga saya dapat login dengan cepat tanpa mengisi form email.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan satu SocialLoginButton: GoogleLoginButton.
2. THE RegisterForm SHALL menampilkan GoogleLoginButton dengan layout dan styling identik dengan LoginForm.
3. THE SocialLoginButton SHALL menggunakan style outlined/bordered (background transparan, border tipis, teks dan ikon berwarna gelap) yang konsisten dengan design system.
4. THE GoogleLoginButton SHALL dirender full-width di bawah subtitle form.
5. WHEN GoogleLoginButton diklik, THE AuthPage SHALL menampilkan efek hover/active visual tanpa navigasi keluar halaman (handler kosong untuk saat ini).
6. THE GoogleLoginButton SHALL menampilkan logo Google SVG multicolor sesuai brand guideline Google.

---

### Requirement 6: Email Divider

**User Story:** Sebagai pengguna, saya ingin melihat pemisah visual yang jelas antara opsi social login dan form email, sehingga dua jalur autentikasi terasa terorganisir.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan EmailDivider di antara SocialLoginButton dan input email.
2. THE RegisterForm SHALL menampilkan EmailDivider di antara SocialLoginButton dan input fields.
3. THE EmailDivider SHALL menampilkan teks "Or continue with email address" diapit oleh dua garis horizontal.
4. THE EmailDivider SHALL menggunakan warna teks muted (`--text-muted`) dan garis dengan opacity tidak lebih dari 30% agar tidak mendominasi layout.

---

### Requirement 7: Input Fields

**User Story:** Sebagai pengguna, saya ingin mengisi form login dan register dengan input field yang jelas dan mudah digunakan, sehingga proses autentikasi terasa lancar.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan input email dengan icon mail di sisi kiri dan placeholder "you@example.com".
2. THE LoginForm SHALL menampilkan input password dengan icon lock di sisi kiri dan karakter dots sebagai placeholder.
3. THE LoginForm SHALL menampilkan toggle show/hide password pada input password dengan aria-label "Show password" dan "Hide password".
4. THE RegisterForm SHALL menampilkan input nama (username) dengan icon user, input email dengan icon mail, input password, dan input konfirmasi password — masing-masing dengan icon dan placeholder yang sesuai.
5. WHEN pengguna fokus pada sebuah input field, THE input field SHALL menampilkan border highlight berwarna `--accent-primary` dengan efek ring/glow tipis dalam durasi transisi tidak lebih dari 200ms.
6. IF sebuah required input field kosong saat CTAButton diklik, THEN THE AuthPage SHALL menampilkan pesan error inline di bawah field tersebut tanpa melakukan navigasi.
7. IF nilai input email tidak mengandung karakter "@" dan domain yang valid, THEN THE AuthPage SHALL menampilkan pesan error "Please enter a valid email address" di bawah field email.
8. IF nilai input password kurang dari 8 karakter saat RegisterForm disubmit, THEN THE AuthPage SHALL menampilkan pesan error "Password must be at least 8 characters" di bawah field password.
9. IF nilai input konfirmasi password tidak sama dengan input password saat RegisterForm disubmit, THEN THE AuthPage SHALL menampilkan pesan error "Passwords do not match" di bawah field konfirmasi password.

---

### Requirement 8: CTA Button

**User Story:** Sebagai pengguna, saya ingin melihat tombol aksi utama yang menonjol di bagian bawah form, sehingga saya tahu dengan jelas langkah selanjutnya.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan CTAButton dengan label "Sign In" berwarna biru solid (`--accent-primary`), full-width, dengan rounded corners.
2. THE RegisterForm SHALL menampilkan CTAButton dengan label "Create Account" dengan styling identik.
3. THE CTAButton SHALL menampilkan efek hover (warna lebih gelap atau shadow) dalam durasi transisi tidak lebih dari 200ms.
4. WHEN CTAButton diklik dan semua required field terisi valid, THE AuthPage SHALL menampilkan SuccessOverlay dan melakukan redirect ke halaman utama setelah 1200ms.
5. WHILE form sedang diproses (antara klik CTAButton dan redirect), THE CTAButton SHALL menampilkan loading state (spinner atau teks berubah) dan tidak dapat diklik ulang.

---

### Requirement 9: Responsivitas dan Aksesibilitas

**User Story:** Sebagai pengguna di berbagai perangkat, saya ingin halaman login tetap dapat digunakan dengan baik, sehingga pengalaman tidak terdegradasi di layar kecil.

#### Acceptance Criteria

1. WHEN viewport lebih sempit dari 768px, THE AuthPage SHALL menampilkan layout single-column dengan RightPanel full-width dan padding horizontal minimal 16px.
2. THE semua input field pada AuthPage SHALL memiliki elemen `<label>` yang terhubung via atribut `htmlFor` yang sesuai dengan `id` input.
3. THE semua button pada AuthPage SHALL memiliki atribut `aria-label` yang deskriptif jika tidak memiliki teks label yang terlihat.
4. THE AuthPage SHALL mendukung navigasi keyboard dengan Tab order yang mengikuti urutan visual dari atas ke bawah, dan Enter untuk submit form.
5. WHEN `data-theme="dark"` aktif, THE AuthPage SHALL menyesuaikan warna background, teks, dan border sehingga rasio kontras teks terhadap background minimal 4.5:1 sesuai WCAG AA.

---

### Requirement 10: Animasi Transisi

**User Story:** Sebagai pengguna, saya ingin perpindahan antara form login dan register terasa halus, sehingga pengalaman terasa polished dan tidak terasa kasar.

#### Acceptance Criteria

1. WHEN mode berpindah antara login dan register, THE AuthPage SHALL menampilkan animasi slide horizontal (x-axis) menggunakan Framer Motion dengan durasi tidak lebih dari 300ms.
2. THE SplitLayout SHALL muncul dengan animasi fade-in dan scale-up saat pertama kali dirender, dengan durasi tidak lebih dari 400ms.
3. WHEN CTAButton diklik dan form valid, THE AuthPage SHALL menampilkan SuccessOverlay dengan animasi fade-in sebelum redirect.
4. THE LeftPanel SHALL menampilkan animasi fade-in dari sisi kiri saat halaman pertama kali dimuat, dengan delay tidak lebih dari 150ms setelah RightPanel muncul.
