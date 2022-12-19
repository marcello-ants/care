import { makeStyles } from '@material-ui/core';
import { Card, Divider, ReadMore, Typography } from '@care/react-component-lib';
import { Icon24InfoPayments, Icon24InfoLocation } from '@care/react-icons';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(0, 2, 0.5),
  },
  jobPostDate: {
    color: theme.palette.care.grey[600],
    margin: theme.spacing(2, 0, 0.5, 2),
  },
  body: {
    padding: theme.spacing(0, 2),
    display: 'inline-block',
    width: '100%',
    // TODO: remove body3's styles after SC-489 is done
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: '20px',
  },
  divider: {
    margin: theme.spacing(1, 0),
    '&::before': {
      borderTopStyle: 'dashed',
    },
  },
  footer: {
    position: 'relative',
    height: '30px',
  },
  footerLocation: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    left: '20px',
  },
  footerRate: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    right: '20px',
  },
  icon: {
    paddingRight: theme.spacing(1),
  },
}));

export interface JobCardProps {
  header: string;
  jobPostDate: string;
  body: string;
  location: string;
  rate: string;
}
export default function JobCard({ header, jobPostDate, body, location, rate }: JobCardProps) {
  const classes = useStyles();
  return (
    <Card variant="outlined">
      <Typography careVariant="tag" className={classes.jobPostDate}>
        <span>{jobPostDate}</span>
      </Typography>
      <Typography variant="h4" className={classes.header}>
        <div>{header}</div>
      </Typography>
      <ReadMore
        variant="body2" // TODO: replace with "body3" after SC-489 is done
        showLessButton
        charLimit={80}
        value={body}
        className={classes.body}
      />
      <Divider classes={classes.divider} />
      <div className={classes.footer}>
        <div className={classes.footerLocation}>
          <Icon24InfoLocation size={24} className={classes.icon} />
          <Typography careVariant="body3">
            <span>{location}</span>
          </Typography>
        </div>
        <div className={classes.footerRate}>
          <Icon24InfoPayments size={24} className={classes.icon} />
          <Typography careVariant="body3">
            <span>{rate}</span>
          </Typography>
        </div>
      </div>
    </Card>
  );
}
