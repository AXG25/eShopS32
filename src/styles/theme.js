// src/styles/theme.js

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#E6FFFA",
      100: "#B2F5EA",
      200: "#81E6D9",
      300: "#4FD1C5",
      400: "#38B2AC",
      500: "#319795",
      600: "#2C7A7B",
      700: "#285E61",
      800: "#234E52",
      900: "#1D4044",
    },
    primary: "var(--primary-color, #319795)",
    secondary: "var(--secondary-color, #38B2AC)",
    buttonColor: "var(--button-color, #319795)",
    buttonTextColor: "var(--button-text-color, #FFFFFF)",
    buttonColorDark: "var(--dark-mode-button-color, #81E6D9)",
    buttonTextColorDark: "var(--dark-mode-button-text-color, #1A202C)",
    backgroundColor: "var(--background-color, #FFFFFF)",
    textColor: "var(--text-color, #1A202C)",
    headerColor: "var(--header-color, #FFFFFF)",
    headerTextColor: "var(--header-text-color, #1A202C)",
    asideColor: "var(--aside-color, #F7FAFC)",
  },
  fonts: {
    heading: 'var(--main-font, "Roboto", sans-serif)',
    body: 'var(--main-font, "Open Sans", sans-serif)',
  },
  fontSizes: {
    base: "var(--base-font-size, 16px)",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.800" : "backgroundColor",
        color: props.colorMode === "dark" ? "white" : "textColor",
        fontSize: "base",
        fontFamily: "body",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
        transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
          color:
            props.colorMode === "dark"
              ? "buttonTextColorDark"
              : "buttonTextColor",
          _hover: {
            opacity: "var(--button-hover-opacity, 0.8)",
            transform: "translateY(-2px)",
            boxShadow: "md",
          },
          _active: {
            transform: "translateY(0)",
            boxShadow: "sm",
          },
        }),
        outline: (props) => ({
          bg: "transparent",
          border: "2px solid",
          borderColor:
            props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
          color: props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
          _hover: {
            bg: props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
            color:
              props.colorMode === "dark"
                ? "buttonTextColorDark"
                : "buttonTextColor",
            opacity: "var(--button-hover-opacity, 0.8)",
          },
        }),
        ghost: (props) => ({
          bg: "transparent",
          color: props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
          _hover: {
            bg:
              props.colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.100",
            opacity: "var(--button-hover-opacity, 0.8)",
          },
        }),
        link: (props) => ({
          color: props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
          _hover: {
            textDecoration: "underline",
            opacity: "var(--button-hover-opacity, 0.8)",
          },
        }),
      },
      defaultProps: {
        variant: "solid",
      },
    },
    Input: {
      variants: {
        filled: (props) => ({
          field: {
            bg: props.colorMode === "dark" ? "whiteAlpha.100" : "gray.100",
            _hover: {
              bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.200",
            },
            _focus: {
              bg: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.300",
              borderColor:
                props.colorMode === "dark" ? "buttonColorDark" : "buttonColor",
            },
          },
        }),
      },
      defaultProps: {
        variant: "filled",
      },
    },
    Heading: {
      baseStyle: {
        color: "headerTextColor",
      },
    },
    Text: {
      baseStyle: {
        color: "textColor",
      },
    },
    Box: {
      baseStyle: {
        bg: "backgroundColor",
      },
    },
  },
});

export default theme;
