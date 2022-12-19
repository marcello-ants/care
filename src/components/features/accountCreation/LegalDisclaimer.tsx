import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/constants';

type DisclaimerProps = {
  cta: string;
};

export const TermsAndPrivacyPolicy = () => (
  <>
    <a href={TERMS_OF_USE_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
      Terms of Use
    </a>{' '}
    <span>and</span>{' '}
    <a href={PRIVACY_POLICY_URL} target="_blank" rel="noreferrer" tabIndex={-1}>
      Privacy Policy
    </a>
  </>
);

const DefaultDisclaimer = ({ cta }: DisclaimerProps) => (
  <>
    {/* needs links */}
    <span>By clicking &quot;</span>
    {cta}
    <span>&quot;, you agree to our&nbsp;</span>
    <TermsAndPrivacyPolicy />
    <span>.</span>
  </>
);

const SeniorLivingCommunitiesDisclaimer = ({ cta }: DisclaimerProps) => (
  <>
    <span>By clicking &quot;</span>
    {cta}
    <span>&quot;, you (1) affirm you have read and agree to our</span> <TermsAndPrivacyPolicy />
    <span>
      &nbsp;and (2) you agree that Care.com may share your information with up to 5 senior living
      communities based on the criteria you’ve provided.
    </span>
  </>
);

const useStyles = makeStyles((theme) => ({
  terms: {
    width: ({ fullWidth }: { fullWidth: boolean }) => (fullWidth ? '100%' : '200px'),
    textAlign: 'center',
    margin: theme.spacing(1, 'auto', 0),
  },
  seniorLivingTerms: {
    width: '100%',
    textAlign: 'left',
    marginTop: theme.spacing(3),
    color: theme.palette.care?.grey[600],
  },
}));
interface LegalDisclaimerProps extends DisclaimerProps {
  seniorLivingCommunities?: boolean;
  fullWidth?: boolean;
}

const LegalDisclaimer = (props: LegalDisclaimerProps) => {
  const { cta, seniorLivingCommunities, fullWidth = false } = props;
  const classes = useStyles({ fullWidth });

  return (
    <div
      className={clsx({
        [classes.terms]: !seniorLivingCommunities,
        [classes.seniorLivingTerms]: seniorLivingCommunities,
      })}>
      <Typography careVariant="info1">
        {seniorLivingCommunities ? (
          <SeniorLivingCommunitiesDisclaimer cta={cta} />
        ) : (
          <DefaultDisclaimer cta={cta} />
        )}
      </Typography>
    </div>
  );
};

LegalDisclaimer.defaultProps = {
  seniorLivingCommunities: false,
  fullWidth: false,
};

export default LegalDisclaimer;
