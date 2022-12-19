import getConfig from 'next/config';
import internalOnly from '@/utilities/internalOnly';
import { SEEKER_HOUSEKEEPING_ROUTES } from '@/constants';

const {
  publicRuntimeConfig: { BASE_PATH },
} = getConfig();

const baseUrl = BASE_PATH;

export default function Home() {
  return (
    <>
      <h2>Senior Care</h2>
      <section>
        <a href={`${baseUrl}/lead-and-connect`}>Lead and Connect with a faked GQL Cache</a>
      </section>

      <section>
        <a href={`${baseUrl}/seeker/sc`}>Seeker Flow</a>
      </section>

      <section>
        <a href={`${baseUrl}/provider/sc`}>Provider Flow</a>
      </section>

      <section>
        <a href={`${baseUrl}/ltcg/insurance-carrier`}>LTCG Flow</a>
      </section>

      <h2>Child Care</h2>
      <section>
        <a href={`${baseUrl}/seeker/cc`}>Seeker Account Creation Flow</a>
      </section>
      <section>
        <a href={`${baseUrl}/seeker/cc/schedule`}>Post a job</a>
      </section>
      <section>
        <a href={`${baseUrl}/seeker/dc/recommendations`}>Daycare Recommendations</a>
      </section>
      <section>
        <a href={`${baseUrl}/seeker/cc/tax-calculator`}>Tax calculator</a>
      </section>
      <section>
        <a href={`${baseUrl}/provider/cc/`}>Provider Flow</a>
      </section>

      <h2>Housekeeping</h2>
      <section>
        <a href={`${baseUrl}${SEEKER_HOUSEKEEPING_ROUTES.INDEX}`}>Housekeeping Seeker Flow</a>
      </section>

      <h2>Pet Care</h2>
      <section>
        <a href={`${baseUrl}/seeker/pc`}>Seeker Flow</a>
      </section>

      <h2>Tutoring</h2>
      <section>
        <a href={`${baseUrl}/seeker/tu`}>Tutoring Seeker Flow</a>
      </section>
    </>
  );
}

export const getServerSideProps = internalOnly();
