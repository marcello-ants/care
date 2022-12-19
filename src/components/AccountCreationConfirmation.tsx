import { ReactElement } from 'react';
import { Icon64BrandActionSuccess } from '@care/react-icons';
import { Grid, Typography } from '@material-ui/core';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import Header from '@/components/Header';
import { SelectorType } from '@care/react-component-lib/dist/components/Selector/StatelessSelector';

const useStyles = makeStyles((theme) => ({
  selector: {
    '& .MuiListItem-root': {
      marginBottom: 0,
    },
  },
  icon: {
    position: 'relative',
    left: '-9px',
  },
  bodyText: {
    fontWeight: 'normal',
    lineHeight: '24px',
    margin: theme.spacing(2, 0, 4),
  },
  typeContainer: {
    margin: theme.spacing(1, 0, 1),
  },

  buttonContainer: {
    padding: theme.spacing(3.5, 3, 0),
  },
  header: {
    marginBottom: ({ subheader }: { subheader: string | undefined }) =>
      subheader ? 0 : theme.spacing(1),
  },
}));

type Options = {
  label: string;
  value: string;
};

interface IAccountCreationConfirmation {
  header: string;
  description?: string;
  subheader?: string;
  options: Options[];
  onChange?: SelectorType['onChange'];
  cta?: ReactElement;
  value?: string;
  showIcon?: boolean;
}

function AccountCreationConfirmation({
  header,
  description,
  subheader,
  options,
  value,
  onChange,
  cta,
  showIcon,
}: IAccountCreationConfirmation) {
  const classes = useStyles({ subheader });

  return (
    <Grid container>
      {showIcon && (
        <Grid item xs={12}>
          {/*
          The svg has a litle padding that makes the icon smaller
          60px makes the icon size to 49.33 the correct size is 60px approx
          74px makes the icon size 60.88
        */}
          <Icon64BrandActionSuccess size="74px" className={classes.icon} />
        </Grid>
      )}

      <Grid item xs={12} className={classes.header}>
        <Header>{header}</Header>
      </Grid>
      {description && (
        <Grid item xs={12}>
          <Typography variant="body2" className={classes.bodyText}>
            {description}
          </Typography>
        </Grid>
      )}

      {subheader && (
        <Grid item xs={12}>
          <Typography variant="h4">{subheader}</Typography>
        </Grid>
      )}

      <Grid item xs={12} className={classes.typeContainer}>
        <StatelessSelector onChange={onChange} single value={value} className={classes.selector}>
          {options.map((option) => (
            <Pill key={option.label} {...option} size="md" />
          ))}
        </StatelessSelector>
        {cta && <div className={classes.buttonContainer}>{cta}</div>}
      </Grid>
    </Grid>
  );
}

AccountCreationConfirmation.defaultProps = {
  value: '',
  onChange: () => {},
  cta: null,
  showIcon: true,
  description: '',
  subheader: '',
};

export default AccountCreationConfirmation;
