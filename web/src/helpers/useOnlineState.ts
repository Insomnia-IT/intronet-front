import { useSyncExternalStore } from 'preact/compat'

const getSnapshot = () => navigator.onLine;
const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

/**
 * Хук для отслеживания онлайн-статуса устройства
 */
export const useOnlineState = () => useSyncExternalStore(subscribe, getSnapshot);
