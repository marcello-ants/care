import React from 'react';
import { useProviderCCState } from '@/components/AppState';
import { CZEN_BACKGROUND_CHECK_CC } from '@/constants';
import JobsMatchingPage from '@/components/pages/provider/JobsMatchingPage';

export default function JobsMatching() {
  const { numberOfJobsNear } = useProviderCCState();
  const redirectURL = CZEN_BACKGROUND_CHECK_CC;
  return <JobsMatchingPage numberOfJobsNear={numberOfJobsNear} nextUrl={redirectURL} />;
}
