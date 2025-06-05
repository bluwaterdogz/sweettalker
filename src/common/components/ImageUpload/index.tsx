import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";
import { common } from "@/common/styles";

export interface ImageUploadProps {
  imageUri?: string | null;
  onImageSelect: (uri: string) => void;
  onImageRemove?: () => void;
  size?: number;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUri,
  onImageSelect,
  onImageRemove,
  size = 120,
  containerStyle,
  imageStyle,
  disabled = false,
}) => {
  const { colors } = useTheme();

  const handleImagePick = async () => {
    if (disabled) return;

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
      onImageSelect(result.assets[0].uri);
    }
  };

  const handleRemove = () => {
    if (disabled || !onImageRemove) return;
    onImageRemove();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={handleImagePick}
        disabled={disabled}
        style={[
          styles.imageContainer,
          {
            width: size,
            height: size,
            backgroundColor: colors.background.secondary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {imageUri ? (
          <>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                { width: size, height: size, borderRadius: size / 2 },
                imageStyle,
              ]}
            />
            {onImageRemove && !disabled && (
              <TouchableOpacity
                onPress={handleRemove}
                style={[
                  styles.removeButton,
                  { backgroundColor: colors.background.primary },
                ]}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size={16}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <FontAwesomeIcon
            icon={faCamera}
            size={size / 3}
            color={colors.text.secondary}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    borderRadius: 60,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    ...common.shadow,
  },
  image: {
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...common.shadow,
  },
});
