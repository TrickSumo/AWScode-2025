// App.js
import React from "react";
import useStore from "./store";
import CountWatcher from "./CountWatcher";

const App = () => {
  const increment = useStore((state) => state.increment);
  const setText = useStore((state) => state.setText);
  const count = useStore((state) => state.count);
  const text = useStore((state) => state.text);

  return (
    <div>
      <h1>Zustand subscribeWithSelector Demo</h1>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <button onClick={increment}>Increment Count</button>
      <button onClick={() => setText("world")}>Change Text</button>

      <CountWatcher />
    </div>
  );
};

export default App;
