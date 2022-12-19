import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Grid, makeStyles, Typography as MuiTypography } from '@material-ui/core';
import { Modal, TextArea, TextField, Typography } from '@care/react-component-lib';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Header from '@/components/Header';
import clsx from 'clsx';
import useEnterKey from '@/components/hooks/useEnterKey';
import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';
import {
  caregiverBiographyUpdate,
  caregiverBiographyUpdateVariables,
} from '@/__generated__/caregiverBiographyUpdate';
import { CAREGIVER_BIOGRAPHY_UPDATE } from '@/components/request/GQL';
import { TEXT_DETECT_CONCERNS } from '@/components/request/TextDetectConcernsGQL';
import OverlaySpinner from '@/components/OverlaySpinner';
import FixElementToBottom from '@/components/FixElementToBottom';
import { useFeatureFlags } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';
import Highlighter, {
  GenericDetectedEntity,
  textToHLChunks,
} from '@/components/blocks/Highlighter';
import {
  textAnalyzerDetectConcerns,
  textAnalyzerDetectConcernsVariables,
} from '@/__generated__/textAnalyzerDetectConcerns';
import { ServiceType } from '@/__generated__/globalTypes';
import { useAppDispatch, useFlowState, useProviderCCState } from '@/components/AppState';
import { getCzenSessionId } from '@/utilities/czenCookiesHelper';
import { helpWithMap } from '@/pages/provider/cc/profile';
import TipsBanner from '@/components/pages/provider/TipsBanner';

type TextAnalyzerKeys = keyof textAnalyzerDetectConcerns;

const useStyles = makeStyles((theme) => ({
  descriptionLine: {
    margin: theme.spacing(2, 0, 2),
  },
  instructionsParagraph: {
    margin: theme.spacing(1, 0, 1),
  },
  descriptionParagraph: {
    marginTop: theme.spacing(2),
  },
  listSection: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  headlineInputContainer: {
    width: '100%',
    '& .MuiFormControl-root': {
      display: 'flex',
    },
    '& .MuiInputBase-root': {
      marginTop: 0,
    },
    '& .MuiFormControl-root label': {
      color: theme?.palette?.care?.grey[900],
    },
  },
  bioError: {
    '& > div > div': {
      border: `1px solid ${theme.palette.care?.red[800]}`,
      boxShadow: 'none',
    },
  },
  errorLabel: {
    display: 'block',
    color: theme.palette.care?.red[800],
    fontSize: theme.spacing(1.5),
    lineHeight: `${theme.spacing(2)}px`,
    margin: theme.spacing(0.5, 1, 0),
    '& + &': {
      marginTop: theme.spacing(0),
    },
  },
  errorLabelLarge: {
    fontSize: theme.spacing(2),
    fontWeight: 'bold',
  },
  charactersLabel: {
    color: theme.palette.care?.grey[600],
    fontSize: '12px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(1),
  },
  list: {
    '-webkit-padding-start': '16px',
    // @ts-ignore
    fontSize: theme.typography.body3?.fontSize,
    paddingLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: '0px',
    '& li': {
      marginTop: 6,
      '&:not(:last-child)': {
        marginBottom: 6,
      },
    },
  },
  textAreaContainer: {
    '& > div': {
      margin: 0,
      width: '100%',
      marginTop: theme.spacing(1),
    },
    '& label': {
      color: theme?.palette?.care?.grey[900],
    },
  },
  tipsContainer: {
    padding: theme.spacing(3, 0),
  },
  bioMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

const TextErrorNotice = () => {
  const classes = useStyles();

  return (
    <span className={`${classes.errorLabel} ${classes.errorLabelLarge}`}>
      <span>This is against our</span>{' '}
      <a href="https://www.care.com/safety#communityGuidelines" target="_blank" rel="noreferrer">
        community guidelines
      </a>
    </span>
  );
};

interface Props {
  headline: string;
  bio: string;
  freeGated?: boolean;
  onHeadlineChange: (headline: string) => void;
  onBioChange: (bio: string) => void;
  nextRoute: string;
  examples: string[];
  title: string;
  serviceType?: ServiceType;
}

export default function HeadlineBio({
  headline,
  bio,
  freeGated,
  onBioChange,
  onHeadlineChange,
  nextRoute,
  examples,
  title,
  serviceType,
}: Props) {
  const router = useRouter();
  const featureFlags = useFeatureFlags();
  const { experienceYears, selectedHelpWith, textAnalysisValidationId } = useProviderCCState();
  const { memberId } = useFlowState();
  const dispatch = useAppDispatch();

  const HEADLINE_LIMIT = 50;
  const BIO_LIMIT = 1000;
  const BIO_MIN_REQUIRED = 100;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorHeadlineText, setErrorHeadlineText] = useState('');
  const [errorSkillsText, setErrorSkillsText] = useState('');
  const [showHTMLErrorModal, setShowHTMLErrorModal] = useState(false);
  const [htmlErrorText, setHtmlErrorText] = useState('');
  const [hlWordsHeadline, setHlWordsHeadline] = useState<GenericDetectedEntity[]>([]);
  const [hlWordsBio, setHlWordsBio] = useState<GenericDetectedEntity[]>([]);
  const [bioFieldFocus, setBioFieldFocus] = useState(false);

  const hlWordSetters = {
    bio: setHlWordsBio,
    headline: setHlWordsHeadline,
  };

  const providerCCFreeGatedExperience =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]?.value;
  const providerCCEnrollmentTextAnalyzer =
    featureFlags?.flags[CLIENT_FEATURE_FLAGS.PROVIDER_CC_ENROLLMENT_TEXT_ANALYZER]?.value;

  const isFreeGated =
    providerCCFreeGatedExperience && serviceType === ServiceType.CHILD_CARE && freeGated;
  const textAnalyzerEnabled =
    providerCCEnrollmentTextAnalyzer && serviceType === ServiceType.CHILD_CARE;

  const handlePostError = (graphQLError: ApolloError) => {
    setShowErrorModal(true);
    setLoading(false);
    logger.error({ event: 'providerUpdateBiographyError', graphQLError: graphQLError?.message });
  };
  const graphQLErrorHandler = (graphQLError: ApolloError) => {
    if (graphQLError.graphQLErrors[0]?.extensions?.code === 'CROSS_SITE_SCRIPT_ERROR') {
      setHtmlErrorText(graphQLError.graphQLErrors[0]?.message);
      setShowHTMLErrorModal(true);
      setLoading(false);
      logger.error({
        event: 'providerUpdateBiographyError',
        graphQLError: graphQLError.message,
      });
    } else {
      handlePostError(graphQLError);
    }
  };

  const [updateProviderBiography] = useMutation<
    caregiverBiographyUpdate,
    caregiverBiographyUpdateVariables
  >(CAREGIVER_BIOGRAPHY_UPDATE, {
    onCompleted(response) {
      if (response?.caregiverBiographyUpdate?.__typename === 'CaregiverBiographyUpdateSuccess') {
        setErrorHeadlineText('');
        setErrorSkillsText('');

        router.push(nextRoute);
      } else {
        const headlineErrors = response?.caregiverBiographyUpdate?.errors?.filter(
          (error) => error.__typename === 'CaregiverBioHeadlineUpdateError'
        );
        const skillsErrors = response?.caregiverBiographyUpdate?.errors?.filter(
          (error) => error.__typename === 'CaregiverBioExperienceSummaryUpdateError'
        );
        setLoading(false);
        if (headlineErrors.length > 0 || skillsErrors.length > 0) {
          setErrorHeadlineText(headlineErrors[0]?.message);
          setErrorSkillsText(skillsErrors[0]?.message);
        } else {
          setShowErrorModal(true);
        }
      }
    },
    onError: graphQLErrorHandler,
  });

  const [analyzeText] = useLazyQuery<
    textAnalyzerDetectConcerns,
    textAnalyzerDetectConcernsVariables
  >(TEXT_DETECT_CONCERNS, {
    onCompleted: (response) => {
      const requestErrors = Object.keys(response || {})
        .map((key) => {
          const item = response[key as TextAnalyzerKeys];
          return item.__typename === 'TextAnalyzerDetectConcernsError' ? item.message : null;
        })
        .filter((el) => el !== null);
      if (requestErrors.length) {
        setHtmlErrorText(requestErrors.join(' '));
        setShowHTMLErrorModal(true);
        setLoading(false);
        return;
      }

      let wordsDetected = false;

      Object.keys(hlWordSetters).forEach((key) => hlWordSetters[key as TextAnalyzerKeys]([]));
      Object.keys(response || {}).forEach((key) => {
        const item = response[key as TextAnalyzerKeys];
        if (item.__typename === 'TextAnalyzerDetectConcernsSuccess') {
          hlWordSetters[key as TextAnalyzerKeys](item.detectedConcerns);
          if (item.detectedConcerns.length) wordsDetected = true;
          if (item.validationId && !textAnalysisValidationId) {
            dispatch({
              type: 'setTextAnalysisValidationId',
              textAnalysisValidationId: item.validationId,
            });
          }
        }
      });

      if (!wordsDetected) {
        updateProviderBiography({
          variables: {
            input: {
              bio,
              headline,
            },
          },
        });
      } else {
        setLoading(false);
      }
    },
    onError: graphQLErrorHandler,
  });

  const renderFreeGatedBioDraft = () => {
    let bioDraft = '';

    if (isFreeGated) {
      bioDraft = `I have ${experienceYears} year${experienceYears > 1 ? 's' : ''} of experience.`;

      if (selectedHelpWith.length) {
        bioDraft += ` I can help with ${selectedHelpWith
          .map((key) => helpWithMap[key].toLowerCase())
          .join(', ')}.`;
      }
      onBioChange(bioDraft);
    }

    return bioDraft;
  };

  const formik = useFormik({
    initialValues: {
      headline,
      bio: bio || renderFreeGatedBioDraft(),
    },
    validationSchema: yup.object({
      headline: yup.string().max(HEADLINE_LIMIT),
      bio: yup.string().max(BIO_LIMIT).min(BIO_MIN_REQUIRED).required(),
    }),
    onSubmit: () => {
      setLoading(true);

      AnalyticsHelper.logEvent({
        name: 'Member Enrolled',
        data: {
          enrollment_flow: 'MW VHP Provider Enrollment',
          enrollment_step: 'provider_bio',
          cta_clicked: 'Next',
          headline,
          bio,
        },
      });

      if (isFreeGated || textAnalyzerEnabled) {
        analyzeText({
          variables: {
            bio: formik.values.bio,
            headline: formik.values.headline,
            textCreator: {
              memberId: String(memberId),
              sessionId: getCzenSessionId(),
            },
            validationId: textAnalysisValidationId,
          },
        });
      } else {
        updateProviderBiography({
          variables: {
            input: {
              bio,
              headline,
            },
          },
        });
      }
    },
  });

  const getErrors = (text: string, detectedEntities: GenericDetectedEntity[]) => {
    const words = detectedEntities.map((item) => item.text);
    const splitText = textToHLChunks(text, detectedEntities);

    if (!splitText) return false;
    return words.some((word) => splitText.includes(word));
  };

  const headlineTextError = useMemo(
    () => getErrors(formik.values.headline, hlWordsHeadline),
    [formik.values.headline, hlWordsHeadline]
  );

  const bioTextError = useMemo(
    () => getErrors(formik.values.bio, hlWordsBio),
    [formik.values.bio, hlWordsBio]
  );

  const hasTextErrors = [headlineTextError, bioTextError].includes(true);

  const BIO_LENGTH = formik.values?.bio?.length;

  useEffect(() => {
    (() => formik.validateForm())();
  }, []);

  const onChangeHeadlineHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // truncate string to match limit if user paste more characters than allowed
    const newValue = value.length <= HEADLINE_LIMIT ? value : value.slice(0, HEADLINE_LIMIT);

    formik.setFieldValue('headline', newValue);
    onHeadlineChange(newValue);
  };

  const onChangeBioHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    // truncate string to match limit if user paste more characters than allowed
    const newValue = value.length <= BIO_LIMIT ? value : value.slice(0, BIO_LIMIT);

    formik.setFieldValue('bio', newValue);
    onBioChange(newValue);
  };

  const classes = useStyles();

  useEnterKey(formik.isValid, formik.submitForm);

  const getBioLabel = () => {
    if (formik.touched.bio && formik.errors.bio && !isFreeGated) {
      return null;
    }
    if (isFreeGated ? !BIO_LENGTH : BIO_LENGTH < BIO_MIN_REQUIRED) {
      return `Minimum ${BIO_MIN_REQUIRED} characters`;
    }
    if (BIO_LENGTH < BIO_MIN_REQUIRED) {
      return `${BIO_MIN_REQUIRED - formik.values.bio.length} min. characters remaining.`;
    }
    return `${BIO_LENGTH}/${BIO_LIMIT} characters`;
  };

  return loading ? (
    <OverlaySpinner isOpen wrapped />
  ) : (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Header>{title}</Header>
        </Grid>

        {isFreeGated ? (
          <Grid item xs={12} className={classes.descriptionLine}>
            <Typography variant="body2">Add a title (ex: Fun sitter and smile creator)</Typography>
          </Grid>
        ) : (
          <>
            <Grid item className={classes.descriptionParagraph}>
              <Typography variant="body2">
                Showcase your personality and professionalism by writing a short bio for potential
                employers.
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.listSection}>
              <MuiTypography variant="h5" component="p">
                You can mention:
              </MuiTypography>
              <ul className={classes.list}>
                {examples.map((example) => (
                  <li key={example}>
                    <Typography careVariant="body3">{example}</Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <div className={classes.headlineInputContainer}>
            <Highlighter text={formik.values.headline} hlWords={hlWordsHeadline}>
              <TextField
                InputLabelProps={{ shrink: true }}
                id="headlineInput"
                name="headline"
                label={!isFreeGated && 'Headline (optional)'}
                InputProps={{
                  disableUnderline: true,
                  inputProps: { 'data-testid': 'headline-details' },
                }}
                placeholder={isFreeGated ? 'Bio title (optional)' : 'Share details here'}
                value={formik.values.headline}
                onChange={onChangeHeadlineHandler}
                helperText={errorHeadlineText}
                error={Boolean(errorHeadlineText) || headlineTextError}
              />
            </Highlighter>
            {headlineTextError && <TextErrorNotice />}

            <span className={classes.charactersLabel}>
              {formik.values.headline?.length ?? <span>0</span>}
              <span>/</span>
              <span>{HEADLINE_LIMIT}</span>
              <span>&nbsp;characters</span>
            </span>
          </div>
        </Grid>
        {isFreeGated && (
          <Grid item xs={12} className={classes.instructionsParagraph}>
            <Typography variant="body2">
              Introduce yourself to families by writing a bio. We started a draft, but you’ll need
              to edit it—reword or add more detail. It should be at least 100 characters.
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <div
            className={clsx(
              classes.textAreaContainer,
              ((formik.touched.bio && formik.errors.bio) || bioTextError) && classes.bioError
            )}>
            <Highlighter text={formik.values.bio} hlWords={hlWordsBio}>
              <TextArea
                maxRows={3}
                id="bioInput"
                name="bio"
                label={(!isFreeGated && 'Share additional skills') || undefined}
                placeholder="Share details here"
                value={formik.values.bio}
                onChange={onChangeBioHandler}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setBioFieldFocus(false);
                }}
                onFocus={() => setBioFieldFocus(true)}
                minRows={4}
                errorText={errorSkillsText}
                resize
                fullWidth
              />
            </Highlighter>
          </div>
          {bioTextError && <TextErrorNotice />}
          <span>
            {isFreeGated ? (
              <>
                {formik.touched.bio && formik.errors.bio && !bioFieldFocus && (
                  <span className={classes.errorLabel}>Please type at least 100 characters</span>
                )}
                <Grid container className={classes.tipsContainer}>
                  <Grid item xs={2}>
                    <TipsBanner />
                  </Grid>
                  <Grid item xs={10} className={classes.bioMessageContainer}>
                    <span className={classes.charactersLabel}>{getBioLabel()}</span>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <span className={classes.errorLabel}>
                  {formik.touched.bio && formik.errors.bio && 'Please type at least 100 characters'}
                </span>
                <span className={classes.charactersLabel}>{getBioLabel()}</span>
              </>
            )}
          </span>
        </Grid>
        <FixElementToBottom>
          <Button
            size="large"
            color="primary"
            variant="contained"
            disabled={!formik.isValid || hasTextErrors}
            fullWidth
            onClick={formik.submitForm}>
            Next
          </Button>
        </FixElementToBottom>
      </Grid>
      <Modal
        open={showErrorModal}
        title="Oops, something went wrong"
        ButtonPrimary={
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setShowErrorModal(false);
              router.push(nextRoute);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        An error occurred updating your profile. Don&apos;t worry though, you can update this from
        your profile later.
      </Modal>
      <Modal
        open={showHTMLErrorModal}
        title="Oops, something went wrong"
        ButtonPrimary={
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              setShowHTMLErrorModal(false);
            }}>
            Got it
          </Button>
        }
        onClose={() => {}}>
        {htmlErrorText}
      </Modal>
    </>
  );
}

HeadlineBio.defaultProps = {
  freeGated: false,
  serviceType: null,
};
