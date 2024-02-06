import {useQuery, useQueryClient} from "@tanstack/react-query";
import Loader from "@/components/Loader";
import {useRouter} from "next/router";
import {useState} from "react";
import toast from "react-hot-toast";

export default function MultipleChoiceBlock({isLoading, data}) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [helpMode, setHelpMode] = useState(false)

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
                                setHelpMode(false)
                                await queryClient.invalidateQueries('get-current-state')
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