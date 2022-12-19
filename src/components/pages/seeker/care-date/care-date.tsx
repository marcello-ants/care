import Head from 'next/head';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { Button, Grid, makeStyles } from '@material-ui/core';

import Header from '@/components/Header';

const useStyles = makeStyles((theme) => ({
  nextButtonContainer: {
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(34.5),
  },
  selector: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(4),
    },
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(-0.5),
      },
    },
  },
  mainContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

interface CareDatePageProps {
  heading: string;
  dateOptions: Array<{ label: string; value: any }>;
  selectedCareDate: any;
  onChangeDateHandler: (value: string[]) => void;
  handleNext: () => void;
}

function CareDatePage({
  heading,
  dateOptions,
  selectedCareDate,
  onChangeDateHandler,
  handleNext,
}: CareDatePageProps) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>{heading}</title>
      </Head>
      <Grid container className={classes.mainContainer}>
        <Grid item xs={12}>
          <Header>{heading}</Header>
        </Grid>
        <Grid item xs={12}>
          <StatelessSelector single onChange={onChangeDateHandler} className={classes.selector}>
            {dateOptions.map((option) => (
              <Pill
                key={option.value}
                size="md"
                label={option.label}
                value={option.value}
                selected={selectedCareDate === option.value}
              />
            ))}
          </StatelessSelector>
        </Grid>
        <Grid item xs={12} className={classes.nextButtonContainer}>
          <Button onClick={handleNext} variant="contained" color="primary" fullWidth size="large">
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CareDatePage;
