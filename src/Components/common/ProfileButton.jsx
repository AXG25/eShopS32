import React from 'react';
import { Box, Avatar } from '@chakra-ui/react';
import useStoreConfigStore from '../../store/useStoreConfigStore';

const ProfileButton = React.forwardRef(({ user, ...props }, ref) => {
  const { config } = useStoreConfigStore();

  const getConfigValue = (key) => {
    const sectionKey = `header${key.charAt(0).toUpperCase() + key.slice(1)}`;
    return config[sectionKey] || config[key];
  };

  return (
    <Box
      ref={ref}
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      rounded="full"
      p={1}
      bg="transparent"
      _hover={{
        bg: getConfigValue('buttonColor'),
        opacity: getConfigValue('buttonHoverOpacity'),
      }}
      transition="all 0.2s"
      {...props}
    >
      <Avatar size="sm" src={user.avatarUrl} name={user.name} />
    </Box>
  );
}); 

ProfileButton.displayName = 'ProfileButton';

export default ProfileButton;