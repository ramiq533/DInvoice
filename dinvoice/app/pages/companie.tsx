import Sidebar from "@/components/Comp";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

const screenWidth = Dimensions.get("window").width;

export default function Companie() {
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

  const companies = [
    {
      name: "Alpha Pvt Ltd",
      ntc: "12345-6789",
      logo: "🏢",
      fbr: "Token123",
      start: "2024-01-01",
      end: "2025-01-01",
      status: "Active",
    },
    {
      name: "Beta Corporation",
      ntc: "98765-4321",
      logo: "🏭",
      fbr: "Token987",
      start: "2023-05-10",
      end: "2024-05-10",
      status: "Inactive",
    },
  ];

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Companies</Text>
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

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Company Overview</Text>

        {/* TABLE */}
        <ScrollView horizontal>
          <View>
            {/* TABLE HEADER */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: 150 }]}>Name</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>NTC/CNIC</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Logo</Text>
              <Text style={[styles.headerCell, { width: 140 }]}>FBR Token</Text>
              <Text style={[styles.headerCell, { width: 130 }]}>
                Start Date
              </Text>
              <Text style={[styles.headerCell, { width: 130 }]}>End Date</Text>
              <Text style={[styles.headerCell, { width: 100 }]}>Status</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Actions</Text>
            </View>

            {/* TABLE ROWS */}
            {companies.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  {
                    backgroundColor:
                      index % 2 === 0
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                  },
                ]}
              >
                <Text style={[styles.cell, { width: 150 }]}>{item.name}</Text>
                <Text style={[styles.cell, { width: 120 }]}>{item.ntc}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.logo}</Text>
                <Text style={[styles.cell, { width: 140 }]}>{item.fbr}</Text>
                <Text style={[styles.cell, { width: 130 }]}>{item.start}</Text>
                <Text style={[styles.cell, { width: 130 }]}>{item.end}</Text>
                <Text style={[styles.cell, { width: 100 }]}>{item.status}</Text>
                <TouchableOpacity style={[styles.actionBtn, { width: 120 }]}>
                  <Text style={{ color: "#67e8f9", fontWeight: "600" }}>
                    View
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
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
    marginBottom: 20,
  },

  // Table styles
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
  },
  headerCell: {
    color: "#67e8f9",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cell: {
    color: "#fff",
    fontSize: 14,
    marginRight: 10,
  },
  actionBtn: {
    alignItems: "center",
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
