// screens/LoginScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen (Placeholder)</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Assessment")}
      >
        <Text style={styles.buttonText}>Continue to Assessment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20 },
  button: {
    backgroundColor: "#6b8e23",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
