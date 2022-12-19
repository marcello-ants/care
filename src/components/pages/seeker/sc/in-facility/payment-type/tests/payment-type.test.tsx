import { screen } from '@testing-library/react';
import { initialAppState } from '@/state';
import { preRenderPage } from '@/__setup__/testUtil';
import { PaymentTypeOptions } from '@/types/seeker';
import userEvent from '@testing-library/user-event';
import { SENIOR_CARE_TYPE } from '@/__generated__/globalTypes';
import { SEEKER_IN_FACILITY_ROUTES } from '@/constants';
import { GET_SEEKER_INFO } from '@/components/request/GQL';

import PaymentType from '../payment-type';

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

describe('payment type', () => {
  it('matches snapshot', async () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(PaymentType);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly', async () => {
    const { renderFn } = preRenderPage();
    renderFn(PaymentType);
    expect(
      screen.getByText(/How is your family thinking about covering the cost?/)
    ).toBeInTheDocument();
  });

  it('should redirect to "/seeker/sc/recap" page when clicking private pay', async () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        PaymentType: PaymentTypeOptions.PRIVATE,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };
    const { renderFn, routerMock } = preRenderPage({ appState });
    renderFn(PaymentType);

    const privatePayButton = screen.getByText(/private/i);
    userEvent.click(privatePayButton);

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });

  it('should redirect to "/seeker/sc/recap" page when clicking Government button', async () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        PaymentType: PaymentTypeOptions.GOVERNMENT,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    const { renderFn, routerMock } = preRenderPage({ appState });
    renderFn(PaymentType);

    const governmentButton = screen.getByText(/Medicaid and\/or Medicare/i);
    userEvent.click(governmentButton);
    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE);
  });

  it('should redirect to "/seeker/sc/in-facility/no-communities-by-covering-cost" page when clicking Government button', async () => {
    const appState = {
      ...initialAppState,
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
      seeker: {
        ...initialAppState.seeker,
        PaymentType: PaymentTypeOptions.GOVERNMENT,
        typeOfCare: SENIOR_CARE_TYPE.IN_FACILITY,
      },
    };

    const { renderFn, routerMock } = preRenderPage({ appState, mocks: [getSeekerInfoMock] });
    renderFn(PaymentType);

    expect(await screen.findByText(/Medicaid and\/or Medicare/i)).toBeInTheDocument();

    const governmentButton = screen.getByText(/Medicaid and\/or Medicare/i);
    userEvent.click(governmentButton);

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE);
  });

  it('should redirect to "/seeker/sc/in-facility/payment-questionnaire" page when clicking private pay', async () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        PaymentType: PaymentTypeOptions.HELP,
      },
    };

    const { renderFn, routerMock } = preRenderPage({ appState });
    renderFn(PaymentType);

    const helpButton = screen.getByText(/help/i);
    userEvent.click(helpButton);

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.PAYMENT_QUESTIONNAIRE);
  });

  it('should redirect to recap page when clicking private pay and userHasAccount: true', async () => {
    const appState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        PaymentType: PaymentTypeOptions.HELP,
      },
      flow: {
        ...initialAppState.flow,
        memberId: '123',
        userHasAccount: true,
      },
    };

    const { renderFn, routerMock } = preRenderPage({ appState, mocks: [getSeekerInfoMock] });
    renderFn(PaymentType);

    expect(await screen.findByText(/private/i)).toBeInTheDocument();

    const privateButton = screen.getByText(/private/i);
    userEvent.click(privateButton);

    expect(routerMock.push).toHaveBeenCalledWith(SEEKER_IN_FACILITY_ROUTES.RECAP);
  });
});
