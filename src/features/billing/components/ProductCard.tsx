import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useBilling } from "../context/context";
import { BillingProduct } from "@sweettalker/common/src/models";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCoins, faInfinity } from "@fortawesome/free-solid-svg-icons";

interface ProductCardProps {
  product: BillingProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { colors, typography } = useTheme();
  const { purchaseProduct } = useBilling();

  const handlePurchase = async () => {
    await purchaseProduct(product.productId);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.accent.primary,
        },
      ]}
      onPress={handlePurchase}
    >
      <View style={styles.header}>
        <FontAwesomeIcon
          icon={product.type === "credits" ? faCoins : faInfinity}
          size={24}
          color={colors.accent.primary}
        />
        <Text style={[typography.headingSmall, { color: colors.text.primary }]}>
          {product.title}
        </Text>
      </View>

      <Text
        style={[typography.bodyMedium, { color: colors.text.secondary }]}
        numberOfLines={2}
      >
        {product.description}
      </Text>

      {product.type === "credits" && product.credits && (
        <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
          {product.credits} Credits
        </Text>
      )}

      {product.type === "subscription" && product.duration && (
        <Text style={[typography.bodyLarge, { color: colors.text.primary }]}>
          {product.duration} Days
        </Text>
      )}

      <Text style={[typography.headingMedium, { color: colors.text.primary }]}>
        {product.price}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
