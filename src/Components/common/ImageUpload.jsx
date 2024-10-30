import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, Input, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ onImageUpload, initialImage }) => {
  const [image, setImage] = useState(initialImage || null);
  const { t } = useTranslation();
  
  useEffect(() => {
    setImage(initialImage || null);
  }, [initialImage]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setImage(e.target.result);
      onImageUpload(e.target.result);
    };
    
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  });

  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box>
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.400' : borderColor}
        borderRadius="md"
        p={6}
        textAlign="center"
        bg={bgColor}
        transition="all 0.2s"
        _hover={{ borderColor: 'blue.400' }}
      >
        <Input {...getInputProps()} />
        <VStack spacing={3}>
          {image ? (
            <Image src={image} alt={t('products.productImage')} maxH="200px" objectFit="contain" />
          ) : (
            <Icon as={FaCloudUploadAlt} w={12} h={12} color={textColor} />
          )}
          <Text fontWeight="medium">
            {isDragActive ? t('ui.dragAndDropImage') : t('ui.dropImageHere')}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  initialImage: PropTypes.string
};

export default ImageUpload;