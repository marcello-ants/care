import { screen, waitFor } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import useNextRoute from '@/components/hooks/useNextRoute';
import { AppState } from '@/types/app';
import { cloneDeep } from 'lodash-es';
import {
  SeniorCarePaymentSource,
  SeniorCareRecipientCondition,
  SeniorCareRecipientRelationshipType,
} from '@/__generated__/globalTypes';
import userEvent from '@testing-library/user-event';
import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { GET_SEEKER_INFO } from '@/components/request/GQL';

import PaymentQuestionnaire from '../payment-questionnaire';

jest.mock('@/components/hooks/useNextRoute');

const initialStateOverride = cloneDeep(initialAppState);

const getSeekerInfoMock = {
  request: {
    operationName: 'getSeekerInfo',
    variables: { memberId: '123' },
    query: GET_SEEKER_INFO,
  },
  result: {
    data: {
      getSeeker: {
        member: {
          firstName: 'John',
          lastName: 'Doe',
          contact: {
            primaryPhone: '',
            __typename: 'MemberContact',
          },
          email: 'sc-1769-3@test.com',
          __typename: 'Member',
        },
        __typename: 'Seeker',
      },
    },
  },
};

describe('payment questionnaire', () => {
  let mockRoute: any = null;

  beforeEach(() => {
    mockRoute = {
      pushNextRoute: jest.fn(),
    };
    (useNextRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    // cleanup on exiting
    mockRoute = null;
  });

  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(PaymentQuestionnaire);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', () => {
    const { renderFn } = preRenderPage();
    renderFn(PaymentQuestionnaire);
    expect(screen.getByText(/Which of the following benefits/)).toBeInTheDocument();
  });

  it('renders with "self" verbiage correctly', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'SELF' as SeniorCareRecipientRelationshipType,
      },
    };

    const { renderFn } = preRenderPage({ appState: modifiedInitialState });
    renderFn(PaymentQuestionnaire);
    expect(
      screen.getByText(/Which of the following benefits do you have access to?/)
    ).toBeInTheDocument();
  });

  it('renders with "other" verbiage correctly', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: modifiedInitialState });
    renderFn(PaymentQuestionnaire);
    expect(
      screen.getByText(/Which of the following benefits does your loved one have access to?/)
    ).toBeInTheDocument();
  });

  it('renders with "parent" verbiage correctly', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: modifiedInitialState });
    renderFn(PaymentQuestionnaire);
    expect(
      screen.getByText(/Which of the following benefits does your parent have access to?/)
    ).toBeInTheDocument();
  });

  it('unselects other options when "None of the above" is selected', () => {
    const { renderFn } = preRenderPage();
    const { container } = renderFn(PaymentQuestionnaire);

    const privatePayText = screen.getByText('Private pay');
    privatePayText.click();

    expect(container.querySelector('input[value="PRIVATE_PAY"]') as Element).toBeChecked();

    const noneOfTheAboveText = screen.getByText('None of the above');
    noneOfTheAboveText.click();

    expect(container.querySelector('input[value="PRIVATE_PAY"]') as Element).not.toBeChecked();
  });

  it('goes to recap page on button click', () => {
    const { renderFn, routerMock } = preRenderPage();
    renderFn(PaymentQuestionnaire);

    const button = screen.getByText(/Next/);
    const pill = screen.getByText(/Private pay/);

    userEvent.click(pill);
    userEvent.click(button);

    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });

  it('goes to no-communities-by-covering-cost page on button click', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.OTHER],
      },
    };
    const { renderFn, routerMock } = preRenderPage({ appState, mocks: [getSeekerInfoMock] });
    renderFn(PaymentQuestionnaire);

    await waitFor(() => screen.findByText(/Next/));
    const button = screen.getByText(/Next/);
    userEvent.click(button);

    expect(routerMock.push).toBeCalledWith(
      SEEKER_IN_FACILITY_ROUTES.NO_COMMUNITIES_BY_COVERING_COST
    );
  });

  it('renders current payment-questionnaire screen', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
      },
    };

    const { renderFn } = preRenderPage({ appState, mocks: [getSeekerInfoMock] });
    const { container } = renderFn(PaymentQuestionnaire);

    await waitFor(() => screen.findByText('Next'));

    expect(screen.getByText(/Which of the following benefits/)).toBeInTheDocument();

    expect(container.querySelector('input[value="PRIVATE_PAY"]') as Element).toBeInTheDocument();
  });

  it('goes to COMMUNITY_LIST page on button click and optimization flag is present', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
        SALCCommunities: [{ id: '1011' }],
      },
    };
    const featureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'variant' },
        value: true,
        variationIndex: 1,
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState,
      mocks: [getSeekerInfoMock],
      flags: featureFlags,
    });
    renderFn(PaymentQuestionnaire);

    await waitFor(() => screen.findByText(/View results/));
    const button = screen.getByText(/View results/);
    userEvent.click(button);

    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.COMMUNITY_LIST);
  });

  it('goes to NO_COMMUNITIES_BY_COVERING_COST page on button click and optimization flag is present and OTHER selected', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.OTHER],
      },
    };
    const featureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'variant' },
        value: true,
        variationIndex: 1,
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState,
      mocks: [getSeekerInfoMock],
      flags: featureFlags,
    });
    renderFn(PaymentQuestionnaire);

    await waitFor(() => screen.findByText(/View results/));
    const button = screen.getByText(/View results/);
    userEvent.click(button);

    expect(routerMock.push).toBeCalledWith(
      SEEKER_IN_FACILITY_ROUTES.NO_COMMUNITIES_BY_COVERING_COST
    );
  });

  it('goes to CARING_LEADS page on button click and optimization flag is present with Caring facilities but no SALC facilities', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
        caringFacilityCountNearBy: 1,
      },
    };
    const featureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'variant' },
        value: true,
        variationIndex: 1,
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState,
      mocks: [getSeekerInfoMock],
      flags: featureFlags,
    });
    renderFn(PaymentQuestionnaire);

    await waitFor(() => screen.findByText(/View results/));
    const button = screen.getByText(/View results/);
    userEvent.click(button);

    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.CARING_LEADS);
  });

  it('goes to OPTIONS page on button click and optimization flag is present but not qualified for leads', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
        paymentDetailTypes: [SeniorCarePaymentSource.PRIVATE_PAY],
        condition: SeniorCareRecipientCondition.CONSTANT_SUPERVISION_NEEDED,
      },
    };
    const featureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'variant' },
        value: true,
        variationIndex: 1,
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState,
      mocks: [getSeekerInfoMock],
      flags: featureFlags,
    });
    renderFn(PaymentQuestionnaire);

    await waitFor(() => screen.findByText(/View results/));
    const button = screen.getByText(/View results/);
    userEvent.click(button);

    expect(routerMock.push).toBeCalledWith(SEEKER_IN_FACILITY_ROUTES.OPTIONS);
  });

  it('renders the correct header for the Optimization flag', () => {
    const modifiedInitialState: AppState = {
      ...initialStateOverride,
      seeker: {
        ...initialStateOverride.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
      },
    };
    const featureFlags = {
      [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
        reason: { kind: 'variant' },
        value: true,
        variationIndex: 1,
      },
    };
    const { renderFn } = preRenderPage({ appState: modifiedInitialState, flags: featureFlags });
    renderFn(PaymentQuestionnaire);
    expect(
      screen.getByText(/Does your parent have access to any of these items?/)
    ).toBeInTheDocument();
  });
});
