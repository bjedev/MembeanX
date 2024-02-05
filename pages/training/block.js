import {useBlockStateStore} from "@/state/basic-state";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/Loader";
import MultipleChoiceBlock from "@/components/training/blocks/MultipleChoiceBlock";
import LearnWordBlock from "@/components/training/blocks/LearnWordBlock";

export default function MainTrainingBlock() {
    const blockState = useBlockStateStore();
    const router = useRouter();

    useEffect(() => {
        if (blockState.blockState === undefined) {
            router.push('/dashboard');
        }
    }, []);

    if (blockState.blockState === undefined) return <Loader />;

    console.log(blockState.blockState)

    switch (blockState.blockState.type) {
        case 'WORD_SPELL':
            return <div>Word spell</div>
        case 'LEARN_WORD_OLD':
            return <LearnWordBlock blockState={blockState} />
        case 'LEARN_WORD_NEW':
            return <LearnWordBlock blockState={blockState} />
        case 'MULTIPLE_CHOICE':
            return <MultipleChoiceBlock blockState={blockState} />
        default:
            return <div>Unknown {blockState.blockState.type}</div>
    }
}