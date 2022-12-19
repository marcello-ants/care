import { Container, makeStyles } from '@material-ui/core';
import { ILayoutProps } from '@/types/layout';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflowX: 'hidden',
    flex: '1 0 auto',
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(6),
    },
  },
  content: {
    margin: 'auto',
    maxWidth: '410px',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '80px',
      paddingRight: '80px',
      maxWidth: '100%',
    },
  },
}));

export default function FullWidthWithPadding({ children }: ILayoutProps) {
  const classes = useStyles();
  return (
    <main>
      <Container maxWidth="lg" className={classes.root}>
        <div className={classes.content}>{children}</div>
      </Container>
    </main>
  );
}
