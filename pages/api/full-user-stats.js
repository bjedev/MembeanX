import {makeEncryptedJsonRequestBody} from "@/utils/request";
import {decrypt} from "@/utils/encryption";
import {MEMBEAN_ACCESS_URL} from "@/utils/constants";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).end('Method Not Allowed');
        return;
    }

    const sessionToken = req.headers['x-session'];

    const allUserData = 'query User($limit: Int, $after: DateTime, $before: DateTime) {\n' +
        '  viewer {\n' +
        '    id\n' +
        '    trainingHistory(after: $after, before: $before) {\n' +
        '      accuracy\n' +
        '      accuracyThreshold\n' +
        '      dubiousMinutes\n' +
        '      minutesTrained\n' +
        '      questionsCorrect\n' +
        '      totalQuestions\n' +
        '      trainingSessions {\n' +
        '        accuracy\n' +
        '        accuracyThreshold\n' +
        '        alerts\n' +
        '        dubiousMinutes\n' +
        '        endedAt\n' +
        '        id\n' +
        '        minutesTrained\n' +
        '        questionsCorrect\n' +
        '        totalQuestions\n' +
        '        startedAt\n' +
        '        __typename\n' +
        '      }\n' +
        '      __typename\n' +
        '    }\n' +
        '    __typename\n' +
        '  }\n' +
        '  viewer {\n' +
        '    id\n' +
        '    trainingCycle(after: $after, before: $before) {\n' +
        '      accuracy\n' +
        '      accuracyThreshold\n' +
        '      days {\n' +
        '        accuracy\n' +
        '        date\n' +
        '        minutesTrained\n' +
        '        __typename\n' +
        '      }\n' +
        '      daysTrained\n' +
        '      dubiousMinutes\n' +
        '      endsAt\n' +
        '      expectedDaysTrained\n' +
        '      expectedMinutesTrained\n' +
        '      expectedMinutesPerDayTrained\n' +
        '      minutesTrained\n' +
        '      nextCycleAvailable {\n' +
        '        endsAt\n' +
        '        startsAt\n' +
        '        __typename\n' +
        '      }\n' +
        '      previousCycleAvailable {\n' +
        '        endsAt\n' +
        '        startsAt\n' +
        '        __typename\n' +
        '      }\n' +
        '      questionsCorrect\n' +
        '      questionsIncorrect\n' +
        '      startsAt\n' +
        '      totalQuestions\n' +
        '      __typename\n' +
        '    }\n' +
        '    __typename\n' +
        '  }\n' +
        '  viewer {\n' +
        '    id\n' +
        '    recentTraining {\n' +
        '      accuracy\n' +
        '      accuracyThreshold\n' +
        '      alerts\n' +
        '      date\n' +
        '      dubiousMinutes\n' +
        '      minutesTrained\n' +
        '      trainingSessions {\n' +
        '        accuracy\n' +
        '        accuracyThreshold\n' +
        '        alerts\n' +
        '        dubiousMinutes\n' +
        '        endedAt\n' +
        '        id\n' +
        '        minutesTrained\n' +
        '        questionsCorrect\n' +
        '        startedAt\n' +
        '        totalQuestions\n' +
        '        __typename\n' +
        '      }\n' +
        '      __typename\n' +
        '    }\n' +
        '    progress {\n' +
        '      booksAssigned\n' +
        '      wordsInPlay\n' +
        '      levels {\n' +
        '        id\n' +
        '        totalWords\n' +
        '        wordsSeen\n' +
        '        __typename\n' +
        '      }\n' +
        '      __typename\n' +
        '    }\n' +
        '    __typename\n' +
        '  }\n' +
        '  viewer {\n' +
        '    id\n' +
        '    alerts {\n' +
        '      button {\n' +
        '        className\n' +
        '        icon\n' +
        '        text\n' +
        '        url\n' +
        '        __typename\n' +
        '      }\n' +
        '      description\n' +
        '      dismissable\n' +
        '      position\n' +
        '      title\n' +
        '      type\n' +
        '      __typename\n' +
        '    }\n' +
        '    __typename\n' +
        '  }\n' +
        '  viewer {\n' +
        '    id\n' +
        '    assignmentsAverageScore\n' +
        '    assignments(limit: $limit) {\n' +
        '      commentsCount\n' +
        '      createdAt\n' +
        '      dueAt\n' +
        '      id\n' +
        '      questions\n' +
        '      score\n' +
        '      status\n' +
        '      submittedAt\n' +
        '      __typename\n' +
        '    }\n' +
        '    quizzesAverageScore\n' +
        '    quizzes(limit: $limit) {\n' +
        '      createdAt\n' +
        '      dueAt\n' +
        '      id\n' +
        '      questions\n' +
        '      score\n' +
        '      status\n' +
        '      submittedAt\n' +
        '      __typename\n' +
        '    }\n' +
        '    __typename\n' +
        '  }\n' +
        '}\n'

    const encryptedRequest = makeEncryptedJsonRequestBody({
        operationName: "User",
        variables: {
            "limit": 100,
            "after": "99-09-08T00:00:00-04:00",
            "before": "9999-01-31T22:34:40-05:00"
        },
        query: allUserData
    });

    const gqlResponse = await fetch(`${MEMBEAN_ACCESS_URL}/graphql.json`, {
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `domain=membean.com; _new_membean_session_id=${sessionToken}`,
        },
        body: JSON.stringify(encryptedRequest),
    }).then(async (r) => {
        const {cipher, token} = await r.json();

        return decrypt(cipher, token);
    });

    res.status(200).json(gqlResponse.data.viewer);
}