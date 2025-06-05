import React from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { register } from "../../store/thunks";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/app/navigation/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "@/common/components";
import { useToast } from "@/common/components/Toast";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";

interface RegisterFormProps {}

export const FirebaseRegisterForm = (props: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { loading } = useAppSelector((state) => state.firebaseAuth);

  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/email-already-in-use":
        return "This email is already registered";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      case "auth/operation-not-allowed":
        return "Registration is currently disabled";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      default:
        return error.message || "Registration failed. Please try again";
    }
  };

  const onRegisterButtonPress = useCallback(async () => {
    if (!email || !password || !confirmPassword || !username) {
      showToast({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        type: "error",
        message: "Passwords do not match",
      });
      return;
    }

    if (password.length < 6) {
      showToast({
        type: "error",
        message: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      await dispatch(register({ email, password, username })).unwrap();
      showToast({
        type: "success",
        message:
          "Registration successful! Please check your email to verify your account.",
      });
      navigation.navigate("Login");
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error);
      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  }, [
    email,
    password,
    confirmPassword,
    username,
    dispatch,
    showToast,
    navigation,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t("auth.createAccount")}</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder={t("auth.username")}
          autoCapitalize="none"
          editable={!loading}
        />
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
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t("auth.confirmPassword")}
          // secureTextEntry
          editable={!loading}
        />
        <Button
          title={loading ? t("auth.creatingAccount") : t("auth.register")}
          onPress={onRegisterButtonPress}
          disabled={loading}
        />
        <Button
          title={t("auth.alreadyHaveAccount")}
          onPress={() => navigation.navigate("Login")}
          variant="secondary"
          disabled={loading}
        />
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
});
