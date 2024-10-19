import PropTypes from "prop-types";
import React, { useMemo, useCallback, useState } from "react";
import { FormControl, FormLabel, Flex, Text } from "@chakra-ui/react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import * as IconsAi from "react-icons/ai";
import * as IconsBi from "react-icons/bi";
import * as IconsBs from "react-icons/bs";
import * as IconsCg from "react-icons/cg";
import * as IconsCi from "react-icons/ci";
import * as IconsDi from "react-icons/di";
import * as IconsFa from "react-icons/fa";
import * as IconsFa6 from "react-icons/fa6";
import * as IconsFc from "react-icons/fc";
import * as IconsFi from "react-icons/fi";
import * as IconsGi from "react-icons/gi";
import * as IconsGo from "react-icons/go";
import * as IconsGr from "react-icons/gr";
import * as IconsHi from "react-icons/hi";
import * as IconsHi2 from "react-icons/hi2";
import * as IconsIm from "react-icons/im";
import * as IconsIo from "react-icons/io";
import * as IconsIo5 from "react-icons/io5";
import * as IconsLia from "react-icons/lia";
import * as IconsLu from "react-icons/lu";
import * as IconsMd from "react-icons/md";
import * as IconsPi from "react-icons/pi";
import * as IconsRi from "react-icons/ri";
import * as IconsRx from "react-icons/rx";
import * as IconsSi from "react-icons/si";
import * as IconsSl from "react-icons/sl";
import * as IconsTb from "react-icons/tb";
import * as IconsTfi from "react-icons/tfi";
import * as IconsTi from "react-icons/ti";
import * as IconsVsc from "react-icons/vsc";
import * as IconsWi from "react-icons/wi";

const INITIAL_LOAD_COUNT = 100;

const IconSelect = React.memo(({ value, onChange }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");

  const allIconSets = useMemo(
    () => ({
      Ai: IconsAi,
      Bi: IconsBi,
      Bs: IconsBs,
      Cg: IconsCg,
      Ci: IconsCi,
      Di: IconsDi,
      Fa: IconsFa,
      Fa6: IconsFa6,
      Fc: IconsFc,
      Fi: IconsFi,
      Gi: IconsGi,
      Go: IconsGo,
      Gr: IconsGr,
      Hi: IconsHi,
      Hi2: IconsHi2,
      Im: IconsIm,
      Io: IconsIo,
      Io5: IconsIo5,
      Lia: IconsLia,
      Lu: IconsLu,
      Md: IconsMd,
      Pi: IconsPi,
      Ri: IconsRi,
      Rx: IconsRx,
      Si: IconsSi,
      Sl: IconsSl,
      Tb: IconsTb,
      Tfi: IconsTfi,
      Ti: IconsTi,
      Vsc: IconsVsc,
      Wi: IconsWi,
    }),
    []
  );

  const allIconOptions = useMemo(() => {
    return Object.entries(allIconSets).flatMap(([prefix, iconSet]) =>
      Object.keys(iconSet)
        .filter((name) => name.startsWith(prefix))
        .map((name) => ({ value: name, label: name, icon: iconSet[name] }))
    );
  }, [allIconSets]);

  const filteredOptions = useMemo(() => {
    if (!inputValue) return allIconOptions.slice(0, INITIAL_LOAD_COUNT);
    return allIconOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [allIconOptions, inputValue]);

  const handleInputChange = useCallback((newValue) => {
    setInputValue(newValue);
  }, []);

  const handleChange = useCallback(
    (selectedOption) => {
      onChange({ target: { value: selectedOption.value } });
    },
    [onChange]
  );

  const MenuList = useCallback(({ options, children, maxHeight, getValue }) => {
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * 35;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={35}
        width="100%"
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }, []);

  const customOption = useCallback(
    ({ data, innerProps }) => (
      <Flex align="center" {...innerProps} p={2}>
        {React.createElement(data.icon, { size: 24 })}
        <Text ml={2}>{data.label}</Text>
      </Flex>
    ),
    []
  );

  return (
    <FormControl>
      <FormLabel>{t("general.icon")}</FormLabel>
      <Select
        options={filteredOptions}
        value={allIconOptions.find((option) => option.value === value)}
        onChange={handleChange}
        onInputChange={handleInputChange}
        components={{ Option: customOption, MenuList }}
        placeholder={t("landingPageConfig.searchIcons")}
      />
      <Flex align="center" mt={2}>
        <Text mr={2}>{t("landingPageConfig.selectedIcon")}:</Text>
        {value && allIconSets[value.substring(0, 2)][value]
          ? React.createElement(allIconSets[value.substring(0, 2)][value], {
              size: 24,
            })
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
