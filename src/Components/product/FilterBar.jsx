import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Flex,
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
import Select from "react-select";
import CustomButton from "../common/CustomButton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import env from "../../config/env";

const fetchCategories = async () => {
  const response = await axios.get(env.PRODUCTS.CATEGORIES);
  return response.data || [];
};

const FilterBar = ({ onFilterChange, onClearFilters, currentFilters }) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [errors, setErrors] = useState({});

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const categoryOptions = [
    { value: t("filters.AllCategories"), label: t("filters.AllCategories") },
    ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
  ];

  const sortOptions = [
    { value: "", label: t("general.sortBy") },
    { value: "price_asc", label: t("filters.priceLowToHigh") },
    { value: "price_desc", label: t("filters.priceHighToLow") },
    { value: "name_asc", label: t("filters.nameAToZ") },
    { value: "name_desc", label: t("filters.nameZToA") },
  ];

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

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

  const handleInputChange = useCallback(
    (key, value) => {
      setLocalFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        if (key === "minPrice" || key === "maxPrice") {
          const index = key === "minPrice" ? 0 : 1;
          newFilters.priceRange = [...prev.priceRange];
          newFilters.priceRange[index] =
            value === "" ? (index === 0 ? 0 : Infinity) : Number(value);
        }
        if (validateInputs(newFilters)) {
          onFilterChange(newFilters);
        }
        return newFilters;
      });
    },
    [onFilterChange, validateInputs]
  );

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: [0, Infinity],
      category: "",
      sortBy: "",
      search: "",
    };
    setLocalFilters(clearedFilters);
    setErrors({});
    onClearFilters();
  };

  const getActiveFilters = () => {
    const filters = [];
    if (localFilters.search)
      filters.push({ key: "search", value: localFilters.search });
    if (
      localFilters.category &&
      localFilters.category !== t("filters.AllCategories")
    )
      filters.push({ key: "category", value: localFilters.category });
    if (
      localFilters.priceRange[0] > 0 ||
      localFilters.priceRange[1] < Infinity
    ) {
      filters.push({
        key: "price",
        value: `${localFilters.priceRange[0]} - ${
          localFilters.priceRange[1] === Infinity
            ? "∞"
            : localFilters.priceRange[1]
        }`,
      });
    }
    if (localFilters.sortBy)
      filters.push({ key: "sortBy", value: localFilters.sortBy });
    return filters;
  };

  const removeFilter = (key) => {
    switch (key) {
      case "search":
        handleInputChange("search", "");
        break;
      case "category":
        handleInputChange("category", "");
        break;
      case "price":
        handleInputChange("minPrice", 0);
        handleInputChange("maxPrice", Infinity);
        setErrors({});
        break;
      case "sortBy":
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
            value={localFilters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </InputGroup>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box>
            <Select
              options={categoryOptions}
              value={
                categoryOptions.find(
                  (option) => option.value === localFilters.category
                ) || categoryOptions[0]
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  "category",
                  selectedOption ? selectedOption.value : ""
                )
              }
              placeholder={t("filters.AllCategories")}
              isClearable
            />
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
                  localFilters.priceRange[0] === 0
                    ? ""
                    : localFilters.priceRange[0]
                }
                onValueChange={(values) =>
                  handleInputChange("minPrice", values.floatValue || 0)
                }
                allowNegative={false}
              />
              <Text>-</Text>
              <NumericFormat
                customInput={Input}
                thousandSeparator={true}
                prefix="$"
                placeholder={t("filters.maxPrice")}
                value={
                  localFilters.priceRange[1] === Infinity
                    ? ""
                    : localFilters.priceRange[1]
                }
                onValueChange={(values) =>
                  handleInputChange("maxPrice", values.floatValue || Infinity)
                }
                allowNegative={false}
              />
            </HStack>
            <FormErrorMessage>
              {errors.priceRange || errors.minPrice || errors.maxPrice}
            </FormErrorMessage>
          </FormControl>

          <Select
            options={sortOptions}
            value={sortOptions.find(
              (option) => option.value === localFilters.sortBy
            )}
            onChange={(selectedOption) =>
              handleInputChange(
                "sortBy",
                selectedOption ? selectedOption.value : ""
              )
            }
            placeholder={t("general.sortBy")}
            isClearable
          />
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
