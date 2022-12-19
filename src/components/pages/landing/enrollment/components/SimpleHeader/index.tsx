// External Dependencies
import { Link } from '@care/react-component-lib';
import Button from '@material-ui/core/Button';
import { IconCareLogo } from '@care/react-icons';

// Styles
import useStyles from './styles';

export default function SimpleHeader() {
  // Styles
  const classes = useStyles();
  const headerClasses = classes.header;

  return (
    <>
      <header className={headerClasses}>
        <div className={classes.headerContent}>
          <div>
            <IconCareLogo width="120px" height="32px" />
          </div>
          <div>
            <>
              <div className={classes.loginDesktop}>
                <Link careVariant="body3" href="https://www.care.com/app/vhp/get-started">
                  Looking for a caregiver?
                </Link>
                <Button
                  color="secondary"
                  variant="outlined"
                  size="small"
                  className={classes.loginLink}
                  href="https://www.care.com/login">
                  Member login
                </Button>
              </div>
              <div className={classes.loginMobile}>
                <Link careVariant="body3" href="https://www.care.com/login">
                  Login
                </Link>
              </div>
            </>
          </div>
        </div>
      </header>
    </>
  );
}
