import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';
import { SubdomainLayout } from '../../../components/SubdomainLayout';
import Head from 'next/head';

export default function AngelHome() {
  return (
    <>
      <Head>
        <title>Angel's List - Local Services & Gigs | YooHoo.Guru</title>
        <meta name="description" content="Find local services, list your gigs, and exchange help through Angel's List." />
      </Head>

      <SubdomainLayout
        title="Angel's List"
        subtitle="List a Gig. Help or get help through Angel's List. Find local services and offer your expertise."
        gradient="secondary"
      >
        <div className="space-y-12">
          <NewsSection subdomain="angel" limit={5} />
          <BlogList subdomain="angel" limit={6} showExcerpts={true} />
        </div>
      </SubdomainLayout>
    </>
  );
}
