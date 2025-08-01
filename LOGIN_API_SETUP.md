# Login API Setup Documentation

## Overview
This document describes the login API setup for the admin panel application, which integrates with an external authentication service.

## API Endpoints

### 1. External API (Primary)
**URL**: `http://srv931842.hstgr.cloud/api/v1/user/login`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

### 2. Local API (Proxy)
**URL**: `http://localhost:3000/api/auth/login`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Note**: This endpoint acts as a proxy to the external API and includes additional validation.

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "success": boolean,
  "message": "string",
  "token": "string (optional)",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

## Test Credentials

The following test credentials are available:

| Email | Password | Name | Role | Access |
|-------|----------|------|------|--------|
| admin@example.com | password123 | Admin User | admin | ✅ Allowed |
| editor@example.com | editor123 | Editor User | editor | ❌ Blocked |
| user@example.com | user123 | Regular User | user | ❌ Blocked |

**Note**: Only users with `userType: "admin"` can access the admin panel.

## Response Status Codes

- `200` - Success
- `400` - Bad Request (missing fields or invalid email format)
- `401` - Unauthorized (invalid credentials)
- `405` - Method Not Allowed (non-POST requests)
- `500` - Internal Server Error

## Error Messages

- `"Email and password are required"` - Missing email or password
- `"Invalid email format"` - Email doesn't match valid format
- `"Invalid email or password"` - Wrong credentials
- `"Access denied. Admin privileges required."` - User is not admin
- `"Method not allowed"` - Using wrong HTTP method
- `"Internal server error"` - Server error

## Implementation Details

### Files Created/Modified:

1. **`pages/api/auth/login.ts`** - Proxy API endpoint (forwards to external API)
2. **`lib/api.ts`** - API utility functions (direct external API calls)
3. **`lib/authContext.tsx`** - Updated authentication context
4. **`lib/tokenManager.ts`** - Enhanced token storage and management
5. **`pages/admin/login.tsx`** - Updated login page
6. **`components/auth/ProtectedRoute.tsx`** - Route protection component
7. **`components/auth/AuthStatus.tsx`** - Debug component for auth status
8. **`pages/_app.tsx`** - Updated app wrapper
9. **`pages/index.tsx`** - Updated dashboard with user info and debug component

### Key Features:

- **External API integration** with your authentication service
- **Dual API support** (direct external calls + local proxy)
- **Enhanced token storage** with validation and expiration handling
- **Admin-only access** - Only users with userType "admin" can log in
- **User role management** (admin, editor, user)
- **Input validation** (email format, required fields)
- **Error handling** with descriptive messages
- **Loading states** during authentication
- **Protected routes** with automatic redirects
- **Session persistence** across page refreshes
- **Debug tools** for monitoring authentication status

## Usage Examples

### Frontend Login
```typescript
import { loginUser } from '../lib/api';

const handleLogin = async (email: string, password: string) => {
  const result = await loginUser({ email, password });
  
  if (result.success) {
    // Redirect to dashboard
    router.push('/');
  } else {
    // Show error message
    setError(result.message);
  }
};
```

### Check Authentication Status
```typescript
import { isAuthenticated, getCurrentUser } from '../lib/api';

const isLoggedIn = isAuthenticated();
const currentUser = getCurrentUser();
```

### Logout
```typescript
import { logoutUser } from '../lib/api';

const handleLogout = () => {
  logoutUser();
  // Redirect to login page
  router.push('/admin/login');
};
```

## Testing

Run the test script to verify the API is working:

```bash
# Start the development server
npm run dev

# In another terminal, run the test
node test-login.js
```

## Security Notes

⚠️ **Important**: This is a development setup with mock authentication. For production:

1. **Use proper password hashing** (bcrypt, argon2)
2. **Implement JWT tokens** with proper signing
3. **Add rate limiting** to prevent brute force attacks
4. **Use HTTPS** in production
5. **Implement proper session management**
6. **Add CSRF protection**
7. **Validate and sanitize all inputs**
8. **Use environment variables** for sensitive data

## Next Steps

1. **Password Reset API** - Implement forgot password functionality
2. **User Registration** - Add user signup endpoint
3. **Email Verification** - Add email verification for new users
4. **Database Integration** - Replace mock data with real database
5. **JWT Implementation** - Add proper JWT token handling
6. **Refresh Tokens** - Implement token refresh mechanism 