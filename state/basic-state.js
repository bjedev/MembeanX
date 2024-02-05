import {create} from "zustand";

export const useBlockStateStore = create((set) => ({
    blockState: undefined,
    updateBlockState: (newBlockState) => set(() => ({blockState: newBlockState})),
}))