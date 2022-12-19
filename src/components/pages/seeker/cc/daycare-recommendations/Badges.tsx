/* eslint-disable react/require-default-props */
import React from 'react';
import { Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import { Icon24UtilityCheckmark, Icon24ShadedInfoStar } from '@care/react-icons';
import dayjs from 'dayjs';
import { Link } from '@care/react-component-lib';
import BadgeModal from './BadgeModal';

const useStyles = makeStyles((theme) => ({
  permit: {
    fontWeight: 'bold',
  },
  licenseDate: {
    color: theme.palette.care.grey[600],
    whiteSpace: 'nowrap',
  },
  ratingIcon: {
    '& svg': {
      fill: theme.palette.care.yellow[600],
      top: '2px',
      position: 'relative',
    },
  },
}));

interface LicenseBadgeProps {
  name: string;
  verifiedDate: string | null;
}

export function LicenseBadge({ name, verifiedDate }: LicenseBadgeProps) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <BadgeModal
      title="License Verified"
      bgColor={theme.palette.care.yellow[100]}
      icon={<Icon24UtilityCheckmark color={theme.palette.care.yellow[600]} size="15px" bold />}>
      <Grid container direction="column">
        <Typography variant="subtitle2">
          <span>Status License: </span>
          <span className={classes.permit}>{name}</span>
        </Typography>
        {verifiedDate && (
          <Typography variant="subtitle2" className={classes.licenseDate}>
            {`(Care.com verified ${dayjs(verifiedDate).format('MM/DD/YYYY')})`}
          </Typography>
        )}
      </Grid>
    </BadgeModal>
  );
}

interface RatingBadgeProps {
  label: string;
}

export const RatingBadge = ({ label }: RatingBadgeProps) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <BadgeModal
      title={label}
      data-testid="average-rating-badge"
      bgColor={theme.palette.care.yellow[100]}
      disabled
      icon={
        <Icon24ShadedInfoStar
          size="14px"
          color={theme.palette.care.yellow[600]}
          className={classes.ratingIcon}
        />
      }
    />
  );
};

export const InHomeDaycareBadge = () => {
  const theme = useTheme();

  return (
    <BadgeModal title="In-home daycare" bgColor={theme.palette.care.purple[100]}>
      <Grid container direction="column">
        <Typography variant="subtitle2">
          <b>This is an in-home daycare. </b>
          <span>
            Pools, firearms, unvetted individuals and other hazards may be present. &nbsp;
          </span>
          <Link href="https://www.care.com" variant="subtitle2" inline role="link" noWrap>
            Care.com
          </Link>
          <span>
            &nbsp; only verifies daycare license status, and not any other information that this
            daycare has provided. We do not endorse any particular daycares, and
          </span>
          <b>
            &nbsp; we strongly recommend you verify the qualifications, credentials, and other
            details of any daycare or caregiver you are considering.
          </b>
        </Typography>
      </Grid>
    </BadgeModal>
  );
};

export const DaycareCenterBadge = () => {
  const theme = useTheme();

  return (
    <BadgeModal title="Daycare center" bgColor={theme.palette.care.blue[100]}>
      <Typography variant="subtitle2">
        <Link href="https://www.care.com" variant="subtitle2" inline role="link" noWrap>
          Care.com
        </Link>
        <span>
          &nbsp; verifies on a monthly basis that this childcare center has an active license to
          operate.&nbsp;
        </span>
        <Link href="https://www.care.com" variant="subtitle2" inline role="link" noWrap>
          Care.com
        </Link>

        <span>
          &nbsp; only verifies the license of a business. Any other information, including awards
          and accreditation, hours, and cost, were provided by this business and may not reflect its
          current status.
        </span>

        <b>
          &nbsp; We strongly encourage you to verify the license, qualifications, and credentials of
          any care providers on your own. Care.com does not endorse or recommend any particular
          business.
        </b>
      </Typography>
    </BadgeModal>
  );
};
