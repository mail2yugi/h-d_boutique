# H & D Boutique Mobile App

React Native mobile app built with Expo.

## Tech Stack

- React Native
- Expo SDK 50
- TypeScript
- React Navigation
- Axios

## Development

```bash
# Install dependencies
pnpm install

# Start Expo development server
pnpm --filter mobile start

# Run on iOS simulator
pnpm --filter mobile ios

# Run on Android emulator
pnpm --filter mobile android
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```env
EXPO_PUBLIC_API_URL=http://localhost:5001
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Distribution

### Expo Go (Free)

Share the Expo Go QR code or link with users.

```bash
npx expo publish
```

Users can scan the QR code in the Expo Go app to access your app.

**Cost: $0/month** - Completely free distribution via Expo Go.

### Building Standalone Apps (Optional)

If you want to distribute via App Store/Play Store (requires paid accounts):

```bash
# Build for iOS (requires Apple Developer Account - $99/year)
eas build --platform ios

# Build for Android (one-time $25 fee for Play Store)
eas build --platform android
```

**Note:** Standalone builds require paid developer accounts. For 100% free distribution, use Expo Go.

## Features

- Browse products
- Product details with image gallery
- WhatsApp integration
- Google OAuth authentication
- Favorites
- Account management

## Cost: $0/month

100% free using:
- Expo Go (free distribution)
- Backend on Vercel Free
- MongoDB Atlas Free
