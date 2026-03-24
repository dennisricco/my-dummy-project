# Design Document: UI Enhancement

## Overview

Dokumen ini mendeskripsikan desain teknis untuk serangkaian perbaikan UI/UX pada aplikasi chat futuristik Next.js. Semua perubahan bersifat **enhancement** — tidak ada fitur baru yang ditambahkan, hanya perbaikan visual, hierarki, dan kegunaan pada komponen yang sudah ada.

Delapan area perbaikan yang dicakup:
1. Visual hierarchy SidebarHeader
2. Kepadatan konten AIProfile panel
3. Reduksi kebisingan animasi WelcomeScreen
4. Date separator di MessageList
5. Empty state ChatList saat search kosong
6. Custom tooltip pada NavBar
7. Perbaikan light mode theme
8. Perbaikan kontras warna `--text-muted`

Stack yang digunakan: Next.js (App Router), React, Framer Motion, Tailwind CSS, Zustand.

---

## Architecture

Aplikasi menggunakan layout bento box 4-panel yang dirender di `app/page.tsx`:

```
┌──────────┬──────────────────────┬──────────────────────┬──────────────┐
│  NavBar  │      Sidebar         │    ChatWindow        │  AIProfile   │
│  (88px)  │     (320px)          │    (flex-1)          │   (320px)    │
│          │  SidebarHeader       │  ChatHeader          │              │
│          │  SearchBar           │  MessageList         │              │
│          │  ChatList            │    DateSeparator     │              │
│          │                      │  InputBar            │              │
└──────────┴──────────────────────┴──────────────────────┴──────────────┘
```

State global dikelola oleh Zustand store (`app/store/useChatStore.ts`). Theming dikontrol via atribut `data-theme` pada `<html>` element dan CSS custom properties di `app/globals.css`.

Semua perubahan bersifat **lokalisasi** — setiap komponen hanya dimodifikasi di file-nya sendiri, tanpa perubahan arsitektur atau penambahan layer baru.

---

## Components and Interfaces

### 1. SidebarHeader (modifikasi `app/components/Sidebar/index.tsx`)

Header saat ini inline di `Sidebar/index.tsx`. Akan ditambahkan:
- Gradient accent line di bawah header (border-bottom dengan gradient)
- Ukuran font judul diperbesar, weight lebih tebal
- Konsistensi padding dengan grid bento

```tsx
// Accent line via CSS gradient border-bottom
<div style={{ borderBottom: '2px solid transparent', backgroundImage: 'linear-gradient(to right, var(--accent-primary), transparent)', backgroundOrigin: 'border-box' }} />
```

### 2. AIProfile (modifikasi `app/components/AIProfile/index.tsx`)

Saat ini menampilkan 4 baris stat. Akan ditambahkan:
- 2 baris stat tambahan (Response Time, Uptime) → total 6 baris
- Seksi "Quick Actions" dengan 3 tombol aksi (New Chat, Export, Settings)
- Placeholder state yang proporsional saat tidak ada chat dipilih

Interface baru untuk quick actions:
```ts
interface QuickAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}
```

### 3. WelcomeScreen (modifikasi `app/components/WelcomeScreen.tsx`)

Saat ini memiliki 2 OrbitRing. Akan dikurangi menjadi 1 OrbitRing dengan:
- Opacity maksimal 0.2
- Durasi floating animation ≥ 5 detik per siklus (saat ini 6s, dipertahankan)

### 4. DateSeparator (file baru `app/components/ChatWindow/DateSeparator.tsx`)

Komponen baru yang menerima prop `date: Date` dan merender label tanggal dengan garis horizontal di kiri-kanan.

```tsx
interface DateSeparatorProps {
  date: Date;
}
```

Label logic:
- Hari ini → `"Today"`
- Kemarin → `"Yesterday"`
- Lainnya → format lokal, contoh `"12 Juli 2025"`

### 5. MessageList (modifikasi `app/components/ChatWindow/MessageList.tsx`)

Akan ditambahkan logika grouping pesan berdasarkan tanggal kalender. Sebelum setiap grup hari baru, dirender `<DateSeparator />`.

Fungsi helper:
```ts
function isSameCalendarDay(a: Date, b: Date): boolean
function getDateLabel(date: Date): string
```

### 6. ChatList (modifikasi `app/components/Sidebar/ChatList.tsx`)

Empty state yang sudah ada (`"No chats found"`) akan diperkaya:
- Menampilkan query pencarian aktif dalam teks
- Ikon lebih besar dan styled sesuai design system
- Teks: `Tidak ada hasil untuk "[query]"`

### 7. NavBar (modifikasi `app/components/NavBar/index.tsx`)

Tooltip custom akan diimplementasikan menggunakan Framer Motion `AnimatePresence` + state hover per item. Atribut `title` native dihapus dari semua nav items.

```tsx
interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}
```

Tooltip diposisikan absolut di sisi kanan ikon dengan animasi:
- `initial`: `{ opacity: 0, x: -8 }`
- `animate`: `{ opacity: 1, x: 0 }`
- `transition`: `{ duration: 0.15 }`

### 8. globals.css (modifikasi `app/globals.css`)

Perubahan CSS custom properties:

**Dark mode:**
- `--text-muted`: `#7dd3fc` → `#94a3b8` (slate-400, saturasi lebih rendah)

**Light mode (`[data-theme="light"]`):**
- `--bg-primary`: `#0f172a` → `#f8fafc` (slate-50, lightness ~98%)
- `--bg-secondary`: `#1e293b` → `#f1f5f9` (slate-100)
- `--bg-tertiary`: `#0f172a` → `#f8fafc`
- `--bg-hover`: `#334155` → `#e2e8f0`
- `--bg-selected`: `#334155` → `#dbeafe`
- `--bg-input`: `#0f172a` → `#f1f5f9`
- `--bg-sidebar`: `#1e293b` → `#f1f5f9`
- `--bg-chat-area`: `#020617` → `#f8fafc`
- `--bg-header`: `rgba(30,41,59,0.85)` → `rgba(248,250,252,0.9)`
- `--text-primary`: `#f8fafc` → `#0f172a`
- `--text-secondary`: `#cbd5e1` → `#1e293b`
- `--text-muted`: `#94a3b8` → `#64748b` (slate-500)
- `--text-timestamp`: `#94a3b8` → `#64748b`
- `--border-color`: → `rgba(15,23,42,0.15)`
- `--glass-bg`: → `rgba(248,250,252,0.7)`

**ThemeToggle icon** (di `NavBar/index.tsx`): ganti ikon `Settings` dengan `Sun` (dark mode) / `Moon` (light mode) dari lucide-react.

---

## Data Models

Tidak ada perubahan pada data model yang sudah ada (`Message`, `Chat`, `User`, `Theme` di `app/types/index.ts`).

Satu-satunya tambahan adalah fungsi helper murni di `MessageList.tsx` (tidak perlu file terpisah):

```ts
// Menentukan apakah dua Date berada di hari kalender yang sama
function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Menghasilkan label teks untuk DateSeparator
function getDateLabel(date: Date): string {
  const now = new Date();
  if (isSameCalendarDay(date, now)) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameCalendarDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
```


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the software should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: AIProfile bot menampilkan konten yang cukup

*For any* bot chat yang dipilih sebagai active chat, komponen AIProfile harus merender minimal 6 baris informasi/widget DAN minimal 3 item interaktif di seksi Quick Actions.

**Validates: Requirements 2.1, 2.2**

---

### Property 2: DateSeparator muncul tepat di setiap transisi hari kalender

*For any* array pesan, DateSeparator harus muncul tepat sebelum pesan pertama dari setiap hari kalender baru (yaitu setiap kali tanggal kalender berubah dari pesan sebelumnya), dan tidak muncul sama sekali jika semua pesan berasal dari hari yang sama.

**Validates: Requirements 4.1, 4.4**

---

### Property 3: Label DateSeparator sesuai tanggal relatif

*For any* nilai `Date`, fungsi `getDateLabel` harus mengembalikan `"Today"` jika tanggal adalah hari ini, `"Yesterday"` jika tanggal adalah kemarin, dan string tanggal lokal non-kosong untuk tanggal yang lebih lama.

**Validates: Requirements 4.2**

---

### Property 4: Empty state ChatList menampilkan query aktif

*For any* query pencarian non-kosong yang tidak menghasilkan ChatItem yang cocok, ChatList harus menampilkan empty state yang teksnya mengandung string query tersebut.

**Validates: Requirements 5.1, 5.2**

---

### Property 5: ChatList kembali normal saat query dikosongkan

*For any* query pencarian yang sebelumnya menghasilkan empty state, mengosongkan query harus mengembalikan ChatList ke daftar chat normal (tanpa empty state, dengan semua chat ditampilkan).

**Validates: Requirements 5.3**

---

### Property 6: Tooltip NavBar mengikuti hover state

*For any* nav item di NavBar, tooltip dengan label yang benar harus muncul saat item di-hover dan menghilang saat kursor keluar. Tidak ada nav item yang boleh memiliki atribut `title` native.

**Validates: Requirements 6.1, 6.4, 6.5**

---

### Property 7: ThemeToggle menampilkan ikon yang sesuai state

*For any* nilai theme (`"dark"` atau `"light"`), ThemeToggle harus merender ikon Sun ketika theme adalah `"dark"` dan ikon Moon ketika theme adalah `"light"`.

**Validates: Requirements 7.4**

---

### Property 8: OrbitRing opacity tidak melebihi batas

*For any* OrbitRing yang dirender di WelcomeScreen, nilai opacity dalam Tailwind class atau inline style harus ≤ 0.2.

**Validates: Requirements 3.2**

---

## Error Handling

Semua perubahan dalam scope ini adalah UI enhancement tanpa side effects asinkron, sehingga error handling yang diperlukan minimal:

- **DateSeparator**: Jika `date` prop adalah `Invalid Date`, `getDateLabel` harus mengembalikan string fallback (misalnya string kosong) tanpa melempar exception.
- **ChatList empty state**: Jika `searchQuery` mengandung karakter regex-special, filter berbasis `includes()` sudah aman karena tidak menggunakan regex.
- **AIProfile**: Jika `chat` tidak ditemukan di store (misalnya setelah data reload), komponen harus merender placeholder state, bukan crash.
- **NavBar tooltip**: Tooltip menggunakan state React lokal (`hoveredItem`), tidak ada async operation — tidak ada error path yang perlu ditangani.
- **Theme CSS**: CSS custom properties dengan nilai tidak valid akan di-ignore oleh browser secara graceful; tidak ada error handling tambahan diperlukan.

---

## Testing Strategy

### Pendekatan Dual Testing

Setiap correctness property diimplementasikan sebagai **property-based test**, sementara kasus spesifik, edge cases, dan integrasi dicover oleh **unit tests**.

- Unit tests: contoh konkret, edge cases, kondisi error
- Property tests: validasi universal dengan input yang di-generate secara acak
- Keduanya saling melengkapi dan keduanya diperlukan

### Library

- **Property-based testing**: [fast-check](https://github.com/dubzzz/fast-check) (TypeScript-native, tidak perlu setup tambahan)
- **Test runner**: Jest atau Vitest (sesuai konfigurasi project)
- **Component testing**: React Testing Library

Instalasi:
```bash
npm install --save-dev fast-check
```

### Konfigurasi Property Tests

- Minimum **100 iterasi** per property test
- Setiap test diberi tag komentar yang mereferensikan property di design document
- Format tag: `// Feature: ui-enhancement, Property {N}: {property_text}`

### Property Tests

**Property 1: AIProfile bot content**
```ts
// Feature: ui-enhancement, Property 1: AIProfile bot menampilkan konten yang cukup
it('renders ≥6 info rows and ≥3 quick actions for any bot chat', () => {
  fc.assert(fc.property(fc.record({ id: fc.string(), isBot: fc.constant(true) }), (chat) => {
    render(<AIProfile />, { /* store with bot chat selected */ });
    expect(screen.getAllByRole('row-or-widget').length).toBeGreaterThanOrEqual(6);
    expect(screen.getAllByRole('button', { name: /action/i }).length).toBeGreaterThanOrEqual(3);
  }), { numRuns: 100 });
});
```

**Property 2: DateSeparator placement**
```ts
// Feature: ui-enhancement, Property 2: DateSeparator muncul tepat di setiap transisi hari kalender
it('shows DateSeparator at every calendar day transition', () => {
  fc.assert(fc.property(fc.array(fc.record({ timestamp: fc.date() }), { minLength: 2 }), (messages) => {
    // Count expected transitions
    const expectedSeparators = countDayTransitions(messages);
    render(<MessageList messages={messages} />);
    expect(screen.queryAllByTestId('date-separator').length).toBe(expectedSeparators);
  }), { numRuns: 100 });
});
```

**Property 3: getDateLabel**
```ts
// Feature: ui-enhancement, Property 3: Label DateSeparator sesuai tanggal relatif
it('returns correct label for any date', () => {
  fc.assert(fc.property(fc.date(), (date) => {
    const label = getDateLabel(date);
    const now = new Date();
    if (isSameCalendarDay(date, now)) expect(label).toBe('Today');
    else if (isSameCalendarDay(date, yesterday(now))) expect(label).toBe('Yesterday');
    else expect(label.length).toBeGreaterThan(0);
  }), { numRuns: 100 });
});
```

**Property 4: Empty state dengan query**
```ts
// Feature: ui-enhancement, Property 4: Empty state ChatList menampilkan query aktif
it('empty state contains the active search query', () => {
  fc.assert(fc.property(fc.string({ minLength: 1 }), (query) => {
    // Render with query that matches nothing
    render(<ChatList searchQuery={`__nomatch__${query}`} />);
    expect(screen.getByText(new RegExp(escapeRegex(query)))).toBeInTheDocument();
  }), { numRuns: 100 });
});
```

**Property 5: ChatList restore**
```ts
// Feature: ui-enhancement, Property 5: ChatList kembali normal saat query dikosongkan
it('restores full chat list when query is cleared', () => {
  fc.assert(fc.property(fc.string({ minLength: 1 }), (query) => {
    const { rerender } = render(<ChatList searchQuery={`__nomatch__${query}`} />);
    rerender(<ChatList searchQuery="" />);
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  }), { numRuns: 100 });
});
```

**Property 6: Tooltip visibility**
```ts
// Feature: ui-enhancement, Property 6: Tooltip NavBar mengikuti hover state
it('shows tooltip on hover and hides on mouse leave for all nav items', () => {
  fc.assert(fc.property(fc.integer({ min: 0, max: 3 }), (itemIndex) => {
    render(<NavBar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[itemIndex]).not.toHaveAttribute('title');
    fireEvent.mouseEnter(buttons[itemIndex]);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(buttons[itemIndex]);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  }), { numRuns: 100 });
});
```

**Property 7: ThemeToggle icon**
```ts
// Feature: ui-enhancement, Property 7: ThemeToggle menampilkan ikon yang sesuai state
it('renders Sun icon for dark theme and Moon icon for light theme', () => {
  fc.assert(fc.property(fc.constantFrom('dark', 'light'), (theme) => {
    render(<NavBar />, { /* store with given theme */ });
    if (theme === 'dark') expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    else expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
  }), { numRuns: 100 });
});
```

**Property 8: OrbitRing opacity**
```ts
// Feature: ui-enhancement, Property 8: OrbitRing opacity tidak melebihi batas
it('all orbit rings have opacity ≤ 0.2', () => {
  render(<WelcomeScreen />);
  const rings = screen.getAllByTestId('orbit-ring');
  rings.forEach((ring) => {
    const opacity = parseFloat(ring.style.opacity || '1');
    expect(opacity).toBeLessThanOrEqual(0.2);
  });
});
```

### Unit Tests

Selain property tests, unit tests berikut diperlukan untuk kasus spesifik:

- `getDateLabel(new Date())` → `"Today"`
- `getDateLabel(yesterday)` → `"Yesterday"`
- `getDateLabel(new Date('2020-01-01'))` → string tanggal lokal non-kosong
- `getDateLabel(new Date('invalid'))` → string fallback tanpa throw
- AIProfile tanpa chat dipilih → placeholder state dirender
- AIProfile dengan non-bot chat → tidak menampilkan bot stats
- WelcomeScreen → tepat 1 OrbitRing dirender
- Light mode CSS: `--bg-primary` memiliki lightness ≥ 90%
- Light mode CSS: `--text-primary` adalah warna gelap
- Dark mode CSS: `--text-muted` bukan `#7dd3fc`
