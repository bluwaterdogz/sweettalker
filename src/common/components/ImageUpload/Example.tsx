import React from "react";
import { View, StyleSheet } from "react-native";
import { ImageUpload } from "./index";
import { useImageUpload } from "@/common/hooks/useImageUpload";
import { useTheme } from "@/common/theme/hooks/useTheme";

export const ImageUploadExample = () => {
  const { colors } = useTheme();
  const { imageUri, handleImageSelect, handleImageRemove } = useImageUpload({
    onImageSelect: (uri) => {
      // Here you would typically upload the image to your server
      // and get back a URL to store in your database
    },
    onImageRemove: () => {
      // Here you would typically remove the image from your server
    },
  });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ImageUpload
        imageUri={imageUri}
        onImageSelect={handleImageSelect}
        onImageRemove={handleImageRemove}
        size={150}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
