import "@/styles/globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <Component {...pageProps} />
        </QueryClientProvider>
    );
}
