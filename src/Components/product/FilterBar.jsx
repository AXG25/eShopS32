import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  Select,
  Input,
  Text,
  HStack,
  VStack,
  Collapse,
  useDisclosure,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";

const FilterBar = ({
  onFilterChange,
  onClearFilters,
  products,
  currentFilters,
}) => {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState(currentFilters.category || "");
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "");

  const categories = [
    "",
    ...new Set(products.map((product) => product.category)),
  ];

  const debouncedFilterChange = useCallback(
    debounce((filters) => {
      onFilterChange(filters);
    }, 300),
    [onFilterChange]
  );

  useEffect(() => {
    const filters = {
      priceRange: [
        minPrice ? parseFloat(minPrice) : 0,
        maxPrice ? parseFloat(maxPrice) : Infinity,
      ],
      category,
      sortBy,
    };
    debouncedFilterChange(filters);
  }, [minPrice, maxPrice, category, sortBy, debouncedFilterChange]);

  useEffect(() => {
    setCategory(currentFilters.category || "");
    setSortBy(currentFilters.sortBy || "");
    setMinPrice(
      currentFilters.priceRange[0] === 0
        ? ""
        : currentFilters.priceRange[0].toString()
    );
    setMaxPrice(
      currentFilters.priceRange[1] === Infinity
        ? ""
        : currentFilters.priceRange[1].toString()
    );
  }, [currentFilters]);

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setSortBy("");
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (minPrice || maxPrice) count++;
    if (category) count++;
    if (sortBy) count++;
    return count;
  };

  return (
    <Box bg="gray.50" p={4} borderRadius="md" shadow="sm" mb={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <HStack>
          <CustomButton
            onClick={onToggle}
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            variant="ghost"
          >
            {t("filters")}
          </CustomButton>
          {getActiveFiltersCount() > 0 && (
            <Badge colorScheme="blue" variant="solid" borderRadius="full">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </HStack>
        <CustomButton
          leftIcon={<CloseIcon />}
          onClick={clearFilters}
          size="sm"
          variant="ghost"
          isDisabled={getActiveFiltersCount() === 0}
        >
          {t("clearFilters")}
        </CustomButton>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={4} align="stretch" mt={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>
              {t("priceRange")}
            </Text>
            <HStack>
              <Input
                placeholder={t("minPrice")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                type="number"
                min="0"
              />
              <Text>-</Text>
              <Input
                placeholder={t("maxPrice")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                min="0"
              />
            </HStack>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="bold" mb={2}>
              {t("category")}
            </Text>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t("allCategories")}</option>
              {categories
                .filter((cat) => cat !== "")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {t(cat.toLowerCase())}
                  </option>
                ))}
            </Select>
          </Box>

          <Divider />

          <Box>
            <Text fontWeight="bold" mb={2}>
              {t("sortBy")}
            </Text>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">{t("select")}</option>
              <option value="price_asc">{t("priceLowToHigh")}</option>
              <option value="price_desc">{t("priceHighToLow")}</option>
              <option value="name_asc">{t("nameAToZ")}</option>
              <option value="name_desc">{t("nameZToA")}</option>
            </Select>
          </Box>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default FilterBar;