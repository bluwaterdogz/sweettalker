import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useBilling } from "../context";
import { BillingProduct } from "../api/models";
import { ProductCard } from "./ProductCard";

export const BillingScreen = () => {
  const { colors, typography } = useTheme();
  const { products, credits, isLoading, error } = useBilling();

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Text style={[typography.bodyLarge, { color: colors.error.primary }]}>
          {error}
        </Text>
      </View>
    );
  }

  const creditProducts = products.filter((p) => p.type === "credits");
  const subscriptionProducts = products.filter(
    (p) => p.type === "subscription"
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.neutral[200],
            backgroundColor: colors.background.primary,
          },
        ]}
      >
        <Text style={[typography.headingLarge, { color: colors.text.primary }]}>
          Billing
        </Text>
        <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
          Available Credits: {credits}
        </Text>
      </View>

      <View
        style={[styles.section, { backgroundColor: colors.background.primary }]}
      >
        <Text
          style={[typography.headingMedium, { color: colors.text.primary }]}
        >
          Credit Packs
        </Text>
        <View style={styles.productsGrid}>
          {creditProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </View>

      <View
        style={[styles.section, { backgroundColor: colors.background.primary }]}
      >
        <Text
          style={[typography.headingMedium, { color: colors.text.primary }]}
        >
          Subscriptions
        </Text>
        <View style={styles.productsGrid}>
          {subscriptionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  section: {
    padding: 16,
  },
  productsGrid: {
    marginTop: 16,
    gap: 16,
  },
});
