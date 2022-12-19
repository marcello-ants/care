/* istanbul ignore next */
import { useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { ApolloError } from '@apollo/client/errors';
import { Button, Grid, List, ListItemText, Link } from '@material-ui/core';
import { Typography, Modal } from '@care/react-component-lib';
import { makeStyles } from '@material-ui/core/styles';
import logger from '@/lib/clientLogger';
import OverlaySpinner from '@/components/OverlaySpinner';
import Header from '@/components/Header';
import PhotoUpload from '@/components/features/photoUpload/photoUpload';
import { SIGNED_URL_CREATE, PROVIDER_PHOTO_SET } from '@/components/request/GQL';
import useEnterKey from '@/components/hooks/useEnterKey';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { captureException } from '@sentry/nextjs';
import FixElementToBottom from '@/components/FixElementToBottom';
import { CLIENT_SIDE_ERROR_TAG } from '@/constants';
import { providerPhotoSet, providerPhotoSetVariables } from '@/__generated__/providerPhotoSet';
import { signedUrlCreate, signedUrlCreateVariables } from '@/__generated__/signedUrlCreate';

const recommendations = [
  { title: 'Look professional', description: "show you're a pro" },
  { title: 'Show your face', description: 'no sunglasses, hat, etc.' },
  { title: "It's just you", description: 'no other people in the photo' },
  { title: 'No frames or filters', description: 'just be real' },
];

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: '0 auto',
  },
  recommendationTitle: {
    fontWeight: 'bold',
  },
  distanceInputContainer: {
    padding: theme.spacing(2, 0),
    // a workaround needed until the DNA-1168 is done
    '& > div': {
      padding: 0,
      maxWidth: '100%',
    },
  },

  bulletPointList: {
    listStyleType: 'disc',
    marginTop: theme.spacing(2),
  },
  bulletPointItem: {
    marginLeft: theme.spacing(2),
    minHeight: theme.spacing(4),
    display: 'list-item',
    paddingBottom: '0 !important',
  },
  note: {
    marginTop: theme.spacing(3),
  },
  skipLink: {
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: theme.spacing(3),
    display: 'block',
  },
  tryAnotherPhotoButton: {
    width: '192px',
  },
  photoExampleContainer: {
    maxWidth: 328,
    margin: '0 auto',
    padding: theme.spacing(2),
    background: theme.palette.care.grey[100],
    borderRadius: theme.spacing(1.5),
  },
  photoExampleHeader: {
    marginBottom: 10,
    '&:not(:first-child)': {
      marginTop: theme.spacing(2.25),
    },
  },
  photoExampleText: {
    marginTop: theme.spacing(0.5),
  },
}));

export interface PhotoProps {
  header: string;
  note?: string;
  nextRoute: string;
  onImageUpdate: (url: string, thumbnailUrl: string) => void;
  thumbnail?: string;
  isFreeGated?: boolean;
  eventPrefix: string;
}

function Photo({
  header,
  note,
  nextRoute,
  onImageUpdate,
  thumbnail,
  isFreeGated,
  eventPrefix,
}: PhotoProps) {
  const classes = useStyles();
  const router = useRouter();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // TODO: remove or modify once https://carecom.atlassian.net/browse/SC-1322 will be done
  const imgLoader = ({ src }: { src: string }) => {
    return src;
  };

  const sendAnalytics = (ctaClicked: string) => {
    AnalyticsHelper.logEvent({
      name: 'Member Enrolled',
      data: {
        enrollment_flow: 'MW VHP Provider Enrollment',
        enrollment_step: 'provider_photo_upload',
        cta_clicked: ctaClicked,
      },
    });
  };

  const handlePhotoUploadError = (graphQLError: ApolloError) => {
    const errorMessage = graphQLError?.message;
    logger.error({
      event: `${eventPrefix}PhotoUploadError`,
      graphQLError: errorMessage,
    });
    setErrorFeedback(errorMessage);
    setShowErrorModal(true);
  };

  const handleFetchPhotoUploadError = (error: Error) => {
    const errorMessage = error?.message;
    logger.error({
      event: `${eventPrefix}FetchPhotoUploadError`,
      fetchError: errorMessage,
    });
    setErrorFeedback(errorMessage);
    setShowErrorModal(true);
  };

  const handleProviderPhotoSetSuccess = (response: providerPhotoSet) => {
    if (response?.providerPhotoSet?.__typename === 'ProviderPhotoSetSuccess') {
      const { url, thumbnailUrl } = response.providerPhotoSet;
      onImageUpdate(url, thumbnailUrl);
      sendAnalytics('Upload');
      router.push(nextRoute);
    } else {
      const {
        errors: [error],
      } = response.providerPhotoSet;
      const errorMessage = error?.message ?? '';

      logger.error({
        event: `${eventPrefix}PhotoUploadError`,
        graphQLError: errorMessage,
      });
      setErrorFeedback(errorMessage);
      setShowErrorModal(true);
    }
  };

  const [providerPhotoSetMutation, { loading: providerPhotoSetLoading }] = useMutation<
    providerPhotoSet,
    providerPhotoSetVariables
  >(PROVIDER_PHOTO_SET, {
    onCompleted(response) {
      handleProviderPhotoSetSuccess(response);
    },
    onError(graphQLError) {
      handlePhotoUploadError(graphQLError);
    },
  });

  const handlePhotoUploadUrlCreateSuccess = (response: signedUrlCreate) => {
    // Ensure that this URL creation result was successful
    if (response?.signedUrlCreate?.__typename === 'SignedUrlCreateResult') {
      const { url, signature } = response.signedUrlCreate;

      if (fileToUpload) {
        // Upload the image
        fetch(url, {
          method: 'PUT',
          cache: 'no-cache',
          headers: {
            'Content-Type': fileToUpload.type,
          },
          body: fileToUpload,
        })
          .then(async (fetchResponse: Response) => {
            // Ensure that the upload of successful
            if (!fetchResponse.ok) {
              throw new Error(`Unable to upload file: ${fetchResponse.statusText}`);
            }

            // Required field
            const etag = fetchResponse.headers.get('ETag');

            if (!etag) {
              throw new Error('Upload failed, missing ETag');
            } else {
              // Need to await this so that the onComplete/onError are ran
              await providerPhotoSetMutation({
                variables: {
                  input: {
                    url,
                    signature,
                    etag,
                  },
                },
              });
            }
          })
          .catch((err) => {
            handleFetchPhotoUploadError(new Error(err));
          });
      }
    } else {
      // No errors are being added from the GraphQL call so setting a generic one
      const errMsg = 'Photo Upload Error';
      logger.error({
        event: `${eventPrefix}PhotoUploadError`,
        graphQLError: errMsg,
      });
      setErrorFeedback(errMsg);
      setShowErrorModal(true);
    }
  };

  const [signedUrlCreateMutation, { loading: signedUrlCreateLoading }] = useMutation<
    signedUrlCreate,
    signedUrlCreateVariables
  >(SIGNED_URL_CREATE, {
    onCompleted(response) {
      handlePhotoUploadUrlCreateSuccess(response);
    },
    onError(graphQLError) {
      handlePhotoUploadError(graphQLError);
    },
  });

  const handleSubmit = () => {
    if (!fileToUpload) {
      setErrorFeedback('File missing');
    } else {
      setErrorFeedback('');
      signedUrlCreateMutation({
        variables: {
          input: {
            fileName: fileToUpload.name,
          },
        },
      });
    }
  };

  const onPhotoDelete = () => {
    setFileToUpload(null);
    onImageUpdate('', '');
  };

  const handleCloseErrorModal = () => {
    onPhotoDelete();
    setShowErrorModal(false);
  };

  const handleRetrySubmit = () => {
    if (errorFeedback) {
      handleCloseErrorModal();
    } else {
      setShowErrorModal(false);
      setTimeout(() => {
        handleSubmit();
      }, 150);
    }
  };

  const skip = () => {
    sendAnalytics('Skip for now');
    router.push(nextRoute);
  };

  const onCropError = (error: Error) => {
    logger.error({ error, tags: [CLIENT_SIDE_ERROR_TAG] });
    /* istanbul ignore next */
    captureException(error);
  };

  useEnterKey(true, handleSubmit);

  return (
    <Grid container className={classes.gridContainer}>
      {(signedUrlCreateLoading || providerPhotoSetLoading) && <OverlaySpinner isOpen wrapped />}
      <Grid item xs={12}>
        <Header>{header}</Header>
      </Grid>
      <Grid item xs={12}>
        <PhotoUpload
          photoURLOnState={thumbnail}
          deleteTrigger={onPhotoDelete}
          fileToUploadExists={Boolean(fileToUpload)}
          setFileToUpload={setFileToUpload}
          onCropError={onCropError}
          acceptedFormats=".jpg,.jpeg,.png"
        />
      </Grid>
      {isFreeGated ? (
        <Grid item xs={12} className={classes.photoExampleContainer}>
          <Typography variant="h4" className={classes.photoExampleHeader} {...{ component: 'p' }}>
            Good photo examples:
          </Typography>
          <Image
            loader={imgLoader}
            src="/app/enrollment/cc/good_photo_example.png"
            alt="good examples"
            width={264}
            height={77}
            priority
          />
          <Typography variant="h4" className={classes.photoExampleHeader} {...{ component: 'p' }}>
            Photos that are not permitted:
          </Typography>
          <Image
            loader={imgLoader}
            src="/app/enrollment/cc/bad_photo_example.png"
            alt="bad examples"
            width={264}
            height={77}
            priority
          />
          <Typography careVariant="body3" className={classes.photoExampleText}>
            No collages, filters, sunglasses, phone or mask obscuring face, or distance photos
            allowed.
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography variant="h4">For the fastest approval time, be sure to:</Typography>
            <List className={classes.bulletPointList}>
              {recommendations.map((recommendation) => (
                <ListItemText key={recommendation.title} className={classes.bulletPointItem}>
                  <Typography variant="body2">
                    <span className={classes.recommendationTitle}>{recommendation.title}</span>
                    <span>&nbsp;-</span> {recommendation.description}
                  </Typography>
                </ListItemText>
              ))}
            </List>
          </Grid>
          {note && (
            <Grid item xs={12} className={classes.note}>
              <Typography careVariant="body3" color="secondary">
                {note}
              </Typography>
            </Grid>
          )}
        </>
      )}
      <FixElementToBottom>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={!fileToUpload}
          onClick={() => {
            handleSubmit();
          }}>
          Upload
        </Button>
      </FixElementToBottom>
      <Grid item xs={12}>
        <Link variant="body2" onClick={skip} className={classes.skipLink}>
          Skip for now
        </Link>
      </Grid>
      <Modal
        open={showErrorModal}
        title="Photo upload failed"
        ButtonPrimary={
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              handleRetrySubmit();
            }}
            className={clsx({ [classes.tryAnotherPhotoButton]: errorFeedback })}>
            {errorFeedback ? 'Try another photo' : 'Retry'}
          </Button>
        }
        Link={
          <>
            {!errorFeedback && (
              <Button onClick={handleCloseErrorModal}>
                <Typography variant="body2">Cancel</Typography>
              </Button>
            )}
          </>
        }
        onClose={handleCloseErrorModal}>
        {errorFeedback}
      </Modal>
    </Grid>
  );
}

export default Photo;
