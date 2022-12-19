import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { useRouter } from 'next/router';
import { theme } from '@care/material-ui-theme';
import { MockedProvider } from '@apollo/client/testing';
import { SIGNED_URL_CREATE, PROVIDER_PHOTO_SET } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import PhotoPage from '@/pages/provider/sc/photo';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('PhotoPage', () => {
  let mockRouter: any | null = null;

  const thumbnailUrl = 'testthumbnailUrl';
  const signedUrl = `//mediaUrl/key/path?params=test`;
  const signature = 'hashSignatureTestHash';
  const etag = 'etaghash';

  const setup = () => {
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

    return render(
      <ThemeProvider theme={theme}>
        <AppStateProvider initialStateOverride={initialAppState}>
          <MockedProvider mocks={mocks} addTypename>
            <PhotoPage />
          </MockedProvider>
        </AppStateProvider>
      </ThemeProvider>
    );
  };

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });
});
