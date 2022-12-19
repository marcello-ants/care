import { Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  section: {
    marginTop: theme.spacing(2),
  },
  list: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    '& li': {
      marginTop: theme.spacing(1),
    },
  },
}));

function CommunityServiceAmenitiesList({ title, list }: { title: string; list: string[] }) {
  const classes = useStyles();
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography className={classes.section} variant="h4">
          {title}
        </Typography>
        {list?.length && (
          <ul className={classes.list}>
            {list.map((item: any) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </Grid>
    </Grid>
  );
}

export default CommunityServiceAmenitiesList;
