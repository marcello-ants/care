import { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import { Typography, Link, Divider } from '@care/react-component-lib';
import {
  IconIllustrationSmallSeniorCare,
  IconIllustrationSmallShieldCheck,
  IconIllustrationMediumClock,
} from '@care/react-icons';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '-47px',
    },
  },
  mainPanel: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '48px',
    borderRadius: '12px',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      width: '1000px',
    },
    [theme.breakpoints.down('md')]: {
      width: '800px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
    },
  },
  formPanel: {
    [theme.breakpoints.up('sm')]: {
      backgroundColor: theme.palette?.care?.grey[50],
      borderRadius: theme.spacing(1),
      minWidth: '800px',
      maxWidth: '800px',
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
    },
    [theme.breakpoints.down('md')]: {
      minWidth: '600px',
      maxWidth: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      minWidth: '380px',
      maxWidth: '380px',
      backgroundColor: theme.palette?.care?.white,
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  iconPanel: {
    [theme.breakpoints.up('md')]: {
      width: '200px',
    },
    [theme.breakpoints.down('md')]: {
      width: '200px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
    },
    display: 'block',
    textAlign: 'center',
    paddingTop: theme.spacing(5),
  },
  pageDisclaimerPanel: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(0),
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      width: '1000px',
    },
    [theme.breakpoints.down('md')]: {
      width: '800px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
    },
  },
  pageTopFlourish: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '128px',
      position: 'absolute',
      right: 0,
      top: 0,
      display: 'block',
      zIndex: 9,
    },
  },
  pageBottomFlourish: {
    paddingTop: theme.spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      width: '800px',
      display: 'none',
    },
    [theme.breakpoints.down('md')]: {
      width: '800px',
      display: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
      marginBottom: '-60px',
      display: 'block',
    },
  },
  formHeader: {},
  formPanelHeadlineDT: {
    marginTop: 'unset',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'block',
      width: '410px',
    },
  },
  formPanelHeadlineMobile: {
    marginTop: 'unset',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  formDisclaimer: {
    display: 'block',
    textAlign: 'center',
    position: 'relative',
    padding: theme.spacing(3, 0),
    width: '410px',
    [theme.breakpoints.down('sm')]: {
      width: '310px',
    },
    marginLeft: 'auto',
    marginRight: 'auto',
    '& p': {
      display: 'inline',
    },
  },
  iconList: {
    [theme.breakpoints.up('sm')]: {
      width: '140px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
    },
    display: 'inline-block',
    textAlign: 'center',
  },
  iconListItem: {
    verticalAlign: 'middle',
  },
  iconDisplay: {
    [theme.breakpoints.up('sm')]: {
      width: '140px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      display: 'inline-block',
    },
    [theme.breakpoints.up('md')]: {
      '& svg': {
        height: '80px',
        width: '80px',
      },
    },
  },
  iconLabel: {
    display: 'inline-block',
    [theme.breakpoints.up('sm')]: {
      width: '140px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '240px',
      height: '50px',
      verticalAlign: 'middle',
      textAlign: 'left',
      paddingLeft: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    '& .MuiTypography-body1': {
      fontWeight: 'bold',
    },
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(6),
  },
  initialIconLabel: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(2),
    },
  },
  imageDecorations: {
    [theme.breakpoints.down('md')]: {
      '& div': {
        maxWidth: '110px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& div': {
        display: 'none',
      },
    },
  },
  rightImage: {
    marginTop: theme.spacing(7),
    marginLeft: theme.spacing(-5.5),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  pageDisclaimerText: {
    '& p': {
      display: 'inline',
    },
    [theme.breakpoints.up('md')]: {
      width: '800px',
    },
    [theme.breakpoints.down('md')]: {
      width: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
    },
    textAlign: 'center',
  },
  pageBottomFlourishImgContainer: {
    [theme.breakpoints.up('md')]: {
      width: '600px',
    },
    [theme.breakpoints.down('md')]: {
      width: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '380px',
    },
    textAlign: 'center',
  },
  pageTopFlourishImgContainer: {
    [theme.breakpoints.down('sm')]: {
      width: '128px',
    },
    textAlign: 'right',
    '& image': {
      transform: 'rotate(180)',
    },
  },
}));

interface ShortEnrollmentContainerProps {
  children?: ReactNode;
}

function ShortEnrollmentContainer(props: ShortEnrollmentContainerProps) {
  const classes = useStyles();
  const { children } = props;
  const disclaimerText = `You must be 18 years or older to use Care.com. By clickling "Join free now" you agree to our `;

  return (
    <>
      <div className={classes.pageTopFlourish}>
        <div className={classes.pageTopFlourishImgContainer}>
          <img src="/app/enrollment/short-enrollment/sef_mw_floral01.png" alt="top_flourish" />
        </div>
      </div>
      <div className={classes.pageContainer}>
        <div className={classes.mainPanel}>
          <div className={classes.formPanel}>
            <div className={classes.formHeader}>
              <Typography careVariant="display2" className={classes.formPanelHeadlineDT}>
                Find a trusted caregiver near you
              </Typography>
              <Typography careVariant="display3" className={classes.formPanelHeadlineMobile}>
                Find a trusted caregiver near you
              </Typography>
            </div>
            {children !== null && <>{children}</>}
            <div className={classes.formDisclaimer}>
              <Typography careVariant="disclaimer2">{disclaimerText}</Typography>
              <Link careVariant="link4" href="/about/terms-of-use/">
                Terms of Use
              </Link>
              <Typography careVariant="disclaimer2">{` and `}</Typography>
              <Link careVariant="link4" href="/about/privacy-policy/">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className={classes.iconPanel}>
            <div className={classes.iconList}>
              <div className={classes.iconListItem}>
                <span className={classes.iconDisplay}>
                  <IconIllustrationSmallSeniorCare height="46px" width="56px" />
                </span>
                <span className={`${classes.iconLabel} ${classes.initialIconLabel}`}>
                  <Typography careVariant="body3">Trusted by over 3 million families</Typography>
                </span>
              </div>
              <div className={classes.iconListItem}>
                <span className={classes.iconDisplay}>
                  <IconIllustrationSmallShieldCheck height="46px" width="56px" />
                </span>
                <span className={classes.iconLabel}>
                  <Typography careVariant="body3">
                    National network of background checked caregivers
                  </Typography>
                </span>
              </div>
              <div className={classes.iconListItem}>
                <span className={classes.iconDisplay}>
                  <IconIllustrationMediumClock height="46px" width="56px" />
                </span>
                <span className={classes.iconLabel}>
                  <Typography careVariant="body3">
                    24/7 access to care for children, adults & pets
                  </Typography>
                </span>
              </div>
              <div className={classes.imageDecorations}>
                <img
                  src="/app/enrollment/short-enrollment/sef_dt_img_1x.png"
                  className={classes.rightImage}
                  alt="care.com"
                />
                <Divider variant="hairline" />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.pageDisclaimerPanel}>
          <div className={classes.pageDisclaimerText}>
            <Typography careVariant="body3">
              <b>Looking to become a caregiver?</b>
            </Typography>
            <br />
            <Link
              careVariant="link3"
              href="/enroll-care-seeker-p1042-qxreasonToEnroll%7Csitter.html">
              Sign up
            </Link>
            <Typography careVariant="body3">&nbsp;today</Typography>
          </div>
        </div>
      </div>
      <div className={classes.pageBottomFlourish}>
        <div className={classes.pageBottomFlourishImgContainer}>
          <img src="/app/enrollment/short-enrollment/sef_mw_floral02.png" alt="bottom flourish" />
        </div>
      </div>
    </>
  );
}

ShortEnrollmentContainer.defaultProps = {
  children: null,
};

export default ShortEnrollmentContainer;
