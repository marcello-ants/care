import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { MockedProvider } from '@apollo/client/testing';

import { AppStateProvider } from '@/components/AppState';
import { SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE } from '@/components/request/GQL';
import { initialAppState } from '@/state';
import ExperienceLevel from '@/pages/provider/sc/experience-level';
import { PROVIDER_ROUTES } from '@/constants';
import { LevelOfExperienceLabels } from '@/types/provider';

const gqlMocks = [
  {
    request: {
      query: SENIOR_CARE_PROVIDER_ATTRIBUTES_UPDATE,
      variables: {
        input: {
          yearsOfExperience: 10,
        },
      },
    },
    result: {
      data: {
        seniorCareProviderAttributesUpdate: {
          __typename: 'SeniorCareProviderAttributesUpdateSuccess',
        },
      },
    },
  },
];

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('Experience level page', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;

  const renderComponent = () => {
    const view = render(
      <MockedProvider mocks={gqlMocks} addTypename={false}>
        <AppStateProvider initialStateOverride={initialAppState}>
          <ExperienceLevel />
        </AppStateProvider>
      </MockedProvider>
    );
    ({ asFragment } = view);
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: PROVIDER_ROUTES.EXPERIENCE_LEVEL,
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRouter = null;
    asFragment = null;
  });

  it('matches snapshot', () => {
    renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('check options and redirect to the next page', async () => {
    renderComponent();
    const option1 = screen.getByText(LevelOfExperienceLabels.YEARS_1);
    const option2 = screen.getByText(LevelOfExperienceLabels.YEARS_3);
    const option3 = screen.getByText(LevelOfExperienceLabels.YEARS_5);
    const option4 = screen.getByText(LevelOfExperienceLabels.YEARS_10);
    const option5 = screen.getByText(LevelOfExperienceLabels.YEARS_0);

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
    expect(option4).toBeInTheDocument();
    expect(option5).toBeInTheDocument();

    fireEvent.click(option4);

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(PROVIDER_ROUTES.PROFILE));
  });
});
