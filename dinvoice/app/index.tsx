import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login, 2 = verify OTP
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://192.168.18.29:5000/api/auth"; // 👈 your backend

  // Step 1 — Request OTP
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login step 1:", data);

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      alert("OTP has been sent to your email!");
      setStep(2);
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      console.log("Verify OTP:", data);

      if (!res.ok) {
        alert(data.error || "Invalid OTP");
        return;
      }

      // ✅ Save token and user
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");
      router.push("/pages/dashboard");
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? "Login to your dashboard"
            : "Enter the OTP sent to your email"}
        </Text>

        <View style={styles.card}>
          {step === 1 ? (
            <>
              {/* Email */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#9da3b4" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9da3b4"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9da3b4"
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9da3b4"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#9da3b4" />
                <TextInput
                  placeholder="Enter OTP"
                  placeholderTextColor="#9da3b4"
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyOtp}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#667eea", "#764ba2"]}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {step === 1 && (
            <TouchableOpacity
              onPress={() => router.push("/")}
              style={{ marginTop: 25 }}
            >
              <Text style={styles.registerText}>
                Don’t have an account? <Text style={styles.link}>Register</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#aaa", marginBottom: 30 },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 16,
  },
  button: { borderRadius: 12, overflow: "hidden" },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  registerText: { color: "#9da3b4", textAlign: "center" },
  link: { color: "#a98bff", fontWeight: "600" },
});
