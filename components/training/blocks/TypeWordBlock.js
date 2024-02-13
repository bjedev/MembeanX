import {useRouter} from "next/router";
import {useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";

export default function TypeWordBlock({data}) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [answerInput, setAnswerInput] = useState('')
    const [helpMode, setHelpMode] = useState(false)

    useEffect(() => {
        // Answer Checking
        const currentAnswer = answerInput.toLowerCase()
        const correctAnswer = data.data.answer.toLowerCase()

        if (currentAnswer.length === correctAnswer.length) {
            // The answers are the same length, now we are sure the user has finished typing
            if (currentAnswer === correctAnswer) {
                // Correct Answer
                toast.success('Correct Answer!')

                const response = fetch('/api/training/advance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: localStorage.getItem('session_id'),
                        auth_token: localStorage.getItem('auth_token'),
                        barrier: data.barrier,
                        advance: data.advance,
                        answer: correctAnswer,
                        type: 'answer'
                    }),
                }).then(async (response) => {
                    const {error, success} = await response.json()

                    if (success) {
                        setHelpMode(false)
                        await queryClient.invalidateQueries('get-current-state')
                    } else {
                        toast.error(error)
                    }
                })
            } else {
                // Incorrect Answer
                toast.error('Incorrect Answer, Try Again!')
                setAnswerInput('')
            }
        }
    }, [answerInput]);

    return (
        <div className="card bg-neutral card-side">
            {data.data.imageUrl && <figure><img src={data.data.imageUrl} alt="Context Image" className={"shadow-2xl"} /></figure>}
            <div className="card-body items-center text-center">
                <h2 className="card-title text-neutral-content bg-secondary rounded p-1 text-secondary-content">
                    Hint: <em className={'font-mono rounded'}>{data.data.hint}</em>
                </h2>

                {/* Answer Input */}
                <input type="text"
                       placeholder={data.data.answer.slice(0, 2) + `${helpMode ? data.data.answer.slice(2) : data.data.answer.slice(2).replace(/[a-zA-Z]/g, '-')}`}
                       className="input input-bordered w-full max-w-xs"
                       maxLength={data.data.answer.length}
                       value={answerInput}
                       onChange={(e) => setAnswerInput(e.target.value)}
                       autoCapitalize={"off"} autoComplete={"off"} autoCorrect={"off"} autoFocus={true} spellCheck={false} />

                <div className="card-actions justify-end">
                    <button className="btn" onClick={() => {
                        setHelpMode(!helpMode)
                    }}>Help
                    </button>
                </div>
            </div>
        </div>
    )
}