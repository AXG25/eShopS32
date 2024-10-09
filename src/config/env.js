// src/config/env.js

/**
 * Determina la URL base de la API según el entorno de ejecución.
 * @returns {string} La URL base de la API.
 */
const getBaseUrl = () => {
  const env = import.meta.env.MODE;

  const urls = {
    development: "http://localhost:3000",
    production: import.meta.env.VITE_API_URL,
  };

  return urls[env] || urls.development;
};

const BASE_URL = getBaseUrl();

/**
 * Función que genera las rutas completas para cada endpoint.
 * @param {Object} endpoints - Objeto con los endpoints relativos.
 * @returns {Object} Objeto con los endpoints completos.
 */
const generateFullUrls = (endpoints) => {
  const fullUrls = {};
  for (const [key, value] of Object.entries(endpoints)) {
    if (typeof value === 'object') {
      fullUrls[key] = generateFullUrls(value);
    } else {
      fullUrls[key] = `${BASE_URL}${value}`;
    }
  }
  return fullUrls;
};

/**
 * Objeto que contiene todos los endpoints base de la API.
 */
const env = generateFullUrls({
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    REFRESH_TOKEN: "/refresh-token",
  },

  PRODUCTS: {
    BASE: "/products",
    CATEGORIES: "/store/s3/categories",
    SYNC: "/sync",
  },

  CART: {
    CREATE_ORDER: "/orders",
  },

  CUSTOMIZED: {
    BASE: "/user/config",
  },
  // Puedes agregar más servicios aquí
});

export default env;