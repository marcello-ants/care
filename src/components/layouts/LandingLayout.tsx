// External Dependencies
import { Container, makeStyles } from '@material-ui/core';

// Internal Dependencies
import { ILayoutProps } from '@/types/layout';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
    overflowX: 'hidden',
    boxSizing: 'border-box',
    flex: '1 0 auto',
    maxWidth: '100%',
  },
  landingContentWide: {
    margin: 'auto',
    maxWidth: '640px',
    marginTop: '-202px',
    padding: theme.spacing(-25.25),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(-40),
    },
  },
  heroContainer: {
    background: theme?.palette?.care?.latte[50],
    height: '317px',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      height: '350px',
    },
  },
  floralDecoration1: {
    position: 'absolute',
    right: theme.spacing(-5),
    bottom: theme.spacing(-7.625),
    height: '220px',
    transform: 'rotate(90deg)',
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      right: theme.spacing(0),
      top: theme.spacing(-11.875),
      height: '320px',
      transform: 'rotate(0)',
    },
  },
  floralDecoration2: {
    position: 'absolute',
    left: theme.spacing(5.375),
    top: theme.spacing(-5.75),
    height: '205px',
    transform: 'rotate(90deg)',
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      left: theme.spacing(0),
      bottom: theme.spacing(0),
      height: '325px',
      top: 'unset',
      transform: 'rotate(0)',
    },
  },
  careProvider: {
    position: 'absolute',
    right: theme.spacing(0),
    width: '195px',
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
    },
  },
}));

export default function LandingLayout({ children }: ILayoutProps) {
  // Styles
  const classes = useStyles();
  const layoutLandingClasses = classes.landingContentWide;
  const rootClasses = classes.root;

  return (
    <main>
      <Container maxWidth="lg" className={rootClasses}>
        <div className={classes.heroContainer}>
          <img src="/app/enrollment/floral-bg-0.png" alt="" className={classes.floralDecoration1} />
          <img src="/app/enrollment/floral-bg-1.png" alt="" className={classes.floralDecoration2} />
        </div>
        <div className={layoutLandingClasses}>{children}</div>
      </Container>
    </main>
  );
}
