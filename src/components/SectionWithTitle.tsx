import { makeStyles } from '@material-ui/core';
import { Typography } from '@care/react-component-lib';

interface SectionWithTitleProps {
  title: string;
  learnMoreLink?: string;
  children: string;
}

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  body: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    fontSize: '14px',
  },
}));

function SectionWithTitle({ title, learnMoreLink, children }: SectionWithTitleProps) {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h2" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" className={classes.body}>
        {children} {learnMoreLink ? <a href={learnMoreLink}>Learn more</a> : null}
      </Typography>
    </div>
  );
}

SectionWithTitle.defaultProps = {
  learnMoreLink: undefined,
};

export default SectionWithTitle;
