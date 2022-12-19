import React from 'react';
import { render, screen, RenderResult, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import { useRouter } from 'next/router';
import { theme } from '@care/material-ui-theme';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { SIGNED_URL_CREATE, PROVIDER_PHOTO_SET } from '@/components/request/GQL';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import logger from '@/lib/clientLogger';
import PhotoPage, { PhotoProps } from '@/components/pages/provider/sc/photo/photo';
import {
  getCroppedImg,
  optimizePhoto,
  blobToFile,
} from '@/components/features/photoUpload/photoUtilities';
import { GraphQLError } from 'graphql';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

jest.mock('@/components/features/photoUpload/photoUtilities', () => ({
  optimizePhoto: jest.fn(),
  getCroppedImg: jest.fn(),
  blobToFile: jest.fn(),
}));

jest.mock('@/lib/clientLogger');

describe('PhotoPage', () => {
  let renderResult: RenderResult;
  let mockRouter: any | null = null;

  const thumbnailUrl = 'testthumbnailUrl';
  const MockFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/jpg' });
  const MockBlob = new Blob([''], { type: 'image/jpg' });
  const originalFetch = global.fetch;
  const signedUrl = `//mediaUrl/key/path?params=test`;
  const signature = 'hashSignatureTestHash';
  const etag = 'etaghash';
  const signedCreateMutationCallMock = jest.fn();

  const signedUrlCreateMocks = {
    request: {
      query: SIGNED_URL_CREATE,
      variables: {
        input: {
          fileName: 'chucknorris.png',
        },
      },
    },
    result: () => {
      signedCreateMutationCallMock();
      return {
        data: {
          signedUrlCreate: {
            __typename: 'SignedUrlCreateResult',
            signature,
            url: signedUrl,
          },
        },
      };
    },
  };

  const signedUrlCreateErrorMocks = {
    request: {
      query: SIGNED_URL_CREATE,
      variables: {
        input: {
          fileName: 'chucknorris.png',
        },
      },
    },
    result: () => {
      signedCreateMutationCallMock();
      return {
        errors: [new GraphQLError('really bad error')],
        data: {},
      };
    },
  };

  const signedUrlCreateWrongTypenameMocks = {
    request: {
      query: SIGNED_URL_CREATE,
      variables: {
        input: {
          fileName: 'chucknorris.png',
        },
      },
    },
    result: () => {
      signedCreateMutationCallMock();
      return {
        data: {
          bogus: {
            __typename: 'bogusResult',
          },
        },
      };
    },
  };

  const providerPhotoSetMocks = {
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
  };

  const providerPhotoSetErrorMocks = {
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
      errors: [new GraphQLError('really bad error')],
      data: {},
    },
  };

  const providerPhotoSetMutationErrorMocks = {
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
          __typename: 'ProviderPhotoSetError',
          errors: [{ message: 'file is blurry' }],
        },
      },
    },
  };

  const mocks = [signedUrlCreateMocks, providerPhotoSetMocks];

  const renderComponent = async ({
    header,
    note,
    nextRoute,
    onImageUpdate,
    thumbnail,
    eventPrefix,
    newMocks,
  }: PhotoProps & {
    newMocks?: MockedResponse<Record<string, any>>[];
  }) => {
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      pathname: '/provider/cc/photo',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    renderResult = render(
      <ThemeProvider theme={theme}>
        <AppStateProvider initialStateOverride={initialAppState}>
          <MockedProvider mocks={newMocks || mocks} addTypename>
            <PhotoPage
              header={header}
              note={note}
              nextRoute={nextRoute}
              onImageUpdate={onImageUpdate}
              thumbnail={thumbnail}
              eventPrefix={eventPrefix}
            />
          </MockedProvider>
        </AppStateProvider>
      </ThemeProvider>
    );
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
    window.URL.createObjectURL = jest.fn();
    (window.URL.createObjectURL as jest.Mock).mockReturnValue('imageURL');

    (optimizePhoto as jest.Mock).mockReturnValue(MockBlob);
    (getCroppedImg as jest.Mock).mockReturnValue(MockBlob);
    (blobToFile as jest.Mock).mockReturnValue(MockFile);
  });

  afterEach(() => {
    // cleanup on exiting
    jest.clearAllMocks();
    mockRouter = null;
    global.fetch = originalFetch;
  });

  const uploadImage = async () => {
    const input = screen.getByTestId('photo-hidden-input') as HTMLInputElement;

    userEvent.upload(input, MockFile);
    expect(await screen.findByText('Position and size your photo')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('rotate-button'));
    const sliderInput = screen.getByTestId('zoom-slider');

    sliderInput.getBoundingClientRect = jest.fn(() => {
      return {
        bottom: 286.22918701171875,
        height: 28,
        left: 19.572917938232422,
        right: 583.0937919616699,
        top: 258.22918701171875,
        width: 563.5208740234375,
        x: 19.572917938232422,
        y: 258.22918701171875,
      };
    }) as jest.Mock;

    fireEvent.mouseDown(sliderInput, { clientX: 162, clientY: 302 });
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
  };

  it('matches snapshot', async () => {
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: 'link',
      eventPrefix: 'name',
      onImageUpdate: () => {},
    });
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('should enable submit button if image exists', async () => {
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: 'link',
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: 'image',
    });
    await act(uploadImage);
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));
    const nextButton = screen.getByText('Upload');

    await waitFor(() => expect(nextButton).toBeEnabled());
  });

  it('should redirect to the right page on for *skip* link', async () => {
    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: 'image',
    });
    const skipLink = screen.getByText('Skip for now');
    skipLink.click();

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(redirectTo));
  });

  it('should redirect to the right page on for submit button', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(etag),
        },
      })
    ) as jest.Mock;

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(signedUrl, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
          'Content-Type': MockFile.type,
        },
        body: MockFile,
      });
    });

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(redirectTo));
  });

  it('should be able to delete the photo', async () => {
    const onImageUpdate = jest.fn();
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: 'link',
      eventPrefix: 'name',
      onImageUpdate,
      thumbnail: 'image',
    });

    await act(uploadImage);
    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    expect(await screen.findByText('Delete')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Delete'));
    expect(onImageUpdate).toHaveBeenCalledWith('', '');
  });

  it('should display file upload error from missing/wrong response', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
      newMocks: [signedUrlCreateWrongTypenameMocks],
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith({
        event: 'namePhotoUploadError',
        graphQLError: 'Photo Upload Error',
      });
    });
    expect(screen.getByText('Photo upload failed')).toBeInTheDocument();
  });

  it('should display file upload error from createSignedUrl', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
      newMocks: [signedUrlCreateErrorMocks],
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith({
        event: 'namePhotoUploadError',
        graphQLError: 'really bad error',
      });
    });
    expect(screen.getByText('Photo upload failed')).toBeInTheDocument();
  });

  it('should display file upload error for bad fetch response', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: false,
        headers: {
          get: jest.fn().mockReturnValue(etag),
        },
        statusText: 'failed fetch file upload',
      })
    ) as jest.Mock;

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith({
        event: 'nameFetchPhotoUploadError',
        fetchError: 'Error: Unable to upload file: failed fetch file upload',
      });
    });
    expect(screen.getByText('Photo upload failed')).toBeInTheDocument();
  });

  it('should display file upload error for missing Etag header', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
        statusText: 'missing etag',
      })
    ) as jest.Mock;

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith({
        event: 'nameFetchPhotoUploadError',
        fetchError: 'Error: Upload failed, missing ETag',
      });
    });
    expect(screen.getByText('Photo upload failed')).toBeInTheDocument();
  });

  it('should handle GraphQL errors on providerPhotoSet mutation', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(etag),
        },
      })
    ) as jest.Mock;

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
      newMocks: [signedUrlCreateMocks, providerPhotoSetErrorMocks],
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(signedUrl, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
          'Content-Type': MockFile.type,
        },
        body: MockFile,
      });
    });

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith({
        event: 'namePhotoUploadError',
        graphQLError: 'really bad error',
      });
    });
    expect(screen.getByText('Photo upload failed')).toBeInTheDocument();
  });

  it('should handle errors on providerPhotoSet mutation', async () => {
    expect(signedCreateMutationCallMock).not.toHaveBeenCalled();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(etag),
        },
      })
    ) as jest.Mock;

    const redirectTo = 'path';
    await renderComponent({
      header: 'header',
      note: 'note',
      nextRoute: redirectTo,
      eventPrefix: 'name',
      onImageUpdate: () => {},
      thumbnail: thumbnailUrl,
      newMocks: [signedUrlCreateMocks, providerPhotoSetMutationErrorMocks],
    });

    await act(uploadImage);

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    const nextButton = screen.getByText('Upload');
    nextButton.click();

    await waitFor(() => expect(signedCreateMutationCallMock).toHaveBeenCalled());
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(signedUrl, {
        method: 'PUT',
        cache: 'no-cache',
        headers: {
          'Content-Type': MockFile.type,
        },
        body: MockFile,
      });
    });

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith({
        event: 'namePhotoUploadError',
        graphQLError: 'file is blurry',
      });
    });
    expect(screen.getByText('Photo upload failed')).toBeInTheDocument();
  });
});
