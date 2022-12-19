/* eslint-disable no-param-reassign */
import {
  MenuItem,
  FormControl,
  FormHelperText,
  makeStyles,
  SelectProps,
  InputLabel,
} from '@material-ui/core';
import { Select } from '@care/react-component-lib';
import { useField } from 'formik';
import { HOW_DID_YOU_HEAR_ABOUT_US } from '../__generated__/globalTypes';

type HearAboutUsOptionsType = Array<{ value: HOW_DID_YOU_HEAR_ABOUT_US; label: string }>;

export const HearAboutUsOptions: HearAboutUsOptionsType = [
  { value: HOW_DID_YOU_HEAR_ABOUT_US.TV_AD, label: 'Cable TV Ad' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.SEARCH_ENGINE, label: 'Search Engine (Google, Bing)' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.PARENTING_GROUP, label: 'Parenting Group or Forum' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.FRIENDS_OR_FAMILY, label: 'Friends or Family' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.BANNER_AD, label: 'Banner Ad' },
  {
    value: HOW_DID_YOU_HEAR_ABOUT_US.PRESS_COVERAGE,
    label: 'Press Coverage (News, Magazine, Blog)',
  },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.FACEBOOK, label: 'Facebook or Instagram' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.ONLINE_VIDEO, label: 'Streaming Video Ad (Hulu, Roku)' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.YOUTUBE, label: 'YouTube' },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.BILLBOARD, label: 'Billboard' },
  {
    value: HOW_DID_YOU_HEAR_ABOUT_US.RADIO_AUDIO_AD,
    label: 'Radio/Audio Ad (iHeart, Pandora, Podcast)',
  },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.INFLUENCER, label: 'Influencer' },
  {
    value: HOW_DID_YOU_HEAR_ABOUT_US.OTHER_SOCIAL_MEDIA,
    label: 'Other Social Media (Twitter, Pinterest, LinkedIn, TikTok)',
  },
  { value: HOW_DID_YOU_HEAR_ABOUT_US.OTHER, label: 'Other' },
];

//  Fisher-Yates Algorithm to shuffle arrays ramdomly
function shuffle(array: HearAboutUsOptionsType) {
  // removes last two items of the array
  // first puts after Facebook or Instagram option
  // last puts back at the end so that it doesn't get shuffled
  const otherOptions = array.slice(-2);
  const rest = array.slice(0, array.length - 2);

  // eslint-disable-next-line no-plusplus
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = rest[i];
    rest[i] = rest[j];
    rest[j] = temp;
  }

  const fbIndex = rest.findIndex((elem) => elem.value === HOW_DID_YOU_HEAR_ABOUT_US.FACEBOOK);
  rest.splice(fbIndex + 1, 0, otherOptions[0]);

  return [...rest, otherOptions[1]];
}

const shuffledHearAboutUsOptions = shuffle(HearAboutUsOptions);

const useStyles = makeStyles((theme) => ({
  // a workaround needed until the DNA-1169 is done
  selectContainer: {
    width: '100%',
    paddingTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginBottom: theme.spacing(0),

    '& .MuiInput-input': {
      paddingTop: theme.spacing(2.25),
      paddingBottom: theme.spacing(0),
      paddingLeft: theme.spacing(2),
      color: theme.palette.care?.navy[900],
      fontSize: '18px',
      fontWeight: 700,
    },
    // styles for placeholder value
    '& .no-value .MuiInput-input': {
      color: theme.palette.care?.grey[700],
      fontWeight: 'normal',
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.25),
    },
  },
}));

interface HearAboutUsProps extends SelectProps {
  id?: string;
  name?: string;
  value?: string;
  helpText?: string;
  errorDisplayed?: string | boolean;
  withLabelText?: boolean;
}

const HearAboutUs = ({
  id,
  name,
  value,
  helpText,
  errorDisplayed,
  onChange,
  onBlur,
  withLabelText,
}: HearAboutUsProps) => {
  const classes = useStyles();

  return (
    <FormControl error={Boolean(errorDisplayed)} className={classes.selectContainer}>
      {withLabelText && <InputLabel id={id}>How did you hear about us?</InputLabel>}
      <Select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        className={!value ? 'no-value' : ''}
        inputProps={{
          tabIndex: -1,
        }}>
        <MenuItem value="" disabled>
          {withLabelText ? 'Select option' : 'How did you hear about us?'}
        </MenuItem>
        {shuffledHearAboutUsOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helpText}</FormHelperText>
    </FormControl>
  );
};

HearAboutUs.defaultProps = {
  id: 'source',
  name: 'source',
  value: '',
  helpText: '',
  errorDisplayed: '',
  withLabelText: true,
};

interface HearAboutUsFieldProps {
  name: string;
  withLabelText?: boolean;
  required?: boolean;
}

function validateFieldRequired(value: string) {
  return HearAboutUsOptions.some((option) => option.value === value)
    ? undefined
    : 'Please select an option';
}

function validateFieldOptional(value: string) {
  if (!value) return undefined;

  return HearAboutUsOptions.some((option) => option.value === value)
    ? undefined
    : 'Please select an option';
}

export function HearAboutUsField({ name, required, withLabelText }: HearAboutUsFieldProps) {
  const validate = required ? validateFieldRequired : validateFieldOptional;
  const [field, meta] = useField({ name, validate });

  return (
    <HearAboutUs
      {...field}
      helpText={meta.error || ' '}
      errorDisplayed={meta.touched && meta.error}
      withLabelText={withLabelText}
    />
  );
}

HearAboutUsField.defaultProps = {
  required: false,
  withLabelText: true,
};

export default HearAboutUs;
