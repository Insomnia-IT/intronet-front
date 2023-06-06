import { useEffect, useState } from "preact/hooks";

/**
 * Хук для отслеживания онлайн-статуса устройства
 */
export const useOnlineState = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onlineHandler = () => {
      setIsOnline(true);
    };
    const offlineHandler = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  });

  return { isOnline };
};
