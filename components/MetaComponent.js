import Head from 'next/head';

export default function Meta({title}) {
    return (
        <Head>
            <title>{`${title ? `MembeanX — ${title}` : ''}`}</title>
        </Head>
    )
}