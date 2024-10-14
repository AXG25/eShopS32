import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Button, IconButton } from "@chakra-ui/react";
import useStoreConfigStore from "../../store/useStoreConfigStore";

const CustomButton = forwardRef(
  (
    {
      children,
      variant = "solid",
      isIconButton = false,
      icon,
      section = "general",
      ...props
    },
    ref
  ) => {
    const { config } = useStoreConfigStore();

    // Función para obtener el valor de configuración específico de la sección o el valor general
    const getConfigValue = (key) => {
      const sectionKey = `${section}${
        key.charAt(0).toUpperCase() + key.slice(1)
      }`;
      return config[sectionKey] || config[key];
    };

    // Estilos de botón para cada variante, utilizando los valores específicos de la sección
    const buttonStyles = {
      solid: {
        bg: getConfigValue("buttonColor"),
        color: getConfigValue("buttonTextColor"),
        _hover: {
          bg: getConfigValue("buttonColor"),
          opacity: getConfigValue("buttonHoverOpacity"),
        },
      },
      outline: {
        bg: "transparent",
        color: getConfigValue("buttonColor"),
        border: "2px solid",
        borderColor: getConfigValue("buttonColor"),
        _hover: {
          bg: getConfigValue("buttonColor"),
          color: getConfigValue("buttonTextColor"),
          opacity: getConfigValue("buttonHoverOpacity"),
        },
      },
      ghost: {
        bg: "transparent",
        color: getConfigValue("buttonColor"),
        _hover: {
          bg: getConfigValue("buttonColor"),
          opacity: getConfigValue("buttonHoverOpacity"),
          color: getConfigValue("buttonTextColor"),
        },
      },
    };

    // Propiedades comunes para todos los tipos de botones
    const commonProps = {
      ...buttonStyles[variant],
      fontSize: getConfigValue("buttonFontSize"),
      borderRadius: getConfigValue("buttonBorderRadius"),
      fontFamily: config.mainFont,
      transition: "all 0.2s",
      ...props,
    };

    // Renderizar un IconButton si isIconButton es true
    if (isIconButton) {
      return (
        <IconButton
          ref={ref}
          icon={icon}
          aria-label={props["aria-label"] || "button"}
          {...commonProps}
        />
      );
    }

    // Renderizar un Button estándar
    return (
      <Button ref={ref} {...commonProps}>
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

CustomButton.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(["solid", "outline", "ghost"]),
  isIconButton: PropTypes.bool,
  icon: PropTypes.node,
  section: PropTypes.oneOf(["general", "header", "productCard", "cart"]),
};

export default CustomButton;
