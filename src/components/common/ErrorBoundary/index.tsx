import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "../Button";
import { typography } from "@/theme/typography";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={[styles.title, typography.headingMedium]}>
            Something went wrong
          </Text>
          <Text style={[styles.message, typography.bodyMedium]}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <Button
            onPress={() => this.setState({ hasError: false, error: null })}
            style={[styles.button, typography.bodyMedium]}
          >
            Try again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 12,
  },
  message: {
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    minWidth: 120,
  },
});
