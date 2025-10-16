import Sidebar from "@/components/Comp";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function UserManagement() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  // Form fields
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [userType, setUserType] = useState("Customer");
  const [status, setStatus] = useState("Active");

  const API_URL = "http://192.168.18.29:5000/api/users";

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.log("❌ Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add or Edit user
  const handleSave = async () => {
    if (!name || !contact || !userType) {
      Alert.alert("Validation", "All fields are required");
      return;
    }

    const userData = { name, contact, userType, status };

    try {
      let res;
      if (editingUser) {
        res = await fetch(`${API_URL}/${editingUser._id || editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
      }

      const result = await res.json();
      // console.log("✅ Response:", result);

      fetchUsers();
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.log("❌ Error saving user:", error);
      Alert.alert("Error", "Failed to save user. Check console.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!id) return;

    // Optimistic UI: remove user immediately
    setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.log("❌ Delete failed", await res.json());
        // If delete fails, refetch to restore
        fetchUsers();
      }
    } catch (error) {
      console.log("❌ Error deleting user:", error);
      fetchUsers();
    }
  };
  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setContact(user.contact);
    setUserType(user.userType);
    setStatus(user.status);
    setModalVisible(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingUser(null);
    setName("");
    setContact("");
    setUserType("Customer");
    setStatus("Active");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

        {/* SIDEBAR */}
        {sidebarVisible && (
          <>
            <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
            <Animated.View
              style={[
                styles.sidebar,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <Sidebar onNavigate={toggleSidebar} />
            </Animated.View>
          </>
        )}

        {/* MAIN CONTENT */}
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#67e8f9" />
              <Text style={styles.statValue}>{users.length}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setModalVisible(true);
            }}
          >
            <Ionicons name="person-add-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add User</Text>
          </TouchableOpacity>

          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={styles.tableWrapper}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.cell, styles.headerText]}>User Name</Text>
                <Text style={[styles.cell, styles.headerText]}>Contact</Text>
                <Text style={[styles.cell, styles.headerText]}>User Type</Text>
                <Text style={[styles.cell, styles.headerText]}>Status</Text>
                <Text style={[styles.cell, styles.headerText]}>Created</Text>
                <Text style={[styles.cell, styles.headerText]}>Action</Text>
              </View>

              {users.length > 0 ? (
                users.map((u, i) => {
                  const userId = u._id || u.id; // ensure ID exists
                  console.log("User row:", u); // log user row for debugging
                  return (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.cell}>{u.name}</Text>
                      <Text style={styles.cell}>{u.contact}</Text>
                      <Text style={styles.cell}>{u.userType}</Text>
                      <Text style={styles.cell}>{u.status}</Text>
                      <Text style={styles.cell}>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </Text>
                      <View style={[styles.cell, { flexDirection: "row" }]}>
                        <TouchableOpacity onPress={() => handleEdit(u)}>
                          <Text style={{ color: "#60a5fa", marginRight: 8 }}>
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(userId)}>
                          <Text style={{ color: "#f87171" }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text
                  style={{ color: "#ccc", textAlign: "center", margin: 10 }}
                >
                  No users found.
                </Text>
              )}
            </View>
          </ScrollView>
        </ScrollView>

        {/* ADD/EDIT MODAL */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {editingUser ? "Edit User" : "Add New User"}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact"
                placeholderTextColor="#aaa"
                value={contact}
                onChangeText={setContact}
              />

              <Picker
                selectedValue={userType}
                onValueChange={setUserType}
                style={styles.picker}
              >
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Customer" value="Customer" />
                <Picker.Item label="Employee" value="Employee" />
              </Picker>

              <Picker
                selectedValue={status}
                onValueChange={setStatus}
                style={styles.picker}
              >
                <Picker.Item label="Active" value="Active" />
                <Picker.Item label="Inactive" value="Inactive" />
              </Picker>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#2563EB" }]}
                  onPress={handleSave}
                >
                  <Text style={styles.btnText}>
                    {editingUser ? "Update" : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#6b7280" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ...Styles remain the same as your original code
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
  title: { fontSize: 26, fontWeight: "700", color: "#fff" },
  menuButton: { padding: 5 },
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
  statValue: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 6 },
  statLabel: { color: "#9da3b4", fontSize: 13, marginTop: 2 },
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
  tableWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 900,
    marginBottom: 50,
  },
  tableHeader: { backgroundColor: "rgba(255,255,255,0.1)" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cell: { flex: 1, color: "#fff", fontSize: 14 },
  headerText: { fontWeight: "700", fontSize: 15, color: "#67e8f9" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#1f2937",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    marginBottom: 10,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
