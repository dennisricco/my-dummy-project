# Bugfix Requirements Document

## Introduction

Terdapat bug UI pada komponen NavBar (sidebar navigasi vertikal kiri) di mana jarak antara logo/brand icon di bagian atas dengan tombol navigasi pertama ("Home") terlalu mepet/tidak memiliki spacing yang cukup. Hal ini menyebabkan tampilan visual yang tidak nyaman dan tidak konsisten dengan desain yang diharapkan.

Komponen yang terdampak: `app/components/NavBar/index.tsx`

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN NavBar dirender, THEN the system menampilkan logo bot dengan `mb-10` (40px margin-bottom) yang menghasilkan jarak visual yang terlalu mepet antara logo dengan tombol "Home" di bawahnya

1.2 WHEN pengguna melihat NavBar, THEN the system menampilkan nav items dengan `gap-8` (32px) antar item, namun jarak antara logo dan item pertama tidak konsisten dengan gap antar nav items itu sendiri

### Expected Behavior (Correct)

2.1 WHEN NavBar dirender, THEN the system SHALL menampilkan jarak yang cukup dan nyaman secara visual antara logo bot dengan tombol "Home" pertama, sehingga tidak terlihat mepet

2.2 WHEN NavBar dirender, THEN the system SHALL menampilkan spacing antara logo dan nav items pertama yang konsisten atau lebih besar dari gap antar nav items (`gap-8` / 32px), misalnya menggunakan `mb-14` atau `mb-16`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN NavBar dirender, THEN the system SHALL CONTINUE TO menampilkan semua nav items (Home, Chats, AI Assistant, Search) dengan gap antar item yang sama (`gap-8`)

3.2 WHEN NavBar dirender, THEN the system SHALL CONTINUE TO menampilkan logo bot di posisi paling atas dengan ukuran dan style yang sama (w-14 h-14, rounded-[16px], gradient background)

3.3 WHEN pengguna hover pada nav item, THEN the system SHALL CONTINUE TO menampilkan tooltip dan animasi scale yang sama

3.4 WHEN pengguna hover pada logo, THEN the system SHALL CONTINUE TO menampilkan animasi rotate 180 derajat yang sama

3.5 WHEN NavBar dirender, THEN the system SHALL CONTINUE TO menampilkan bottom actions (theme toggle dan user avatar) di posisi bawah dengan spacing yang sama
