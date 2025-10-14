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

export default function SalesInvoice() {
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
        <Text style={styles.title}>Sales Invoice</Text>
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
        {/* ====== BOXES ====== */}
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Total Sales</Text>
            <Text style={styles.boxValue}>1,248</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Orders</Text>
            <Text style={styles.boxValue}>320</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Total Value</Text>
            <Text style={styles.boxValue}>$84,900</Text>
          </View>
        </View>

        {/* ====== HEADER ROW ====== */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Invoice List</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Invoice</Text>
          </TouchableOpacity>
        </View>

        {/* ====== TABLE ====== */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {/* HEADER */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.headerText]}>#Invoice No.</Text>
              <Text style={[styles.cell, styles.headerText]}>Company</Text>
              <Text style={[styles.cell, styles.headerText]}>Buyer Name</Text>
              <Text style={[styles.cell, styles.headerText]}>Invoice Date</Text>
              <Text style={[styles.cell, styles.headerText]}>Status</Text>
              <Text style={[styles.cell, styles.headerText]}>Buyer Status</Text>
              <Text style={[styles.cell, styles.headerText]}>Action</Text>
            </View>

            {/* ROWS */}
            {[
              {
                invoice: "#INV-0012",
                company: "TechOne Pvt Ltd",
                buyer: "Ali Traders",
                date: "2025-10-10",
                status: "Paid",
                buyerStatus: "Active",
              },
              {
                invoice: "#INV-0013",
                company: "Digital Hub",
                buyer: "Ahmad Supplies",
                date: "2025-10-12",
                status: "Pending",
                buyerStatus: "Active",
              },
              {
                invoice: "#INV-0014",
                company: "VisionCorp",
                buyer: "Imran Distributors",
                date: "2025-10-13",
                status: "Cancelled",
                buyerStatus: "Inactive",
              },
            ].map((data, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{data.invoice}</Text>
                <Text style={styles.cell}>{data.company}</Text>
                <Text style={styles.cell}>{data.buyer}</Text>
                <Text style={styles.cell}>{data.date}</Text>
                <Text style={styles.cell}>{data.status}</Text>
                <Text style={styles.cell}>{data.buyerStatus}</Text>
                <Text style={styles.cell}>Edit | Delete</Text>
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: "center",
  },
  boxTitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 5,
  },
  boxValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  // HEADER ROW (ADD BUTTON)
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

  // TABLE
  tableWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 950,
    marginBottom: 50,
  },
  tableHeader: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cell: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#67e8f9",
  },
});
