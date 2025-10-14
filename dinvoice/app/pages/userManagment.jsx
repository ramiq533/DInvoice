import Sidebar from "@/components/Comp";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserManagment() {
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
        <Text style={styles.title}>User Management</Text>
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
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#67e8f9" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#a98bff"
            />
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Administrators</Text>
          </View>
        </View>

        {/* Add User Button */}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>

        {/* Horizontal Scroll for Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {/* TABLE HEADER */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.cell, styles.headerText]}>User Name</Text>
              <Text style={[styles.cell, styles.headerText]}>Contact</Text>
              <Text style={[styles.cell, styles.headerText]}>User Type</Text>
              <Text style={[styles.cell, styles.headerText]}>Status</Text>
              <Text style={[styles.cell, styles.headerText]}>Created</Text>
              <Text style={[styles.cell, styles.headerText]}>Action</Text>
            </View>

            {/* TABLE ROWS */}
            {[
              {
                name: "John Doe",
                contact: "+92 300 1234567",
                type: "Admin",
                status: "Active",
                created: "2025-10-10",
              },
              {
                name: "Sara Khan",
                contact: "+92 301 7654321",
                type: "User",
                status: "Inactive",
                created: "2025-09-15",
              },
              {
                name: "Ali Raza",
                contact: "+92 321 5551234",
                type: "Manager",
                status: "Active",
                created: "2025-08-05",
              },
            ].map((u, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{u.name}</Text>
                <Text style={styles.cell}>{u.contact}</Text>
                <Text style={styles.cell}>{u.type}</Text>
                <Text style={styles.cell}>{u.status}</Text>
                <Text style={styles.cell}>{u.created}</Text>
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

  // STATS
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 5,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },
  statLabel: {
    color: "#9da3b4",
    fontSize: 13,
    marginTop: 2,
  },

  // ADD BUTTON
  addButton: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  // TABLE
  tableWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 900, // ensures horizontal scroll
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
