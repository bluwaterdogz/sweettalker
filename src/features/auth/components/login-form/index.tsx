import React from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { login } from "../../store/thunks";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/app/navigation/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "@/common/components";
import { useToast } from "@/common/components/Toast";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";

interface LoginFormProps {}

export const FirebaseLoginForm = (props: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading } = useAppSelector((state) => state.firebaseAuth);

  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      default:
        return error.message || "Login failed. Please try again";
    }
  };

  const onLoginButtonPress = useCallback(async () => {
    if (!email || !password) {
      showToast({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      showToast({
        type: "success",
        message: "Login successful",
      });
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  }, [email, password, dispatch, showToast]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sweet Talker</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t("auth.email")}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("auth.password")}
          // secureTextEntry
          editable={!loading}
        />
        <Button
          title={loading ? t("auth.loggingIn") : t("auth.login")}
          onPress={onLoginButtonPress}
          disabled={loading}
        />
        <Button
          title={t("auth.createAccount")}
          onPress={() => navigation.navigate("Register")}
          variant="secondary"
          disabled={loading}
        />
        {/* <Button
          title="Forgot Password?"
          onPress={() => navigation.navigate("ForgotPassword")}
          variant="text"
          disabled={loading}
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
