import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/Loader";
import {useRouter} from "next/router";
import {useState} from "react";
import toast from "react-hot-toast";

export default function CompletedSessionBlock({blockState}) {
    const router = useRouter()

    const {isLoading, error, data} = useQuery({
        queryKey: ['fetch-completed-session-data', blockState.blockState.barrier],
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
                <h2 className="card-title">Study Session Complete!</h2>
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
                                type: 'done'
                            }),
                        })

                        const {error, success} = await response.json()
                        if (success) {
                            blockState.setBlockState({
                                updateRequired: true,
                            })
                        } else {
                            toast.error(error)
                        }

                    }} className='btn btn-primary'>Exit</button>
            </div>
        </div>
    )
}