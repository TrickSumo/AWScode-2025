import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    text: "hello",
    increment: () => set((state) => ({ count: state.count + 1 })),
    setText: (newText) => set({ text: newText }),
  }))
);

// const useStore = create((set) => ({
//   count: 0,
//   text: "hello",
//   increment: () => set((state) => ({ count: state.count + 1 })),
//   setText: (newText) => set({ text: newText }),
// }));

export default useStore;
