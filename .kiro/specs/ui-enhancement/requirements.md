# Requirements Document

## Introduction

UI Enhancement untuk aplikasi chat futuristik berbasis Next.js (WhatsApp Web clone dengan AI assistant). Scope pekerjaan ini adalah perbaikan tampilan dan UX pada komponen-komponen yang sudah ada — bukan penambahan fitur baru. Area yang dicakup meliputi visual hierarchy Sidebar, kepadatan konten AIProfile panel, kebisingan animasi WelcomeScreen, date separator di MessageList, empty state ChatList, custom tooltip NavBar, serta perbaikan sistem theming (light mode dan warna `--text-muted`).

---

## Glossary

- **App**: Aplikasi chat futuristik Next.js secara keseluruhan
- **NavBar**: Panel navigasi vertikal slim di sisi paling kiri layout
- **Sidebar**: Panel kedua dari kiri yang menampilkan daftar chat (ChatList) dan SearchBar
- **SidebarHeader**: Bagian atas Sidebar yang menampilkan judul "Messages" dan badge "NEW"
- **ChatList**: Komponen daftar item chat di dalam Sidebar
- **ChatItem**: Satu baris item chat di dalam ChatList
- **ChatWindow**: Panel tengah yang menampilkan percakapan aktif
- **MessageList**: Komponen scroll area yang merender semua MessageBubble dalam satu chat
- **MessageBubble**: Komponen gelembung pesan individual
- **DateSeparator**: Komponen pemisah visual antar kelompok pesan berdasarkan tanggal
- **AIProfile**: Panel kanan yang menampilkan profil dan statistik AI/kontak aktif
- **WelcomeScreen**: Layar yang ditampilkan di ChatWindow saat belum ada chat yang dipilih
- **OrbitRing**: Elemen dekoratif berputar di sekitar ikon utama WelcomeScreen
- **Tooltip**: Elemen UI kecil yang muncul saat hover pada item NavBar
- **Theme**: Skema warna yang diterapkan ke seluruh App, dikontrol via atribut `data-theme`
- **ThemeToggle**: Tombol di NavBar (ikon Settings) yang mengubah Theme aktif
- **text-muted**: CSS custom property `--text-muted` yang digunakan untuk teks sekunder/placeholder

---

## Requirements

### Requirement 1: Visual Hierarchy SidebarHeader

**User Story:** Sebagai pengguna, saya ingin header Sidebar memiliki hierarki visual yang lebih kuat, sehingga area navigasi terasa lebih terstruktur dan premium.

#### Acceptance Criteria

1. THE SidebarHeader SHALL menampilkan elemen dekoratif (misalnya gradient underline atau accent line) yang membedakannya secara visual dari konten ChatList di bawahnya.
2. THE SidebarHeader SHALL menampilkan judul dengan ukuran font, weight, dan warna yang kontras terhadap item ChatList.
3. WHEN SidebarHeader dirender, THE SidebarHeader SHALL mempertahankan padding dan alignment yang konsisten dengan grid layout bento box.

---

### Requirement 2: Kepadatan Konten AIProfile Panel

**User Story:** Sebagai pengguna, saya ingin panel AIProfile terisi dengan konten yang lebih padat dan informatif, sehingga whitespace kosong berkurang dan panel terasa lebih berguna.

#### Acceptance Criteria

1. THE AIProfile SHALL menampilkan minimal 6 baris informasi atau widget ketika sebuah chat bot aktif dipilih.
2. THE AIProfile SHALL menampilkan seksi "Capabilities" atau "Quick Actions" yang berisi minimal 3 item interaktif (misalnya tag kemampuan AI atau tombol aksi cepat).
3. WHEN tidak ada chat yang dipilih, THE AIProfile SHALL menampilkan placeholder state yang mengisi ruang panel secara proporsional tanpa whitespace berlebih.
4. THE AIProfile SHALL mempertahankan scrollability vertikal ketika konten melebihi tinggi panel.

---

### Requirement 3: Reduksi Kebisingan Animasi WelcomeScreen

**User Story:** Sebagai pengguna, saya ingin animasi di WelcomeScreen terasa lebih tenang dan elegan, sehingga tidak mengganggu fokus visual.

#### Acceptance Criteria

1. THE WelcomeScreen SHALL menampilkan maksimal 1 OrbitRing yang aktif berputar secara bersamaan.
2. WHEN OrbitRing dirender, THE OrbitRing SHALL menggunakan opacity tidak lebih dari 0.2 agar tidak mendominasi elemen utama.
3. THE WelcomeScreen SHALL mempertahankan animasi floating (y-axis) pada ikon utama dengan durasi tidak kurang dari 5 detik per siklus untuk kesan yang lebih lambat dan tenang.

---

### Requirement 4: Date Separator di MessageList

**User Story:** Sebagai pengguna, saya ingin melihat pemisah tanggal antar kelompok pesan di MessageList, sehingga saya dapat dengan mudah memahami kapan pesan-pesan tersebut dikirim.

#### Acceptance Criteria

1. WHEN MessageList dirender dengan pesan dari lebih dari satu hari kalender, THE MessageList SHALL menampilkan DateSeparator di antara pesan dari hari yang berbeda.
2. THE DateSeparator SHALL menampilkan label "Today" untuk pesan hari ini, "Yesterday" untuk pesan kemarin, dan format tanggal lokal (misalnya "12 Juli 2025") untuk pesan yang lebih lama.
3. THE DateSeparator SHALL menggunakan styling yang secara visual berbeda dari MessageBubble (misalnya teks kecil terpusat dengan garis horizontal di kiri dan kanan).
4. WHEN semua pesan dalam satu chat berasal dari hari yang sama, THE MessageList SHALL tidak menampilkan DateSeparator sama sekali.

---

### Requirement 5: Empty State ChatList saat Search Tidak Menemukan Hasil

**User Story:** Sebagai pengguna, saya ingin melihat pesan yang jelas ketika pencarian di ChatList tidak menemukan hasil, sehingga saya tahu bahwa pencarian sudah berjalan dan tidak ada hasil yang cocok.

#### Acceptance Criteria

1. WHEN nilai SearchBar tidak kosong dan tidak ada ChatItem yang cocok, THE ChatList SHALL menampilkan komponen empty state yang berisi ikon dan teks deskriptif.
2. THE empty state SHALL menampilkan teks yang menyertakan query pencarian aktif, contoh: `Tidak ada hasil untuk "[query]"`.
3. WHEN nilai SearchBar dikosongkan kembali, THE ChatList SHALL kembali menampilkan daftar chat normal tanpa empty state.
4. THE empty state SHALL menggunakan warna dan styling yang konsisten dengan design system futuristik App (tidak menggunakan warna default browser).

---

### Requirement 6: Custom Tooltip pada NavBar

**User Story:** Sebagai pengguna, saya ingin melihat tooltip yang sesuai tema saat hover pada item NavBar, sehingga saya mengetahui fungsi setiap ikon tanpa harus menebak.

#### Acceptance Criteria

1. WHEN pengguna melakukan hover pada sebuah nav item di NavBar, THE NavBar SHALL menampilkan Tooltip yang berisi label teks item tersebut di sisi kanan ikon.
2. THE Tooltip SHALL muncul dengan animasi fade-in dan slide (dari kiri ke posisi akhir) dalam durasi tidak lebih dari 200ms.
3. THE Tooltip SHALL menggunakan styling glass-panel (backdrop-blur, border tipis, background semi-transparan) yang konsisten dengan design system App.
4. WHEN pengguna memindahkan kursor keluar dari nav item, THE Tooltip SHALL menghilang dengan animasi fade-out.
5. THE Tooltip SHALL tidak menggunakan atribut HTML `title` native sebagai mekanisme tampil — atribut `title` yang ada SHALL dihapus dari nav items.

---

### Requirement 7: Perbaikan Light Mode Theme

**User Story:** Sebagai pengguna, saya ingin light mode benar-benar menampilkan tampilan terang, sehingga toggle theme tidak menyesatkan dan saya mendapatkan pilihan tema yang bermakna.

#### Acceptance Criteria

1. WHEN `data-theme="light"` aktif, THE App SHALL menggunakan warna background utama (`--bg-primary`) dengan nilai lightness (HSL) tidak kurang dari 90% sehingga tampak terang secara nyata.
2. WHEN `data-theme="light"` aktif, THE App SHALL menggunakan warna teks utama (`--text-primary`) yang gelap (misalnya `#0f172a` atau setara) agar kontras terhadap background terang.
3. WHEN `data-theme="light"` aktif, THE App SHALL mempertahankan identitas visual futuristik dengan menggunakan accent color biru (`--accent-primary`) yang sama atau serupa dengan dark mode.
4. THE ThemeToggle SHALL menampilkan ikon yang berbeda untuk masing-masing state: ikon matahari (Sun) untuk dark mode (menandakan "klik untuk beralih ke light") dan ikon bulan (Moon) untuk light mode (menandakan "klik untuk beralih ke dark").
5. WHEN tema berpindah, THE App SHALL menerapkan transisi warna CSS pada semua elemen yang menggunakan CSS custom properties dalam durasi 300ms.

---

### Requirement 8: Perbaikan Kontras Warna `--text-muted`

**User Story:** Sebagai pengguna, saya ingin teks sekunder (muted) memiliki kontras yang cukup terhadap background, sehingga teks tersebut tetap terbaca dengan nyaman tanpa terasa terlalu mencolok.

#### Acceptance Criteria

1. THE App SHALL mendefinisikan nilai `--text-muted` pada dark mode dengan rasio kontras minimal 3:1 terhadap `--bg-secondary` sesuai standar WCAG AA untuk teks non-utama.
2. THE App SHALL mengganti nilai `--text-muted` dari `#7dd3fc` (sky-300, terlalu biru/jenuh) menjadi warna dengan saturasi lebih rendah, misalnya `#94a3b8` (slate-400) atau setara.
3. WHEN `data-theme="light"` aktif, THE App SHALL mendefinisikan nilai `--text-muted` yang kontras terhadap background terang, misalnya `#64748b` (slate-500) atau setara.
