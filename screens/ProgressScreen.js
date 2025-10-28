// ProgressScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProgressScreen({ navigation }) {
  const [progress, setProgress] = useState({
    streakDays: 0,
    totalMessages: 0,
    lastReflectionDate: null,
  });

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem("progressData");
        if (saved) setProgress(JSON.parse(saved));
      } catch (error) {
        console.log("Error loading progress:", error);
      }
    };
    loadProgress();
  }, []);

  // Tree logic placeholder
  const growingTree = () => {
    // For now this just returns a static image.
    // Later, we’ll use progress.streakDays or totalMessages
    // to dynamically change which tree image shows.
    return (
      <Image
        source={require("../assets/tree_young.png")} // replace later with dynamic growth logic
        style={styles.treeImage}
        resizeMode="contain"
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Tree section */}
        <View style={styles.treeContainer}>{growingTree()}</View>

        {/* Progress text */}
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>
            🌱 Current Streak: <Text style={styles.textValue}>{progress.streakDays} days</Text>
          </Text>
          <Text style={styles.textLabel}>
            💬 Total Reflections:{" "}
            <Text style={styles.textValue}>{progress.totalMessages}</Text>
          </Text>
          <Text style={styles.textLabel}>
            🗓️ Last Reflection:{" "}
            <Text style={styles.textValue}>
              {progress.lastReflectionDate || "No reflections yet"}
            </Text>
          </Text>
        </View>

        {/* Footer buttons */}
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.footerButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("CalendarScreen")}
          >
            <Text style={styles.footerButtonText}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  scrollContainer: { alignItems: "center", paddingBottom: 40 },
  treeContainer: { width: "100%", alignItems: "center", marginBottom: 20 },
  treeImage: { width: 200, height: 200 },
  textContainer: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  textLabel: { fontSize: 16, color: "#444", marginBottom: 8 },
  textValue: { fontWeight: "700", color: "#2E7D32" },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  footerButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  footerButtonText: { fontWeight: "600", color: "#333" },
});
