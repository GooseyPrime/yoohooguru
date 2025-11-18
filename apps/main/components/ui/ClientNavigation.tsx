import dynamic from 'next/dynamic';

// Import Navigation dynamically with SSR disabled to avoid useRouter issues during SSG
const ClientNavigation = dynamic(() => import('./Navigation'), {
  ssr: false,
  loading: () => (
    <div className="h-20" />
  ),
});

export default ClientNavigation;
