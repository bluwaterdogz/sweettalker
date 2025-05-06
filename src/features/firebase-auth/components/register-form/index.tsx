import React from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { register } from "../../reducers";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/navigation/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/common/Button";
import { TextInput } from "@/components/common/TextInput";
import { useToast } from "@/lib/toast";

interface RegisterFormProps {}

export const FirebaseRegisterForm = (props: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { error, loading } = useAppSelector((state) => state.firebaseAuth);

  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { showToast } = useToast();

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
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          // secureTextEntry
          editable={!loading}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          // secureTextEntry
          editable={!loading}
        />
        <Button
          title={loading ? "Creating Account..." : "Register"}
          onPress={onRegisterButtonPress}
          disabled={loading}
        />
        <Button
          title="Already have an account? Login"
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
