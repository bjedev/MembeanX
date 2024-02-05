import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/Loader";

export default function MultipleChoiceBlock({ blockState }) {
    console.log(blockState)

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

            console.log(response)
        }
    })

    if (isLoading) return <Loader />

    return <div>Multiple choice</div>
}