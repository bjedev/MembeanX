import Head from 'next/head';

export default function Meta({title}) {
    return (
        <Head>
            <title>MembeanX{title ? ` — ${title}` : ''}</title>
        </Head>
    )
}