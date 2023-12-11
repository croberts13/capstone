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
import { Snackbar } from '@mui/material';

// ----------------------------------------------------------------------

function Root() {
  const { token, _refreshToken } = useAuth();
  const [snackOpenMsg, setSnackOpenMsg] = useState(false);

  const getAuthHeader = () => {
    const result = !token
      ? {}
      : { authorization: `Bearer ${token ?? ''}`, refreshToken: _refreshToken };
    console.log('App.applying authorization header', token, result);
    return result;
  };
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          mutations: {
            onError: (error) => {
              console.log(error);
              setSnackOpenMsg(JSON.stringify(error, null, 4));
            },
            queries: {
              onError: (error) => {
                console.log(error);
                setSnackOpenMsg(JSON.stringify(error, null, 4));
              },
            },
          },
        },
      })
  );
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
          <Snackbar
            open={Boolean(snackOpenMsg)}
            onClose={() => setSnackOpenMsg(false)}
            autoHideDuration={6000}
          >
            {snackOpenMsg ?? ''}
          </Snackbar>
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
