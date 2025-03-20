import { Text, View } from "@/components/Themed";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { useSession } from "@/providers/session-provider";
import { SignInDTO, signInSchema } from "@/schema/auth";
import { useSignInUser } from "@/services/auth/signIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";

export default function SignInScreen() {
  const { signIn } = useSession();
  const form = useForm<SignInDTO>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useSignInUser({
    onSuccess({ data }) {
      signIn(data.user);
      router.replace("/");
    },
    onError(error) {
      const res = error.response;
      const message = res?.data.message || error.message;
      if (res && res.status < 500) {
        form.setError("email", { message }, { shouldFocus: true });
        form.setError("password", { message: "" });
      } else {
        form.setError("root", { message });
      }
    },
  });

  function onSumbit(values: SignInDTO) {
    mutate(values);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.subHeading}>Get access to your account</Text>
      </View>
      <View style={styles.form}>
        <Controller
          control={form.control}
          name="email"
          render={({
            field: { name, onChange, value },
            fieldState: { error },
          }) => (
            <>
              <Text style={styles.label}>{name}</Text>
              <TextInput
                placeholder="john.doe@example.com"
                value={value}
                onChangeText={onChange}
              />
              {error && (
                <Text style={styles.errorMessage}>{error.message}</Text>
              )}
            </>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({
            field: { name, onChange, value },
            fieldState: { error },
          }) => (
            <>
              <Text style={styles.label}>{name}</Text>
              <PasswordInput
                placeholder="*********"
                value={value}
                onChangeText={onChange}
              />
              {error && (
                <Text style={styles.errorMessage}>{error.message}</Text>
              )}
            </>
          )}
        />
        <Button
          title="Sign in"
          isLoading={isPending}
          onPress={form.handleSubmit(onSumbit)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 30,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  form: {
    width: "100%",
    gap: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 14,
    color: "#525B75",
  },
  label: {
    fontSize: 12,
    width: "100%",
    textAlign: "left",
    textTransform: "uppercase",
    color: "#525B75",
  },
  errorMessage: {
    color: "red",
    alignSelf: "stretch",
    fontSize: 12,
  },
});
