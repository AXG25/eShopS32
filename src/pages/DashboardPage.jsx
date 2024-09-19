// src/pages/DashboardPage.jsx
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Heading,
} from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Componente para mostrar una estadística individual
const StatCard = ({ label, number, helpText, type }) => (
  <Stat
    px={{ base: 2, md: 4 }}
    py={'5'}
    shadow={'xl'}
    border={'1px solid'}
    borderColor={'gray.200'}
    rounded={'lg'}
  >
    <StatLabel fontWeight={'medium'} isTruncated>
      {label}
    </StatLabel>
    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
      {number}
    </StatNumber>
    <StatHelpText>
      <StatArrow type={type} />
      {helpText}
    </StatHelpText>
  </Stat>
);

// Datos de ejemplo para el gráfico
const salesData = [
  { name: 'Ene', ventas: 4000 },
  { name: 'Feb', ventas: 3000 },
  { name: 'Mar', ventas: 5000 },
  { name: 'Abr', ventas: 4500 },
  { name: 'May', ventas: 6000 },
  { name: 'Jun', ventas: 5500 },
];

// Datos de ejemplo para la tabla de ventas recientes
const recentSales = [
  { id: 1, product: 'Smartphone XYZ', date: '2024-09-18', amount: 599.99 },
  { id: 2, product: 'Laptop ABC', date: '2024-09-17', amount: 999.99 },
  { id: 3, product: 'Smartwatch 123', date: '2024-09-16', amount: 199.99 },
  { id: 4, product: 'Auriculares Pro', date: '2024-09-15', amount: 149.99 },
];

const DashboardPage = () => {
  return (
    <Box maxWidth="1200px" margin="auto" mt={8} p={4}>
      <Heading mb={6}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
        <StatCard label="Ventas Totales" number="€55,234" helpText="23% más que el mes pasado" type="increase" />
        <StatCard label="Nuevos Clientes" number="245" helpText="10% más que el mes pasado" type="increase" />
        <StatCard label="Tasa de Conversión" number="3.2%" helpText="1% menos que el mes pasado" type="decrease" />
        <StatCard label="Promedio de Venta" number="€225" helpText="5% más que el mes pasado" type="increase" />
      </SimpleGrid>

      <Box mt={8} bg="white" p={4} borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>Ventas Mensuales</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={8} bg="white" p={4} borderRadius="lg" shadow="md">
        <Heading size="md" mb={4}>Ventas Recientes</Heading>
        <Table variant="simple">
          <TableCaption>Últimas 4 ventas realizadas</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Producto</Th>
              <Th>Fecha</Th>
              <Th isNumeric>Monto</Th>
            </Tr>
          </Thead>
          <Tbody>
            {recentSales.map((sale) => (
              <Tr key={sale.id}>
                <Td>{sale.id}</Td>
                <Td>{sale.product}</Td>
                <Td>{sale.date}</Td>
                <Td isNumeric>€{sale.amount.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default DashboardPage;