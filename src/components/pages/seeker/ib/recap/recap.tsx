import { useRouter } from 'next/router';
import Head from 'next/head';
import RecapPage from '@/components/pages/RecapPage/RecapPage';
import { SEEKER_INSTANT_BOOK_ROUTES } from '@/constants';
import { caregivers } from '@/components/pages/seeker/sc/recap/recap';
import { useSeekerState } from '@/components/AppState';

const IbRecapPage = () => {
  const router = useRouter();
  const nextRoute = SEEKER_INSTANT_BOOK_ROUTES.ADDRESS;
  const { city } = useSeekerState();

  return (
    <>
      <Head>
        <title>Looking for sitters in {city} that meet your needs…</title>
      </Head>
      <RecapPage
        info="Did you know? 100% of sitters on Care are background checked"
        title={`Looking for sitters in ${city} that meet your needs…`}
        onComplete={() => router.push(nextRoute)}
        caregivers={caregivers}
      />
    </>
  );
};

export default IbRecapPage;
