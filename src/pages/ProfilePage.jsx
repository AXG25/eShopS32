// src/pages/ProfilePage.jsx
import { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica real para actualizar el perfil en el backend
    login({ ...user, name, email });
    setIsEditing(false);
    toast({
      title: 'Perfil actualizado',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxWidth="600px" margin="auto" mt={8} p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>Perfil de Usuario</Heading>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue">Guardar Cambios</Button>
            </VStack>
          </form>
        ) : (
          <VStack align="stretch" spacing={4}>
            <Text><strong>Nombre:</strong> {user?.name}</Text>
            <Text><strong>Email:</strong> {user?.email}</Text>
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default ProfilePage;