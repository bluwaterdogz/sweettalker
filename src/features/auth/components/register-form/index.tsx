import React from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useAppDispatch } from "@/store";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../reducers";
import { RootStackNavigationProp } from "@/navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/common/Button";
import { useToast } from "@/lib/toast";
import { TextInput } from "@/components/common/TextInput";

interface RegisterFormProps {}

export const RegisterForm = (props: RegisterFormProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();

  const onRegisterButtonPress = useCallback(() => {
    if (password !== confirmPassword) {
      showToast({
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }
    dispatch(register({ email, username, password }));
  }, [email, username, password, confirmPassword, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry
        />
        <Button title="Register" onPress={onRegisterButtonPress} />
        <Button
          title="Back to Login"
          onPress={() => navigation.navigate("Login")}
          variant="secondary"
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
