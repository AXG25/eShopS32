// src/config/env.js

/**
 * Extrae el nombre de la tienda de la URL actual
 * @returns {string} Nombre de la tienda
 */
const getStoreName = () => {
  try {
    // Obtiene el hostname de la URL actual (ej: eshop.s3-la.com)
    const hostname = window.location.hostname;
    // Obtiene el pathname de la URL actual (ej: /montallas o /s3)
    const pathname = window.location.pathname;
    
    // Si hay un pathname específico (diferente a /), úsalo como nombre de tienda
    if (pathname && pathname !== '/') {
      // Elimina la barra inicial y cualquier barra final
      return pathname.replace(/^\/|\/$/g, '');
    }
    
    // Si no hay pathname específico, extrae el subdominio
    const subdomain = hostname.split('.')[0];
    if (subdomain === 'eshop') {
      // Si el hostname es eshop.s3-la.com, usa 's3' como nombre por defecto
      return 's3';
    }
    return subdomain;
  } catch (error) {
    console.warn('Error al obtener el nombre de la tienda:', error);
    return 's3'; // Valor por defecto si algo falla
  }
};

/**
 * Determina la URL base de la API según el entorno de ejecución.
 * @returns {string} La URL base de la API.
 */
const getBaseUrl = () => {
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
  
  if (isProduction && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  return "http://localhost:3000";
};

const BASE_URL = getBaseUrl();
const STORE_NAME = getStoreName();

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
      // Reemplaza el placeholder {storeName} con el nombre real de la tienda
      const processedValue = value.replace('{storeName}', STORE_NAME);
      fullUrls[key] = `${BASE_URL}${processedValue}`;
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
    BASE: "/{storeName}/products",
    CATEGORIES: "/{storeName}/store/categories", // Usa un placeholder para el nombre de la tienda
    SYNC: "/sync",
  },

  CART: {
    CREATE_ORDER: "/orders",
  },

  CUSTOMIZED: {
    BASE: "/user/config",
  },
});

export default env;