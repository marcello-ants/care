import { Grid, Typography, makeStyles } from '@material-ui/core';

import { Icon24UtilityCheckmark, Icon24InfoSeniorCare } from '@care/react-icons';

import BlueWrapperIcon from '@/components/BlueWrapperIcon';
import Header from '@/components/Header';

const personalizedHelpFeatures = [
  { id: 1, text: 'Personalized guidance from a trusted senior care advisor at Caring.com' },
  { id: 2, text: 'Receive a call in less than 5 minutes' },
  { id: 3, text: 'It’s free and fast!' },
];

const useStyles = makeStyles((theme) => ({
  featuresContainer: {
    display: 'flex',
    marginTop: theme.spacing(2),
  },
  checkMarkIcon: {
    marginTop: '2px',
    marginRight: theme.spacing(1),
    width: 20,
    height: 20,
    backgroundColor: '#01A87A',
    borderRadius: '50%',
    flexShrink: 0,
    textAlign: 'center',
  },
  headerWrapper: {
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1),
    },
  },
}));

const PersonalizedHelpFeatures = () => {
  const classes = useStyles();
  return (
    <Grid container>
      <BlueWrapperIcon icon={<Icon24InfoSeniorCare />} />

      <Grid item xs={12} className={classes.headerWrapper}>
        <Header>Get personalized help finding the best community for your loved one</Header>
      </Grid>
      {personalizedHelpFeatures.map((feature) => (
        <Grid key={feature.id} item xs={12} className={classes.featuresContainer}>
          <Typography variant="body2" className={classes.checkMarkIcon}>
            <Icon24UtilityCheckmark size="14px" color="white" />
          </Typography>
          <Typography variant="body2">{feature.text}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default PersonalizedHelpFeatures;
