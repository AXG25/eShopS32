import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FaGear } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import DrawerControlPanel from "./DrawerControlPanel";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const MainLayaout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const login = true;
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
              {/* Botón para abrir el panel de control */}
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

              {/* Panel de control */}
              <DrawerControlPanel
                isOpen={isOpen}
                onClose={onClose}
                finalFocusRef={btnRef}
                placement="left"
              />
            </Box>

            <Spacer />

            <Box>
              <NavBar />
            </Box>

            <Spacer />

            <Box p="2">
              <Flex>
                <Text fontWeight="bold" p={2}> Hola Usuario</Text>

                {/* Botón para cerrar sesion */}
                <Tooltip hasArrow label=" Cerrar sesion">
                  <Button colorScheme="gray" color="#3182ce">
                    <TbLogout2 />
                  </Button>
                </Tooltip>
              </Flex>
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
