import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Spacer,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaGear } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import DrawerControlPanel from "./DrawerControlPanel";
import { Outlet } from "react-router-dom";

const MainLayaout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const login = false;
  return (
    <>
      {login ? (
        <>
          {/* Header para cuando este logueado */}
          <Flex
            minWidth="max-content"
            alignItems="center"
            gap="2"
            bg="#3182ce"
            maxW="100%"
            p={2}
            color="white"
          >
            <Box p="2">
              <Tooltip hasArrow label=" Panel de Control ">
                <Button
                  colorScheme="gray"
                  color="#3182ce"
                  ref={btnRef}
                  onClick={onOpen}
                >
                  <FaGear />
                </Button>
              </Tooltip>
              <DrawerControlPanel
                isOpen={isOpen}
                onClose={onClose}
                finalFocusRef={btnRef}
                placement="left"
              />
            </Box>
            <Spacer />
            <Box>
              <Heading size="md">Panel: Administrador</Heading>
            </Box>
            <Spacer />
            <Box p="2">
              <Tooltip hasArrow label=" Cerrar sesion">
                <Button colorScheme="gray" color="#3182ce">
                  <TbLogout2 />
                </Button>
              </Tooltip>
            </Box>
          </Flex>
        </>
      ) : (
        <>
          {/* Header para cuando NO este logueado */}
          <Flex
            minWidth="max-content"
            alignItems="center"
            gap="2"
            bg="#3182ce"
            maxW="100%"
            p={4}
            color="white"
          >
            <Box p="2">
              <Heading size="md">eShopS32</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap="2">
              <Button colorScheme="gray" color="#3182ce">
                Registrarse
              </Button>
              <Button colorScheme="gray" color="#3182ce">
                Iniciar sesion
              </Button>
            </ButtonGroup>
          </Flex>
        </>
      )}

      {/* Cuerpo */}
      <Center>
        <Outlet />
      </Center>
    </>
  );
};

export default MainLayaout;
