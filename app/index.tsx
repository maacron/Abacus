import { useInterval } from "@/app/components/IntervalContext";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type WrongItem = {
  num1: number;
  num2: number;
};

export default function Index() {
  const { firstNumber, secondNumber } = useInterval();
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [numbers, setNumbers] = useState({ num1: 0, num2: 0 });
  const [timer, setTimer] = useState(3);
  const [showTimer, setShowTimer] = useState(true);
  const [wrongList, setWrongList] = useState<WrongItem[]>([]);
  const [isReviewPhase, setIsReviewPhase] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateNumbers = () => {
    if (isReviewPhase && wrongList.length > 0) {
      // Pick a random item from wrongList
      const randomIndex = Math.floor(Math.random() * wrongList.length);
      setNumbers(wrongList[randomIndex]);
    } else {
      // Normal number generation
      const num1 = Math.floor(Math.random() * (firstNumber.max - firstNumber.min + 1)) + firstNumber.min;
      const num2 = Math.floor(Math.random() * (secondNumber.max - secondNumber.min + 1)) + secondNumber.min;
      setNumbers({ num1, num2 });
    }
    setShowTimer(true);
    setTimer(3);
  };

  useEffect(() => {
    generateNumbers();
  }, [firstNumber, secondNumber]);

  useEffect(() => {
    if (totalQuestions >= 10 && wrongList.length > 0) {
      setIsReviewPhase(true);
      setNumbers(wrongList[0]);
      setQuestionNumber(1);
    } else if (wrongList.length === 0 && isReviewPhase) {
      setIsReviewPhase(false);
      setTotalQuestions(0);
      generateNumbers();
    }
  }, [totalQuestions, wrongList, isReviewPhase]);

  useEffect(() => {
    if (!showTimer) return;

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setShowTimer(false);
          // Add to wrongList when timer expires
          if (!wrongList.some(item => 
            item.num1 === numbers.num1 && item.num2 === numbers.num2
          )) {
            setWrongList(prev => [...prev, { num1: numbers.num1, num2: numbers.num2 }]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showTimer, numbers, wrongList]);

  const checkAnswer = (answer: string) => {
    const correctAnswer = numbers.num1 * numbers.num2;
    const isCorrect = parseInt(answer) === correctAnswer;

    if (isCorrect) {
      setQuestionNumber((prev) => prev + 1);
      setTotalQuestions((prev) => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (isReviewPhase) {
        setWrongList(prev => prev.filter(item => 
          !(item.num1 === numbers.num1 && item.num2 === numbers.num2)
        ));
      }
      
      generateNumbers();
      setAnswer("");
    } else {
      if (!wrongList.some(item => 
        item.num1 === numbers.num1 && item.num2 === numbers.num2
      )) {
        setWrongList(prev => [...prev, { num1: numbers.num1, num2: numbers.num2 }]);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setAnswer("");
    }
  };

  return (
    <Pressable
      style={styles.container}
      onLongPress={() => router.push("/settings")}
      delayLongPress={500}
    >
      {showTimer && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timer}</Text>
        </View>
      )}
      <View style={styles.card}>
        {isReviewPhase ? (
          <Text style={styles.reviewText}>Review Mode ({wrongList.length} remaining)</Text>
        ) : (
          <Text style={styles.normalText}>Normal Mode ({totalQuestions}/10)</Text>
        )}
        <Text style={styles.questionNumber}>Question {questionNumber}</Text>
        <Text style={styles.questionText}>
          {numbers.num1} × {numbers.num2}
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor="#888"
          value={answer}
          onChangeText={setAnswer}
          onSubmitEditing={() => checkAnswer(answer)}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: 50,
    alignItems: "center",
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
  timerContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#ddd',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  reviewText: {
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  normalText: {
    color: 'green',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});