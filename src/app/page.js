"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store.js';

export default function RootPage() {
  const [state] = useStore();
  const router = useRouter();

  useEffect(() => {
    if (state.isInitialized) {
      if (state.staffUser) {
        router.replace(state.appLayout === 'grid' ? '/home' : '/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [state.isInitialized, state.staffUser, state.appLayout, router]);

  return null;
}
