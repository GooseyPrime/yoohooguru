import React from 'react';
import { GetServerSideProps } from 'next';

export default function OrbitronPage() {
  return (
    <main className="font-orbitron bg-gradient-to-br from-purple-900 to-blue-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">ORBITRON</h1>
        <p className="text-xl">Test page working!</p>
      </div>
    </main>
  );
}
// Make this page server-side rendered to avoid SSG issues with Navigation component using useRouter
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
