import React, { ChangeEvent, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';

import { useRouter } from 'next/router';
import { Grid, makeStyles, Button, useMediaQuery, useTheme } from '@material-ui/core';
import { ProfileAvatar, TextArea, Typography } from '@care/react-component-lib';
import { Icon80MiniCelebrationNewApplicationCelebrate, Icon24InfoTips } from '@care/react-icons';
import { useAppDispatch, useSeekerState } from '@/components/AppState';

import stripInvalidCharacters from '@/utilities/stripInvalidCharacters';
import BadWordsFilter from 'bad-words';
import { ApolloError, useMutation } from '@apollo/client';
import { SEND_MESSAGE_TO_PROVIDER } from '@/components/request/GQL';
import { sendMessage, sendMessageVariables } from '@/__generated__/sendMessage';

import { CZEN_BASE_PATH, MHP_FAVORITES_PATH, SEEKER_LEAD_CONNECT_ROUTES } from '@/constants';
import logger from '@/lib/clientLogger';

import FullWidthLayout from '@/components/layouts/FullWidthLayout';

import LcContainer from '@/components/LcContainer';

import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import OverlaySpinner from '@/components/OverlaySpinner';
import { providersToShow } from '../helpers';

const MESSAGE_LIMIT = 5000;

const useStyles = makeStyles((theme) => ({
  lcContainer: {
    padding: theme.spacing(3, 3, 0),
    [theme.breakpoints.up('md')]: {
      padding: 0,
    },
  },
  innerContainer: {
    maxWidth: 410,
  },
  subheader: {
    marginBottom: theme.spacing(3),
  },
  careGivers: {
    marginBottom: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  careGiver: {
    '&:not(:last-child)': {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        marginRight: theme.spacing(3),
      },
    },
  },
  sendingButton: {
    marginBottom: 10,
  },
  skipButton: {
    '& .MuiButton-label': {
      textDecoration: 'underline',
    },
    fontSize: 16,
    color: theme?.palette?.care?.grey[600],
  },
  errorText: {
    marginBottom: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(1),
    width: 64,
    height: 64,
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(2),
      width: 100,
      height: 100,
    },
  },
  textAreaContainer: {
    '& > div': {
      margin: 0,
      width: '100%',
      marginTop: theme.spacing(1),
    },
    '& textarea': {
      width: '100%',
    },
    marginBottom: theme.spacing(3),
    width: '100%',
  },
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
    justifyContent: 'center',
    backgroundColor: theme?.palette?.care?.grey[50],
  },
  tip: {
    display: 'flex',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(0, 1, 0),
  },
  tipIcon: {
    marginRight: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    width: '100%',
    padding: theme.spacing(0, 2),
  },
  message: {
    [theme.breakpoints.up('md')]: {
      // responsive font sizes; h4 on desktop should look like h3
      ...theme.typography.h3,
    },
  },
}));

const filter = new BadWordsFilter();

const formatWhoNeedsCare = (whoNeedsCare: SeniorCareRecipientRelationshipType | null) => {
  if (whoNeedsCare === 'OTHER' || !whoNeedsCare) {
    return 'my loved one';
  }
  if (whoNeedsCare === 'SELF') {
    return 'myself';
  }
  return `my ${whoNeedsCare.toLowerCase()}`;
};

const MAX_SEND_ATTEMPTS = 2;

function UpgradeOrSkip() {
  const router = useRouter();
  const classes = useStyles();
  const {
    leadAndConnect: {
      acceptedProviders,
      messageSentAttempts: nullableMessageSentAttempts,
      failedMessageSentProviderIds: nullableFailedMessageSentProviderIds,
      message: nullableMessage,
    },
    whoNeedsCare,
    jobPost: { jobId },
  } = useSeekerState();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const messageSentAttempts = nullableMessageSentAttempts ?? 0;
  const failedMessageSentProviderIds = nullableFailedMessageSentProviderIds ?? [];

  const dispatch = useAppDispatch();

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const providers = providersToShow(acceptedProviders);
  const message =
    nullableMessage ??
    `Hello, I'm looking for a caregiver to help out with ${formatWhoNeedsCare(
      whoNeedsCare
    )}. Are you interested?`;

  const handlePostSuccess = (response: sendMessage) => {
    let failuresAdded = false;
    if (response.sendMessage.__typename === 'SendMessageError') {
      if (
        response.sendMessage.failedRecipientIds &&
        response.sendMessage.failedRecipientIds.length > 0
      ) {
        failuresAdded = true;
        response.sendMessage.failedRecipientIds.forEach((providerId: string) => {
          if (!failedMessageSentProviderIds.includes(providerId)) {
            failedMessageSentProviderIds.push(providerId);
          }
        });

        dispatch({
          type: 'setFailedMessageSentProviderIds',
          failedMessageSentProviderIds,
        });
      }
    }

    if (failuresAdded) {
      logger.warn({ event: 'leadConnectMessageSentFailure' });
      dispatch({
        type: 'setMessageSentAttempts',
        messageSentAttempts: messageSentAttempts + 1,
      });
      setIsWaiting(false);
    } else {
      logger.info({ event: 'leadConnectMessageSentSuccess' });
      router.push(SEEKER_LEAD_CONNECT_ROUTES.MESSAGE_SENT);
    }
  };

  const handlePostError = (graphQLError: ApolloError) => {
    if (messageSentAttempts < MAX_SEND_ATTEMPTS - 1) {
      logger.warn({ event: 'leadConnectMessageSentFailure', graphQLError });
    } else {
      logger.error({ event: 'leadConnectMessageSentFailure', graphQLError });
    }
    dispatch({
      type: 'setMessageSentAttempts',
      messageSentAttempts: messageSentAttempts + 1,
    });

    setIsWaiting(false);
  };

  const handleNoSendOrSkip = () => {
    setIsWaiting(true);
    window.location.assign(MHP_FAVORITES_PATH);
  };

  const [sendMessageToProvider, sendMessageToProviderStatus] = useMutation<
    sendMessage,
    sendMessageVariables
  >(SEND_MESSAGE_TO_PROVIDER, {
    onCompleted(response) {
      handlePostSuccess(response);
    },
    onError(graphQLError) {
      handlePostError(graphQLError);
    },
  });

  const formik = useFormik({
    initialValues: {
      message,
    },
    validationSchema: yup.object({
      message: yup
        .string()
        .max(MESSAGE_LIMIT)
        .test('Profanity Check', 'Profanity not allowed', (msg) => {
          if (msg) {
            return !filter.isProfane(msg);
          }
          return true;
        }),
    }),
    onSubmit: () => {
      setIsWaiting(true);
      // strip characters on submit when hooked up to state
      const result = stripInvalidCharacters(message);
      if (acceptedProviders) {
        const targetProviderIds =
          failedMessageSentProviderIds.length > 0
            ? failedMessageSentProviderIds
            : acceptedProviders.map((provider) => provider.memberId);
        sendMessageToProvider({
          variables: {
            input: {
              message: result,
              recipientMemberIds: targetProviderIds,
              ...(jobId ? { relatedJobId: jobId } : {}),
            },
          },
        });
      }
    },
  });

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length <= MESSAGE_LIMIT) {
      formik.setFieldValue('message', value);
      dispatch({
        type: 'setMessage',
        message: value,
      });
    }
  };

  const profanityInMessage = filter.isProfane(message);
  const errorText = profanityInMessage
    ? 'Please remove profanity before sending a message'
    : undefined;
  const skipButtonDisabled = isWaiting || sendMessageToProviderStatus.loading;
  const submitButtonDisabled = skipButtonDisabled || profanityInMessage;

  if (!acceptedProviders || acceptedProviders.length === 0) {
    window.location.assign(CZEN_BASE_PATH);
    return <OverlaySpinner isOpen wrapped />;
  }

  return (
    <>
      <div className={classes.headerWrapper}>
        <Icon80MiniCelebrationNewApplicationCelebrate className={classes.icon} />
        <Typography variant="h2" className={classes.message}>
          Thanks for upgrading!
        </Typography>
      </div>
      <LcContainer classes={{ root: classes.lcContainer }}>
        <Grid container justifyContent="center">
          <div className={classes.subheader}>
            <Typography variant="h4">
              Now, send a quick message so you can start narrowing down your options
            </Typography>
          </div>

          <div className={classes.innerContainer}>
            <div className={classes.careGivers}>
              {providers.map(({ imgSource, displayName }) => (
                <div className={classes.careGiver}>
                  <ProfileAvatar
                    alt={displayName}
                    src={imgSource}
                    size={isDesktop ? 'large' : 'medium'}
                    variant="rounded"
                    online={false}
                    data-testid="avatar"
                  />
                </div>
              ))}
            </div>
            <div className={classes.textAreaContainer}>
              <TextArea
                charCountMax={MESSAGE_LIMIT}
                maxRows={4}
                id="message"
                name="message"
                label="Send a message"
                minRows={4}
                value={formik.values.message}
                onChange={handleMessageChange}
                errorText={errorText}
              />
            </div>
            <div className={classes.tip}>
              <Icon24InfoTips className={classes.tipIcon} />
              <Typography variant="body2">
                <span className={classes.bold}>Tip:</span>
                <span>
                  &nbsp;It’s OK to keep this short. We’ll share your needs in addition to the
                  message above.
                </span>
              </Typography>
            </div>
            <div className={classes.buttonsContainer}>
              {messageSentAttempts > 0 && (
                <Typography variant="h4" className={classes.errorText} align="center">
                  <strong>An error has occurred</strong>
                </Typography>
              )}
              {messageSentAttempts < MAX_SEND_ATTEMPTS && (
                <Button
                  color={messageSentAttempts > 0 ? 'secondary' : 'primary'}
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={formik.submitForm}
                  className={classes.sendingButton}
                  disabled={submitButtonDisabled}>
                  {messageSentAttempts > 0 ? 'Try sending again' : 'Send to all'}
                </Button>
              )}
              <Button
                fullWidth
                size="large"
                className={classes.skipButton}
                disabled={skipButtonDisabled}
                onClick={handleNoSendOrSkip}>
                <span>Skip for now</span>
              </Button>
            </div>
          </div>
        </Grid>
      </LcContainer>
    </>
  );
}

UpgradeOrSkip.Layout = FullWidthLayout;
export default UpgradeOrSkip;
