import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';
import { SubdomainLayout } from '../../../components/SubdomainLayout';
import Head from 'next/head';

export default function HeroesHome() {
  return (
    <>
      <Head>
        <title>Hero Gurus - Adaptive Teaching & Learning | YooHoo.Guru</title>
        <meta name="description" content="Join the Heroes. Empower and be empowered through adaptive teaching and inclusive learning." />
      </Head>

      <SubdomainLayout
        title="Hero Gurus"
        subtitle="Join the Heroes. Empower and be empowered through adaptive teaching and inclusive learning."
        gradient="primary"
      >
        <div className="space-y-12">
          <NewsSection subdomain="heroes" limit={5} />
          <BlogList subdomain="heroes" limit={6} showExcerpts={true} />
        </div>
      </SubdomainLayout>
    </>
  );
}
