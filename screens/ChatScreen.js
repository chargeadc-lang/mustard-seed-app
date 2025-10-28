// HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OPENAI_API_KEY } from "@env";

export default function HomeScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load chat history when screen opens
  useEffect(() => {
    const loadChat = async () => {
      try {
        const saved = await AsyncStorage.getItem("chatHistory");
        if (saved) setMessages(JSON.parse(saved));
      } catch (error) {
        console.log("Error loading chat history:", error);
      }
    };
    loadChat();
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    AsyncStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.choices?.[0]?.message?.content || "..." };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.log("Error sending message:", error);
      setMessages([...updatedMessages, { role: "assistant", content: "Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.header}>
        <Image source={require("../assets/avatar.png")} style={styles.avatar} />
        <Text style={styles.statusText}>Welcome back 🌱</Text>
      </View>

      {/* Chat */}
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your reflection..."
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("ProgressScreen")}>
          <Text style={styles.footerButtonText}>Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("CalendarScreen")}>
          <Text style={styles.footerButtonText}>Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  statusText: { fontSize: 18, fontWeight: "600", color: "#333" },
  chatContainer: { flex: 1, marginBottom: 10 },
  messageBubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: "85%",
  },
  userBubble: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  aiBubble: { backgroundColor: "#f1f1f1", alignSelf: "flex-start" },
  messageText: { fontSize: 16, color: "#333" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  input: { flex: 1, fontSize: 16, padding: 10, color: "#000" },
  sendButton: { marginLeft: 8, backgroundColor: "#4CAF50", padding: 10, borderRadius: 8 },
  sendButtonText: { color: "#fff", fontWeight: "600" },
  footerButtons: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10 },
  footerButton: { backgroundColor: "#eee", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10 },
  footerButtonText: { fontWeight: "600", color: "#333" },
});
