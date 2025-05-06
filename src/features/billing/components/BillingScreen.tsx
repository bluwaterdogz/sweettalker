import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useTheme } from "@/theme";
import { useBilling } from "../context/BillingContext";
import { BillingProduct } from "../api/models";
import { ProductCard } from "./ProductCard";
import { Colors } from "@/theme/colors";

export const BillingScreen = () => {
  const { colors, typography } = useTheme();
  const { products, credits, isLoading, error } = useBilling();
  const styles = getStyles(colors);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.default },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.default },
        ]}
      >
        <Text style={[typography.bodyLarge, { color: colors.error.main }]}>
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
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <View style={styles.header}>
        <Text style={[typography.headingLarge, { color: colors.text.primary }]}>
          Billing
        </Text>
        <Text style={[typography.bodyLarge, { color: colors.text.secondary }]}>
          Available Credits: {credits}
        </Text>
      </View>

      <View style={styles.section}>
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

      <View style={styles.section}>
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

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      backgroundColor: colors.background.default,
    },
    section: {
      padding: 16,
      backgroundColor: colors.background.default,
    },
    productsGrid: {
      marginTop: 16,
      gap: 16,
    },
  });
