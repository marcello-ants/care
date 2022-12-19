import React from 'react';
import { useRouter } from 'next/router';
import { fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { MockedProvider } from '@apollo/client/testing';
import { theme } from '@care/material-ui-theme';

import PhotoPage from '@/pages/provider/cc/photo';
import { SIGNED_URL_CREATE, PROVIDER_PHOTO_SET } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';

import { initialAppState } from '@/state';
import { CLIENT_FEATURE_FLAGS, PROVIDER_CHILD_CARE_ROUTES } from '@/constants';
import { cloneDeep } from 'lodash-es';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

describe('PhotoPage', () => {
  let mockRouter: any | null = null;

  const thumbnailUrl = 'testthumbnailUrl';
  const signedUrl = `//mediaUrl/key/path?params=test`;
  const signature = 'hashSignatureTestHash';
  const etag = 'etaghash';

  const setup = (withFreeGated: boolean = false) => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/cc/photo',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mocks = [
      {
        request: {
          query: SIGNED_URL_CREATE,
          variables: {
            input: {
              fileName: 'chucknorris.png',
            },
          },
        },
        result: {
          signedUrlCreate: {
            __typename: 'SignedUrlCreateResult',
            signature,
            url: signedUrl,
          },
        },
      },
      {
        request: {
          query: PROVIDER_PHOTO_SET,
          variables: {
            input: {
              url: signedUrl,
              signature,
              etag,
            },
          },
        },
        result: {
          data: {
            providerPhotoSet: {
              __typename: 'ProviderPhotoSetSuccess',
              url: signedUrl,
              thumbnailUrl,
            },
          },
        },
      },
    ];

    const featureFlagsMockTrue = {
      [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
        value: withFreeGated,
        reason: {
          kind: 'FALLTHROUGH',
        },
      },
    };

    const initialStateOverrideFreeGated = {
      ...initialStateClone,
      providerCC: {
        ...initialStateClone.providerCC,
        freeGated: true,
      },
    };

    return render(
      <ThemeProvider theme={theme}>
        <AppStateProvider
          initialStateOverride={withFreeGated ? initialStateOverrideFreeGated : initialAppState}>
          <MockedProvider mocks={mocks} addTypename>
            <FeatureFlagsProvider flags={featureFlagsMockTrue}>
              <PhotoPage />
            </FeatureFlagsProvider>
          </MockedProvider>
        </AppStateProvider>
      </ThemeProvider>
    );
  };

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('should match snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should redirect to app download page when free gated ld flag and context value is true', () => {
    setup(true);

    fireEvent.click(screen.getByText('Skip for now'));

    expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.APP_DOWNLOAD);
  });

  it('should redirect to jobs matching page when free gated ld flag and context value is false', () => {
    setup();

    fireEvent.click(screen.getByText('Skip for now'));

    expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_CHILD_CARE_ROUTES.JOBS_MATCHING);
  });
});
