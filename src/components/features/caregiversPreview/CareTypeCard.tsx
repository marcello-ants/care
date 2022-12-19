import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@care/react-component-lib';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme) => ({
  cardGridContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  cardDisplayName: {
    display: 'flex',
    minWidth: 'auto',
    width: '100%',

    textAlign: 'left',

    marginLeft: 10,

    marginTop: 3,
  },

  cardIcon: {
    display: 'flex',
  },
}));

export type CareType = {
  description: string;
  icon?: ReactNode;
};

export type CareTypeCardProps = {
  careType: CareType;
};

function CareTypeCard({ careType }: CareTypeCardProps) {
  const classes = useStyles();
  const { description, icon } = careType;

  return (
    <Grid container spacing={1} justifyContent="flex-start" alignContent="center">
      <div className={classes.cardGridContainer}>
        {icon && <div className={classes.cardIcon}>{icon}</div>}
        <div className={classes.cardDisplayName}>
          <Typography careVariant="body3">{description}</Typography>
        </div>
      </div>
    </Grid>
  );
}

export default CareTypeCard;
