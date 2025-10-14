import Sidebar from "@/components/Comp";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Report() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* SIDEBAR OVERLAY */}
      {sidebarVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
      )}

      {/* SLIDING SIDEBAR */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <Sidebar onNavigate={toggleSidebar} />
      </Animated.View>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ===== SUMMARY BOXES ===== */}
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <Ionicons name="cart-outline" size={24} color="#67e8f9" />
            <Text style={styles.boxTitle}>Total Orders</Text>
            <Text style={styles.boxValue}>320</Text>
          </View>
          <View style={styles.box}>
            <Ionicons name="cash-outline" size={24} color="#a98bff" />
            <Text style={styles.boxTitle}>Total Revenue</Text>
            <Text style={styles.boxValue}>$84,900</Text>
          </View>
          <View style={styles.box}>
            <Ionicons name="cube-outline" size={24} color="#FFD54F" />
            <Text style={styles.boxTitle}>Total Items</Text>
            <Text style={styles.boxValue}>124</Text>
          </View>
          <View style={styles.box}>
            <Ionicons name="business-outline" size={24} color="#4CAF50" />
            <Text style={styles.boxTitle}>Active Companies</Text>
            <Text style={styles.boxValue}>48</Text>
          </View>
        </View>

        {/* ===== REPORT BOXES ===== */}
        <View style={styles.reportContainer}>
          <View style={styles.reportBox}>
            <Ionicons name="document-text-outline" size={40} color="#67e8f9" />
            <Text style={styles.reportTitle}>Sales Invoice Report</Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reportBox}>
            <Ionicons name="stats-chart-outline" size={40} color="#FFD54F" />
            <Text style={styles.reportTitle}>Sales Invoice Report Items</Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 10 },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  menuButton: { padding: 5 },

  // SIDEBAR + OVERLAY
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#111827",
    zIndex: 20,
    elevation: 10,
    paddingTop: 50,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },

  // BOXES
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  box: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  boxTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 8,
  },
  boxValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },

  // REPORT BOXES
  reportContainer: {
    marginTop: 10,
  },
  reportBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  reportTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  viewText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
