import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Flex,
  Select,
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
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import CustomButton from "../common/CustomButton";
import { debounce } from "lodash";
import axios from "axios";
import env from "../../config/env";

const FilterBar = ({ onFilterChange, onClearFilters, currentFilters }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState(currentFilters.category || "");
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "");
  const [search, setSearch] = useState(currentFilters.search || "");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [debouncedFilters, setDebouncedFilters] = useState(currentFilters);
  const debouncedFilterChangeRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(env.PRODUCTS.CATEGORIES);
        const processedCategories = response?.data || [];
        setCategories(["", ...processedCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    debouncedFilterChangeRef.current = debounce((newFilters) => {
      if (validateInputs(newFilters)) {
        onFilterChange(newFilters);
      }
    }, 500);

    return () => {
      if (debouncedFilterChangeRef.current) {
        debouncedFilterChangeRef.current.cancel();
      }
    };
  }, [onFilterChange]);

  const validateInputs = useCallback(
    (filters) => {
      const newErrors = {};
      const minPriceValue = filters.priceRange[0];
      const maxPriceValue = filters.priceRange[1];

      if (minPriceValue < 0) {
        newErrors.minPrice = t("errors.negativeNumber");
      }

      if (maxPriceValue < 0) {
        newErrors.maxPrice = t("errors.negativeNumber");
      }

      if (minPriceValue > maxPriceValue) {
        newErrors.priceRange = t("errors.minGreaterThanMax");
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [t]
  );

  const handleInputChange = useCallback((key, value) => {
    setDebouncedFilters((prev) => {
      const newFilters = { ...prev };
      if (key === "minPrice" || key === "maxPrice") {
        const index = key === "minPrice" ? 0 : 1;
        newFilters.priceRange = [...prev.priceRange];
        newFilters.priceRange[index] =
          value === "" ? (index === 0 ? 0 : Infinity) : value;
      } else {
        newFilters[key] = value;
      }
      if (debouncedFilterChangeRef.current) {
        debouncedFilterChangeRef.current(newFilters);
      }
      return newFilters;
    });
  }, []);

  const clearFilters = () => {
    setDebouncedFilters({
      priceRange: [0, Infinity],
      category: "",
      sortBy: "",
      search: "",
    });
    setErrors({});
    onClearFilters();
  };

  const getActiveFilters = () => {
    const filters = [];
    if (search) filters.push({ key: "search", value: search });
    if (category) filters.push({ key: "category", value: category });
    if (
      debouncedFilters.priceRange[0] > 0 ||
      debouncedFilters.priceRange[1] < Infinity
    ) {
      filters.push({
        key: "price",
        value: `${debouncedFilters.priceRange[0]} - ${
          debouncedFilters.priceRange[1] === Infinity
            ? "∞"
            : debouncedFilters.priceRange[1]
        }`,
      });
    }
    if (sortBy) filters.push({ key: "sortBy", value: sortBy });
    return filters;
  };

  const removeFilter = (key) => {
    switch (key) {
      case "search":
        setSearch("");
        handleInputChange("search", "");
        break;
      case "category":
        setCategory("");
        handleInputChange("category", "");
        break;
      case "price":
        handleInputChange("minPrice", 0);
        handleInputChange("maxPrice", Infinity);
        setErrors({});
        break;
      case "sortBy":
        setSortBy("");
        handleInputChange("sortBy", "");
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
            onChange={(e) => {
              setSearch(e.target.value);
              handleInputChange("search", e.target.value);
            }}
          />
        </InputGroup>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleInputChange("category", e.target.value);
              }}
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
              <NumericFormat
                customInput={Input}
                thousandSeparator={true}
                prefix="$"
                placeholder={t("filters.minPrice")}
                value={
                  debouncedFilters.priceRange[0] === 0
                    ? ""
                    : debouncedFilters.priceRange[0]
                }
                onValueChange={(values) => {
                  handleInputChange("minPrice", values.floatValue || 0);
                }}
                allowNegative={false}
              />
              <Text>-</Text>
              <NumericFormat
                customInput={Input}
                thousandSeparator={true}
                prefix="$"
                placeholder={t("filters.maxPrice")}
                value={
                  debouncedFilters.priceRange[1] === Infinity
                    ? ""
                    : debouncedFilters.priceRange[1]
                }
                onValueChange={(values) => {
                  handleInputChange("maxPrice", values.floatValue || Infinity);
                }}
                allowNegative={false}
              />
            </HStack>
            <FormErrorMessage>
              {errors.priceRange || errors.minPrice || errors.maxPrice}
            </FormErrorMessage>
          </FormControl>

          <Select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              handleInputChange("sortBy", e.target.value);
            }}
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
