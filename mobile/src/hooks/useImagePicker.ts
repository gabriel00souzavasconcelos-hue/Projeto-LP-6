import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface ImageState {
  uri: string | null;
  isUploading: boolean;
}

export const useImagePicker = (initialUri?: string) => {
  const [image, setImage] = useState<ImageState>({
    uri: initialUri || null,
    isUploading: false
  });

  const pickImage = useCallback(async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria para selecionar imagens');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false, // Remove cropping
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage({
          uri: result.assets[0].uri,
          isUploading: false
        });
        return result.assets[0].uri;
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
      console.error('Error picking image:', error);
    }
    return null;
  }, []);

  const setImageUri = useCallback((uri: string | null) => {
    setImage(prev => ({ ...prev, uri }));
  }, []);

  const setUploading = useCallback((isUploading: boolean) => {
    setImage(prev => ({ ...prev, isUploading }));
  }, []);

  const resetImage = useCallback(() => {
    setImage({ uri: null, isUploading: false });
  }, []);

  const showImageOptions = useCallback(() => {
    pickImage(); // Vai direto para a galeria
  }, [pickImage]);

  return {
    image,
    pickImage,
    setImageUri,
    setUploading,
    resetImage,
    showImageOptions,
  };
};