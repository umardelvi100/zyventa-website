import { useEffect, useState } from "react";

export function useHasMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-mount flag to avoid SSR hydration mismatch
    setMounted(true);
  }, []);

  return mounted;
}
