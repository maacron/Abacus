import { createContext, useContext, useState } from "react";

type NumberInterval = {
  min: number;
  max: number;
};

type IntervalContextType = {
  firstNumber: NumberInterval;
  secondNumber: NumberInterval;
  setFirstNumber: (interval: NumberInterval) => void;
  setSecondNumber: (interval: NumberInterval) => void;
};

const IntervalContext = createContext<IntervalContextType | undefined>(undefined);

export const IntervalProvider = ({ children }: { children: React.ReactNode }) => {
  const [firstNumber, setFirstNumber] = useState<NumberInterval>({ min: 1, max: 10 });
  const [secondNumber, setSecondNumber] = useState<NumberInterval>({ min: 1, max: 10 });

  return (
    <IntervalContext.Provider value={{ firstNumber, secondNumber, setFirstNumber, setSecondNumber }}>
      {children}
    </IntervalContext.Provider>
  );
};

export const useInterval = () => {
  const context = useContext(IntervalContext);
  if (!context) throw new Error("useInterval must be used within IntervalProvider");
  return context;
};