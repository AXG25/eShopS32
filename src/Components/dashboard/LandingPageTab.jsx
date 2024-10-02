import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  SimpleGrid,
  Box,
  Select,
} from '@chakra-ui/react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CustomButton from '../common/CustomButton';
import ImageUpload from '../common/ImageUpload';
import ColorPicker from './ColorPicker';

const LandingPageTab = ({ landingPageConfig, onLandingPageConfigChange }) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    onLandingPageConfigChange({ [name]: value });
  };

  const handleColorChange = (key, color) => {
    onLandingPageConfigChange({ [key]: color });
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...landingPageConfig.features];
    updatedFeatures[index][field] = value;
    onLandingPageConfigChange({ features: updatedFeatures });
  };

  const addFeature = () => {
    const newFeature = { icon: 'FaUser', title: '', description: '' };
    onLandingPageConfigChange({ features: [...landingPageConfig.features, newFeature] });
  };

  const removeFeature = (index) => {
    const updatedFeatures = landingPageConfig.features.filter((_, i) => i !== index);
    onLandingPageConfigChange({ features: updatedFeatures });
  };

  const handleImageUpload = (imageData) => {
    onLandingPageConfigChange({ heroImage: imageData });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">{t('landingPageConfig')}</Heading>

      <Box>
        <Heading size="sm" mb={4}>{t('heroSection')}</Heading>
        <SimpleGrid columns={2} spacing={4}>
          <FormControl>
            <FormLabel>{t('heroTitle')}</FormLabel>
            <Input name="heroTitle" value={landingPageConfig.heroTitle} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('heroSubtitle')}</FormLabel>
            <Input name="heroSubtitle" value={landingPageConfig.heroSubtitle} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('heroButtonText')}</FormLabel>
            <Input name="heroButtonText" value={landingPageConfig.heroButtonText} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('heroButtonColor')}</FormLabel>
            <Select name="heroButtonColorScheme" value={landingPageConfig.heroButtonColorScheme} onChange={handleChange}>
              <option value="teal">Teal</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t('heroBgGradient')}</FormLabel>
            <Input name="heroBgGradient" value={landingPageConfig.heroBgGradient} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('heroTextColor')}</FormLabel>
            <ColorPicker
              color={landingPageConfig.heroTextColor}
              onChange={(color) => handleColorChange('heroTextColor', color)}
              label={t('heroTextColor')}
            />
          </FormControl>
          <FormControl gridColumn="span 2">
            <FormLabel>{t('heroImage')}</FormLabel>
            <ImageUpload
              onImageUpload={handleImageUpload}
              initialImage={landingPageConfig.heroImage}
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="sm" mb={4}>{t('featuresSection')}</Heading>
        <FormControl>
          <FormLabel>{t('featuresTitle')}</FormLabel>
          <Input name="featuresTitle" value={landingPageConfig.featuresTitle} onChange={handleChange} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>{t('featuresSubtitle')}</FormLabel>
          <Textarea name="featuresSubtitle" value={landingPageConfig.featuresSubtitle} onChange={handleChange} />
        </FormControl>

        {landingPageConfig.features.map((feature, index) => (
          <Box key={index} mt={4} p={4} borderWidth={1} borderRadius="md">
            <Heading size="xs" mb={2}>{t('feature')} {index + 1}</Heading>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl>
                <FormLabel>{t('icon')}</FormLabel>
                <Select
                  value={feature.icon}
                  onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                >
                  <option value="FaUser">{t('user')}</option>
                  <option value="FaRocket">{t('rocket')}</option>
                  <option value="FaHeadset">{t('headset')}</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>{t('title')}</FormLabel>
                <Input
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                />
              </FormControl>
              <FormControl gridColumn="span 2">
                <FormLabel>{t('description')}</FormLabel>
                <Textarea
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                />
              </FormControl>
            </SimpleGrid>
            <CustomButton
              leftIcon={<FaTrash />}
              colorScheme="red"
              size="sm"
              mt={2}
              onClick={() => removeFeature(index)}
            >
              {t('removeFeature')}
            </CustomButton>
          </Box>
        ))}
        <CustomButton leftIcon={<FaPlus />} colorScheme="blue" mt={4} onClick={addFeature}>
          {t('addFeature')}
        </CustomButton>
      </Box>
    </VStack>
  );
};

LandingPageTab.propTypes = {
  landingPageConfig: PropTypes.object.isRequired,
  onLandingPageConfigChange: PropTypes.func.isRequired,
};

export default LandingPageTab;