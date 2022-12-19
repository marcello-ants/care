import React from 'react';
import { CardMedia, makeStyles } from '@material-ui/core';
import { Card, Typography, Link } from '@care/react-component-lib';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    marginTop: theme.spacing(1),
  },

  cardContent: {
    display: 'flex',
    alignItems: 'center',
  },

  card: {
    // changed left padding to match design spacings
    padding: theme.spacing(2, 2, 2, 1),
    marginBottom: theme.spacing(3),
    cursor: 'pointer',
  },
  header: {
    marginBottom: 0,
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(1),
    },
  },
  linkContainer: {
    marginTop: 0,
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(1),
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export interface IconCardProps {
  icon: React.ReactNode;
  iconTitle: string;
  header: string;
  description?: string;
  linkContent: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function IconCard({ header, icon, iconTitle, description, linkContent, onClick }: IconCardProps) {
  const classes = useStyles();
  return (
    <Card careVariant="subtle" className={classes.card} onClick={onClick}>
      <div className={classes.cardContent}>
        <CardMedia title={iconTitle} className={classes.icon}>
          {icon}
        </CardMedia>
        <div>
          <Typography variant="h4" className={classes.header}>
            {header}
          </Typography>

          {description && <Typography careVariant="body3">{description}</Typography>}
          <div className={classes.linkContainer}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link component="button" careVariant="link2" inline>
              {linkContent}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default IconCard;
