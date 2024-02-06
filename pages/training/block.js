import {useBlockStateStore} from "@/state/basic-state";
import {useRouter} from "next/router";
import {useEffect} from "react";
import Loader from "@/components/Loader";
import MultipleChoiceBlock from "@/components/training/blocks/MultipleChoiceBlock";
import LearnWordBlock from "@/components/training/blocks/LearnWordBlock";
import Meta from "@/components/MetaComponent";
import {useQuery} from "@tanstack/react-query";
import CompletedSessionBlock from "@/components/training/blocks/CompletedSessionBlock";

export default function MainTrainingBlock() {
    const blockState = useBlockStateStore();
    const router = useRouter();

    useEffect(() => {
        if (blockState.blockState === undefined) {
            router.push('/dashboard')
        }
    }, [blockState.blockState])

    const {isLoading, error, data} = useQuery({
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

    if (isLoading) return <Loader/>;
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

    let usedBlock = undefined;

    switch (data.type) {
        case 'WORD_SPELL':
            usedBlock = <div>Word spell</div>
            break
        case 'LEARN_WORD_OLD':
            usedBlock = <LearnWordBlock isLoading={isLoading} data={data} />
            break
        case 'LEARN_WORD_NEW':
            usedBlock = <LearnWordBlock isLoading={isLoading} data={data}/>
            break
        case 'MULTIPLE_CHOICE':
            usedBlock = <MultipleChoiceBlock isLoading={isLoading} data={data} />
            break
        case 'SESSION_GRACEFULLY_COMPLETED':
            usedBlock = <CompletedSessionBlock isLoading={isLoading} data={data} />
            break
        default:
            usedBlock = <div>Unknown {data.type}</div>
            break
    }

    return (
        <>
            <Meta title="Training"/>
            <div className="h-screen flex items-center justify-center">
                {usedBlock}
            </div>
        </>
    )
}