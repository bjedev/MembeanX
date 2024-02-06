export default function DashboardTotalsComponent({userData}) {
    return (
        <div>
            <div className="bg-base-300 rounded-xl p-2 space-y-2 text-center">
                <h2 className="card-actions text-primary-content bg-primary rounded w-fit p-1">Quiz Stats</h2>
                <div className="stats shadow">

                    <div className="stat">
                        <div className="stat-title">Average Score</div>
                        <div className="stat-value">{userData.quizzesAverageScore}%</div>
                    </div>

                    <div className="stat">
                        <div className="stat-title">Total Quizzes</div>
                        <div className="stat-value">{userData.quizzes.length}</div>
                    </div>
                </div>
                <h2 className="card-actions text-primary-content bg-primary rounded w-fit p-1">Last Quiz</h2>
                <div className="stats shadow">

                    <div className="stat">
                        <div className="stat-title">Score</div>
                        {!userData.quizzes.length >= 1 ? (
                            <div className="stat-value">No Quiz</div>
                        ) : (
                            <div
                                className="stat-value">{(100 * userData.quizzes[0].score) / userData.quizzes[0].questions}%
                            </div>
                        )}
                    </div>

                    <div className="stat">
                        <div className="stat-title">Total Questions</div>
                        {!userData.quizzes.length >= 1 ? (
                            <div className="stat-value">No Quiz</div>
                        ) : (
                            <div
                                className="stat-value">{userData.quizzes[0].questions}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}