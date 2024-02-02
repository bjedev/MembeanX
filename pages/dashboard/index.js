import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import DashboardTotalsComponent from "@/components/dashboard/stats/DashboardTotalsComponent";
import Loader from "@/components/Loader";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardIndex() {
    const router = useRouter();

    const {isPending, error, data} = useQuery({
        queryKey: ['checkSession'],
        queryFn: () => {
            const token = localStorage.getItem('token');

            if (!token || token === 'undefined') {
                router.push('/');
                return false;
            }

            fetch('api/check-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            }).then((res) => res.json())

            // Fetch user totals

            return fetch('api/full-user-stats', {
                method: 'GET',
                headers: {
                    'X-Session': token,
                },
            }).then((res) => res.json())
        }
    })

    if (isPending) return <Loader/>

    if (error) return 'An error has occurred: ' + error.message

    if (data === false) return <Loader/>

    return (
        <>
            <DashboardNavbar userData={data}/>
            <div className="flex items-center justify-center min-h-screen">
                <DashboardTotalsComponent userData={data}/>
            </div>
        </>
    );
}