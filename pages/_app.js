import "@/styles/globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";
import {useEffect, useState} from "react";
import Meta from "@/components/MetaComponent";
import {useThemeStore} from "@/state/basic-state";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/react";

const queryClient = new QueryClient()

export default function App({Component, pageProps}) {
    const themeStore = useThemeStore();

    useEffect(() => {
        const theme = localStorage.getItem('theme');

        if (theme) themeStore.updateTheme(theme);
    }, []);

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Toaster/>
                <Meta/>
                <div data-theme={themeStore.theme}>
                    <Component {...pageProps} />
                </div>
            </QueryClientProvider>

            <Analytics />
            <SpeedInsights />
        </>
    );
}
