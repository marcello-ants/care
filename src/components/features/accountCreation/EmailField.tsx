import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useField, useFormikContext } from 'formik';
import { debounce } from 'lodash-es';
import * as yup from 'yup';
import { InlineTextField } from '@care/react-component-lib';
import { TextFieldProps } from '@material-ui/core';
import {
  validateMemberEmail,
  validateMemberEmailVariables,
} from '@/__generated__/validateMemberEmail';
import { VALIDATE_MEMBER_EMAIL } from '@/components/request/GQL';
import { SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';

const MEMBER_EMAIL_ALREADY_REGISTERED = 'MemberEmailAlreadyRegistered';

const emailSchema = yup.string().email();

type EmailFieldProps = {
  id: string;
  name: string;
  label: string;
  czenGeneralLoginUrl: string;
  showErrorWhenTouched?: boolean;
  classes?: TextFieldProps['classes'];
};

function EmailField(props: EmailFieldProps) {
  const ref = useRef<{ email?: string; errorMessage?: string }>({});
  const { id, name, label, czenGeneralLoginUrl, showErrorWhenTouched, classes } = props;
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (ref.current.errorMessage?.startsWith(MEMBER_EMAIL_ALREADY_REGISTERED)) {
      AnalyticsHelper.logEvent({
        name: 'Email Already Registered',
      });
    }
  }, [ref.current.errorMessage]);

  const debouncedValidation = useCallback(
    debounce(async (email: string, resolve: (msg: string | void) => void) => {
      let responseError;
      try {
        const { data } = await apolloClient.query<
          validateMemberEmail,
          validateMemberEmailVariables
        >({
          query: VALIDATE_MEMBER_EMAIL,
          variables: { email },
          context: { [SKIP_AUTH_CONTEXT_KEY]: true },
        });
        responseError = data?.validateMemberEmail.errors?.[0];
      } catch (e) {
        responseError = null;
      }

      let errorMessage = responseError ? responseError.message || 'Validation Failed' : undefined;

      if (responseError?.__typename === MEMBER_EMAIL_ALREADY_REGISTERED) {
        // we want to inject a log in link into this message, but formik expects a string
        // to get around this, prefix the message with the typename so we can identify and remove it on render
        errorMessage = `${MEMBER_EMAIL_ALREADY_REGISTERED}${errorMessage}`;
      }

      resolve(errorMessage);
      ref.current = {
        email,
        errorMessage,
      };
    }, 500),
    [apolloClient]
  );

  const validate = useCallback(
    async (value: string) => {
      if (ref.current.email === value) {
        return ref.current.errorMessage;
      }

      const formatIsValid = await emailSchema.isValid(value);
      if (!formatIsValid) {
        return 'Please enter a valid email.';
      }

      return new Promise<string | void>((resolve) => {
        debouncedValidation(value, resolve);
      });
    },
    [debouncedValidation]
  );

  const [field, meta] = useField({ name, validate });
  const [isFocused, setIsFocused] = useState(false);
  const { isValidating } = useFormikContext();

  // server validation errors will be immediately shown, but client-side (schema/regex) validations show when the field is blurred
  const showError = Boolean(
    meta.error &&
      !isValidating &&
      (showErrorWhenTouched ? meta.touched : field.value) &&
      (!isFocused || emailSchema.isValidSync(field.value))
  );

  let helperText: ReactNode;
  if (showError && meta.error) {
    helperText = meta.error;
    if (meta.error.startsWith(MEMBER_EMAIL_ALREADY_REGISTERED)) {
      helperText = (
        <span>
          {meta.error.replace(MEMBER_EMAIL_ALREADY_REGISTERED, '')}{' '}
          <a href={czenGeneralLoginUrl} style={{ textDecoration: 'none' }}>
            Log in?
          </a>
        </span>
      );
    }
  }

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur(e: React.FocusEvent) {
    setIsFocused(false);
    field.onBlur(e);
  }

  return (
    <InlineTextField
      type="email"
      id={id}
      name={field.name}
      label={label}
      value={field.value}
      error={showError}
      helperText={helperText}
      onChange={field.onChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      classes={classes}
    />
  );
}

EmailField.defaultProps = {
  showErrorWhenTouched: false,
  classes: undefined,
};

export default EmailField;
