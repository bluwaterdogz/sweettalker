import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

interface UseImageUploadOptions {
  onImageSelect?: (uri: string) => void;
  onImageRemove?: () => void;
  initialImageUri?: string | null;
}

export const useImageUpload = ({
  onImageSelect,
  onImageRemove,
  initialImageUri = null,
}: UseImageUploadOptions = {}) => {
  const [imageUri, setImageUri] = useState<string | null>(initialImageUri);

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      onImageSelect?.(result.assets[0].uri);
    }
  };

  const handleImageRemove = () => {
    setImageUri(null);
    onImageRemove?.();
  };

  return {
    imageUri,
    handleImageSelect,
    handleImageRemove,
  };
};
