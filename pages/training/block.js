import {useBlockStateStore} from "@/state/basic-state";
import {useRouter} from "next/router";
import {useEffect} from "react";
import Loader from "@/components/Loader";
import MultipleChoiceBlock from "@/components/training/blocks/MultipleChoiceBlock";
import LearnWordBlock from "@/components/training/blocks/LearnWordBlock";
import Meta from "@/components/MetaComponent";

export default function MainTrainingBlock() {
    const blockState = useBlockStateStore();
    const router = useRouter();

    useEffect(() => {
        if (blockState.blockState === undefined) {
            router.push('/dashboard');
        }
    }, []);

    if (blockState.blockState === undefined) return <Loader/>;

    let usedBlock = undefined;

    switch (blockState.blockState.type) {
        case 'WORD_SPELL':
            usedBlock = <div>Word spell</div>
            break
        case 'LEARN_WORD_OLD':
            usedBlock = <LearnWordBlock blockState={blockState}/>
            break
        case 'LEARN_WORD_NEW':
            usedBlock = <LearnWordBlock blockState={blockState}/>
            break
        case 'MULTIPLE_CHOICE':
            usedBlock = <MultipleChoiceBlock blockState={blockState}/>
            break
        default:
            usedBlock = <div>Unknown {blockState.blockState.type}</div>
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