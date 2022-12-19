import React from 'react';

import { KeyboardDatePicker, Typography, Link } from '@care/react-component-lib';
import { Icon24UtilityAdd } from '@care/react-icons';
import { Grid, makeStyles } from '@material-ui/core';
import { ChildDOB } from '@/types/seekerCC';

const MAX_CHILDREN = 10;
const MIN_CHILDREN = 1;

const useStyles = makeStyles((theme) => ({
  childInfoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  childLabel: {
    fontWeight: 'bold',
    paddingTop: '3px',
  },
  addChildContainer: {
    display: 'flex',
    justifyContent: 'center',
    cursor: 'default',
    whiteSpace: 'nowrap',
  },
  addChildButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  addIcon: {
    size: '24px',
    marginRight: theme.spacing(1),
  },
}));

type ChildDOBInputProps = {
  childrenList: ChildDOB[];
  handleAddChild: () => void;
  handleDeleteChild: (index: number) => void;
  handleAgeChange: (fieldName: string, value: any) => void;
  errorMessage: string;
  fieldsWithErrors: any;
};

const ChildDOBInput = ({
  childrenList,
  handleAgeChange,
  handleAddChild,
  handleDeleteChild,
  errorMessage,
  fieldsWithErrors,
}: ChildDOBInputProps) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      {childrenList.map((childDOB, i: number) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid key={i} item xs={12}>
          <Grid className={classes.childInfoContainer}>
            <Typography
              careVariant="body3"
              color="primary"
              className={classes.childLabel}>{`Child ${i + 1}`}</Typography>
            {childrenList.length > MIN_CHILDREN && (
              <Link careVariant="link4" onClick={() => handleDeleteChild(i)} bold>
                Remove
              </Link>
            )}
          </Grid>
          <Grid item xs={12}>
            <KeyboardDatePicker
              error={Boolean(fieldsWithErrors[i])}
              helperText={fieldsWithErrors[i] && errorMessage}
              name={`children[${i}]`}
              disableToolbar
              label="Birth Month and Year (MM/YYYY)"
              format="MM/YYYY"
              placeholder="MM/YYYY"
              value={childDOB}
              onChange={(value) => handleAgeChange(`childrenDOB[${i}]`, value)}
              id={`childrenDOB[${i}]`}
            />
          </Grid>
        </Grid>
      ))}
      {childrenList.length < MAX_CHILDREN && (
        <Grid className={classes.addChildContainer} item xs={12}>
          <Grid className={classes.addChildButton} onClick={handleAddChild} item xs={6}>
            <Icon24UtilityAdd className={classes.addIcon} />
            <Typography>Add another child</Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ChildDOBInput;
