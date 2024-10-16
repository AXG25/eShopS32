import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
  Select,
  Input,
  Text,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";
import axios from "axios";
import env from "../../config/env";

const FilterBar = ({ onFilterChange, onClearFilters, currentFilters }) => {
  const { t } = useTranslation();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState(currentFilters.category || "");
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "");
  const [search, setSearch] = useState(currentFilters.search || "");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(env.PRODUCTS.CATEGORIES);
        const processedCategories = response?.data;
        setCategories(["", ...processedCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const validateInputs = () => {
    const newErrors = {};
    if (minPrice && isNaN(parseFloat(minPrice))) {
      newErrors.minPrice = t("errors.invalidNumber");
    }
    if (maxPrice && isNaN(parseFloat(maxPrice))) {
      newErrors.maxPrice = t("errors.invalidNumber");
    }
    if (parseFloat(minPrice) < 0) {
      newErrors.minPrice = t("errors.negativeNumber");
    }
    if (parseFloat(maxPrice) < 0) {
      newErrors.maxPrice = t("errors.negativeNumber");
    }
    if (parseFloat(minPrice) > parseFloat(maxPrice) && maxPrice !== "") {
      newErrors.priceRange = t("errors.minGreaterThanMax");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const debouncedFilterChange = useCallback(
    debounce((filters) => {
      if (validateInputs()) {
        onFilterChange(filters);
      }
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
      search,
    };
    debouncedFilterChange(filters);
  }, [minPrice, maxPrice, category, sortBy, search, debouncedFilterChange]);

  useEffect(() => {
    setCategory(currentFilters.category || "");
    setSortBy(currentFilters.sortBy || "");
    setSearch(currentFilters.search || "");
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
    setSearch("");
    setErrors({});
    onClearFilters();
  };

  const getActiveFilters = () => {
    const filters = [];
    if (search) filters.push({ key: "search", value: search });
    if (category) filters.push({ key: "category", value: category });
    if (
      (minPrice && minPrice !== "0") ||
      (maxPrice && maxPrice !== "Infinity")
    ) {
      filters.push({
        key: "price",
        value: `${minPrice || 0} - ${maxPrice || "∞"}`,
      });
    }
    if (sortBy) filters.push({ key: "sortBy", value: sortBy });
    return filters;
  };

  const removeFilter = (key) => {
    switch (key) {
      case "search":
        setSearch("");
        break;
      case "category":
        setCategory("");
        break;
      case "price":
        setMinPrice("");
        setMaxPrice("");
        setErrors({});
        break;
      case "sortBy":
        setSortBy("");
        break;
      default:
        break;
    }
  };

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" mb={4}>
      <VStack spacing={4} align="stretch">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder={t("filters.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={t("filters.AllCategories")}
            >
              {categories
                .filter((cat) => cat !== "")
                .map((cat, key) => (
                  <option key={key} value={cat?.value}>
                    {cat?.name}
                  </option>
                ))}
            </Select>
          </Box>

          <FormControl
            isInvalid={errors.priceRange || errors.minPrice || errors.maxPrice}
          >
            <HStack>
              <Input
                placeholder={t("filters.minPrice")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                type="number"
                min="0"
              />
              <Text>-</Text>
              <Input
                placeholder={t("filters.maxPrice")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                type="number"
                min="0"
              />
            </HStack>
            <FormErrorMessage>
              {errors.priceRange || errors.minPrice || errors.maxPrice}
            </FormErrorMessage>
          </FormControl>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            placeholder={t("general.sortBy")}
          >
            <option value="price_asc">{t("priceLowToHigh")}</option>
            <option value="price_desc">{t("priceHighToLow")}</option>
            <option value="name_asc">{t("nameAToZ")}</option>
            <option value="name_desc">{t("nameZToA")}</option>
          </Select>
        </SimpleGrid>

        <Wrap spacing={2}>
          {getActiveFilters().map((filter) => (
            <WrapItem key={filter.key}>
              <Tag size="md" variant="subtle" colorScheme="blue">
                <TagLabel>{`${t(`filters.${filter.key}`)}: ${
                  filter.value
                }`}</TagLabel>
                <TagCloseButton onClick={() => removeFilter(filter.key)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>

        {getActiveFilters().length > 0 && (
          <Flex justifyContent="flex-end">
            <CustomButton onClick={clearFilters} size="sm" variant="outline">
              {t("general.clearFilters")}
            </CustomButton>
          </Flex>
        )}
      </VStack>
    </Box>
  );
};

FilterBar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  currentFilters: PropTypes.shape({
    category: PropTypes.string,
    sortBy: PropTypes.string,
    search: PropTypes.string,
    priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default FilterBar;
