import { Typography } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core';

interface ILcHeader {
  header: string;
  subheader?: string | undefined;
  isVisible?: boolean;
}

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme?.palette?.care?.grey[50],
    backgroundImage: 'url("/app/enrollment/lead-connect/lcHeaderBg_mw.png")',
    backgroundPosition: 'top right',
    backgroundRepeat: 'no-repeat',
    padding: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      backgroundImage: 'url("/app/enrollment/lead-connect/lcHeaderBg_dt.png")',
    },
  },
  headerText: {
    // responsive font sizes; h2 on desktop should look like h1
    [theme.breakpoints.up('md')]: { ...theme.typography.h1 },
  },
  container: {
    width: 410,
    [theme.breakpoints.up('md')]: {
      width: 628,
    },
  },
  subheader: {
    marginTop: theme.spacing(1),
  },
}));

function LcHeader({ header, subheader, isVisible }: ILcHeader) {
  const classes = useStyles();
  return isVisible ? (
    <div className={classes.header}>
      <div className={classes.container}>
        <Typography variant="h2" className={classes.headerText}>
          <span>{header}</span>
        </Typography>
        {subheader && (
          <Typography variant="body1" className={classes.subheader}>
            <span>{subheader}</span>
          </Typography>
        )}
      </div>
    </div>
  ) : null;
}

LcHeader.defaultProps = {
  subheader: undefined,
  isVisible: true,
};

export default LcHeader;
