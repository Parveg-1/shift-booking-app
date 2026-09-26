import { Platform } from 'react-native';

const PORT = 8080;

const PLATFORM_DEFAULT = Platform.select({
  android: `http://10.0.2.2:${PORT}`,
  default: `http://localhost:${PORT}`,
});

const configured = process.env.EXPO_PUBLIC_API_URL || PLATFORM_DEFAULT;

export const API_BASE_URL = configured.replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 15000;
