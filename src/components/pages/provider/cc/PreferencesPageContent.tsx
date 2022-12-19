import React, { useRef, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import {
  Checkbox,
  FormControlLabel,
  Pill,
  StatelessSelector,
  StepperInput,
  Typography,
} from '@care/react-component-lib';
import Header from '@/components/Header';
import { useAppDispatch, useProviderCCState } from '@/components/AppState';

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(5),
  },
  checkboxLabel: {
    fontSize: '16px',
    marginTop: theme.spacing(3),
  },
  numberOfChildren: {
    maxWidth: '100%',
  },
  selector: {
    '& .MuiListItem-root': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: '0px !important',
    },
  },
  allItemsSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-1),
  },
  children: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const helpWith = ['NEWBORN', 'TODDLER', 'EARLY_SCHOOL', 'ELEMENTARY_SCHOOL', 'TEEN'];
const helpWithMap: { [key in typeof helpWith[number]]: string } = {
  NEWBORN: '0 - 11 mos',
  TODDLER: '1 - 3 yrs',
  EARLY_SCHOOL: '4 - 5 yrs',
  ELEMENTARY_SCHOOL: '6 - 11 yrs',
  TEEN: '12+ yrs',
};

type PreferencesPageContentProps = {
  hideSickChildrenCheckbox?: boolean;
};

const PreferencesPageContent = ({ hideSickChildrenCheckbox }: PreferencesPageContentProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const helpWithRef = useRef<null | HTMLDivElement>(null);
  const { numberOfChildren, ageGroups, careForSickChild } = useProviderCCState();

  const [errorForHelpWith, setErrorForHelpWith] = useState(false);

  const handleHelpWithSelected = (...props: any[]) => {
    dispatch({ type: 'setProviderCCComfortableCaringFor', numberOfChildren: props[0] });
  };
  const onAgeGroups = (...props: any[]) => {
    setErrorForHelpWith(false);
    dispatch({ type: 'setProviderCCAgegroups', ageGroups: props[0] });
  };
  const onWillingToCareSickChildren = (checked: boolean) => {
    dispatch({ type: 'setCareForSickChild', careForSickChild: checked });
  };

  return (
    <>
      <Grid item xs={12} ref={helpWithRef}>
        <Header>Who would you like to care for?</Header>
      </Grid>
      <Grid item xs={12} className={classes.children}>
        <StepperInput
          className={classes.numberOfChildren}
          name="children"
          min={1}
          max={10}
          inc={1}
          initialVal={numberOfChildren}
          onChange={handleHelpWithSelected}
          stepperLabel="I’m comfortable caring for:"
          optionalLabel={numberOfChildren === 1 ? 'Child' : 'Children'}
        />
      </Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4">Ages</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          careVariant="body3"
          color="secondary"
          className={errorForHelpWith ? classes.error : ''}>
          Select all that apply
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <StatelessSelector
          className={clsx(classes.selector, classes.allItemsSelector)}
          horizontal
          onChange={onAgeGroups}
          value={ageGroups}>
          {helpWith.map((value) => (
            <Pill key={value} label={helpWithMap[value]} value={value} name={value} />
          ))}
        </StatelessSelector>
      </Grid>
      {!hideSickChildrenCheckbox && (
        <Grid item xs={12}>
          <FormControlLabel
            className={classes.checkboxLabel}
            control={
              <Checkbox
                checked={careForSickChild}
                onChange={(event) => onWillingToCareSickChildren(event.target.checked)}
              />
            }
            label="Willing to care for sick children"
            labelPlacement="end"
          />
        </Grid>
      )}
    </>
  );
};

PreferencesPageContent.defaultProps = {
  hideSickChildrenCheckbox: false,
};

export default PreferencesPageContent;
