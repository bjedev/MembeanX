import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import DashboardTotalsComponent from "@/components/dashboard/stats/DashboardTotalsComponent";
import Loader from "@/components/Loader";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import {useState} from "react";
import toast from "react-hot-toast";
import {useBlockStateStore} from "@/state/basic-state";
import Meta from "@/components/MetaComponent";

export default function DashboardIndex() {
    const router = useRouter();
    const blockState = useBlockStateStore();
    const [selectedMinutes, setSelectedMinutes] = useState(undefined);

    const {isPending, error, data} = useQuery({
        queryKey: ['checkSession'],
        queryFn: () => {
            const session_id = localStorage.getItem('session_id');

            if (!session_id || session_id === 'undefined') {
                router.push('/');
                return false;
            }

            fetch('api/check-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({session_id}),
            }).then((res) => res.json())

            // Fetch user totals
            return fetch('api/full-user-stats', {
                method: 'GET',
                headers: {
                    'X-Session': session_id,
                },
            }).then((res) => res.json())
        }
    })

    if (isPending) return <Loader/>

    if (error) return 'An error has occurred: ' + error.message

    if (data === false) return <Loader/>

    async function startTrainingSession() {
        toast.dismiss()
        if (!selectedMinutes) {
            toast.error('You must select a session length!',
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            return;
        }

        const newSession = await fetch('api/training/start-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: localStorage.getItem('session_id'),
                auth_token: localStorage.getItem('auth_token'),
                minutes: selectedMinutes,
            }),
        })

        if (newSession.status === 200) {
            const {success, type, initialState} = await newSession.json();

            toast.success(type === "ALREADY_BEGUN" && success === true ? 'Continuing your existing session!' : 'Started a new session!',
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });

            if (success === true) {
                blockState.updateBlockState(initialState);
                router.push('/training/block');
            }
        }
    }

    return (
        <>
            <DashboardNavbar userData={data}/>
            <Meta title="Dashboard"/>
            <div className="items-center justify-center min-h-screen grid">
                <div className="flex items-center justify-center space-x-10">
                    <select className="select select-accent w-full max-w-xs" defaultValue={"Session Length..."}
                            onChange={(e) => {
                                const minuteType = e.target.value.split(' ')[0];
                                setSelectedMinutes(minuteType)
                            }}>
                        <option disabled>Session Length...</option>
                        <option>5 Minutes</option>
                        <option>10 Minutes</option>
                        <option>15 Minutes</option>
                        <option>20 Minutes</option>
                        <option>25 Minutes</option>
                        <option>30 Minutes</option>
                        <option>35 Minutes</option>
                        <option>45 Minutes</option>
                        <option>60 Minutes</option>
                    </select>
                    <button className={"btn btn-primary"}
                            onClick={async () => await startTrainingSession()}>
                        Start Session
                    </button>
                </div>
                <DashboardTotalsComponent userData={data}/>
            </div>
        </>
    );
}