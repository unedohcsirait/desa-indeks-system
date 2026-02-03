# Sistem Autentikasi - Dokumentasi

## Ringkasan
Sistem autentikasi LOGIN ONLY telah diimplementasikan. Semua halaman aplikasi dilindungi dan memerlukan login terlebih dahulu.

## Akun Test
Username dan password test sudah terseed di database:
- **Username**: `admin` | **Password**: `password123`
- **Username**: `user` | **Password**: `password123`

## Fitur Implementasi

### 1. **Login Page** (`/login`)
- **Path**: `/client/src/pages/login.tsx`
- **Field**: Username dan Password
- **Validasi**:
  - Username dan password wajib diisi
  - Password diverifikasi dengan hash bcrypt (10 rounds)
- **Proses**:
  - User input username dan password
  - Sistem verifikasi dengan password hash di database
  - Jika berhasil: simpan session dan redirect ke dashboard
  - Jika gagal: tampilkan pesan error

### 2. **Protected Routes**
Semua halaman aplikasi dilindungi dengan `ProtectedRoute` component:
- `/` - Dashboard
- `/villages` - Daftar Desa
- `/assessments` - Daftar Penilaian
- `/assessments/:id` - Detail Penilaian
- `/profile` - Edit Profil

**Jika user belum login → redirect otomatis ke `/login`**

### 3. **Edit Profile Page** (`/profile`)
- **Path**: `/client/src/pages/profile.tsx`
- **Field yang bisa diubah**:
  - Username (harus unik)
  - Email (harus unik, tidak untuk login)
  - Password (di-hash dengan bcrypt)
- **Validasi**:
  - Username dan email harus unik
  - Password minimal 6 karakter
  - Password baru harus dikonfirmasi
- **Hasil**: Update data di database, session tetap aktif

### 4. **Logout**
- Tombol logout ada di navbar (dropdown user)
- Session destroyed, user redirect ke login

### 5. **Session Management**
- **Type**: Express-session dengan HTTP-only cookies
- **Duration**: 24 jam
- **Security**: 
  - HTTP-only (tidak bisa diakses dari JavaScript)
  - Secure flag (hanya di production + HTTPS)
  - SameSite policy

## Struktur Backend

### Authentication Middleware
**File**: `/server/auth.ts`
- `hashPassword()`: Hash password dengan bcrypt
- `verifyPassword()`: Verifikasi password dengan hash
- `authMiddleware`: Middleware untuk protect routes

### Storage Methods
**File**: `/server/storage.ts`
```typescript
async getUserByUsername(username: string): Promise<User | undefined>
async getUserById(id: number): Promise<User | undefined>
async getUserByEmail(email: string): Promise<User | undefined>
async updateUser(id: number, updates: Partial<InsertUser>): Promise<User>
```

### API Routes
**File**: `/server/routes.ts`
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

**Semua endpoint Data (villages, assessments) juga dilindungi dengan authMiddleware**

## Struktur Client

### Auth Context
**File**: `/client/src/hooks/use-auth.tsx`
- `useAuth()`: Hook untuk akses user state dan logout function
- `AuthProvider`: Provider untuk wrap aplikasi

### Protected Route Component
**File**: `/client/src/components/protected-route.tsx`
- Mengecek apakah user authenticated
- Jika tidak → tampilkan login page
- Jika ya → tampilkan component

### Database Schema
**File**: `/shared/schema.ts`
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

## Keamanan

✅ **Implementasi**:
1. Password di-hash dengan bcrypt (10 rounds)
2. Semua endpoint dilindungi dengan middleware auth
3. Session menggunakan HTTP-only cookies
4. Password tidak pernah di-expose
5. Session invalidation saat logout
6. Username dan email enforced unique di database

## Menambah User Baru

Untuk menambah user baru ke database, gunakan script seed:

```bash
# Edit script/seed-users.ts
# Tambahkan user baru di array testUsers

npm run seed:users
```

Atau buat script seed manual dengan bcrypt hashing.

## Catatan Penting

1. **SESSION_SECRET**: Ubah di production (`server/index.ts`)
2. **Cookies**: Hanya berfungsi dengan `credentials: 'include'` di fetch
3. **CORS**: Pastikan credentials policy di-config jika ada CORS
4. **Password Reset**: Belum diimplementasikan (sesuai requirement login only)
5. **Email Verification**: Belum diimplementasikan

## Testing

1. **Login berhasil**:
   ```
   Username: admin
   Password: password123
   → Redirect ke dashboard
   ```

2. **Login gagal**:
   ```
   Username: admin
   Password: wrong
   → Tampilkan error message
   ```

3. **Protected route**:
   ```
   Akses /villages tanpa login
   → Redirect ke /login
   ```

4. **Edit profile**:
   ```
   Login → /profile → ubah username/email/password
   → Update berhasil, tetap login
   ```

5. **Logout**:
   ```
   Login → Klik logout di navbar
   → Redirect ke /login
   ```

## API Contract Reference
Lihat `/shared/routes.ts` untuk full API contract dengan validasi Zod.
