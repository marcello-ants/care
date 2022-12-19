import { ApolloError, useMutation } from '@apollo/client';
import logger from '@/lib/clientLogger';
import { facebookConnect } from '@/__generated__/facebookConnect';
import { FacebookConnectInput } from '@/__generated__/globalTypes';
import { FACEBOOK_CONNECT } from '@/components/request/GQL';
import get from 'lodash-es/get';
import { useFlowState } from '@/components/AppState';

function onFacebookConnectError(graphQLError: ApolloError) {
  logger.error({
    event: 'facebookConnectError',
    graphQLError: graphQLError?.message,
  });
}

export default function useFacebookConnection() {
  const flowData = useFlowState();
  const accessToken = get(flowData, 'facebookData.accessToken', null);

  const [facebookConnectMutation] = useMutation<facebookConnect, { input: FacebookConnectInput }>(
    FACEBOOK_CONNECT,
    {
      onError: onFacebookConnectError,
    }
  );

  const connectToFacebook = (authToken: string) => {
    if (accessToken && authToken) {
      facebookConnectMutation({ variables: { input: { accessToken } } });
    }
  };

  return {
    connectToFacebook,
  };
}
