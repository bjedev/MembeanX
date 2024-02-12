import {useRef, useState} from "react";
import {useRouter} from "next/router";
import {useThemeStore} from "@/state/basic-state";

export default function DashboardNavbar({userData}) {
    const alertsModal = useRef(null);
    const themeStore = useThemeStore();
    const mbxModal = useRef(null);
    const customThemeModal = useRef(null);
    const router = useRouter();

    // Theme picker
    const themes = [
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "luxury",
        "dracula",
        "autumn",
        "business",
        "lemonade",
        "night",
        "coffee",
        "winter",
        "dim",
        "nord",
        "sunset",
    ];

    const themeIndex = useState(themes.indexOf(themeStore.theme))[0];

    return (
        <div className={"p-3 fixed w-full"}>
            <div className="navbar bg-base-200 rounded-xl shadow-xl">

                {/* MBX Button */}

                <div className="flex-1">
                    <button onClick={() => mbxModal.current.showModal()} className="btn btn-ghost text-xl">MBX</button>
                </div>

                <div className="navbar-end space-x-2">

                    {/* Theme Picker */}

                    <div className="dropdown">
                        <div tabIndex={themeIndex} role="button"
                             className="btn m-1 btn-secondary text-secondary-content">
                            Theme
                            <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block"
                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                            </svg>
                        </div>
                        <ul tabIndex={themeIndex} onChange={(e) => {
                            themeStore.updateTheme(e.target.value)
                        }} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
                            {/*<li>*/}
                            {/*    <button type="radio"*/}
                            {/*            name="theme-dropdown"*/}
                            {/*            className="theme-controller btn btn-sm btn-block btn-ghost justify-start bg-primary"*/}
                            {/*            onClick={() => customThemeModal.current.showModal()}*/}
                            {/*    >Custom</button>*/}
                            {/*</li>*/}
                            {themes.map((theme, index) => (
                                    <li key={index}>
                                        <input type="radio" name="theme-dropdown"
                                               defaultChecked={theme === themeStore.theme}
                                               className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                               aria-label={theme} value={theme}/>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Custom theme modal */}

                    <dialog ref={customThemeModal} className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Custom Theme Builder</h3>
                            <p className="py-4">kys xd</p>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>


                    {/* Alerts button */}

                    <button className="btn btn-accent btn-outline btn-circle"
                            onClick={() => alertsModal.current.showModal()}>
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            {userData.alerts.length > 0 && (
                                <span className="badge badge-xs badge-primary indicator-item"></span>
                            )}
                        </div>
                    </button>

                    {/* Sign out button */}

                    <button className="btn btn-primary" onClick={() => {
                        localStorage.removeItem("token")
                        router.push('/')
                    }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Alerts modal */}

            <dialog ref={alertsModal} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Your alerts</h3>
                    {userData.alerts.length === 0 ? (
                        <p className="py-4">All set! You don't have any alerts.</p>
                    ) : (
                        <p className="py-4">You
                            have {userData.alerts.length} alert{userData.alerts.length > 1 ? 's' : ''}, but I have not
                            fully implement alerts yet... They are not viewable.</p>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* MBX Modal with Info */}

            <dialog ref={mbxModal} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">MembeanX</h3>
                    <p className="pb-4">MembeanX is a project designed to bring specific utilities to Membean which have
                        not previously existed.</p>
                    <p className="">Thank you,</p>
                    <button onClick={() => {
                        router.push('https://github.com/bjedev')
                    }} className="pl-5 font-mono text-accent">Fluyd
                    </button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}