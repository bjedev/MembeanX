import {useBlockStateStore} from "@/state/basic-state";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Loader from "@/components/Loader";
import MultipleChoiceBlock from "@/components/training/blocks/MultipleChoiceBlock";
import LearnWordBlock from "@/components/training/blocks/LearnWordBlock";
import Meta from "@/components/MetaComponent";
import {useQuery} from "@tanstack/react-query";
import CompletedSessionBlock from "@/components/training/blocks/CompletedSessionBlock";
import TypeWordBlock from "@/components/training/blocks/TypeWordBlock";
import WordMapBlock from "@/components/training/blocks/WordMapBlock";

export default function MainTrainingBlock() {
    const blockState = useBlockStateStore();
    const [backupTimeLeft, setBackupTimeLeft] = useState('')
    const router = useRouter();

    useEffect(() => {
        if (blockState.blockState === undefined) {
            router.push('/dashboard')
        }
    }, [blockState.blockState])

    const {isFetching, error, data} = useQuery({
        queryKey: ['get-current-state'],
        retry: false,
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

            const {type, data, barrier, advance, time_left} = await response.json()

            if (time_left !== "") {
                setBackupTimeLeft(time_left)
            }

            console.log("Backup Time Left:", backupTimeLeft, "\nTime Left:", time_left)

            return {
                type: type,
                data: data,
                barrier: barrier,
                advance: advance,
                time_left: time_left === "" ? backupTimeLeft : time_left,
            }
        }
    })

    // If Loading
    if (isFetching) return <Loader/>;

    // If the request fails, or the backend returns an error
    if (error) return (
        <div className="h-screen flex items-center justify-center">
            <div className="card bg-neutral text-neutral-content">
                <div className="card-body items-center text-center">
                    <h1 className="text-error text-5xl font-mono">Fatal Error!</h1>
                    <div className="mockup-code bg-base-100">
                        <pre className={"bg-error text-error-content"}><code>{error.toString()}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    );

    // If the backend returns a session expired error
    if (data.type === "SESSION_EXPIRED") {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="card bg-neutral text-neutral-content">
                    <div className="card-body items-center text-center">
                        <h1 className="text-error text-5xl font-mono">Session Expired</h1>
                        <p className="text-lg">Your session has expired, please start a new session</p>
                        <button onClick={() => router.push('/dashboard')} className="btn btn-primary">Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    let usedBlock = undefined;

    switch (data.type) {
        case 'WORD_SPELL':
            usedBlock = <div>Word spell</div>
            break
        case 'LEARN_WORD_OLD':
            usedBlock = <LearnWordBlock data={data}/>
            break
        case 'LEARN_WORD_NEW':
            usedBlock = <LearnWordBlock data={data}/>
            break
        case 'MULTIPLE_CHOICE':
            usedBlock = <MultipleChoiceBlock data={data}/>
            break
        case 'SESSION_GRACEFULLY_COMPLETED':
            usedBlock = <CompletedSessionBlock data={data}/>
            break
        case 'WORD_TYPE':
            usedBlock = <TypeWordBlock data={data}/>
            break
        case 'WORD_MAP':
            usedBlock = <WordMapBlock data={data}/>
            break
        default:
            usedBlock = <div>Unknown {data.type}</div>
            break
    }

    return (
        <>
            <Meta title="Training"/>
            <div className={"flex items-center justify-center bg-primary rounded-b-2xl p-2 text-primary-content"}>
                {data.time_left}
            </div>

            <div className="h-screen flex items-center justify-center">
                {usedBlock}
            </div>
        </>
    )
}