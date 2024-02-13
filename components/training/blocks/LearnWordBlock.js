import {useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {useState} from "react";

export default function LearnWordBlock({data}) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [helpMode, setHelpMode] = useState(false)
    const [completedQuestion, setCompletedQuestion] = useState(false)
    const [allowedAnswers, setAllowedAnswers] = useState([])

    return (
        <div className="card bg-neutral text-neutral-content">
            <div className="max-w-2xl card-body items-center text-center">
                <div className="indicator">
                    {
                        data.type === 'LEARN_WORD_NEW' ?
                        <span className="indicator-item badge badge-success">New</span> :
                        <span className="indicator-item badge badge-error">Restudy</span>}
                    <p className={'text-2xl'}>{data.data.word}</p>
                </div>
                <div className="divider divider-accent">Context</div>
                <p>{data.data.context}</p>
                <div className="divider divider-accent">Check your knowledge</div>
                {data.data.questions.map((question, index) => {
                    return (
                        <button key={index} onClick={async () => {
                            if (question.correct) {
                                setCompletedQuestion(true)
                            } else {
                                toast.error('Incorrect!')
                                setAllowedAnswers([...allowedAnswers, index])
                            }

                            if (question.correct) {
                                toast.success('Correct!')

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
                                        type: 'spell',
                                        study_type: data.type === 'LEARN_WORD_NEW' ? 'finish_study' : 'finish_restudy',
                                    }),
                                })

                                const {error, success} = await response.json()
                                if (success) {
                                    setHelpMode(false)
                                    setCompletedQuestion(false)
                                    setAllowedAnswers([])
                                    await queryClient.invalidateQueries('get-current-state')
                                } else {
                                    toast.error(error)
                                }
                            }
                        }} className={`btn btn-${
                            (completedQuestion || helpMode) ? question.correct ? 'success' : 'error' : 'primary'
                        }`} disabled={allowedAnswers.includes(index) || (completedQuestion && !question.correct)}>{question.text}</button>
                    )
                })}
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