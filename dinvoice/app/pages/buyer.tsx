import Sidebar from "@/components/Comp";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Picker,
} from "react-native";

const API_URL = "http://192.168.18.29:5000/api/buyers";
const ITEMS_URL = "http://192.168.18.29:5000/api/items";

export default function Buyer() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<any>(null);

  const slideAnim = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  // Fetch buyers
  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setBuyers(data.data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for picker
  const fetchItems = async () => {
    try {
      const res = await fetch(ITEMS_URL);
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Delete buyer
  const deleteBuyer = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        // Remove the buyer from state immediately
        setBuyers((prev) => prev.filter((b) => b._id !== id));
      } else {
        Alert.alert("Error", data.message || "Failed to delete buyer");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Cannot reach server");
    }
  };

  // Add / Edit buyer modal
  const openModal = (buyer: any = null) => {
    setEditingBuyer(
      buyer || {
        buyerName: "",
        itemNames: [],
        buyerAddress: "",
        company: "",
      }
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!editingBuyer.buyerName) {
      Alert.alert("Error", "Buyer Name is required");
      return;
    }

    try {
      const url = editingBuyer._id ? `${API_URL}/${editingBuyer._id}` : API_URL;
      const method = editingBuyer._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBuyer),
      });
      const data = await res.json();
      if (data.success) {
        fetchBuyers();
        setModalVisible(false);
      } else {
        Alert.alert("Error", data.message || "Failed to save buyer");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Server error");
    }
  };

  useEffect(() => {
    fetchBuyers();
    fetchItems();
  }, []);

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Buyers</Text>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {sidebarVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
      )}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <Sidebar onNavigate={toggleSidebar} />
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Buyer List</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal()}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Buyer</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            color="#fff"
            size="large"
            style={{ marginTop: 50 }}
          />
        ) : buyers.length === 0 ? (
          <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
            No buyers found.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.tableWrapper}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.cell, styles.headerText]}>Buyer Name</Text>
                <Text style={[styles.cell, styles.headerText]}>Item Names</Text>
                <Text style={[styles.cell, styles.headerText]}>
                  Buyer Address
                </Text>
                <Text style={[styles.cell, styles.headerText]}>Company</Text>
                <Text style={[styles.cell, styles.headerText]}>Action</Text>
              </View>

              {buyers.map((buyer) => (
                <View key={buyer._id} style={styles.tableRow}>
                  <Text style={styles.cell}>{buyer.buyerName}</Text>
                  <Text style={styles.cell}>
                    {Array.isArray(buyer.itemNames)
                      ? buyer.itemNames.join(", ")
                      : buyer.itemNames}
                  </Text>
                  <Text style={styles.cell}>{buyer.buyerAddress}</Text>
                  <Text style={styles.cell}>{buyer.company}</Text>
                  <View style={[styles.cell, { flexDirection: "row", gap: 8 }]}>
                    <TouchableOpacity onPress={() => openModal(buyer)}>
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#4ade80"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteBuyer(buyer._id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#f87171"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingBuyer?._id ? "Edit Buyer" : "Add Buyer"}
            </Text>

            <TextInput
              placeholder="Buyer Name"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={editingBuyer?.buyerName}
              onChangeText={(val) =>
                setEditingBuyer({ ...editingBuyer, buyerName: val })
              }
            />
            <TextInput
              placeholder="Buyer Address"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={editingBuyer?.buyerAddress}
              onChangeText={(val) =>
                setEditingBuyer({ ...editingBuyer, buyerAddress: val })
              }
            />
            <TextInput
              placeholder="Company"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={editingBuyer?.company}
              onChangeText={(val) =>
                setEditingBuyer({ ...editingBuyer, company: val })
              }
            />

            {/* Items Picker */}
            <Text style={{ color: "#fff", marginBottom: 5 }}>
              Select Items:
            </Text>
            <Picker
              selectedValue={editingBuyer?.itemNames?.[0] || ""}
              onValueChange={(val: any) =>
                setEditingBuyer({ ...editingBuyer, itemNames: [val] })
              }
              style={{
                backgroundColor: "#334155",
                color: "#fff",
                marginBottom: 10,
              }}
            >
              <Picker.Item label="Select an item" value="" />
              {items.map((item) => (
                <Picker.Item
                  key={item._id}
                  label={item.itemName}
                  value={item.itemName}
                />
              ))}
            </Picker>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#1E88E5" }]}
                onPress={handleSave}
              >
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#555" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// Styles remain mostly the same
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
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
  tableWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    minWidth: 850,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: { color: "#fff", fontSize: 18, marginBottom: 10 },
  input: {
    backgroundColor: "#334155",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
});
