import { Container, makeStyles } from '@material-ui/core';
import { ILayoutProps } from '@/types/layout';
import { useFlowState } from '@/components/AppState';
import { FLOWS } from '@/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: ({ isWideSpacingLayout }: { isWideSpacingLayout: boolean }) =>
      isWideSpacingLayout ? theme.spacing(3) : theme.spacing(2),
    paddingRight: ({ isWideSpacingLayout }: { isWideSpacingLayout: boolean }) =>
      isWideSpacingLayout ? theme.spacing(3) : theme.spacing(2),
    overflowX: 'hidden',
    boxSizing: 'border-box',
    flex: '1 0 auto',
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  content: {
    margin: 'auto',
    maxWidth: '410px',
  },
}));

function DefaultLayout({ children }: ILayoutProps) {
  const { flowName } = useFlowState();

  /* istanbul ignore next */
  const isWideSpacingLayout =
    flowName === FLOWS.SEEKER_IN_FACILITY.name ||
    flowName === FLOWS.SEEKER.name ||
    flowName === FLOWS.LTCG.name;

  const classes = useStyles({ isWideSpacingLayout });

  return (
    <Container className={classes.root}>
      <div className={classes.content}>{children}</div>
    </Container>
  );
}

export default DefaultLayout;
