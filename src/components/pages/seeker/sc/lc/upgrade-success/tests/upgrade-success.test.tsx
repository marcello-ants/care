import React from 'react';
import { Formik } from 'formik';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';

import { setupWindowLocation } from '@/__setup__/testUtil';
import { AppStateProvider } from '@/components/AppState';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { MockedProvider } from '@apollo/client/testing';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { SEND_MESSAGE_TO_PROVIDER } from '@/components/request/GQL';
import { SEEKER_LEAD_CONNECT_ROUTES } from '@/constants';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { MinimalProviderProfile } from '@/types/seeker';
import { jobPostInitialState } from '@/state/seeker/reducer';
import UpgradeSuccess from '../upgrade-success';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const successfulSendMessageMock = {
  request: {
    query: SEND_MESSAGE_TO_PROVIDER,
    variables: {
      input: {
        message:
          "Hello, I'm looking for a caregiver to help out with my loved one. Are you interested?",
        recipientMemberIds: ['23135', '69817', '3501'],
        relatedJobId: '789',
      },
    },
  },
  result: {
    data: {
      sendMessage: {
        __typename: 'SendMessageSuccess',
        dummy: 'dummy',
      },
    },
  },
};

const partialSuccessSendMessageMock = {
  request: {
    query: SEND_MESSAGE_TO_PROVIDER,
    variables: {
      input: {
        message:
          "Hello, I'm looking for a caregiver to help out with my loved one. Are you interested?",
        recipientMemberIds: ['23135', '69817', '3501'],
      },
    },
  },
  result: {
    data: {
      sendMessage: {
        __typename: 'SendMessageError',
        failedRecipientIds: ['3501'],
      },
    },
  },
};

const successfulRetrySendMessageMock = {
  request: {
    query: SEND_MESSAGE_TO_PROVIDER,
    variables: {
      input: {
        message:
          "Hello, I'm looking for a caregiver to help out with my loved one. Are you interested?",
        recipientMemberIds: ['3501'],
      },
    },
  },
  result: {
    data: {
      sendMessage: {
        __typename: 'SendMessageSuccess',
        dummy: 'dummy',
      },
    },
  },
};

describe('L+C Upgrade Success', () => {
  let mockRouter: any = null;
  let asFragment: any | null = null;
  let windowLocation: ReturnType<typeof setupWindowLocation>;

  const renderComponent = (initialInnerState: AppState, mocks?: any) => {
    const view = render(
      <RouterContext.Provider value={mockRouter}>
        <MockedProvider mocks={mocks ?? []} addTypename={false}>
          <AppStateProvider initialStateOverride={initialInnerState}>
            <Formik
              initialValues={{
                message:
                  'Hello, I’m looking for a caregiver to help out with my loved one. Are you interested?',
              }}
              onSubmit={() => {}}>
              <UpgradeSuccess />
            </Formik>
          </AppStateProvider>
        </MockedProvider>
      </RouterContext.Provider>
    );
    ({ asFragment } = view);

    return view;
  };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      pathname: '/seeker/sc/lc/upgrade-success',
      asPath: '/seeker/sc/lc/upgrade-success',
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    windowLocation = setupWindowLocation();
  });

  afterEach(() => {
    mockRouter = null;
    asFragment = null;
    windowLocation.cleanUp();
  });

  it('matches snapshot', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(screen.getByText(/Thanks for upgrading!/)).toBeInTheDocument();
    expect(
      screen.getByText(/Now, send a quick message so you can start narrowing down your options/)
    ).toBeInTheDocument();
  });

  it('renders correct number of avatars when 6 or more caregivers are provided', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        displayName: 'Mikasa A',
        imgSource: '/app/enrollment/mikasa.jpg',
        memberId: '3504',
        memberUUID: '3079eb2a-81bd-4906-b6b4-4125e437c148',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        displayName: 'Armin',
        imgSource: '/app/enrollment/armin.jpg',
        memberId: '3544',
        memberUUID: '47e7c025-6c5c-4af0-af43-a6599dde4788',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        displayName: 'Eren A',
        imgSource: '/app/enrollment/eren.jpg',
        memberId: '3564',
        memberUUID: 'a0a0c728-8a22-44fa-a3dc-1bb40d02e300',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(screen.getAllByTestId('avatar').length).toBe(5);
  });
  it('renders correct number of avatars when 5 caregivers are provided', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        displayName: 'Tashe M.',
        imgSource: '/app/enrollment/tashe.jpg',
        memberId: '3509',
        memberUUID: '94ddf5d8-d11e-487d-ae77-05858e4703c7',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        displayName: 'Tashaaa M.',
        imgSource: '/app/enrollment/tashaaa.jpg',
        memberId: '4501',
        memberUUID: '1aa0ddab-77dc-42fe-a41c-bbb67c6b2982',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(screen.getAllByTestId('avatar').length).toBe(5);
  });

  it('renders correct number of avatars when 2 caregivers are provided', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(screen.getAllByTestId('avatar').length).toBe(2);
  });

  it('renders correct number of avatars when single caregiver', () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    expect(screen.getAllByTestId('avatar').length).toBe(1);
  });

  it("renders correct text value when no 'WhoNeedsCare' is provided", async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    const textArea = await screen.findByLabelText('Send a message');

    expect(textArea).toHaveValue(
      `Hello, I'm looking for a caregiver to help out with my loved one. Are you interested?`
    );
  });

  it("renders correct text value when 'WhoNeedsCare' is 'SELF'", async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'SELF' as SeniorCareRecipientRelationshipType,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    const textArea = await screen.findByLabelText('Send a message');

    expect(textArea).toHaveValue(
      `Hello, I'm looking for a caregiver to help out with myself. Are you interested?`
    );
  });

  it("renders correct text value when 'WhoNeedsCare' is 'PARENT'", async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    const textArea = await screen.findByLabelText('Send a message');

    expect(textArea).toHaveValue(
      `Hello, I'm looking for a caregiver to help out with my parent. Are you interested?`
    );
  });

  it("renders correct text value when 'WhoNeedsCare' is 'OTHER'", async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);
    const textArea = await screen.findByLabelText('Send a message');

    expect(textArea).toHaveValue(
      `Hello, I'm looking for a caregiver to help out with my loved one. Are you interested?`
    );
  });

  it('should call the correct page when clicking on Send to all button', async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
        jobPost: {
          ...jobPostInitialState,
          jobId: '789',
        },
      },
    };
    renderComponent(overrideState, [successfulSendMessageMock]);
    const sendButton = screen.getByRole('button', { name: 'Send to all' });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_LEAD_CONNECT_ROUTES.MESSAGE_SENT);
    });
  });

  it('partially succeeds then succeeds in retry', async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState, [partialSuccessSendMessageMock, successfulRetrySendMessageMock]);
    const sendButton = screen.getByRole('button', { name: 'Send to all' });
    sendButton.click();

    await waitFor(() => expect(screen.getByText('An error has occurred')).toBeVisible(), {
      timeout: 2000,
    });
    const trySendingAgainButton = screen.getByRole('button', { name: 'Try sending again' });
    trySendingAgainButton.click();
    await waitFor(() =>
      expect(mockRouter.push).toHaveBeenCalledWith(SEEKER_LEAD_CONNECT_ROUTES.MESSAGE_SENT)
    );
  });

  it('partially succeeds then skips', async () => {
    const acceptedProviders = [
      {
        displayName: 'Michelle T.',
        imgSource: '/app/enrollment/joanna.jpg',
        memberId: '23135',
        memberUUID: '6fc30c0a-c4c1-4fba-a0dd-cc15bb87ac41',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
      {
        averageRating: 3,
        displayName: 'Lauren K.',
        imgSource: '/app/enrollment/lauren.jpg',
        memberId: '69817',
        memberUUID: '22d53b55-3e94-4b58-88ae-f76a9dd01714',
        numberReviews: 8,
        yearsOfExperience: 2,
      },
      {
        displayName: 'Tasha M.',
        imgSource: '/app/enrollment/tasha.jpg',
        memberId: '3501',
        memberUUID: '26f1f1f9-794f-4393-b394-37e522025fab',
        numberReviews: 0,
        yearsOfExperience: 10,
      },
    ];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState, [partialSuccessSendMessageMock]);
    const skipButton = screen.getByRole('button', { name: 'Skip for now' });
    fireEvent.click(skipButton);

    await waitFor(() => {
      expect(windowLocation.mock).toHaveBeenLastCalledWith('/ppr.do#3');
    });
  });

  it('routes to MHP if no providers already accepted', async () => {
    const acceptedProviders: MinimalProviderProfile[] = [];
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        leadAndConnect: { ...initialAppState.seeker.leadAndConnect, acceptedProviders },
      },
    };
    renderComponent(overrideState);

    await waitFor(() => {
      expect(windowLocation.mock).toHaveBeenLastCalledWith('/');
    });
  });
});
