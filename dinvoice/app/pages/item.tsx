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

export default function Item() {
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
        <Text style={styles.title}>Items</Text>
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
        {/* HEADER ROW WITH ADD BUTTON */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Item List</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll for Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {/* TABLE HEADER */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.headerText]}>Item Name</Text>
              <Text style={[styles.cell, styles.headerText]}>HS Code</Text>
              <Text style={[styles.cell, styles.headerText]}>Description</Text>
              <Text style={[styles.cell, styles.headerText]}>ST Tax</Text>
              <Text style={[styles.cell, styles.headerText]}>
                Third Schedule
              </Text>
              <Text style={[styles.cell, styles.headerText]}>Sale Type</Text>
              <Text style={[styles.cell, styles.headerText]}>Tax Rate</Text>
              <Text style={[styles.cell, styles.headerText]}>Action</Text>
            </View>

            {/* TABLE ROWS */}
            {[
              {
                name: "Laptop",
                hs: "8471.30",
                desc: "Dell Inspiron 15",
                sttax: "17%",
                schedule: "Yes",
                saleType: "Retail",
                rate: "12%",
              },
              {
                name: "Mobile",
                hs: "8517.12",
                desc: "Samsung Galaxy S24",
                sttax: "17%",
                schedule: "No",
                saleType: "Wholesale",
                rate: "10%",
              },
              {
                name: "Printer",
                hs: "8443.32",
                desc: "HP LaserJet 1020",
                sttax: "16%",
                schedule: "No",
                saleType: "Retail",
                rate: "8%",
              },
            ].map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.hs}</Text>
                <Text style={styles.cell}>{item.desc}</Text>
                <Text style={styles.cell}>{item.sttax}</Text>
                <Text style={styles.cell}>{item.schedule}</Text>
                <Text style={styles.cell}>{item.saleType}</Text>
                <Text style={styles.cell}>{item.rate}</Text>
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

  // HEADER ROW (TITLE + ADD BUTTON)
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

  // TABLE
  tableWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 1000,
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
