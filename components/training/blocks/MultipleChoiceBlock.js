import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/Loader";
import {useRouter} from "next/router";
import {useState} from "react";
import toast from "react-hot-toast";

export default function MultipleChoiceBlock({blockState}) {
    const router = useRouter()
    const [helpMode, setHelpMode] = useState(false)

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
                return false
            }

            if (data === undefined) {
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

    if (data === false) router.push("/dashboard")

    return (
        <div className="card bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
                <h2 className="card-title">{data.data.question}</h2>
                {data.data.answers.map((answer, index) => {
                    return (
                        <button key={index} onClick={async () => {
                            const response = await fetch('/api/training/advance', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    session_id: localStorage.getItem('session_id'),
                                    auth_token: localStorage.getItem('auth_token'),
                                    barrier: data.barrier,
                                    advance: data.advance,
                                    answer: index,
                                    type: 'answer'
                                }),
                            })

                            const {error, success} = await response.json()
                            if (success) {
                                router.push('/training/block')
                            } else {
                                toast.error(error)
                            }

                        }} className={`btn btn-${
                            helpMode ? answer.correct ? 'success' : 'error' : 'primary'
                        }`}>{answer.text}</button>
                    )
                })}
                <div className="card-actions justify-end">
                    <button className="btn" onClick={() => {
                        setHelpMode(!helpMode)
                    }}>Help</button>
                </div>
            </div>
        </div>
    )
}