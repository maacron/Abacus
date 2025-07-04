import { createContext, useContext, useState } from "react";

type Interval = {
  start: number;
  end: number;
};

type IntervalContextType = {
  interval: Interval;
  setInterval: (interval: Interval) => void;
};

const IntervalContext = createContext<IntervalContextType | undefined>(undefined);

export const IntervalProvider = ({ children }: { children: React.ReactNode }) => {
  const [interval, setInterval] = useState<Interval>({ start: 1, end: 10 });

  return (
    <IntervalContext.Provider value={{ interval, setInterval }}>
      {children}
    </IntervalContext.Provider>
  );
};

export const useInterval = () => {
  const context = useContext(IntervalContext);
  if (!context) throw new Error("useInterval must be used within IntervalProvider");
  return context;
};
