import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Icon } from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa"; // Icono por defecto

// Caché para iconos ya cargados
const iconCache = new Map();

/**
 * Objeto que mapea prefijos de iconos a funciones de importación de librerías.
 * @type {Object.<string, function(): Promise<any>>}
 */
const iconLibraries = {
  Ai: () => import("react-icons/ai"),
  Bi: () => import("react-icons/bi"),
  Bs: () => import("react-icons/bs"),
  Cg: () => import("react-icons/cg"),
  Ci: () => import("react-icons/ci"),
  Di: () => import("react-icons/di"),
  Fa: () => import("react-icons/fa"),
  Fa6: () => import("react-icons/fa6"),
  Fc: () => import("react-icons/fc"),
  Fi: () => import("react-icons/fi"),
  Gi: () => import("react-icons/gi"),
  Go: () => import("react-icons/go"),
  Gr: () => import("react-icons/gr"),
  Hi: () => import("react-icons/hi"),
  Hi2: () => import("react-icons/hi2"),
  Im: () => import("react-icons/im"),
  Io: () => import("react-icons/io"),
  Io5: () => import("react-icons/io5"),
  Lia: () => import("react-icons/lia"),
  Lu: () => import("react-icons/lu"),
  Md: () => import("react-icons/md"),
  Pi: () => import("react-icons/pi"),
  Ri: () => import("react-icons/ri"),
  Rx: () => import("react-icons/rx"),
  Si: () => import("react-icons/si"),
  Sl: () => import("react-icons/sl"),
  Tb: () => import("react-icons/tb"),
  Tfi: () => import("react-icons/tfi"),
  Ti: () => import("react-icons/ti"),
  Vsc: () => import("react-icons/vsc"),
  Wi: () => import("react-icons/wi"),
};

// Mapeo de iconos personalizados
const customIcons = {
  hose: "GiGardeningHose",
  // Agrega aquí más mapeos personalizados si es necesario
};

/**
 * Función para importar un icono dinámicamente
 * @param {string} iconName - Nombre del icono a importar
 * @returns {Promise<React.ComponentType|null>} Componente del icono o null si no se encuentra
 */
const importIcon = async (iconName) => {
  const prefix = iconName.match(/^[A-Z][a-z][a-z]?/)?.[0];
  if (!prefix || !iconLibraries[prefix]) {
    console.warn(`No library found for icon: ${iconName}`);
    return null;
  }

  try {
    const module = await iconLibraries[prefix]();
    return module[iconName] || null;
  } catch (error) {
    console.error(`Error importing icon ${iconName}:`, error);
    return null;
  }
};

/**
 * Componente DynamicIcon que carga y renderiza iconos dinámicamente.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.name - El nombre del icono a cargar (debe incluir el prefijo de la librería, ej: "FaHome" o "TfiHome").
 * @param {Object} [props...rest] - Propiedades adicionales que serán pasadas al componente Icon de Chakra UI.
 * @returns {React.ReactElement} Un componente Icon de Chakra UI con el icono cargado, o un icono por defecto si no se pudo cargar.
 *
 * @example
 * // Uso del componente
 * <DynamicIcon name="FaHome" color="blue.500" boxSize="24px" />
 */
const DynamicIcon = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState(() => FaQuestion);

  const loadIcon = useCallback(async () => {
    if (!name) return;

    // Manejar iconos personalizados
    const iconName = customIcons[name] || name;

    // Verificar caché
    if (iconCache.has(iconName)) {
      setIconComponent(() => iconCache.get(iconName));
      return;
    }

    const importedIcon = await importIcon(iconName);
    if (importedIcon) {
      iconCache.set(iconName, importedIcon);
      setIconComponent(() => importedIcon);
    } else {
      console.warn(`Icon ${iconName} not found. Using default icon.`);
      setIconComponent(() => FaQuestion);
    }
  }, [name]);

  useEffect(() => {
    loadIcon();
  }, [loadIcon]);

  return <Icon as={IconComponent} {...props} />;
};

DynamicIcon.propTypes = {
  /**
   * El nombre del icono a cargar. Debe incluir el prefijo de la librería (ej: "FaHome" o "TfiHome").
   */
  name: PropTypes.string.isRequired,
  /**
   * Propiedades adicionales que serán pasadas al componente Icon de Chakra UI.
   */
  ...Icon.propTypes,
};

export default DynamicIcon;