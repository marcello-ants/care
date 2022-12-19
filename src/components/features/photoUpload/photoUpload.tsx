import { ChangeEvent, useEffect, useState, useCallback, createRef } from 'react';
import clsx from 'clsx';
import Cropper from 'react-easy-crop';
import PropTypes, { InferProps } from 'prop-types';
import { Grid, Slider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Modal } from '@care/react-component-lib';
import { Icon104SelfieTime, Icon24UtilityRotate } from '@care/react-icons';

import { getCroppedImg, optimizePhoto, blobToFile } from './photoUtilities';

const useStyles = makeStyles((theme) => ({
  cropperContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginTop: theme.spacing(2),
  },
  simpleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  buttonSpacing: {
    padding: theme.spacing(0, 3),
    color: theme.palette?.care?.blue[700],
  },
  changeBtnsContainer: {
    margin: theme.spacing(1, 0, 2),
    '& .MuiTypography-root': {
      fontWeight: 'bold',
    },
  },
  rotateIconContainer: {
    paddingTop: theme.spacing(3),
  },
  zoomContainer: {
    width: '200px',
  },
  slider: {
    padding: theme.spacing(2, 0),
    margin: 0,
    width: '100%',
  },
  croppedImage: {
    width: '146px',
    height: '146px',
    overflow: 'hidden',
    borderRadius: '16px',
    marginTop: theme.spacing(3),
  },
  addPhotoContainer: {
    paddingLeft: theme.spacing(2),
  },
  tapText: {
    marginBottom: theme.spacing(4),
  },
  // TODO:// temporary fix should be removed once icon is available in care-library
  addCircle: {
    '& g g:nth-child(3) g': {
      fill: theme?.palette?.care?.navy[600],
    },
  },
}));

const INITIAL_ROTATION = 0;
const INITIAL_ZOOM = 1;

function PhotoUpload(props: InferProps<typeof PhotoUpload.propTypes>) {
  const {
    setFileToUpload,
    deleteTrigger,
    onCropError,
    acceptedFormats,
    photoURLOnState,
    fileToUploadExists,
  } = props;

  const fileInputRef = createRef<HTMLInputElement>();

  const classes = useStyles();
  const [picture, setPicture] = useState('');
  const [pictureFile, setPictureFile] = useState<File | undefined>();
  const [croppedPicture, setCroppedPicture] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [rotation, setRotation] = useState(INITIAL_ROTATION);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [showModal, setShowModal] = useState(false);
  const [cspNonce, setCspNonce] = useState<string | undefined>();

  const handleModalDisplay = () => {
    setShowModal((value) => !value);
  };

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (files?.length) {
      setPictureFile(files[0]);
      const optimizedPicture = await optimizePhoto(files[0]);
      setPicture(URL.createObjectURL(optimizedPicture));
      setRotation(INITIAL_ROTATION);
      setZoom(INITIAL_ZOOM);
      handleModalDisplay();
    }
  };

  const handleOnClose = () => {
    setPicture('');
    setPictureFile(undefined);
    handleModalDisplay();
  };

  const handleOnDelete = () => {
    setCroppedPicture('');
    setPicture('');
    deleteTrigger();
  };

  const onCropComplete = useCallback((croppedArea, newCroppedAreaPixels) => {
    setCroppedAreaPixels(newCroppedAreaPixels);
  }, []);

  const showCroppedPicture = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(picture, croppedAreaPixels, rotation);
      setCroppedPicture(URL.createObjectURL(croppedImage));
      if (pictureFile) {
        setFileToUpload(blobToFile(croppedImage, pictureFile.name));
      }
    } catch (e) {
      onCropError(e);
    }
    handleModalDisplay();
  }, [picture, croppedAreaPixels, rotation]);

  const showSelectFileWindow = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef?.current?.click();
    }
  };

  useEffect(() => {
    if (!fileToUploadExists) {
      setCroppedPicture('');
      setPicture('');
    }
  }, [fileToUploadExists]);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      await import('blueimp-canvas-to-blob');
    })();
  }, []);

  useEffect(() => {
    if (photoURLOnState) {
      setCroppedPicture(photoURLOnState);
    } else {
      setCroppedPicture('');
      setPicture('');
    }
  }, []);

  useEffect(() => {
    const node = document.querySelector('meta[property="csp-nonce"]');
    if (node) {
      setCspNonce(node.getAttribute('content') || undefined);
    }
  }, []);

  return (
    <>
      <Grid container direction="column" alignItems="center">
        <input
          accept={acceptedFormats}
          type="file"
          hidden
          required
          onChange={handleOnChange}
          key={pictureFile?.name || ''}
          ref={fileInputRef}
          data-testid="photo-hidden-input"
        />
        {!croppedPicture && (
          <Grid item className={classes.addPhotoContainer}>
            <button type="button" className={classes.simpleBtn} onClick={showSelectFileWindow}>
              <Icon104SelfieTime size="170px" className={classes.addCircle} />
            </button>
          </Grid>
        )}
      </Grid>
      {croppedPicture ? (
        <div>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <img className={classes.croppedImage} src={croppedPicture} alt="cropped" />
            </Grid>
            <Grid
              className={classes.changeBtnsContainer}
              item
              container
              justifyContent="center"
              alignItems="center">
              <Grid item>
                <button
                  type="button"
                  className={clsx(classes.simpleBtn, classes.buttonSpacing)}
                  onClick={showSelectFileWindow}>
                  <Typography careVariant="link3">Change</Typography>
                </button>
              </Grid>
              <Grid item>
                <Typography careVariant="link3">|</Typography>
              </Grid>
              <Grid item>
                <button
                  type="button"
                  className={clsx(classes.simpleBtn, classes.buttonSpacing)}
                  onClick={() => {
                    handleOnDelete();
                  }}>
                  <Typography careVariant="link3">Delete</Typography>
                </button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Typography variant="h4" className={classes.tapText} align="center">
          Tap to add a photo
        </Typography>
      )}
      <Modal
        open={showModal}
        variant="dynamic"
        title="Position and size your photo"
        ButtonPrimary={
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              showCroppedPicture();
            }}>
            Apply
          </Button>
        }
        Link={
          <Button onClick={handleOnClose}>
            <Typography variant="body2">Cancel</Typography>
          </Button>
        }
        onClose={handleOnClose}>
        <Grid container direction="column" alignItems="center">
          {picture && (
            <Grid item className={classes.cropperContainer}>
              <Cropper
                image={picture}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
                nonce={cspNonce}
              />
            </Grid>
          )}
          <Grid item className={classes.rotateIconContainer}>
            <button
              data-testid="rotate-button"
              className={classes.simpleBtn}
              type="button"
              onClick={() => setRotation(rotation - 90)}>
              <Icon24UtilityRotate size="24px" />
            </button>
          </Grid>
          <Grid item className={classes.zoomContainer}>
            <Slider
              data-testid="zoom-slider"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, newZoom) => {
                if (!Array.isArray(newZoom)) {
                  setZoom(newZoom);
                }
              }}
              className={classes.slider}
            />
          </Grid>
        </Grid>
      </Modal>
    </>
  );
}

PhotoUpload.propTypes = {
  setFileToUpload: PropTypes.func.isRequired,
  deleteTrigger: PropTypes.func.isRequired,
  onCropError: PropTypes.func.isRequired,
  acceptedFormats: PropTypes.string.isRequired,
  photoURLOnState: PropTypes.string,
  fileToUploadExists: PropTypes.bool,
};

PhotoUpload.defaultProps = {
  photoURLOnState: '',
  fileToUploadExists: false,
};

export default PhotoUpload;
