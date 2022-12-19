import { makeStyles } from '@material-ui/core';
import { StatelessSelector, Pill } from '@care/react-component-lib';
import { YesOrNoAnswer } from '@/__generated__/globalTypes';

const yesNoOrNotSurePills = [
  { label: 'Yes', value: YesOrNoAnswer.YES },
  { label: 'No', value: YesOrNoAnswer.NO },
  { label: "I'm not sure", value: YesOrNoAnswer.NOT_SURE },
];

const useStyles = makeStyles((theme) => ({
  selector: {
    marginTop: theme.spacing(3),
    '& .MuiListItem-root': {
      marginBottom: theme.spacing(0),
      paddingBottom: `${theme.spacing(1)}px`,
      paddingTop: `4px !important`,
      '&:last-child': {
        paddingBottom: '0px !important',
      },
      '&:first-child': {
        paddingTop: `0 !important`,
      },
    },
  },
}));

interface YesNoNotSureProps {
  selectorName: string;
  handleChange: Function;
}

function YesNoNotSurePills(props: YesNoNotSureProps) {
  const { selectorName, handleChange } = props;
  const classes = useStyles();

  return (
    <StatelessSelector
      onChange={handleChange}
      name={selectorName}
      single
      className={classes.selector}>
      {yesNoOrNotSurePills.map((option) => (
        <Pill key={option.value} {...option} size="md" />
      ))}
    </StatelessSelector>
  );
}

export default YesNoNotSurePills;
