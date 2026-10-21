import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PinLock } from '@/components/pin-lock';
import { InactivityOverlay } from '@/components/inactivity-overlay';
import { Layout } from '@/components/layout';
import { Home } from '@/pages/home';
import { Editor } from '@/pages/editor';
import { Archive } from '@/pages/archive';
import { Kitty } from '@/pages/kitty';
import { Settings } from '@/pages/settings';
import { SharedEntry } from '@/pages/shared-entry';
import { JournalProvider, useJournal } from '@/hooks/use-journal';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
      <div className="font-heading text-6xl text-primary mb-4">?</div>
      <h2 className="font-heading text-4xl text-foreground mb-4">Oh no!</h2>
      <p className="text-muted-foreground">This page is hiding.</p>
    </div>
  );
}

import { ScrollToTop } from '@/components/scroll-to-top';

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/archive" component={Archive} />
        <Route path="/kitty" component={Kitty} />
        <Route path="/settings" component={Settings} />
        <Route path="/entry/:id" component={Editor} />
        <Route path="/shared/:id" component={SharedEntry} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

// Inner component that has access to JournalProvider context
function AppInner() {
  const isSharedRoute = window.location.pathname.startsWith('/shared/');
  const [isLocked, setIsLocked] = useState(!isSharedRoute);
  const [showInactivity, setShowInactivity] = useState(false);
  const { refresh } = useJournal();
  const hiddenTimeRef = useRef(0);

  // Auto-refresh entries whenever the app becomes visible again
  // This ensures notes written on another device always appear
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenTimeRef.current = Date.now();
      } else {
        const awayMs = Date.now() - hiddenTimeRef.current;
        if (hiddenTimeRef.current && awayMs > 300000) {
          // Away > 5 min: show inactivity overlay (user will tap to refresh)
          setShowInactivity(true);
        } else if (hiddenTimeRef.current && awayMs > 5000) {
          // Away > 5 seconds: silently refresh entries in the background
          refresh();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refresh]);

  const handleDismissInactivity = useCallback(() => {
    setShowInactivity(false);
    // Always do a fresh fetch when the user wakes the app back up
    refresh();
  }, [refresh]);

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AnimatePresence>
        {showInactivity && (
          <InactivityOverlay
            key="inactivity"
            onDismiss={handleDismissInactivity}
          />
        )}
        {isLocked && !showInactivity && <PinLock onUnlock={() => setIsLocked(false)} key="lock" />}
      </AnimatePresence>
      {!isLocked && !showInactivity && <Router />}
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JournalProvider>
        <AppInner />
      </JournalProvider>
    </QueryClientProvider>
  );
}

export default App;
