import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Icon } from "@chakra-ui/react";

/**
 * Objeto que mapea prefijos de iconos a funciones de importación de librerías.
 * @type {Object.<string, function(): Promise<any>>}
 */
const iconLibraries = {
  Fa: () => import("react-icons/fa"),
  Gi: () => import("react-icons/gi"),
  Md: () => import("react-icons/md"),
  Io: () => import("react-icons/io"),
  Ri: () => import("react-icons/ri"),
};

/**
 * Componente DynamicIcon que carga y renderiza iconos dinámicamente.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.name - El nombre del icono a cargar (debe incluir el prefijo de la librería, ej: "FaHome").
 * @param {Object} [props...rest] - Propiedades adicionales que serán pasadas al componente Icon de Chakra UI.
 * @returns {React.ReactElement|null} Un componente Icon de Chakra UI con el icono cargado, o null si el icono no se pudo cargar.
 *
 * @example
 * // Uso del componente
 * <DynamicIcon name="FaHome" color="blue.500" boxSize="24px" />
 */
const DynamicIcon = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    /**
     * Carga asincrónica del icono.
     * @async
     * @function
     */
    const loadIcon = async () => {
      if (!name) return;

      const prefix = name.substring(0, 2);
      const importLibrary = iconLibraries[prefix];

      if (!importLibrary) {
        console.error(`No library found for prefix: ${prefix}`);
        return;
      }

      try {
        const iconModule = await importLibrary();
        if (iconModule[name]) {
          setIconComponent(() => iconModule[name]);
        } else {
          console.error(`Icon ${name} not found in the library`);
        }
      } catch (error) {
        console.error(`Error loading icon: ${name}`, error);
      }
    };

    loadIcon();
  }, [name]);

  if (!IconComponent) return null;

  return <Icon as={IconComponent} {...props} />;
};

DynamicIcon.propTypes = {
  /**
   * El nombre del icono a cargar. Debe incluir el prefijo de la librería (ej: "FaHome").
   */
  name: PropTypes.string.isRequired,
  /**
   * Propiedades adicionales que serán pasadas al componente Icon de Chakra UI.
   */
  ...Icon.propTypes,
};

export default DynamicIcon;
