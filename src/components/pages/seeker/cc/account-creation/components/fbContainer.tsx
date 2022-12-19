import { Box, makeStyles, Grid, Button } from '@material-ui/core';
import { useFacebookApiKey } from '@/components/FacebookApiKeyContext';

// @ts-ignore
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { Icon48SocialMediaFacebook } from '@care/react-icons';

export type facebookResponseProps = {
  accessToken: string;
  // eslint-disable-next-line
  data_access_expiration_time?: number;
  email: string;
  expiresIn?: number;
  graphDomain?: string;
  id?: string;
  name: string;
  signedRequest?: string;
  userID?: string;
};

export interface SplitFormValues {
  email: string;
}

export interface SplitFormWithFbData extends SplitFormValues {
  firstName?: string;
  lastName?: string;
  accessToken?: string;
}

const mobileWidth = 360;
const fbColor = '#1877F2';
const fbIconSize = '35px';
const useStyles = (fbEmphasizedDesign: boolean) =>
  makeStyles((theme) => ({
    fbButton: {
      paddingTop: theme.spacing(5),
      borderColor: fbEmphasizedDesign ? fbColor : theme.palette.default?.dark,
      background: fbEmphasizedDesign ? fbColor : theme.palette.care?.white,
      color: fbEmphasizedDesign ? theme.palette.care?.white : theme.palette.default?.dark,
      fontSize: fbEmphasizedDesign ? '21px' : '18px',
      '&:hover': {
        background: fbEmphasizedDesign ? fbColor : theme.palette.care?.white,
      },
    },
    fbButtonContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      [theme.breakpoints.down(mobileWidth)]: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    fbIconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fbIconSize,
      '& svg': {
        width: fbIconSize,
        height: fbIconSize,
      },
    },
    fbIcon: {
      background: '#1a77f2',
      borderRadius: '19px',
    },
    fbButtonText: {
      justifySelf: 'center',
      marginLeft: '10px',
      marginRight: '5px',
      fontColor: theme.palette.care?.white,
    },
  }));

type GetFbContainerProps = {
  handleFacebookLogin: (response: facebookResponseProps) => Promise<void>;
  fbButtonOnTop: boolean;
  fbButtonOnBottom: boolean;
};

const getFbContainer = ({
  handleFacebookLogin,
  fbButtonOnTop,
  fbButtonOnBottom,
}: GetFbContainerProps) => {
  const fbEmphasizedDesign = fbButtonOnBottom || fbButtonOnTop;
  const classes = useStyles(fbEmphasizedDesign)();
  const { apiKey } = useFacebookApiKey();

  return (
    <Grid item xs={12}>
      <Box pt={fbButtonOnTop ? 0 : 2}>
        <FacebookLogin
          appId={apiKey}
          autoLoad={false}
          fields="name,email"
          callback={handleFacebookLogin}
          render={(renderProps: any) => (
            <Button
              onClick={renderProps.onClick}
              className={classes.fbButton}
              variant="outlined"
              size="large"
              fullWidth>
              <div className={classes.fbButtonContent}>
                <div className={classes.fbIconContainer}>
                  <Icon48SocialMediaFacebook size="38px" color="white" className={classes.fbIcon} />
                </div>
                <p className={classes.fbButtonText}>Continue with Facebook</p>
              </div>
            </Button>
          )}
        />
      </Box>
    </Grid>
  );
};

export default getFbContainer;
