import {
  getRemoteConfig,
  setConfigSettings,
  setDefaults,
  fetchAndActivate,
  getBoolean,
} from '@react-native-firebase/remote-config';

// Feature toggles controlados pelo Firebase Remote Config.
// Crie estes parâmetros (tipo Boolean) no console do Firebase.
export const DEFAULT_FLAGS = {
  show_monthly_summary: true, // card "Total do mês" na tela de gastos
  show_category_filter: true, // filtro por categoria na tela de gastos
};

export function readFlags() {
  const rc = getRemoteConfig();
  return {
    show_monthly_summary: getBoolean(rc, 'show_monthly_summary'),
    show_category_filter: getBoolean(rc, 'show_category_filter'),
  };
}

export async function loadFlags() {
  try {
    const rc = getRemoteConfig();
    await setConfigSettings(rc, {
      minimumFetchIntervalMillis: __DEV__ ? 0 : 60 * 60 * 1000,
    });
    await setDefaults(rc, DEFAULT_FLAGS);
    await fetchAndActivate(rc);
    return readFlags();
  } catch (e) {
    if (__DEV__) console.warn('[remote-config]', e?.message);
    return DEFAULT_FLAGS;
  }
}
