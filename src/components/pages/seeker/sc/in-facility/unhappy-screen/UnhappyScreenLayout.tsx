import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@care/react-component-lib';
import { IconIllustrationMediumChecklist, IconIllustrationSmallPolaroids } from '@care/react-icons';
import Header from '@/components/Header';
import IconCard from '@/components/IconCard';

const useStyles = makeStyles((theme) => ({
  headerTextContainer: {
    marginBottom: theme.spacing(2),
  },
  descriptionText: {
    marginBottom: theme.spacing(3),
  },
}));

export interface UnhappyCardProps {
  iconTitle: string;
  header: string;
  linkContent: string;
  onClickHandler: React.MouseEventHandler<HTMLDivElement>;
}

interface UnhappyScreenLayoutProps {
  headerText: string;
  descriptionText: string;
  inHomeCard: UnhappyCardProps;
  learningCard: UnhappyCardProps;
}

function Options(props: UnhappyScreenLayoutProps) {
  const { headerText, descriptionText, inHomeCard, learningCard } = props;
  const classes = useStyles();

  return (
    <Grid container>
      <>
        <Grid item xs={12} className={classes.headerTextContainer}>
          <Header>{headerText}</Header>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" className={classes.descriptionText}>
            {descriptionText}
          </Typography>
        </Grid>
      </>
      <Grid item xs={12}>
        <IconCard
          icon={<IconIllustrationSmallPolaroids size="64px" />}
          iconTitle={inHomeCard.iconTitle}
          header={inHomeCard.header}
          linkContent={inHomeCard.linkContent}
          onClick={inHomeCard.onClickHandler}
        />
        <IconCard
          icon={<IconIllustrationMediumChecklist size="64px" />}
          iconTitle={learningCard.iconTitle}
          header={learningCard.header}
          linkContent={learningCard.linkContent}
          onClick={learningCard.onClickHandler}
        />
      </Grid>
    </Grid>
  );
}

export default Options;
