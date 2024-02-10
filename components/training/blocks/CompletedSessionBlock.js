import {useRouter} from "next/router";
import toast from "react-hot-toast";

export default function CompletedSessionBlock({data}) {
  const router = useRouter();

  return (
    <div className="card bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Study Session Complete!</h2>
        <p>Great job! You've completed the study session.</p>
        <p>
          You studied for <b>{data.data.timeSpent}</b> minutes!
        </p>
        <div className="divider divider-accent">MBX</div>
        <button
          onClick={async () => {
            const response = await fetch("/api/training/advance", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                session_id: localStorage.getItem("session_id"),
                auth_token: localStorage.getItem("auth_token"),
                barrier: data.barrier,
                advance: data.advance,
                type: "close",
              }),
            });

            const { error, success } = await response.json();
            if (success) {
              toast.success("Session completed!");
              router.push("/dashboard");
            } else {
              toast.error(error);
            }
          }}
          className="btn btn-primary"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
