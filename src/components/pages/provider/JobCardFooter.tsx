import React from 'react';
import { Button } from '@material-ui/core';
import { jobsNearAnalytics } from '@/components/pages/provider/jobPostUtil';
import FixElementToBottom from '@/components/FixElementToBottom';
import useEnterKey from '@/components/hooks/useEnterKey';

interface JobCardFooterProps {
  numberOfJobsNear: number;
  nextUrl: string;
}
export default function JobCardFooter({ numberOfJobsNear, nextUrl }: JobCardFooterProps) {
  const handleNext = () => {
    jobsNearAnalytics(numberOfJobsNear);
    window.location.assign(nextUrl);
  };
  useEnterKey(true, handleNext);
  return (
    <FixElementToBottom>
      <Button color="primary" variant="contained" size="large" fullWidth onClick={handleNext}>
        Next
      </Button>
    </FixElementToBottom>
  );
}
