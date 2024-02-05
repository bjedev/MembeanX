import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/Loader";
import {useRouter} from "next/router";

export default function LearnWordBlock({blockState}) {
    const router = useRouter()

    const {isLoading, error, data} = useQuery({
        queryKey: ['fetch-learn-word', blockState.blockState.barrier],
        queryFn: async () => {
            const response = await fetch('/api/training/current-state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: localStorage.getItem('session_id'),
                    auth_token: localStorage.getItem('auth_token'),
                    blockState: blockState.blockState,
                }),
            })

            const {type} = await response.json()

            if (type === "SESSION_EXPIRED") {
                router.push("/dashboard")
            }
        }
    })

    if (isLoading) return <Loader/>

    return <div>Learn word</div>
}