# Stripe Servicing Portal - Embedded Components Demo

A Next.js application demonstrating Stripe's Embedded Components for platform accounts managing connected accounts. This demo showcases the Notification Banner, Payments List, and Payouts components.

## Features

- **Connected Accounts List**: View all connected accounts with real-time status indicators
- **Account Status Monitoring**: Track charges_enabled, payouts_enabled, details_submitted, and requirements
- **Embedded Components Integration**:
  - Notification Banner for account-level alerts
  - Payments List for payment management
  - Payouts List for payout history

## Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 18.x or 20.x (LTS)
- **npm**: Version 9.x or higher
- **Stripe Account**: Platform account with Connect enabled
- **Connected Accounts**: At least one test connected account for demonstration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.local` file and add your Stripe credentials:

```bash
# .env.local

# Get these from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_51xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
```

**Where to find your credentials:**

- Go to [Stripe Dashboard > Developers > API keys](https://dashboard.stripe.com/test/apikeys)
- Use **Test mode** keys for development
- Copy both the Secret key (starts with `sk_test_`) and Publishable key (starts with `pk_test_`)

### 3. Create Test Connected Accounts (Optional)

If you don't have any connected accounts yet:

1. Go to [Stripe Dashboard > Connect > Accounts](https://dashboard.stripe.com/test/connect/accounts/overview)
2. Click "Add account" or use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to create test accounts
3. Complete the onboarding flow for at least one account

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Viewing Connected Accounts

The home page displays all connected accounts in a card grid. Each card shows:

- Account ID and name
- Status indicators (✅/❌):
  - **Charges Enabled**: Can accept payments
  - **Payouts Enabled**: Can receive payouts
  - **Details Submitted**: Completed onboarding
  - **Currently Due**: Requirements needing attention (✅ = none)
  - **Past Due**: Overdue requirements (✅ = none)
- Disabled reason (if applicable)

### Viewing Account Details

Click "View Details" on any account card to see:

1. **Notification Banner**: Displays important alerts and requirements for the account
2. **Payments**: Lists all payments processed by the connected account with refund management
3. **Payouts**: Shows payout history and details

Use the "Back to Accounts" button to return to the list view.

## Key Integration Concepts

### Account Sessions

The app uses Stripe's AccountSession API to securely initialize embedded components:

```typescript
// Server-side (API route)
const accountSession = await stripe.accountSessions.create({
  account: accountId,
  components: {
    notification_banner: { enabled: true },
    payments: { enabled: true, features: { refund_management: true } },
    payouts: { enabled: true },
  },
});
```

### Connect.js SDK

Embedded components are initialized client-side using the Connect.js SDK:

```typescript
import { loadConnectAndInitialize } from '@stripe/connect-js';

const stripeConnectInstance = loadConnectAndInitialize({
  publishableKey: 'pk_test_...',
  fetchClientSecret: async () => {
    // Fetch client secret from your API
    const response = await fetch('/api/session', {...});
    return clientSecret;
  },
});
```

### Component Lifecycle

1. User navigates to account details page
2. Client requests account session from `/api/session`
3. Server creates AccountSession with Stripe API
4. Client receives client_secret
5. Connect.js initializes with client_secret
6. Embedded components mount and display live data

## Project Structure

```
zebra-servicing-portal/
├── app/
│   ├── page.tsx                    # Connected accounts list
│   ├── account/[id]/page.tsx       # Account details with embedded components
│   ├── api/
│   │   ├── accounts/route.ts       # Fetch connected accounts
│   │   └── session/route.ts        # Create account sessions
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── AccountCard.tsx             # Account list item
│   ├── StatusBadge.tsx             # Status indicator
│   ├── NotificationBanner.tsx      # Embedded notification banner
│   ├── PaymentsList.tsx            # Embedded payments list
│   └── PayoutsList.tsx             # Embedded payouts list
├── lib/
│   └── stripe.ts                   # Stripe client configuration
├── types/
│   └── stripe.ts                   # TypeScript type definitions
└── .env.local                      # Environment variables (create this)
```

## API Routes

### GET `/api/accounts`

Fetches all connected accounts for the platform.

**Response:**
```json
[
  {
    "id": "acct_xxx",
    "business_profile": { "name": "Business Name" },
    "charges_enabled": true,
    "payouts_enabled": true,
    "details_submitted": true,
    "requirements": {
      "currently_due": [],
      "past_due": [],
      "disabled_reason": null
    }
  }
]
```

### POST `/api/session`

Creates an AccountSession for embedded components.

**Request:**
```json
{
  "accountId": "acct_xxx"
}
```

**Response:**
```json
{
  "clientSecret": "acct_sess_xxx_secret_xxx"
}
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API Key" error | Verify keys in `.env.local` start with `sk_test_` and `pk_test_` |
| "No connected accounts found" | Create test accounts in Stripe Dashboard > Connect > Accounts |
| Port 3000 already in use | Run on different port: `npm run dev -- -p 3001` |
| Embedded components not loading | Check browser console for errors; ensure client secret is valid |
| Account sessions expired | Refresh the page to generate a new session |

### Development Tips

- **Use Test Mode**: Always use test mode API keys during development
- **Check Browser Console**: Embedded components log helpful debugging information
- **Stripe Dashboard**: Monitor API requests in Dashboard > Developers > Logs
- **Session Expiration**: Account sessions expire after a few hours; refresh to create new ones

## Technologies Used

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS 3**: Utility-first styling
- **Stripe Node SDK**: Server-side Stripe API calls
- **@stripe/connect-js**: Embedded Components SDK
- **Stripe API Version**: 2025-04-30.basil

## Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Deploy to Vercel

This application is optimized for deployment on Vercel.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment Steps

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your git repository
   - Vercel will automatically detect Next.js

3. **Configure Environment Variables**

   In Vercel project settings, add these environment variables:

   | Variable | Value | Description |
   |----------|-------|-------------|
   | `STRIPE_SECRET_KEY` | `sk_test_51...` | Your Stripe secret key |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51...` | Your Stripe publishable key |

   **Important**: Use the same test mode keys from your local development.

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll receive a production URL (e.g., `your-app.vercel.app`)

### Automatic Deployments

Once connected to Vercel:
- **Production**: Pushes to `main` branch automatically deploy to production
- **Preview**: Pushes to other branches create preview deployments
- **Environment Variables**: Managed in Vercel dashboard, not in code

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificates

### Post-Deployment Checklist

- ✅ Verify environment variables are set correctly
- ✅ Test the production URL
- ✅ Check all connected accounts load properly
- ✅ Test embedded components functionality
- ✅ Verify responsive design on mobile devices

## Additional Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Embedded Components Guide](https://stripe.com/docs/connect/get-started-connect-embedded-components)
- [AccountSession API Reference](https://stripe.com/docs/api/account_sessions)
- [Next.js Documentation](https://nextjs.org/docs)

## Notes

- This is a demo application for **test mode** only
- Account sessions expire and require page refresh
- Generic error handling is suitable for demos, not production
- No pagination implemented (assumes <100 accounts)
- Production applications should implement webhook handlers and more robust error handling

## Support

For issues with this demo:
1. Check the troubleshooting section above
2. Review Stripe Dashboard logs
3. Verify environment variables are correct
4. Ensure test connected accounts exist

For Stripe-specific questions, visit [Stripe Support](https://support.stripe.com).
