import {create} from "zustand";

export const useBlockStateStore = create((set) => ({
    blockState: undefined,
    updateBlockState: (newBlockState) => set(() => ({blockState: newBlockState})),
}))

export const useThemeStore = create((set) => ({
    theme: 'dark',
    updateTheme: (newTheme) => set(() => {
        localStorage.setItem('theme', newTheme)
        return {theme: newTheme}
    }),
}))