import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Select,
  Input,
  Text,
  Button,
  HStack,
  VStack,
  Collapse,
  useDisclosure,
  Badge,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import useProductStore from '../../store/useProductStore';

const FilterBar = ({ onFilterChange }) => {
  const { products } = useProductStore();
  const { isOpen, onToggle } = useDisclosure();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const categories = ['Todas', ...new Set(products.map(product => product.category))];

  useEffect(() => {
    const filters = {
      priceRange: [minPrice ? parseFloat(minPrice) : 0, maxPrice ? parseFloat(maxPrice) : Infinity],
      category: category === 'Todas' ? '' : category,
      sortBy,
    };
    onFilterChange(filters);
  }, [minPrice, maxPrice, category, sortBy, onFilterChange]);

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setCategory('');
    setSortBy('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (minPrice || maxPrice) count++;
    if (category && category !== 'Todas') count++;
    if (sortBy) count++;
    return count;
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" shadow="sm" mb={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <HStack>
          <Button onClick={onToggle} rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} variant="ghost">
            Filtros
          </Button>
          {getActiveFiltersCount() > 0 && (
            <Badge colorScheme="blue" variant="solid" borderRadius="full">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </HStack>
        <IconButton
          icon={<CloseIcon />}
          onClick={clearFilters}
          size="sm"
          variant="ghost"
          aria-label="Limpiar filtros"
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={4} align="stretch" mt={4}>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" wrap="wrap">
            <Box>
              <Text fontWeight="bold" mb={2}>Rango de Precio</Text>
              <HStack>
                <Input
                  placeholder="Min €"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  type="number"
                  min="0"
                  w="100px"
                />
                <Text>-</Text>
                <Input
                  placeholder="Max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  type="number"
                  min="0"
                  w="100px"
                />
              </HStack>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Categoría</Text>
              <Select value={category} onChange={(e) => setCategory(e.target.value)} w="200px">
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>Ordenar por</Text>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} w="200px">
                <option value="">Seleccionar</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name_asc">Nombre: A-Z</option>
                <option value="name_desc">Nombre: Z-A</option>
              </Select>
            </Box>
          </Flex>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default FilterBar;