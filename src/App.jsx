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
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  const { config } = useStoreConfigStore();

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript
            initialColorMode={config.darkMode ? "dark" : "light"}
          />
             <Toaster position="top-right" />
          <BrowserRouter>
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
