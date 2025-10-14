import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname(); // 👈 Detect current active path

  const menuItems = [
    {
      section: "Main",
      items: [
        { name: "Dashboard", icon: "grid-outline", path: "/pages/dashboard" },
        {
          name: "Companies",
          icon: "business-outline",
          path: "/pages/companie",
        },
      ],
    },
    {
      section: "Management",
      items: [
        {
          name: "User Management",
          icon: "people-outline",
          path: "/pages/userManagment",
        },
        { name: "Items", icon: "cube-outline", path: "/pages/item" },

        { name: "Buyers", icon: "person-outline", path: "/pages/buyer" },
      ],
    },
    {
      section: "Operations",
      items: [
        {
          name: "Sales Invoice",
          icon: "document-text-outline",
          path: "/pages/SalesInvoice",
        },
        { name: "Reports", icon: "bar-chart-outline", path: "/pages/Report" },
      ],
    },
  ];

  const handlePress = (path: string) => {
    router.push(path);
    if (onNavigate) onNavigate(); // Close sidebar on navigate
  };

  return (
    <View style={styles.sidebar}>
      <ScrollView contentContainerStyle={{ paddingVertical: 25 }}>
        {menuItems.map((section, idx) => (
          <View key={idx}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item, i) => {
              const isActive = pathname === item.path; // 👈 check active page
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.item, isActive && styles.activeItem]}
                  onPress={() => handlePress(item.path)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={isActive ? "#67e8f9" : "#fff"}
                  />
                  <Text
                    style={[styles.itemText, isActive && styles.activeItemText]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  itemText: {
    color: "#E5E7EB",
    fontSize: 15,
    marginLeft: 12,
    fontWeight: "500",
  },
  activeItem: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeItemText: {
    color: "#67e8f9",
    fontWeight: "700",
  },
});
