import {useEffect, useState} from 'react';
import {useRouter} from "next/router";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && token !== 'undefined') {
            fetch('api/check-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            }).then((response) => {
                if (response.status === 200) {
                    router.push('/dashboard');
                }
            })
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        const data = await response.json();
        localStorage.setItem('session_id', data.session_id);
        localStorage.setItem('auth_token', data.auth_token);
        if (response.status === 200) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="card w-96 bg-primary text-primary-content">
                    <div className="card-body items-center text-center">
                        <h2 className="card-title text-primary-content">Sign In</h2>
                        <div className="card-actions justify-end">
                            <input
                                className="input input-bordered input-info w-full max-w-xs"
                                id="username" type="text" placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}/>
                            <input
                                className="input input-bordered input-info w-full max-w-xs"
                                id="password" type="password" placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}/>
                            <button
                                className="btn w-full text-secondary-content btn-secondary"
                                type="submit">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
