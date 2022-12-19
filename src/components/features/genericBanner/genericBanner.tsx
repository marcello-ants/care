// External Dependencies
import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Types
type MessageData = {
  children: ReactElement;
  messageText: string;
  data?: number;
};

// Default properties for optional values
const defaultProps = {
  data: 0,
};

// Styles
const useStyles = makeStyles((theme) => ({
  caregiversNearYouBanner: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.care?.grey[200]}`,
  },
  message: {
    marginLeft: theme.spacing(2),
  },
  placeholder: {
    color: theme.palette.care?.green[800],
  },
}));

// Utilities Functions

/**
 * Replace occurences of a token in a string.
 *
 * Replaced tokens are converted into a <span> tag with "placeholder" class.
 *
 * @param messageText {string} - Text of the message.
 * @param token {string} - Token to replace. Default value "{data}".
 * @param tokenValue {string} - Value that will replace the token.
 * @param classes {any} - Styles {message} will style the container, {placeholder} will style the replaced text.
 */
function replaceText(
  messageText: string,
  token: string = '{data}',
  classes: any,
  tokenValue?: number | undefined
): ReactElement {
  // Message text doesn't contain any token.
  if (messageText.indexOf(token) === -1) {
    return (
      <Typography variant="body2" className={classes.message}>
        {messageText}
      </Typography>
    );
  }

  // Replace tokens in message text.
  const strings = messageText.split(token);
  const replacements = strings.length - 1;
  return (
    <Typography variant="body2" className={classes.message}>
      {strings.map((text, index) => {
        if (index < replacements) {
          return (
            <React.Fragment key={index.toString()}>
              {text}
              <span className={classes.placeholder}>{tokenValue}</span>
            </React.Fragment>
          );
        }

        return <React.Fragment key={index.toString()}>{text}</React.Fragment>;
      })}
    </Typography>
  );
}

/**
 * Generic Banner to display an icon and a message.
 *
 * @param props {MessageData} - Properties for the component to render.
 */
function GenericBanner(props: MessageData) {
  const classes = useStyles();
  const { children, messageText, data } = props;
  const parsedMessageText = replaceText(messageText, undefined, classes, data);

  return (
    <>
      <div className={classes.caregiversNearYouBanner}>
        {children}
        {parsedMessageText}
      </div>
    </>
  );
}

GenericBanner.defaultProps = defaultProps;

export default GenericBanner;
