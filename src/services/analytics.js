import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserId,
} from '@react-native-firebase/analytics';

// Eventos usados: login, sign_up, logout, expense_created, expense_updated, expense_deleted
export async function trackEvent(name, params = {}) {
  try {
    await logEvent(getAnalytics(), name, params);
  } catch (e) {
    if (__DEV__) console.warn('[analytics]', name, e?.message);
  }
}

export async function trackScreen(name) {
  try {
    await logScreenView(getAnalytics(), { screen_name: name, screen_class: name });
  } catch (e) {
    if (__DEV__) console.warn('[analytics] screen', name, e?.message);
  }
}

export async function setAnalyticsUser(uid) {
  try {
    await setUserId(getAnalytics(), uid);
  } catch {}
}
