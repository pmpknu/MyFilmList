import { Provider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';
import store from '../store';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </Provider>
  );
};

export default App;
