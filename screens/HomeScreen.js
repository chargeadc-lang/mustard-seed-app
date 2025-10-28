// HomeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OPENAI_API_KEY } from "@env";

export default function HomeScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    streakDays: 0,
    totalMessages: 0,
    lastReflectionDate: null,
  });

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedChat = await AsyncStorage.getItem("chatHistory");
        const savedProgress = await AsyncStorage.getItem("progressData");

        if (savedChat) setMessages(JSON.parse(savedChat));
        if (savedProgress) setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.log("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // Save messages
  useEffect(() => {
    AsyncStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Save progress
  useEffect(() => {
    AsyncStorage.setItem("progressData", JSON.stringify(progress));
  }, [progress]);

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
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const aiText =
        data?.choices?.[0]?.message?.content || "Something went wrong. Try again.";
      const aiMessage = { role: "assistant", content: aiText };
      const allMessages = [...updatedMessages, aiMessage];
      setMessages(allMessages);
      await updateProgress();
    } catch (error) {
      console.log("Error sending message:", error);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Error: no response from AI." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async () => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = progress.lastReflectionDate;
    let newStreak = progress.streakDays;

    if (!lastDate) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor(
        (new Date(today).getTime() - new Date(lastDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (diffDays === 0) {
        newStreak = progress.streakDays;
      } else if (diffDays === 1) {
        newStreak = progress.streakDays + 1;
      } else {
        newStreak = 1;
      }
    }

    const updatedProgress = {
      streakDays: newStreak,
      totalMessages: progress.totalMessages + 1,
      lastReflectionDate: today,
    };
    setProgress(updatedProgress);
    await AsyncStorage.setItem("progressData", JSON.stringify(updatedProgress));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={require("../assets/avatar.png")} style={styles.avatar} />
          <Text style={styles.statusText}>
            Welcome back 🌱 | {progress.streakDays}-Day
          </Text>
        </View>

        {/* Chat Messages */}
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
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

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your reflection..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity
            style={[styles.sendButton, loading && { opacity: 0.6 }]}
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("ProgressScreen")}
          >
            <Text style={styles.footerButtonText}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation.navigate("CalendarScreen")}
          >
            <Text style={styles.footerButtonText}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  statusText: { fontSize: 16, fontWeight: "600", color: "#333" },
  chatContainer: { flex: 1 },
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
    backgroundColor: "#fff",
  },
  input: { flex: 1, fontSize: 16, padding: 10, color: "#000" },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendButtonText: { color: "#fff", fontWeight: "600" },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  footerButton: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  footerButtonText: { fontWeight: "600", color: "#333" },
});
