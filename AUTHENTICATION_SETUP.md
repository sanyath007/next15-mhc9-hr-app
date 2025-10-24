# Authentication System Setup

This Next.js 15 project includes a complete authentication system with the following features:

## Features

- **User Registration & Login**: Complete user management with validation
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Route Protection**: Middleware-based route protection
- **Role-based Access**: Support for different user roles (user, manager, admin)
- **Token Management**: Automatic token validation and refresh
- **Protected Routes**: Automatic redirection for unauthenticated users

## Database Schema

The system uses Prisma with MySQL and includes:

- **User Model**: Stores user credentials and profile information
- **Employee Model**: Links to users for face recognition features
- **Attendance Model**: Tracks employee check-ins

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Token verification

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
   ```

2. **Environment Variables**:
   Create a `.env.local` file with:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="24h"
   ```

3. **Database Migration**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Usage

### Authentication Flow

1. **Registration**: Users can register at `/auth/register`
2. **Login**: Users can login at `/auth/login`
3. **Protected Routes**: All routes under `/(pages)` are protected
4. **Dashboard**: Authenticated users see the dashboard at `/dashboard`

### User Roles

- **user**: Basic user access
- **manager**: Manager-level access
- **admin**: Administrative access

### Token Management

- Tokens are stored in localStorage
- Automatic token validation every 30 seconds
- Token expiration warnings
- Automatic logout on token expiry

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token expiration
- CSRF protection through SameSite cookies
- Input validation and sanitization
- SQL injection protection through Prisma

## Components

- **AuthProvider**: Context provider for authentication state
- **ProtectedRoute**: Component wrapper for protected pages
- **useAuth**: Hook for accessing authentication state
- **tokenManager**: Utility for token operations

## Middleware

The `middleware.ts` file handles:
- Route protection for authenticated areas
- Redirect logic for auth pages
- Token validation on route changes

## Customization

You can customize the authentication system by:
- Modifying user roles in the Prisma schema
- Adding additional user fields
- Implementing password reset functionality
- Adding social login providers
- Customizing the UI components
