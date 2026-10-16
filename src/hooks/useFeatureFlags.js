import { useEffect, useState } from 'react';
import { DEFAULT_FLAGS, loadFlags } from '../services/remoteConfig';

export function useFeatureFlags() {
  const [flags, setFlags] = useState(DEFAULT_FLAGS);

  useEffect(() => {
    let active = true;
    loadFlags().then((f) => active && setFlags(f));
    return () => {
      active = false;
    };
  }, []);

  return flags;
}
