import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/Loader";
import {useRouter} from "next/router";

export default function MultipleChoiceBlock({blockState}) {
    const router = useRouter()

    const {isLoading, error, data} = useQuery({
        queryKey: ['fetch-multiple-choice', blockState.blockState.barrier],
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

            const {type, data, barrier, advance} = await response.json()

            if (type === "SESSION_EXPIRED") {
                router.push("/dashboard")
                return false
            }

            return {
                type: type,
                data: data,
                barrier: barrier,
                advance: advance
            }
        }
    })

    if (isLoading) return <Loader/>

    return <div>{data.barrier}</div>
}