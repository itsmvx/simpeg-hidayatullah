import { createContext, Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export type ThemeContextType = {
    theme: 'light' | 'dark' | string;
    setTheme: Dispatch<SetStateAction<'light' | 'dark' | string>>
}
export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: {
    children: ReactNode;
}) => {
    const [ theme, setTheme  ] = useLocalStorage<'light' | 'dark' | string>('theme', () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }, {
        serializer: (value) => btoa(value),
        deserializer: (value) => atob(value)
    });
    useEffect(() => {
        if (theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [ theme ]);

    return (
        <>
            <ThemeContext.Provider value={{
                theme, setTheme
            }}>
                { children }
            </ThemeContext.Provider>
        </>
    )
};

export default ThemeProvider;
