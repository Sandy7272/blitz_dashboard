# Blitz AI Dashboard

A modern SaaS dashboard for AI-powered product photography, food styling, and website audits.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Authentication**: Auth0 React SDK
- **Animations**: Framer Motion
- **HTTP Client**: Axios

## Project Structure

```
src/
├── auth/                 # Auth0 authentication module
│   ├── AuthProvider.tsx  # Auth0 provider wrapper
│   ├── ProtectedRoute.tsx # Route protection component
│   ├── useAuth.ts        # Custom auth hook
│   ├── authConfig.ts     # Auth0 configuration
│   └── auth.types.ts     # TypeScript types
├── components/
│   ├── audit/            # Audit flow components
│   ├── dashboard/        # Dashboard widgets
│   ├── layout/           # Layout components (Sidebar, Header)
│   ├── onboarding/       # Onboarding modals & tooltips
│   ├── pdf/              # PDF generation components
│   ├── ui/               # shadcn/ui components
│   └── workspace/        # Creation wizard components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API layer
├── mock/                 # Mock data for development
├── pages/                # Route pages
└── types/                # TypeScript type definitions
```

## Authentication Setup (Auth0)

This project uses Auth0 for secure, enterprise-grade authentication.

### 1. Create an Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Navigate to **Applications** → **Create Application**
3. Select **Single Page Application**
4. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:5173, https://yourdomain.com`
   - **Allowed Logout URLs**: `http://localhost:5173, https://yourdomain.com`
   - **Allowed Web Origins**: `http://localhost:5173, https://yourdomain.com`

### 2. Create an API (Optional - for backend integration)

1. Navigate to **APIs** → **Create API**
2. Set an identifier (audience), e.g., `https://api.blitz.ai`
3. Enable RBAC and add permissions if needed

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Auth0 Configuration (Required)
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id

# Auth0 API (Optional - for backend API calls)
VITE_AUTH0_AUDIENCE=https://api.blitz.ai
```

### 4. Role-Based Access Control (RBAC)

To enable RBAC:

1. In Auth0 Dashboard, go to **User Management** → **Roles**
2. Create roles: `admin`, `user`, `pro`, `enterprise`
3. Create an Auth0 Action or Rule to add roles to tokens:

```javascript
// Auth0 Action: Add roles to tokens
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://blitz.ai';
  const roles = event.authorization?.roles || [];
  
  api.idToken.setCustomClaim(`${namespace}/roles`, roles);
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
};
```

### 5. Using Authentication in Components

```tsx
import { useAuth } from '@/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={() => login()}>Sign In</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  );
}
```

### 6. Protecting Routes

```tsx
import { ProtectedRoute } from '@/auth';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredRole="user">
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Development

### Prerequisites

- Node.js 18+ (or Bun)
- npm, yarn, or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_AUTH0_DOMAIN` | Yes | Your Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Yes | Your Auth0 application client ID |
| `VITE_AUTH0_AUDIENCE` | No | API identifier for backend calls |

## Security Best Practices

- ✅ Tokens stored in memory (not localStorage)
- ✅ Silent refresh using refresh tokens
- ✅ PKCE flow enabled by default
- ✅ Automatic token attachment to API calls
- ✅ Global 401/403 error handling
- ✅ Protected routes with role-based access

## API Integration

The API layer (`src/lib/api.ts`) automatically:

1. Attaches Bearer tokens to requests
2. Handles token refresh
3. Manages 401/403 errors globally
4. Provides typed request/response interfaces

## Deployment

### Lovable

Click **Share** → **Publish** in the Lovable editor.

### Custom Domain

Navigate to **Project** → **Settings** → **Domains** to connect a custom domain.

### Production Checklist

1. Update Auth0 application URLs for production domain
2. Set `VITE_AUTH0_*` environment variables in production
3. Enable Auth0 "Token Endpoint Authentication Method" to "None" for SPA
4. Configure Auth0 branding for login pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
