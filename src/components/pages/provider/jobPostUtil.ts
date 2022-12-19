import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import {
  getNewJobsForProvider,
  getNewJobsForProviderVariables,
} from '@/__generated__/getNewJobsForProvider';
import { GET_NEW_JOBS_PROVIDER } from '@/components/request/GQL';
import { useQuery } from '@apollo/client';
import { JobCardProps } from './JobCard';

const numResults = 3;
dayjs.extend(relativeTime);

export function jobPostDate(date1: string, date2: Date) {
  const hoursDiff = dayjs(date2).diff(date1, 'hour');
  let jobPostDesc;
  if (hoursDiff <= 1) {
    jobPostDesc = 'posted 1 hour ago';
  } else if (hoursDiff < 24 * 7) {
    jobPostDesc = `posted ${dayjs(date1).from(date2)}`;
  } else {
    jobPostDesc = '';
  }
  return jobPostDesc;
}
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
export function useJobList() {
  const {
    loading,
    data: jobSummaries,
    error: jobsError,
  } = useQuery<getNewJobsForProvider, getNewJobsForProviderVariables>(GET_NEW_JOBS_PROVIDER, {
    variables: {
      numResults,
    },
  });
  const jobs = jobSummaries?.getNewJobsForProvider.map((jobSummary) => {
    const hourlyRateFrom = currencyFormatter.format(
      Math.ceil(parseFloat(jobSummary.payRange.hourlyRateFrom.amount))
    );
    const jobCardProps: JobCardProps = {
      header: jobSummary.title || '',
      jobPostDate: jobPostDate(jobSummary.jobPostDate, new Date()),
      body: jobSummary.description || '',
      location: `${jobSummary.city}, ${jobSummary.state}`,
      rate: `${hourlyRateFrom}-${jobSummary.payRange.hourlyRateTo.amount}/hr`,
    };
    return jobCardProps;
  });
  return {
    jobs,
    loading,
    jobsError,
  };
}

export function jobsNearAnalytics(numberOfJobsNear: number) {
  AnalyticsHelper.logEvent({
    name: 'Member Enrolled',
    data: {
      enrollment_flow: 'MW VHP Provider Enrollment',
      enrollment_step: 'new_jobs_near_you',
      cta_clicked: 'Next',
      number_of_jobs: numberOfJobsNear,
    },
  });
}
