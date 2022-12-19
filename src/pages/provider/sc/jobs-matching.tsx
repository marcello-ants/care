/* eslint-disable radix */
import React from 'react';
import { useProviderState } from '@/components/AppState';
import { CZEN_BACKGROUND_CHECK } from '@/constants';
import JobsMatchingPage from '@/components/pages/provider/JobsMatchingPage';

export default function JobsMatching() {
  const { numberOfJobsNear } = useProviderState();
  const redirectURL = CZEN_BACKGROUND_CHECK;
  return <JobsMatchingPage numberOfJobsNear={numberOfJobsNear} nextUrl={redirectURL} />;
}
