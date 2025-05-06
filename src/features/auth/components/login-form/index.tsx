import React from "react";
import { useCallback, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { login } from "../../reducers";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/navigation/types";
import { useAppDispatch } from "@/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/common/Button";
import { TextInput } from "@/components/common/TextInput";

interface LoginFormProps {}

export const LoginForm = (props: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();

  const onLoginButtonPress = useCallback(() => {
    dispatch(login({ email, password }));
  }, [email, password, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
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
        <Button title="Login" onPress={onLoginButtonPress} />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate("Register")}
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
