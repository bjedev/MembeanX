import "@/styles/globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import {useEffect, useState} from "react";
import Meta from "@/components/MetaComponent";

const queryClient = new QueryClient()

export default function App({Component, pageProps}) {
    const [theme, setTheme] = useState()

    useEffect(() => {
        const theme = localStorage.getItem('theme');

        setTheme(theme || 'dark')
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster/>
            <Meta/>
            <div className={`theme-${theme}`}>
                <Component {...pageProps} />
            </div>
        </QueryClientProvider>
    );
}
