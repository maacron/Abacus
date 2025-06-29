import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function GameScreen() {
  const [answer, setAnswer] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1)
  const [numbers, setNumbers] = useState({ num1: 0, num2: 0 });
  const [interval, setInterval] = useState({start: 1, end: 10})

  const [correctSound, setCorrectSound] = useState<Audio.Sound | undefined>(undefined);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | undefined>(undefined);

  // Functions 
  const generateNumbers = () => {
    const num1 = Math.floor(Math.random() * interval.end) + interval.start;
    const num2 = Math.floor(Math.random() * interval.end) + interval.start;
    setNumbers({ num1, num2 });
  }; 

  // Call it once on mount
  useEffect(() => {
    generateNumbers();

    // Load both sounds on mount
    const loadSounds = async () => {
      const { sound: cSound } = await Audio.Sound.createAsync(require("../assets/audios/wrong.mp3"));
      setCorrectSound(cSound);

      const { sound: wSound } = await Audio.Sound.createAsync(require("../assets/audios/wrong.mp3"));
      setWrongSound(wSound);
    };
    loadSounds();

    // Unload sounds on unmount
    return () => {
      if (correctSound) {
        correctSound.unloadAsync();
      }
      if (wrongSound) {
        wrongSound.unloadAsync();
      }
    };

  }, []);  

  const playCorrectSound = async () => {
    if (correctSound) {
      await correctSound.replayAsync();
    }
  };

  const playWrongSound = async () => {
    if (wrongSound) {
      await wrongSound.replayAsync();
    }
  };

  const checkAnswer = (answer: string) => {
    const correctAnswer = numbers.num1 * numbers.num2; 

    if (parseInt(answer) === correctAnswer) {
      playCorrectSound();
      setQuestionNumber(prev => prev + 1);
      generateNumbers();
      setAnswer("");
    }
    else { 
      playWrongSound();
      setAnswer("")
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.questionNumber}>Question {questionNumber}</Text>
        <Text style={styles.questionText}>{numbers.num1} × {numbers.num2}</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#888"
          value={answer}
          onChangeText={setAnswer}
          onSubmitEditing={() => {
            checkAnswer(answer)
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ccc",
    alignSelf: "flex-start",
    marginLeft: 16,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  questionNumber: {
    fontSize: 18,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 44,
    fontWeight: "bold",
    textShadowColor: "#aaa",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 200,
    textAlign: "center",
  },
});
