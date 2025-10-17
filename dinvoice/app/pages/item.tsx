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
import { Picker } from "@react-native-picker/picker"; // ✅ import picker

const BASE_URL = "http://192.168.18.29:5000/api/items";

export default function Item() {
  type Item = {
    _id?: string;
    itemName?: string;
    hsCode?: string;
    description?: string;
    stTax?: number | string;
    thirdSchedule?: boolean | string;
    saleType?: string;
    taxRate?: number | string;
  };

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  // ✅ Fetch all items
  const fetchItems = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error fetching items:", error.message);
      } else {
        console.error("❌ Error fetching items:", error);
      }
      Alert.alert("Error", "Failed to fetch items from server.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: sidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  // ✅ Delete
  const handleDelete = async (id: string | undefined) => {
    console.log("🗑 Attempting to delete ID:", id);
    if (!id) return Alert.alert("Error", "Item ID missing");

    try {
      const res = await fetch(`http://192.168.18.29:5000/api/items/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("📩 Response:", data);

      if (res.ok) {
        Alert.alert("Success", "Item deleted successfully");
        setItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        Alert.alert("Error", data.message || "Failed to delete item");
      }
    } catch (err) {
      console.error("❌ Delete failed:", err);
      Alert.alert("Error", "Network error while deleting");
    }
  };

  // ✅ Save (Add or Update)
  const handleSave = async () => {
    if (!editingItem) {
      Alert.alert("Error", "No item selected to save.");
      return;
    }

    if (!editingItem.itemName || !editingItem.hsCode) {
      Alert.alert("Error", "Item name and HS Code are required.");
      return;
    }

    // ✅ Auto-fix logic for Third Schedule
    let finalItem = { ...editingItem };
    if (finalItem.thirdSchedule === "Yes" || finalItem.thirdSchedule === true) {
      finalItem.thirdSchedule = true;
      finalItem.saleType = "Retail"; // ✅ Force retail
      finalItem.taxRate = 18; // ✅ Standard rate
    } else {
      finalItem.thirdSchedule = false;
      finalItem.taxRate = Number(
        finalItem.taxRate?.toString().replace("%", "").trim() || 0
      );
    }

    // Convert stTax to number
    finalItem.stTax = Number(finalItem.stTax || 0);

    const url = finalItem._id ? `${BASE_URL}/${finalItem._id}` : BASE_URL;
    const method = finalItem._id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalItem),
      });

      const data = await res.json();
      console.log("📩 Response:", data);

      if (res.ok) {
        setModalVisible(false);
        fetchItems();
      } else {
        Alert.alert("Error", data.message || "Failed to save item.");
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      Alert.alert("Error", "Server connection issue.");
    }
  };

  const handleAddNew = () => {
    setEditingItem({
      itemName: "",
      hsCode: "",
      description: "",
      stTax: "",
      thirdSchedule: "",
      saleType: "",
      taxRate: "",
    });
    setModalVisible(true);
  };

  const handleEdit = (
    item: React.SetStateAction<{
      _id?: string;
      itemName?: string;
      hsCode?: string;
      description?: string;
      stTax?: number | string;
      thirdSchedule?: boolean | string;
      saleType?: string;
      taxRate?: number | string;
    } | null>
  ) => {
    setEditingItem(item);
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
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
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

      {/* ADD / EDIT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingItem?._id ? "Edit Item" : "Add Item"}
            </Text>

            {/* Inputs */}
            {(
              [
                "itemName",
                "hsCode",
                "description",
                "stTax",
                "taxRate",
              ] as (keyof Item)[]
            ).map((field) => (
              <TextInput
                key={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                placeholderTextColor="#aaa"
                style={styles.input}
                keyboardType={
                  field === "stTax" || field === "taxRate"
                    ? "numeric"
                    : "default"
                }
                editable={
                  field === "taxRate"
                    ? !(
                        editingItem?.thirdSchedule === "Yes" ||
                        editingItem?.thirdSchedule === true
                      )
                    : true
                }
                value={
                  (
                    editingItem?.[field] as string | number | undefined
                  )?.toString() || ""
                }
                onChangeText={(val) =>
                  setEditingItem(
                    (prev) => ({ ...(prev || {}), [field]: val } as Item)
                  )
                }
              />
            ))}

            {/* Third Schedule */}
            <Text style={styles.label}>Third Schedule</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editingItem?.thirdSchedule || ""}
                onValueChange={(val) => {
                  if (val === "Yes") {
                    setEditingItem({
                      ...editingItem,
                      thirdSchedule: "Yes",
                      saleType: "Retail",
                      taxRate: "18",
                    });
                  } else {
                    setEditingItem({
                      ...editingItem,
                      thirdSchedule: "No",
                      taxRate: "",
                    });
                  }
                }}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>

            {/* Sale Type */}
            <Text style={styles.label}>Sale Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={editingItem?.saleType || ""}
                enabled={
                  !(
                    editingItem?.thirdSchedule === "Yes" ||
                    editingItem?.thirdSchedule === true
                  )
                }
                onValueChange={(val) =>
                  setEditingItem({ ...editingItem, saleType: val })
                }
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Retail" value="Retail" />
                <Picker.Item label="Wholesale" value="Wholesale" />
                <Picker.Item label="Export" value="Export" />
                <Picker.Item label="Service" value="Service" />
              </Picker>
            </View>

            {/* Buttons */}
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

// 🎨 Styles (unchanged)
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
  label: { color: "#fff", marginBottom: 5, marginTop: 5 },
  input: {
    backgroundColor: "#334155",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#334155",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: { color: "#fff" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
