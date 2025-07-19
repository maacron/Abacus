import { useInterval } from "@/app/components/IntervalContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const { firstNumber, secondNumber, setFirstNumber, setSecondNumber } = useInterval();
  const router = useRouter();

  const [firstMin, setFirstMin] = useState(firstNumber.min.toString());
  const [firstMax, setFirstMax] = useState(firstNumber.max.toString());
  const [secondMin, setSecondMin] = useState(secondNumber.min.toString());
  const [secondMax, setSecondMax] = useState(secondNumber.max.toString());

  const saveSettings = () => {
    const newFirstMin = parseInt(firstMin);
    const newFirstMax = parseInt(firstMax);
    const newSecondMin = parseInt(secondMin);
    const newSecondMax = parseInt(secondMax);

    if (
      isNaN(newFirstMin) || isNaN(newFirstMax) || 
      isNaN(newSecondMin) || isNaN(newSecondMax) ||
      newFirstMin <= 0 || newFirstMax < newFirstMin ||
      newSecondMin <= 0 || newSecondMax < newSecondMin
    ) {
      alert("Please enter valid numbers. Min must be ≤ Max for both numbers.");
      return;
    }

    setFirstNumber({ min: newFirstMin, max: newFirstMax });
    setSecondNumber({ min: newSecondMin, max: newSecondMax });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <Text style={styles.sectionTitle}>First Number</Text>
      <Text style={styles.label}>Minimum</Text>
      <TextInput
        value={firstMin}
        onChangeText={setFirstMin}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Maximum</Text>
      <TextInput
        value={firstMax}
        onChangeText={setFirstMax}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Second Number</Text>
      <Text style={styles.label}>Minimum</Text>
      <TextInput
        value={secondMin}
        onChangeText={setSecondMin}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Maximum</Text>
      <TextInput
        value={secondMax}
        onChangeText={setSecondMax}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Save Settings" onPress={saveSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
});