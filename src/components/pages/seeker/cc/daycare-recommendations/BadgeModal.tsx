import { Badge, Modal } from '@care/react-component-lib';
import { Box, Button, makeStyles, Tooltip, useMediaQuery, useTheme } from '@material-ui/core';
import { ReactFragment, ReactNode, useCallback, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  badge: {
    cursor: 'pointer',
    color: theme.palette.text.primary,
    padding: theme.spacing(0, 0.75),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    border: 'none',
    '& .MuiTypography-root': {
      fontWeight: 700,
    },
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(-1),
  },
}));

interface BadgeModalProps {
  title?: string;
  icon?: ReactNode;
  bgColor?: string;
  children?: ReactFragment;
  disabled?: boolean;
}

// util component that renders a clickable badge which shows a tooltip on hover(desktop) or modal on mobile
const BadgeModal = ({ title, bgColor, icon, children, disabled }: BadgeModalProps) => {
  const theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showDialog, setShowDialog] = useState(false);

  const handleModal = useCallback(() => {
    if (!disabled) setShowDialog(!showDialog);
  }, [showDialog, disabled]);

  if (isMobile)
    return (
      <Box onClick={handleModal}>
        <Badge className={classes.badge} icon={icon} bgColor={bgColor} text={title} />
        <Modal onClose={handleModal} open={showDialog} title={title}>
          {children}
          <Button
            className={classes.button}
            color="secondary"
            variant="contained"
            onClick={handleModal}>
            Got it
          </Button>
        </Modal>
      </Box>
    );
  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      role="tooltip"
      aria-label={`${title}`}
      title={children ?? false}
      placement="top"
      disableFocusListener={disabled}
      disableHoverListener={disabled}
      interactive
      arrow>
      <Badge className={classes.badge} icon={icon} bgColor={bgColor} text={title} />
    </Tooltip>
  );
};

BadgeModal.defaultProps = {
  title: '',
  icon: undefined,
  bgColor: undefined,
  children: null,
  disabled: false,
};

export default BadgeModal;
