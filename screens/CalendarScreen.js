// CalendarScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [log, setLog] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [entries, setEntries] = useState({});

  // Load saved entries
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("calendarEntries");
        if (saved) setEntries(JSON.parse(saved));
      } catch (e) {
        console.log("Error loading entries:", e);
      }
    })();
  }, []);

  const openLogModal = (date) => {
    setSelectedDate(date);
    setLog(entries[date] || "");
    setModalVisible(true);
  };

  const saveLog = async () => {
    try {
      const updated = { ...entries, [selectedDate]: log };
      setEntries(updated);
      await AsyncStorage.setItem("calendarEntries", JSON.stringify(updated));

      const progress = {
        streak: Object.keys(updated).length,
        tokens: 0,
        lastLog: `${selectedDate}: ${log}`,
      };
      await AsyncStorage.setItem("progressData", JSON.stringify(progress));

      setModalVisible(false);
    } catch (error) {
      console.log("Error saving log:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Growth Journal</Text>

      <ScrollView>
        <Calendar
          onDayPress={(day) => openLogModal(day.dateString)}
          markedDates={{
            ...Object.keys(entries).reduce((acc, date) => {
              acc[date] = { marked: true, dotColor: "#6b8e23" };
              return acc;
            }, {}),
            ...(selectedDate && { [selectedDate]: { selected: true } }),
          }}
          theme={{
            selectedDayBackgroundColor: "#6b8e23",
            todayTextColor: "#6b8e23",
            arrowColor: "#6b8e23",
          }}
        />
      </ScrollView>

      {/* Modal for journaling */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Log for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              value={log}
              onChangeText={setLog}
              placeholder="Write your reflection..."
              multiline
            />
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.save]}
                onPress={saveLog}
              >
                <Text style={styles.btnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, styles.homeBtn]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.navTxt}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.progressBtn]}
          onPress={() => navigation.navigate("Progress")}
        >
          <Text style={styles.navTxt}>Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#556b2f",
    textAlign: "center",
    marginVertical: 10,
  },
  modalWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#556b2f",
  },
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  btnRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancel: { backgroundColor: "#ccc" },
  save: { backgroundColor: "#6b8e23" },
  btnTxt: { color: "#fff", fontWeight: "700" },

  navRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  navBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  homeBtn: { backgroundColor: "#f2ecd2" },
  progressBtn: { backgroundColor: "#e5f0e1" },
  navTxt: { fontSize: 16, fontWeight: "700", color: "#444" },
});
