/* eslint-disable perfectionist/sort-imports */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { trpc } from './hooks/trpc';
import { Provider } from 'react-redux';
import store from 'src/store';
import { useAuth } from './store/slices/authSlice';

// ----------------------------------------------------------------------

function Root() {
  const { token } = useAuth();

  const getAuthHeader = () => {
    console.log('App.applying autthorization header');
    return !token ? {} : { authorization: `Bearer ${token ?? ''}` };
  };
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(
    () =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: 'http://localhost:3000/trpc',
            // You can pass any HTTP headers you wish here
            async headers() {
              return {
                // authorization: getAuthCookie(),
                ...getAuthHeader(),
              };
            },
          }),
        ],
      }),
    [getAuthHeader]
  );
  useScrollToTop();

  return (
    <ThemeProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {/* Your app here */}
          <Router />
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
