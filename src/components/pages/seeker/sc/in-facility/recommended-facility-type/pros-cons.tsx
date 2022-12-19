import React from 'react';
import { makeStyles, List, ListItem } from '@material-ui/core';
import { Icon24InfoSuccessFilled, Icon24UtilityMinus } from '@care/react-icons';
import { Typography } from '@care/react-component-lib';

const useStyles = makeStyles(() => ({
  subHeaderSpace: {
    margin: '24px 0 8px',
  },
  marginLeftTextList: {
    marginLeft: '10px',
  },
  marginListStartItem: {
    '& .MuiListItem-root': {
      alignItems: 'flex-start',
      minHeight: '40px',
      paddingBottom: '0px !important',
    },
  },
}));

interface ProsAndConsListProps {
  pros: string[];
  cons: string[];
}

const ProsAndConsList = ({ pros, cons }: ProsAndConsListProps) => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h5" className={classes.subHeaderSpace}>
        Why we think it&apos;s a good fit:
      </Typography>
      <List className={classes.marginListStartItem}>
        {pros.map((text, key) => (
          <ListItem disableGutters key={`item-${key + 1}`}>
            <Icon24InfoSuccessFilled height="20px" width="20px" />
            <Typography careVariant="body3" className={classes.marginLeftTextList}>
              {text}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" className={classes.subHeaderSpace}>
        Why it may not be a good fit:
      </Typography>
      <List className={classes.marginListStartItem}>
        {cons.map((text, key) => (
          <ListItem disableGutters key={`item-${key + 1}`}>
            <Icon24UtilityMinus />
            <Typography careVariant="body3" className={classes.marginLeftTextList}>
              {text}
            </Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProsAndConsList;
