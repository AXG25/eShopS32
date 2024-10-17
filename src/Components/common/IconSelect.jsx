import PropTypes from "prop-types";
import React, { useState, useMemo, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Text,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import * as Icons from "react-icons/fa";
import { debounce } from "lodash";

const IconSelect = React.memo(({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const iconNames = useMemo(
    () => Object.keys(Icons).filter((name) => name.startsWith("Fa")),
    []
  );

  const filteredIcons = useMemo(() => {
    if (!search) return iconNames.slice(0, 100); // Show first 100 icons when no search
    return iconNames
      .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100); // Limit to 100 results
  }, [iconNames, search]);

  const debouncedSetSearch = useMemo(
    () => debounce((value) => setSearch(value), 300),
    []
  );

  const handleSearchChange = useCallback(
    (e) => {
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  const handleSelectChange = useCallback(
    (e) => {
      onChange(e);
    },
    [onChange]
  );

  return (
    <FormControl>
      <FormLabel>{t("general.icon")}</FormLabel>
      <Input
        placeholder={t("landingPageConfig.searchIcons")}
        onChange={handleSearchChange}
        mb={2}
      />
      <Select value={value} onChange={handleSelectChange} size="sm">
        {filteredIcons.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
      <Flex align="center" mt={2}>
        <Text mr={2}>{t("landingPageConfig.selectedIcon")}:</Text>
        {value && Icons[value]
          ? React.createElement(Icons[value], { size: 24 })
          : null}
      </Flex>
    </FormControl>
  );
});

IconSelect.displayName = "IconSelect";

IconSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

IconSelect.defaultProps = {
  value: "",
};

export default IconSelect;
