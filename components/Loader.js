import Meta from "@/components/MetaComponent";

export default function Loader() {
    return (
        <>
            <Meta title="Loading..." />
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner text-error size-20"></span>
            </div>
        </>
    )
}