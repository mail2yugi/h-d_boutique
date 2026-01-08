export default {
  expo: {
    name: 'H & D Boutique',
    slug: 'hd-boutique',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.hdboutique.app',
    },
    android: {
      package: 'com.hdboutique.app',
    },
    scheme: 'hd-boutique',
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001',
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '72660985008-ulsd7t85ec69gdhcogems519o0hodkpb.apps.googleusercontent.com',
    },
  },
};
