import { Header } from '@yoohooguru/shared';
import { NewsSection } from '../../../components/NewsSection';
import { BlogList } from '../../../components/BlogList';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="subdomain-home">
        <div className="hero-section">
          <h1>Home Guru</h1>
          <p>Welcome to your expert guide for home</p>
        </div>

        <div className="content-wrapper">
          <NewsSection subdomain="home" limit={5} />
          <BlogList subdomain="home" limit={6} showExcerpts={true} />
        </div>
      </main>

      <style jsx>{`
        .subdomain-home {
          min-height: 100vh;
          background: #f9fafb;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .hero-section h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-section p {
          font-size: 1.25rem;
          opacity: 0.95;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem;
          }

          .hero-section p {
            font-size: 1rem;
          }

          .content-wrapper {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
