import Sidebar from "@/components/Comp";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width - 40;

export default function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current; // sidebar starts hidden

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const chartData = [
    {
      name: "Completed",
      population: 45,
      color: "#4CAF50",
      legendFontColor: "#9da3b4",
      legendFontSize: 13,
    },
    {
      name: "Pending",
      population: 25,
      color: "#FFC107",
      legendFontColor: "#9da3b4",
      legendFontSize: 13,
    },
    {
      name: "Cancelled",
      population: 15,
      color: "#F44336",
      legendFontColor: "#9da3b4",
      legendFontSize: 13,
    },
    {
      name: "Returned",
      population: 15,
      color: "#03A9F4",
      legendFontColor: "#9da3b4",
      legendFontSize: 13,
    },
  ];

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
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
        <Sidebar />
      </Animated.View>

      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Overview of your business</Text>

        {/* Sales Summary Cards */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Ionicons name="cart-outline" size={24} color="#67e8f9" />
            <Text style={styles.cardValue}>128</Text>
            <Text style={styles.cardLabel}>Total Sales</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="cash-outline" size={24} color="#a98bff" />
            <Text style={styles.cardValue}>$9,430</Text>
            <Text style={styles.cardLabel}>Revenue</Text>
          </View>
          <View style={styles.card}>
            <Ionicons name="people-outline" size={24} color="#FFD54F" />
            <Text style={styles.cardValue}>14</Text>
            <Text style={styles.cardLabel}>Active Clients</Text>
          </View>
        </View>

        {/* Order Status Breakdown */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Order Status Breakdown</Text>
          <PieChart
            data={chartData}
            width={screenWidth}
            height={180}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>

        {/* Manage Sections */}
        <Text style={[styles.chartTitle, { marginTop: 25 }]}>
          Quick Management
        </Text>
        <View style={styles.manageContainer}>
          <TouchableOpacity
            style={styles.manageCard}
            onPress={() => router.push("/")}
          >
            <Ionicons name="business-outline" size={28} color="#67e8f9" />
            <Text style={styles.manageText}>Manage Companies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manageCard}
            onPress={() => router.push("/")}
          >
            <Ionicons name="cube-outline" size={28} color="#a98bff" />
            <Text style={styles.manageText}>Manage Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.manageCard}
            onPress={() => router.push("/")}
          >
            <Ionicons name="receipt-outline" size={28} color="#FFD54F" />
            <Text style={styles.manageText}>Manage Sales</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingTop: 10 },
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
  menuButton: {
    padding: 5,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 15,
    marginBottom: 25,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 5,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },
  cardLabel: {
    color: "#9da3b4",
    fontSize: 13,
    marginTop: 2,
  },
  chartBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 15,
    alignItems: "center",
  },
  chartTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  manageContainer: {
    marginTop: 10,
  },
  manageCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  manageText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },

  // Sidebar + Overlay
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
});
