# Stripe Embedded Components Demo - Build Plan

## High-Level Checklist
- [ ] Initialize Next.js application with TypeScript and Tailwind CSS
- [ ] Set up Stripe SDK and authentication configuration
- [ ] Build Connected Accounts list page with status indicators
- [ ] Create Connected Account details page with three embedded components
- [ ] Implement API routes for secure Stripe operations
- [ ] Test end-to-end user journeys and embedded component interactions

---

## 1. Project Overview

### Purpose and Target Audience
This demo application showcases Stripe's Embedded Components for platform accounts managing connected accounts. Target audience includes:
- Stripe Integration Engineers demonstrating platform capabilities
- Platform developers exploring Stripe Connect embedded UI components
- Technical stakeholders evaluating Stripe Connect solutions

### Key User Journeys
1. **View Connected Accounts**: Platform admin views all connected accounts with status indicators (charges_enabled, payout_enabled, details_submitted, requirements)
2. **Drill into Account Details**: Admin clicks on a connected account to view detailed information
3. **Interact with Embedded Components**: Admin views and interacts with:
   - Notification Banner (account-level alerts and requirements)
   - Payment List (payments processed by the connected account)
   - Payouts (payout history and details)

---

## 2. Architecture & Stack

### Technology Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x (App Router) | React framework with server/client components |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling framework |
| Stripe Node SDK | 17.x | Backend Stripe API calls |
| Stripe.js | Latest | Frontend Stripe integrations |
| @stripe/connect-js | Latest | Embedded Components SDK |

### Environment Requirements
- **Node.js**: 18.x or 20.x (LTS versions)
- **Package Manager**: npm or yarn
- **Stripe Account**: Platform account with Connect enabled
- **Connected Accounts**: At least one test connected account for demonstration

### Project Structure
```
zebra-servicing-portal/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Connected accounts list
│   │   ├── account/[id]/page.tsx       # Account details page
│   │   ├── api/
│   │   │   ├── accounts/route.ts       # List connected accounts
│   │   │   └── session/route.ts        # Create embedded component sessions
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── AccountCard.tsx             # Account list item
│   │   ├── StatusBadge.tsx             # Status indicator component
│   │   ├── NotificationBanner.tsx      # Embedded notification banner
│   │   ├── PaymentsList.tsx            # Embedded payments list
│   │   └── PayoutsList.tsx             # Embedded payouts list
│   ├── lib/
│   │   └── stripe.ts                   # Stripe client configuration
│   └── types/
│       └── stripe.ts                   # TypeScript type definitions
├── .env.local                          # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 3. Implementation Steps

### Phase 1: Project Setup & Configuration
**Testing Checkpoint**: Development server starts without errors

1. **Initialize Next.js Application**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
   ```

2. **Install Dependencies**
   ```bash
   npm install stripe @stripe/stripe-js @stripe/connect-js
   npm install -D @types/node
   ```

3. **Create Environment Variables**
   - Create `.env.local` with required variables:
     ```
     STRIPE_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     ```

4. **Configure Stripe Client**
   - Create `src/lib/stripe.ts` with server-side Stripe instance using API version `2025-04-30.basil`

### Phase 2: Connected Accounts List Page
**Testing Checkpoint**: Account list renders with correct status indicators

5. **Build API Route for Account Listing**
   - Create `src/app/api/accounts/route.ts`
   - Fetch all connected accounts with required fields
   - Return account data with status indicators

6. **Create Status Badge Component**
   - Build reusable `StatusBadge.tsx` with green (✅) and red (❌) indicators
   - Support boolean and array/null value checks

7. **Build Account Card Component**
   - Display account ID, name, and status badges
   - Include "View Details" button linking to account details page

8. **Implement Main List Page**
   - Create `src/app/page.tsx` with responsive grid layout
   - Fetch accounts from API route
   - Render account cards with proper spacing

### Phase 3: Account Details Page with Embedded Components
**Testing Checkpoint**: Embedded components load and display data

9. **Create Account Session API Route**
   - Create `src/app/api/session/route.ts`
   - Generate `AccountSession` for embedded components
   - Return client secret for frontend initialization

10. **Build Embedded Component Wrapper Components**
    - Create `NotificationBanner.tsx` with Connect.js initialization
    - Create `PaymentsList.tsx` with Connect.js initialization
    - Create `PayoutsList.tsx` with Connect.js initialization
    - Each component handles loading states and errors

11. **Implement Account Details Page**
    - Create `src/app/account/[id]/page.tsx`
    - Add back button to return to list
    - Layout three embedded components in sections
    - Pass account ID to each embedded component

### Phase 4: Styling & Polish
**Testing Checkpoint**: UI is responsive and accessible on mobile, tablet, desktop

12. **Visual Polish**
    - Add consistent spacing and typography
    - Implement loading skeletons
    - Add hover states and transitions

### Phase 5: Testing & Documentation
**Testing Checkpoint**: All user journeys work end-to-end

13. **Documentation**
    - Create comprehensive `readme.md`

---

## 4. Stripe Integration Plan

### Integration Points

#### 1. List Connected Accounts
**Endpoint**: `/api/accounts`
**Method**: GET
**Server Action**:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
});

const accounts = await stripe.accounts.list({
  limit: 100
});
```

**Response Fields**:
- `id`: Connected account ID
- `business_profile.name`: Account name
- `charges_enabled`: Boolean
- `payouts_enabled`: Boolean
- `details_submitted`: Boolean
- `requirements.currently_due`: Array of requirements
- `requirements.past_due`: Array of requirements
- `requirements.disabled_reason`: String or null

#### 2. Create Account Session
**Endpoint**: `/api/session`
**Method**: POST
**Request Body**:
```json
{
  "accountId": "acct_xxx"
}
```

**Server Action**:
```typescript
const accountSession = await stripe.accountSessions.create({
  account: accountId,
  components: {
    notification_banner: { enabled: true },
    payments: { enabled: true, features: { refund_management: true } },
    payouts: { enabled: true }
  }
});
```

**Response**:
```json
{
  "clientSecret": "acct_sess_xxx_secret_xxx"
}
```

#### 3. Initialize Embedded Components
**Frontend Flow**:
```typescript
import { loadConnectAndInitialize } from '@stripe/connect-js';

const stripeConnectInstance = loadConnectAndInitialize({
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  fetchClientSecret: async () => {
    const response = await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ accountId })
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  }
});
```

### Sequential Flow Diagram

```
User Journey: View Connected Account Details
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  1. User clicks "View Details" on Account Card               │
│     └─> Navigate to /account/[id]                            │
│                                                               │
│  2. Account Details Page Loads                               │
│     └─> Fetch Account Session (POST /api/session)            │
│         └─> Server creates AccountSession with Stripe        │
│             └─> Returns client_secret                        │
│                                                               │
│  3. Initialize Embedded Components                           │
│     └─> loadConnectAndInitialize() with client_secret        │
│         ├─> Mount Notification Banner                        │
│         ├─> Mount Payments List                              │
│         └─> Mount Payouts List                               │
│                                                               │
│  4. Components Render with Live Data                         │
│     └─> User can interact with embedded UIs                  │
│         ├─> View notifications/requirements                  │
│         ├─> Browse payments                                  │
│         └─> View payout history                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Error Handling Strategies

1. **Account Fetching Errors**
   ```typescript
   try {
     const accounts = await stripe.accounts.list();
     return NextResponse.json(accounts);
   } catch (error) {
     console.error('Error fetching accounts:', error);
     return NextResponse.json(
       { error: 'Failed to fetch accounts' },
       { status: 500 }
     );
   }
   ```

2. **Account Session Creation Errors**
   ```typescript
   try {
     const session = await stripe.accountSessions.create({...});
     return NextResponse.json({ clientSecret: session.client_secret });
   } catch (error) {
     console.error('Error creating account session:', error);
     return NextResponse.json(
       { error: 'Failed to create session' },
       { status: 500 }
     );
   }
   ```

3. **Frontend Component Loading Errors**
   ```typescript
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     try {
       // Load component
     } catch (err) {
       setError('Failed to load component');
     }
   }, []);

   if (error) return <div>Error: {error}</div>;
   ```

---

## 5. UI/UX Design Decisions

- **Minimal, Modern Design**: Clean interface with ample white space, focusing attention on account statuses and embedded components
- **Status Indicators**: Visual feedback using emoji indicators (✅/❌) for quick scanning of account health
- **Card-Based Layout**: Account list uses card grid for easy scanning and clear visual hierarchy
- **Responsive Grid System**: 1 column mobile, 2 columns tablet, 3 columns desktop for optimal space usage
- **Color Coding**: Green for healthy/complete statuses, red for issues/incomplete, neutral for informational
- **Clear Navigation**: Back button on details page with breadcrumb-style context
- **Loading States**: Skeleton screens and loading spinners during API calls for perceived performance
- **Component Sections**: Clear visual separation between the three embedded components with headers
- **Accessibility**: Semantic HTML, proper heading hierarchy, keyboard navigation support, ARIA labels for status indicators
- **Typography**: Clear hierarchy with larger text for account names, smaller for IDs and metadata

---

## 6. Environment Setup Guide

### Prerequisites
- **Node.js**: Version 18.x or 20.x (LTS)
  - Check version: `node --version`
  - Install via [nodejs.org](https://nodejs.org) or use `nvm`/`nodenv`
- **npm**: Version 9.x or higher (comes with Node.js)
  - Check version: `npm --version`
- **Stripe Account**: Platform account with Connect enabled
  - Sign up at [dashboard.stripe.com](https://dashboard.stripe.com)
  - Enable Connect in your dashboard

### Step-by-Step Environment Preparation

1. **Verify Node.js Installation**
   ```bash
   node --version  # Should show v18.x or v20.x
   npm --version   # Should show v9.x or higher
   ```

2. **Create Stripe Test Connected Account** (if needed)
   - Go to Stripe Dashboard > Connect > Accounts
   - Create a test connected account
   - Note the account ID (starts with `acct_`)

3. **Gather Required API Keys**
   - Platform Secret Key: Dashboard > Developers > API keys > Secret key
   - Platform Publishable Key: Dashboard > Developers > API keys > Publishable key

4. **Set Up Environment Variables**
   - After project initialization, create `.env.local` with:
     ```
     STRIPE_SECRET_KEY=sk_test_51xxxxx
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
     ```
   - Never commit `.env.local` to version control

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `npm: command not found` | Node.js not installed | Install Node.js from nodejs.org |
| `Module not found: stripe` | Dependencies not installed | Run `npm install` |
| `Invalid API Key` | Wrong key in .env.local | Verify key starts with `sk_test_` |
| Port 3000 already in use | Another process using port | Kill process or use different port: `npm run dev -- -p 3001` |
| Embedded components not loading | Client secret expired | Account sessions expire after a few hours; refresh page |

### Dependency Compatibility Notes
- Next.js 14.x requires React 18.x (automatically handled by create-next-app)
- Stripe Node SDK 17.x is compatible with Node.js 18.x and 20.x
- @stripe/connect-js requires modern browsers with ES6 support
- All dependencies tested and compatible as of October 2025

---

## Images Required

No images are required for this application. The UI will be entirely component-based with status indicators using emoji and text. The focus is on functionality and Stripe embedded components rather than marketing imagery.

---

## Build Notes

### Stripe API Version
- All Stripe API calls will use version **2025-04-30.basil**
- This is configured in the Stripe client initialization

### Testing Strategy
- **Phase 1**: Verify server starts and environment variables load
- **Phase 2**: Test account list displays with mock/real data
- **Phase 3**: Test embedded components load and display data
- **Phase 4**: Test responsive design on multiple screen sizes
- **Phase 5**: Full user journey from list to details and back

### Known Limitations
- Account sessions expire after a few hours; users must refresh
- Demo assumes test mode; production would need webhook handlers
- Generic error handling suitable for demos, not production
- No pagination on account list (assumes <100 accounts)
