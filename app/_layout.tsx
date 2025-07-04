import { IntervalProvider } from "@/app/components/IntervalContext"; // adjust path if needed
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <IntervalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </IntervalProvider>
  );
}
