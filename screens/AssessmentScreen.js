import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AssessmentScreen({ navigation }) {
  const questions = [
    "I feel clear about what I'm working toward.",
    "I’m consistent with my habits or workouts.",
    "My mindset supports my progress, not blocks it.",
    "I adapt instead of quitting when things change.",
    "I take action even when I don’t feel ready.",
  ];

  const [scores, setScores] = useState(Array(questions.length).fill(null));
  const [completed, setCompleted] = useState(false);
  const [average, setAverage] = useState(0);
  const [message, setMessage] = useState("");

  const handleScore = (index, value) => {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  };

  const handleSubmit = async () => {
    if (scores.includes(null)) {
      alert("Please rate all questions before submitting.");
      return;
    }

    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = (sum / scores.length).toFixed(1);
    setAverage(avg);

    let summary = "";
    if (avg < 2) summary = "You're planting the seed — stay patient and start small.";
    else if (avg < 3.5) summary = "You’re sprouting roots — consistency will strengthen them.";
    else if (avg < 4.5) summary = "You’re growing steady — keep nurturing what’s working.";
    else summary = "You’re thriving — now help others plant theirs.";

    setMessage(summary);
    setCompleted(true);

    try {
      // store full result object under the key HomeScreen expects
      const result = {
        score: parseFloat(avg),
        band:
          avg < 2
            ? "Seed — starting from the dirt"
            : avg < 3.5
            ? "Sprout — early growth"
            : avg < 4.5
            ? "Sapling — building strength"
            : "Tree — steady and rooted",
        message: summary,
      };

      await AsyncStorage.setItem("ms_assessment_result_v1", JSON.stringify(result));
    } catch (error) {
      console.error("Error saving assessment:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Self-Growth Assessment</Text>

      {questions.map((q, i) => (
        <View key={i} style={styles.questionBlock}>
          <Text style={styles.questionText}>{q}</Text>
          <View style={styles.scoreRow}>
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.scoreButton,
                  scores[i] === num && styles.scoreSelected,
                ]}
                onPress={() => handleScore(i, num)}
              >
                <Text
                  style={[
                    styles.scoreText,
                    scores[i] === num && styles.scoreTextSelected,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {!completed ? (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Assessment</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Your Result</Text>
          <Text style={styles.resultScore}>{average}/5</Text>
          <Text style={styles.resultMessage}>{message}</Text>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF9E6",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6B4F1D",
    marginVertical: 20,
  },
  questionBlock: {
    width: "100%",
    marginVertical: 15,
    backgroundColor: "#F7E6A4",
    borderRadius: 10,
    padding: 15,
  },
  questionText: {
    fontSize: 16,
    color: "#4C3B17",
    marginBottom: 10,
    fontWeight: "500",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A17C00",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreSelected: {
    backgroundColor: "#A17C00",
  },
  scoreText: {
    color: "#6B4F1D",
    fontWeight: "600",
  },
  scoreTextSelected: {
    color: "#FFF",
  },
  submitButton: {
    backgroundColor: "#A17C00",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
  },
  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    backgroundColor: "#F7E6A4",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginTop: 30,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B4F1D",
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4C3B17",
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: "#6B4F1D",
    textAlign: "center",
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: "#A17C00",
    padding: 12,
    borderRadius: 10,
  },
  homeText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
