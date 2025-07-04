import { useInterval } from "@/app/components/IntervalContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SettingsScreen() {
  const { interval, setInterval } = useInterval();
  const router = useRouter();

  const [start, setStart] = useState(interval.start.toString());
  const [end, setEnd] = useState(interval.end.toString());

  const saveSettings = () => {
    const newStart = parseInt(start);
    const newEnd = parseInt(end);

    if (isNaN(newStart) || isNaN(newEnd) || newStart <= 0 || newEnd < newStart) {
      alert("Please enter valid numbers. Start must be ≤ End.");
      return;
    }

    setInterval({ start: newStart, end: newEnd });
    router.back(); // go back to game
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <Text style={styles.label}>Start of Range</Text>
      <TextInput
        value={start}
        onChangeText={setStart}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>End of Range</Text>
      <TextInput
        value={end}
        onChangeText={setEnd}
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
  label: {
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
});
