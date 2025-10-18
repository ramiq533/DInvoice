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
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// ✅ CHANGE THIS to your computer's IP (same network as mobile)
const BASE_URL = "http://192.168.18.29:5000/api/items";

export default function Item() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await fetch(BASE_URL);
      const json = await res.json();
      const safeData = Array.isArray(json.data) ? json.data : [];
      setItems(safeData);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch items from server.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Sidebar toggle
  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  // Delete item
  const handleDelete = async (id: string) => {
    console.log("Attempting to delete item id:", id);

    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      console.log("Delete response:", data);

      if (res.ok && data.success) {
        // Remove the deleted item from state
        setItems((prev) => prev.filter((item) => item._id !== id));
        console.log("Item deleted successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to delete item.");
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
      Alert.alert("Error", "Cannot reach server. Check network.");
    }
  };

  // Save/Add item
  const handleSave = async () => {
    if (!editingItem.itemName || !editingItem.hsCode || !editingItem.taxRate) {
      Alert.alert("Error", "Item name, HS Code, and Tax Rate are required.");
      return;
    }

    // Convert values
    let thirdSchedule = editingItem.thirdSchedule === "Yes";
    let taxRate = Number(editingItem.taxRate);
    let saleType = editingItem.saleType;

    // Backend rule: Third Schedule must be Retail & taxRate 18
    if (thirdSchedule) {
      if (saleType !== "Retail") {
        Alert.alert(
          "Warning",
          "Third Schedule items must be Retail. Adjusted automatically."
        );
        saleType = "Retail";
      }
      if (taxRate !== 18) {
        Alert.alert(
          "Warning",
          "Third Schedule items must have tax rate 18%. Adjusted automatically."
        );
        taxRate = 18;
      }
    }

    const payload = {
      ...editingItem,
      thirdSchedule,
      taxRate,
      saleType,
    };

    try {
      const url = editingItem._id ? `${BASE_URL}/${editingItem._id}` : BASE_URL;
      const method = editingItem._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalVisible(false);
        fetchItems();
      } else {
        Alert.alert("Error", data.message || "Failed to save item.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server connection issue.");
    }
  };

  // Add new
  const handleAddNew = () => {
    setEditingItem({
      itemName: "",
      hsCode: "",
      description: "",
      stTax: "",
      thirdSchedule: "No",
      saleType: "Retail",
      taxRate: "",
    });
    setModalVisible(true);
  };

  // Edit existing
  const handleEdit = (item: any) => {
    setEditingItem({
      ...item,
      thirdSchedule: item.thirdSchedule ? "Yes" : "No",
    });
    setModalVisible(true);
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

      {sidebarVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />
      )}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <Sidebar onNavigate={toggleSidebar} />
      </Animated.View>

      {/* MAIN CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Item List</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* TABLE */}
        <ScrollView horizontal>
          <View style={styles.tableWrapper}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              {[
                "Item Name",
                "HS Code",
                "Description",
                "ST Tax",
                "Third Schedule",
                "Sale Type",
                "Tax Rate",
                "Action",
              ].map((header) => (
                <Text key={header} style={[styles.cell, styles.headerText]}>
                  {header}
                </Text>
              ))}
            </View>

            {items.length > 0 ? (
              items.map((item) => (
                <View key={item._id} style={styles.tableRow}>
                  <Text style={styles.cell}>{item.itemName}</Text>
                  <Text style={styles.cell}>{item.hsCode}</Text>
                  <Text style={styles.cell}>{item.description}</Text>
                  <Text style={styles.cell}>{item.stTax}</Text>
                  <Text style={styles.cell}>
                    {item.thirdSchedule ? "Yes" : "No"}
                  </Text>
                  <Text style={styles.cell}>{item.saleType}</Text>
                  <Text style={styles.cell}>{item.taxRate}%</Text>
                  <View style={[styles.cell, { flexDirection: "row" }]}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#4FC3F7"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item._id)}
                      style={{ marginLeft: 10 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#EF5350"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={[styles.cell, { textAlign: "center" }]}>
                  No items found.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingItem?._id ? "Edit Item" : "Add Item"}
            </Text>

            {/* Inputs */}
            {["itemName", "hsCode", "description", "stTax", "taxRate"].map(
              (field) => (
                <TextInput
                  key={field}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  placeholderTextColor="#aaa"
                  style={styles.input}
                  value={editingItem?.[field]?.toString() || ""}
                  keyboardType={
                    field === "stTax" || field === "taxRate"
                      ? "numeric"
                      : "default"
                  }
                  onChangeText={(val) =>
                    setEditingItem({ ...editingItem, [field]: val })
                  }
                />
              )
            )}

            {/* Third Schedule Picker */}
            <Text style={{ color: "#fff", marginBottom: 5 }}>
              Third Schedule
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editingItem?.thirdSchedule || "No"}
                onValueChange={(val) =>
                  setEditingItem({ ...editingItem, thirdSchedule: val })
                }
                style={styles.picker}
              >
                <Picker.Item label="No" value="No" />
                <Picker.Item label="Yes" value="Yes" />
              </Picker>
            </View>

            {/* Sale Type Picker */}
            <Text style={{ color: "#fff", marginBottom: 5 }}>Sale Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={editingItem?.saleType || "Retail"}
                onValueChange={(val) =>
                  setEditingItem({ ...editingItem, saleType: val })
                }
                style={styles.picker}
              >
                <Picker.Item label="Retail" value="Retail" />
                <Picker.Item label="Wholesale" value="Wholesale" />
                <Picker.Item label="Service" value="Service" />
              </Picker>
            </View>

            {/* Modal Actions */}
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

// Styles
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
    minWidth: 1000,
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
  pickerWrapper: {
    backgroundColor: "#334155",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: { color: "#fff" },
});
