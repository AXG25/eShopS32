// src/App.jsx

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import theme from "./styles/theme";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import useStoreConfigStore from "./store/useStoreConfigStore";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast, { Toaster } from "react-hot-toast";
import { STORE_NAME } from "./config/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.response?.status === 401) return false;

        return failureCount < 3;
      },
      onError: (error) => {
        if (error?.response?.status !== 401) {
          toast.error(`Error: ${error.message}`);
        }
      },
    },
    mutations: {
      onError: (error) => {
        if (error?.response?.status !== 401) {
          toast.error(`Error: ${error.message}`);
        }
      },
    },
  },
});

function App() {
  const { config } = useStoreConfigStore();
  const basename = import.meta.env.PROD ? '/s3' : '/';
  
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript
            initialColorMode={config.darkMode ? "dark" : "light"}
          />
          <Toaster position="top-right" />
          <BrowserRouter basename={`/${STORE_NAME}`}>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
