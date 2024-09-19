// src/pages/OrdersPage.jsx
import {
    Box,
    VStack,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  
  // Simula una llamada a la API para obtener los pedidos
  const fetchOrders = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, date: '2023-09-15', total: 125.99, status: 'Entregado' },
          { id: 2, date: '2023-09-20', total: 79.50, status: 'En proceso' },
          { id: 3, date: '2023-09-25', total: 199.99, status: 'Enviado' },
        ]);
      }, 1000);
    });
  };
  
  const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      fetchOrders().then((data) => {
        setOrders(data);
        setIsLoading(false);
      });
    }, []);
  
    return (
      <Box maxWidth="800px" margin="auto" mt={8} p={4}>
        <VStack spacing={6} align="stretch">
          <Heading>Mis Pedidos</Heading>
          {isLoading ? (
            <Text>Cargando pedidos...</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID del Pedido</Th>
                  <Th>Fecha</Th>
                  <Th>Total</Th>
                  <Th>Estado</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    <Td>{order.date}</Td>
                    <Td>€{order.total.toFixed(2)}</Td>
                    <Td>{order.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </VStack>
      </Box>
    );
  };
  
  export default OrdersPage;