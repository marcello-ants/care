import getConfig from 'next/config';
import { Card, CardMedia, CardContent, makeStyles, Grid } from '@material-ui/core';

import { Checkbox, Typography } from '@care/react-component-lib';
import { Icon24InfoLocation, Icon24InfoPayments } from '@care/react-icons';
import { CommunityDetail } from '@/types/seeker';

const {
  publicRuntimeConfig: { BASE_PATH },
} = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    cursor: 'pointer',
  },
  media: {
    height: 107,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      minHeight: 120,
      maxWidth: 145,
    },
  },
  checkbox: {
    alignSelf: 'flex-start',
    '& .MuiButtonBase-root': {
      padding: 0,
    },
    '& .MuiCheckbox-root': {
      padding: 0,
    },
    [theme.breakpoints.up('md')]: {
      alignSelf: 'center',
    },
  },
  content: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .MuiFormControlLabel-root': {
      padding: 0,
    },

    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
  container: {
    marginTop: theme.spacing(1),
  },
  copy: {
    marginLeft: theme.spacing(1),
  },
  icon: {
    width: 19,
  },
  cardContainer: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  title: {
    [theme.breakpoints.up('md')]: {
      fontSize: 21,
    },
  },
}));

function CommunityCard({
  selectedCommunity,
  index,
  onCheck,
  onClick,
  checked,
  displayCheckbox,
}: {
  selectedCommunity: CommunityDetail;
  index: number;
  onClick: () => void;
  onCheck: (id: string) => void;
  checked: boolean;
  displayCheckbox: boolean;
}) {
  const classes = useStyles();
  const picIndex = ((index + 1) % 8) + 1;
  const placeholder = `${BASE_PATH}/community-list/${picIndex}.jpg`;

  const mainImage =
    selectedCommunity.images && selectedCommunity.images.length > 0
      ? selectedCommunity.images[0].small
      : placeholder;
  return (
    <Card variant="outlined" className={classes.root} onClick={onClick}>
      <div className={classes.cardContainer}>
        <CardMedia className={classes.media} image={mainImage} data-testid="image" />

        <CardContent className={classes.content}>
          <div>
            {selectedCommunity.name && (
              <Typography variant="h4" className={classes.title}>
                {typeof index === 'number'
                  ? `${index + 1}. ${selectedCommunity.name}`
                  : selectedCommunity.name}
              </Typography>
            )}

            {selectedCommunity.location && (
              <Grid container alignItems="center" className={classes.container}>
                <Icon24InfoLocation className={classes.icon} />
                <Grid item>
                  <Typography className={classes.copy} careVariant="body3">
                    {selectedCommunity.location} &middot;{' '}
                    {selectedCommunity.distanceFromSearchCenter}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {selectedCommunity.baseCost && (
              <Grid container alignItems="center" className={classes.container}>
                <Icon24InfoPayments className={classes.icon} />
                <Grid item>
                  <Typography className={classes.copy} careVariant="body3">
                    Starting at ${selectedCommunity.baseCost}/mo
                  </Typography>
                </Grid>
              </Grid>
            )}
          </div>
          {displayCheckbox && (
            <span className={classes.checkbox}>
              <Checkbox
                checked={checked}
                name="options"
                onChange={() => onCheck(selectedCommunity.id)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </span>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

export default CommunityCard;
