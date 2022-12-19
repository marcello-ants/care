import { screen, fireEvent, waitFor } from '@testing-library/react';

import { SEEKER_IN_FACILITY_ROUTES, CLIENT_FEATURE_FLAGS } from '@/constants';
import { GET_SEEKER_INFO, GET_SEEKER_ZIP_CODE } from '@/components/request/GQL';
import { initialAppState } from '@/state';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';

import { useAppDispatch } from '@/components/AppState';
import { preRenderPage } from '@/__setup__/testUtil';
import DescribeLovedOne from '../describe-loved-one';

jest.mock('@/components/AppState', () => ({
  ...(jest.requireActual('@/components/AppState') as object),
  useAppDispatch: jest.fn(),
}));

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

const getZipCodeMock = {
  request: {
    query: GET_SEEKER_ZIP_CODE,
    variables: {
      memberId: '123',
    },
  },
  result: {
    data: {
      getSeeker: {
        member: {
          address: {
            zip: '02451',
          },
        },
      },
    },
  },
};

describe('in facility describe-loved-one', () => {
  const mockAppDispatch: ReturnType<typeof useAppDispatch> = jest.fn();
  (useAppDispatch as jest.Mock).mockReturnValue(mockAppDispatch);

  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(DescribeLovedOne);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correclty when whoNeedsCare equals "SELF"', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'SELF' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(DescribeLovedOne);
    expect(screen.getByText(/How would you describe yourself?/)).toBeInTheDocument();
  });

  it('renders correclty when whoNeedsCare equals "OTHER"', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(DescribeLovedOne);
    expect(screen.getByText(/How would you describe your loved one?/)).toBeInTheDocument();
  });

  it('renders correclty when whoNeedsCare equals "PARENT"', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({ appState: overrideState });
    renderFn(DescribeLovedOne);
    expect(screen.getByText(/How would you describe your parent?/)).toBeInTheDocument();
  });

  it('should go to the correct route: enrollment flow', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn, routerMock } = preRenderPage({ appState: overrideState });
    renderFn(DescribeLovedOne);
    expect(screen.getByText(/How would you describe your loved one?/)).toBeInTheDocument();
    const clickableOption = screen.getByText('Independent');
    fireEvent.click(clickableOption);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
  });

  it('should go to the correct route: nth-day flow', async () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'OTHER' as SeniorCareRecipientRelationshipType,
      },
      flow: {
        ...initialAppState.flow,
        userHasAccount: true,
        memberId: '123',
      },
    };
    const { renderFn, routerMock } = preRenderPage({
      appState: overrideState,
      mocks: [getSeekerInfoMock],
    });

    renderFn(DescribeLovedOne);
    expect(await screen.findByText(/How would you describe your loved one?/)).toBeInTheDocument();
    const clickableOption = screen.getByText('Independent');
    fireEvent.click(clickableOption);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.HELP_TYPE);
  });

  it('renders correclty when is RECOMMENDATION_OPTIMIZATION flow', () => {
    const overrideState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        whoNeedsCare: 'PARENT' as SeniorCareRecipientRelationshipType,
      },
    };
    const { renderFn } = preRenderPage({
      appState: overrideState,
      flags: {
        [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
          reason: { kind: 'control' },
          value: true,
          variationIndex: 1,
        },
      },
    });
    renderFn(DescribeLovedOne);
    expect(screen.getByText(/How would you describe the person needing care?/)).toBeInTheDocument();
  });

  it('should not collect nth day user zip code to redirect to CZEN search page when in FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations and zipcode is already provided', async () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        flow: {
          ...initialAppState.flow,
          memberId: '123',
          userHasAccount: true,
        },
        seeker: {
          ...initialAppState.seeker,
          zipcode: '90001',
        },
      },
      mocks: [getZipCodeMock],
      flags: {
        [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
          reason: { kind: '' },
          variationIndex: 1,
          value: 'variation',
        },
      },
    });
    renderFn(DescribeLovedOne);

    expect(mockAppDispatch).not.toHaveBeenCalledWith({
      type: 'setZipcode',
      zipcode: '02451',
    });
  });

  it('should collect nth day user zip code to redirect to CZEN search page when in FF enrollment-mfe-in-facility-enrollment-recommendations-and-flow-optimizations and zipcode is empty', async () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        flow: {
          ...initialAppState.flow,
          memberId: '123',
          userHasAccount: true,
        },
        seeker: {
          ...initialAppState.seeker,
          zipcode: '',
        },
      },
      mocks: [getZipCodeMock],
      flags: {
        [CLIENT_FEATURE_FLAGS.ENROLLMENT_RECOMMENDATIONS_FLOW_OPTIMIZATION]: {
          reason: { kind: '' },
          variationIndex: 1,
          value: 'variation',
        },
      },
    });
    renderFn(DescribeLovedOne);

    await waitFor(() =>
      expect(mockAppDispatch).toHaveBeenCalledWith({
        type: 'setZipcode',
        zipcode: '02451',
      })
    );
  });
});
