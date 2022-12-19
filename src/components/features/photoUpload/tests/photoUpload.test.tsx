import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PhotoUpload from '../photoUpload';
import { getCroppedImg, optimizePhoto, blobToFile } from '../photoUtilities';

jest.mock('../photoUtilities', () => ({
  optimizePhoto: jest.fn(),
  getCroppedImg: jest.fn(),
  blobToFile: jest.fn(),
}));

describe('Photo Component', () => {
  const MockFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/jpg' });
  const MockBlob = new Blob([''], { type: 'image/jpg' });
  const mockSetFile = jest.fn();
  const mockDeleteTrigger = jest.fn();
  const mockOnCropError = jest.fn();
  let asFragment: any | null = null;

  const renderComponent = ({
    photoURLOnState = '',
    setFileToUpload = mockSetFile,
    onCropError = mockOnCropError,
    deleteTrigger = mockDeleteTrigger,
    acceptedFormats = '.jpg',
  }) => {
    const view = render(
      <PhotoUpload
        photoURLOnState={photoURLOnState}
        setFileToUpload={setFileToUpload}
        onCropError={onCropError}
        deleteTrigger={deleteTrigger}
        acceptedFormats={acceptedFormats}
      />
    );
    ({ asFragment } = view);
  };

  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
    (window.URL.createObjectURL as jest.Mock).mockReturnValue('imageURL');

    (optimizePhoto as jest.Mock).mockReturnValue(MockBlob);
    (getCroppedImg as jest.Mock).mockReturnValue(MockBlob);
    (blobToFile as jest.Mock).mockReturnValue(MockFile);
  });

  it('should match snapshot', () => {
    renderComponent({});
    expect(asFragment()).toMatchSnapshot();
  });

  it('should load photo on modal', async () => {
    renderComponent({});
    // get the upload button
    const input = screen.getByTestId('photo-hidden-input') as HTMLInputElement;

    userEvent.upload(input, MockFile);

    expect(await screen.findByText('Position and size your photo')).toBeInTheDocument();
  });
  it('should show the cropped photo UI and call to the delete function', async () => {
    renderComponent({});
    // get the upload button
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

    expect(await screen.findByText('Delete')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(mockDeleteTrigger).toHaveBeenCalled());
  });

  it('should load the photo if the photo in state already exists', async () => {
    renderComponent({ photoURLOnState: 'http://url.com/img.jpg' });
    expect(await screen.findByText('Change')).toBeInTheDocument();
    expect(await screen.findByText('Delete')).toBeInTheDocument();
  });
});
