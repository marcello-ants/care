import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { cloneDeep } from 'lodash-es';

import JobType from '../../../pages/provider/sc/job-type';
import { PROVIDER_ROUTES } from '../../../constants';
import { AppStateProvider } from '../../../components/AppState';
import { initialAppState } from '../../../state';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

describe('Job Type page', () => {
  let mockRouter: any = null;
  let utils: any | null = null;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: PROVIDER_ROUTES.HEADLINE_BIO,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    const view = render(
      <AppStateProvider initialStateOverride={initialStateClone}>
        <JobType />
      </AppStateProvider>
    );
    utils = view;
  });

  it('matches snapshot', () => {
    expect(utils.asFragment()).toMatchSnapshot();
  });

  it('should select Recurring jobs option and display hours inputs', () => {
    const option = screen.getByText('Recurring jobs');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);

    const minInput = screen.getByText('Min');
    const maxInput = screen.getByText('Max');

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
  });

  it('should not allow letters to be inputted for recurring jobs option', () => {
    const option = screen.getByText('Recurring jobs');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);

    const minInputField = screen.getByLabelText('min-recurring') as HTMLInputElement;
    fireEvent.change(minInputField, { target: { value: '13' } }); // type: number now constrains chars input
    expect(minInputField.value).toBe('13');

    const maxInputField = screen.getByLabelText('max-recurring') as HTMLInputElement;
    fireEvent.change(maxInputField, { target: { value: '40' } }); // type: number now constrains chars input
    expect(maxInputField.value).toBe('40');
  });

  it('should not allow letters to be inputted for one-time jobs option', () => {
    const option = screen.getByText('One-time jobs');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);

    const minInputField = screen.getByLabelText('min-onetime') as HTMLInputElement;
    fireEvent.change(minInputField, { target: { value: '13' } }); // type: number now constrains chars input
    expect(minInputField.value).toBe('13');

    const maxInputField = screen.getByLabelText('max-onetime') as HTMLInputElement;
    fireEvent.change(maxInputField, { target: { value: '40' } }); // type: number now constrains chars input
    expect(maxInputField.value).toBe('40');
  });

  it('should not allow letters to be inputted for live-in jobs option', () => {
    const option = screen.getByText('Live-in jobs');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);

    const minInputField = screen.getByLabelText('min-livein') as HTMLInputElement;
    fireEvent.change(minInputField, { target: { value: '13' } }); // type: number now constrains chars input
    expect(minInputField.value).toBe('13');

    const maxInputField = screen.getByLabelText('max-livein') as HTMLInputElement;
    fireEvent.change(maxInputField, { target: { value: '40' } }); // type: number now constrains chars input
    expect(maxInputField.value).toBe('40');
  });

  it('should not allow more than 168 hours per week', () => {
    const option = screen.getByText('Recurring jobs');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);

    const inputField = screen.getByLabelText('min-recurring') as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: '200' } });
    expect(inputField.value).toBe('168');
  });

  it('should redirect to the next page', () => {
    const option = screen.getByText('Recurring jobs');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.AVAILABILITY);
  });
});
