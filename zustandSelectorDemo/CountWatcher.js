import { useEffect } from "react";
import useStore from "./store";

const CountWatcher = () => {
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.count, // selector
      (count) => {
        console.log("🔢 Count changed to:", count);
      }
    );
    // const unsubscribe = useStore.subscribe((newState, prevState) => {
    //   if (newState.count !== prevState.count) {
    //     console.log("🔢 Count changed to:", newState.count);
    //   }

    //   if (newState.text !== prevState.text) {
    //     console.log("🔤 Text changed to:", newState.text);
    //   }
    // });

    return () => {
      unsubscribe(); // cleanup on unmount
    };
  }, []);

  return null; // this component just watches — no UI
};

export default CountWatcher;
