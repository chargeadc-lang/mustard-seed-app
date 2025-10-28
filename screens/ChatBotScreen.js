import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatBotScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadChat();
  }, []);

  const loadChat = async () => {
    try {
      const saved = await AsyncStorage.getItem("chatHistory");
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        const intro = [
          {
            sender: "bot",
            text: "Welcome back. How are you feeling today?",
          },
        ];
        setMessages(intro);
      }
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  const saveChat = async (newMessages) => {
    try {
      await AsyncStorage.setItem("chatHistory", JSON.stringify(newMessages));
    } catch (err) {
      console.error("Error saving chat:", err);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input.trim() };
    const botReply = generateBotReply(input.trim());
    const updated = [...messages, newMessage, botReply];

    setMessages(updated);
    saveChat(updated);
    setInput("");
  };

  const generateBotReply = (userText) => {
    const lower = userText.toLowerCase();

    if (lower.includes("tired"))
      return {
        sender: "bot",
        text: "That’s okay. Rest is part of growth. What’s been draining your energy lately?",
      };
    if (lower.includes("good") || lower.includes("great"))
      return {
        sender: "bot",
        text: "Love to hear that. What’s been working well for you today?",
      };
    if (lower.includes("stuck"))
      return {
        sender: "bot",
        text: "We all hit those spots. What’s one small action you could take right now?",
      };

    return {
      sender: "bot",
      text: "I hear you. Keep showing up for yourself — even small thoughts matter.",
    };
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={{ paddingVertical: 15 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.sender === "user" ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.sender === "user"
                  ? styles.userText
                  : styles.botText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          placeholder="Type your reflection..."
          placeholderTextColor="#8C7A4E"
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    marginVertical: 6,
    maxWidth: "80%",
    borderRadius: 10,
    padding: 10,
  },
  botMessage: {
    backgroundColor: "#F7E6A4",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#A17C00",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: "#4C3B17",
  },
  userText: {
    color: "#FFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7E6A4",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: "#4C3B17",
  },
  sendButton: {
    backgroundColor: "#A17C00",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sendText: {
    color: "#FFF",
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#6B4F1D",
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  homeText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
