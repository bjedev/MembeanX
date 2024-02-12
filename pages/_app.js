import "@/styles/globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import {useEffect} from "react";
import Meta from "@/components/MetaComponent";
import {useThemeStore} from "@/state/basic-state";
import {Analytics} from "@vercel/analytics/react";

const queryClient = new QueryClient()

export default function App({Component, pageProps}) {
    const themeStore = useThemeStore();

    useEffect(() => {
        const theme = localStorage.getItem('theme');

        if (theme) themeStore.updateTheme(theme);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <div className={"btn btn-success hidden"} /> {/* This is required on each page to fix the buttons not coloring as success properly */}
            <div className={"btn btn-error hidden"} /> {/* This is required on each page to fix the buttons not coloring as success properly */}
            <Toaster/>
            <Meta/>
            <div data-theme={themeStore.theme}>
                <Component {...pageProps} />
            </div>
            <Analytics/>
        </QueryClientProvider>
    );
}
