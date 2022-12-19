import { IconLogoCarelogo } from '@care/react-icons';
import { makeStyles, Button } from '@material-ui/core';
import { Link } from '@care/react-component-lib';

const useStyles = makeStyles((theme) => ({
  headerRoot: {
    [theme.breakpoints.down('sm')]: {
      height: '60px',
      '& + div': {
        width: '100%',
      },
    },
    [theme.breakpoints.up('md')]: {
      height: '104px',
    },
  },
  logoContainer: {
    float: 'left',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '36px',
      marginLeft: theme.spacing(-4),
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: '16px',
      marginLeft: '-48px',
    },
    width: '200px',
    overflow: 'hidden',
  },
  linkContainer: {
    float: 'right',
    [theme.breakpoints.up('sm')]: {
      paddingTop: '36px',
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: '16px',
      paddingRight: theme.spacing(2),
    },
  },
  findAJob: {
    paddingRight: theme.spacing(4),
    '& a': {
      color: theme.palette.care.grey[900],
    },
  },
  login: {
    '& a': {
      color: theme.palette.care.grey[900],
    },
  },
}));

interface ShortEnrollmentHeaderProps {
  showButtons?: boolean;
}

const ShortEnrollmentHeader = (props: ShortEnrollmentHeaderProps) => {
  const { showButtons } = props;
  const classes = useStyles();

  return (
    <div className={classes.headerRoot}>
      <span className={classes.logoContainer}>
        <IconLogoCarelogo height="32px" width="250px" color="#444444" />
      </span>
      {showButtons && (
        <span className={classes.linkContainer}>
          <span className={classes.findAJob}>
            <Link
              careVariant="link2"
              href="/enroll-care-seeker-p1042-qxreasonToEnroll%7Csitter.html">
              Find a job
            </Link>
          </span>
          <span className={classes.login}>
            <Button size="small" variant="outlined" className="flexible">
              <Link careVariant="link2" href="/vis/auth/login">
                Log in
              </Link>
            </Button>
          </span>
        </span>
      )}
    </div>
  );
};

ShortEnrollmentHeader.defaultProps = {
  showButtons: true,
};

export default ShortEnrollmentHeader;
