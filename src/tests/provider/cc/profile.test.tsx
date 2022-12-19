import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@material-ui/core';
import { cloneDeep } from 'lodash-es';
import { theme } from '@care/material-ui-theme';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';

import Profile from '@/pages/provider/cc/profile';
import { CAREGIVER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { GraphQLError } from 'graphql';
import { FeatureFlagsProvider } from '@/components/FeatureFlagsContext';
import { CLIENT_FEATURE_FLAGS } from '@/constants';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const initialStateClone = cloneDeep(initialAppState);

describe('Provider CC Profile Page', () => {
  let mockRouter: any | null = null;

  const successMock = {
    request: {
      query: CAREGIVER_ATTRIBUTES_UPDATE,
      variables: {
        input: {
          caregiver: {
            comfortableWithPets: false,
            covidVaccinated: false,
            education: 'COLLEGE_DEGREE',
            languages: ['ENGLISH'],
            ownTransportation: false,
            smokes: false,
            yearsOfExperience: 1,
          },
          childcare: {
            carpooling: false,
            certifiedNursingAssistant: false,
            certifiedRegistedNurse: false,
            certifiedTeacher: false,
            childDevelopmentAssociate: false,
            cprTrained: false,
            craftAssistance: false,
            doula: false,
            earlyChildDevelopmentCoursework: false,
            earlyChildhoodEducation: false,
            errands: false,
            expSpecialNeedsChildren: false,
            experienceWithTwins: false,
            firstAidTraining: false,
            groceryShopping: false,
            laundryAssistance: false,
            lightHousekeeping: true,
            mealPreparation: false,
            nafccCertified: false,
            remoteLearningAssistance: false,
            swimmingSupervision: false,
            travel: false,
            trustlineCertifiedCalifornia: false,
          },
          serviceType: 'CHILD_CARE',
        },
      },
    },
    result: {
      data: {
        caregiverAttributesUpdate: {
          __typename: 'CaregiverAttributesUpdateSuccess',
          dummy: 'Success',
        },
      },
    },
  };

  const errorMock = {
    request: {
      query: CAREGIVER_ATTRIBUTES_UPDATE,
      variables: {
        input: {
          caregiver: {
            comfortableWithPets: false,
            covidVaccinated: false,
            education: 'COLLEGE_DEGREE',
            languages: ['ENGLISH'],
            ownTransportation: false,
            smokes: false,
            yearsOfExperience: 1,
          },
          childcare: {
            carpooling: false,
            certifiedNursingAssistant: false,
            certifiedRegistedNurse: false,
            certifiedTeacher: false,
            childDevelopmentAssociate: false,
            cprTrained: false,
            craftAssistance: false,
            doula: false,
            earlyChildDevelopmentCoursework: false,
            earlyChildhoodEducation: false,
            errands: false,
            expSpecialNeedsChildren: false,
            experienceWithTwins: false,
            firstAidTraining: false,
            groceryShopping: false,
            laundryAssistance: false,
            lightHousekeeping: true,
            mealPreparation: false,
            nafccCertified: false,
            remoteLearningAssistance: false,
            swimmingSupervision: false,
            travel: false,
            trustlineCertifiedCalifornia: false,
          },
          serviceType: 'CHILD_CARE',
        },
      },
    },
    result: { errors: [new GraphQLError('error')] },
  };

  const featureFlagsMock = {
    [CLIENT_FEATURE_FLAGS.PROVIDER_VACCINE_INDICATOR]: {
      value: true,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
    [CLIENT_FEATURE_FLAGS.PROVIDER_CC_FREE_GATED_EXPERIENCE]: {
      value: true,
      reason: {
        kind: 'FALLTHROUGH',
      },
    },
  };

  function renderComponent(initialState = initialStateClone, isFailing = false) {
    return render(
      <FeatureFlagsProvider flags={featureFlagsMock}>
        <MockedProvider mocks={[isFailing ? errorMock : successMock]} addTypename={false}>
          <ThemeProvider theme={theme}>
            <AppStateProvider initialStateOverride={initialState}>
              <Profile />
            </AppStateProvider>
          </ThemeProvider>
        </MockedProvider>
      </FeatureFlagsProvider>
    );
  }

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = () => {};
    mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
      query: { param: [] },
      pathname: '',
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
  });

  it('matches snapshot', async () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should redirect on successful submit', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Light housekeeping'));

    fireEvent.click(screen.getByText('No'));

    fireEvent.mouseDown(screen.getByLabelText('Highest level achieved'));
    fireEvent.click(screen.getByText('College degree'));

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
  });

  it('should not redirect if "help with" is not selected', async () => {
    renderComponent();

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(0));
  });

  it('should not redirect if "education" is not selected', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Light housekeeping'));

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(0));
  });

  it('should be able to select a skill', async () => {
    renderComponent();

    const skillCheckbox = screen.getByRole('checkbox', {
      name: 'Certified teacher',
    });
    await waitFor(() => expect(skillCheckbox).not.toBeChecked());
    fireEvent.click(skillCheckbox);
    await waitFor(() => expect(skillCheckbox).toBeChecked());
  });

  it('should be able to select "willing to help with"', async () => {
    const { container } = renderComponent();
    const pill = container.querySelector('input[value="lightHousekeeping"]') as Element;
    await waitFor(() => expect(pill).not.toBeChecked());
    fireEvent.click(screen.getByText('Light housekeeping'));
    await waitFor(() => expect(pill).toBeChecked());
  });

  it('should be able to select "about me"', async () => {
    const { container } = renderComponent();
    const pill = container.querySelector('input[value="ownTransportation"]') as Element;
    await waitFor(() => expect(pill).not.toBeChecked());
    fireEvent.click(screen.getByText('Have a car'));
    await waitFor(() => expect(pill).toBeChecked());
  });

  it('should be able to select Language', async () => {
    const { container } = renderComponent();
    const pill = container.querySelector('input[value="SPANISH"]') as Element;
    await waitFor(() => expect(pill).not.toBeChecked());
    fireEvent.click(screen.getByText('Spanish'));
    await waitFor(() => expect(pill).toBeChecked());
  });

  it('should be able to redirect after failing mutation', async () => {
    await renderComponent(initialAppState, true);

    fireEvent.click(screen.getByText('Light housekeeping'));

    fireEvent.click(screen.getByText('No'));

    fireEvent.mouseDown(screen.getByLabelText('Highest level achieved'));
    fireEvent.click(screen.getByText('College degree'));

    const btn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(btn);

    const gotItBtn = await screen.findByRole('button', { name: 'Got it' });
    await waitFor(() => expect(gotItBtn).toBeInTheDocument());
    fireEvent.click(gotItBtn);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
  });
});
