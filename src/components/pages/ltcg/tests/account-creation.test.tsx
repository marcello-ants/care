import React from 'react';
import { screen, waitFor, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LTCG_ROUTES } from '@/constants';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { preRenderPage } from '@/__setup__/testUtil';
import {
  ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT,
  VALIDATE_MEMBER_EMAIL,
  VALIDATE_MEMBER_PASSWORD,
  GET_ZIP_CODE_SUMMARY,
} from '@/components/request/GQL';
import { YesOrNoAnswer, CareDate, ServiceType } from '@/__generated__/globalTypes';

import {
  enrollSeekerForEnterpriseClient,
  enrollSeekerForEnterpriseClientVariables,
} from '@/__generated__/enrollSeekerForEnterpriseClient';
import AuthService from '@/lib/AuthService';

import AccountCreation from '../account-creation';

jest.mock('@/lib/AuthService');

const validEmail = 'tim@care.com';
const emailValidationMock = {
  request: {
    query: VALIDATE_MEMBER_EMAIL,
    variables: {
      email: validEmail,
    },
  },
  result: {
    data: {
      validateMemberEmail: { errors: [] },
    },
  },
};

const validPassword = 'test456';
const passwordValidationMock = {
  request: {
    query: VALIDATE_MEMBER_PASSWORD,
    variables: {
      password: validPassword,
    },
  },
  result: {
    data: {
      validateMemberPassword: { errors: [] },
    },
  },
};

const zipCodeSummaryMock = {
  request: {
    query: GET_ZIP_CODE_SUMMARY,
    variables: {
      zipcode: '10001',
    },
  },
  result: {
    data: {
      getZipcodeSummary: {
        __typename: 'ZipcodeSummary',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        latitude: 3,
        longitude: 3,
      },
    },
  },
};
const successMock = {
  request: {
    query: ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT,
    variables: {
      employeeEnrollmentDetails: {
        group: 'LTCG',
        employeeInformation: {
          firstName: 'Jon',
          lastName: 'Doe',
          address: '5th street',
          zip: '10001',
          dateOfBirth: '1993-07-10',
          email: 'tim@care.com',
          password: 'test456',
          phoneNumber: '+15128675309',
          primaryService: ServiceType.SENIOR_CARE,
        },
      },
    } as enrollSeekerForEnterpriseClientVariables,
  },
  result: {
    data: {
      enrollSeekerForEnterpriseClient: {
        __typename: 'EnterpriseEmployeeEnrollmentSuccess',
        memberId: 'memberId',
        authToken: 'authToken',
        oneTimeToken: 'oneTimeToken',
      },
    } as enrollSeekerForEnterpriseClient,
  },
};

const errorsMock = {
  request: {
    query: ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT,
    variables: {
      employeeEnrollmentDetails: {
        group: 'LTCG',
        employeeInformation: {
          firstName: 'Jon',
          lastName: 'Errors-a-lot',
          address: '5th street',
          zip: '10001',
          dateOfBirth: '1993-07-10',
          email: 'tim@care.com',
          password: 'test456',
          phoneNumber: '+15128675309',
          primaryService: ServiceType.SENIOR_CARE,
        },
      },
    } as enrollSeekerForEnterpriseClientVariables,
  },
  result: {
    data: {
      enrollSeekerForEnterpriseClient: {
        __typename: 'EnterpriseEnrollmentProcessFailure',
        errors: [
          {
            errorMessages: ["I don't know, LOL", 'oh look, another error'],
          },
        ],
      },
    } as enrollSeekerForEnterpriseClient,
  },
};

const failureMock = {
  request: {
    query: ENROLL_SEEKER_FOR_ENTERPRISE_CLIENT,
    variables: {
      employeeEnrollmentDetails: {
        group: 'LTCG',
        employeeInformation: {
          firstName: 'Jon',
          lastName: 'Failure',
          address: '5th street',
          zip: '10001',
          dateOfBirth: '1993-07-10',
          email: 'tim@care.com',
          password: 'test456',
          phoneNumber: '+15128675309',
          primaryService: ServiceType.SENIOR_CARE,
        },
      },
    } as enrollSeekerForEnterpriseClientVariables,
  },
  error: new Error('An error occurred'),
};

let rerender: RenderResult['rerender'];
function preRender() {
  const customState: AppState = {
    ...initialAppState,
    ltcg: {
      ...initialAppState.ltcg,
      careDate: CareDate.RIGHT_NOW,
      caregiverNeeded: YesOrNoAnswer.NO,
    },
  };
  const { renderFn, routerMock, renderTree } = preRenderPage({
    mocks: [
      zipCodeSummaryMock,
      emailValidationMock,
      passwordValidationMock,
      successMock,
      errorsMock,
      failureMock,
    ],
    addTypeName: true,
    basePath: '/app/enrollment',
    appState: customState,
  });
  routerMock.route = LTCG_ROUTES.DETAILS_ABOUT_YOURSELF;
  (routerMock.push as jest.Mock).mockImplementation((url) => {
    routerMock.route = url;
    // since we're mocking the router, we need to manually rerender on pushes
    rerender(renderTree(<AccountCreation />));
  });

  return {
    renderFn: (arg: React.ComponentType | React.ReactNode) => {
      const utils = renderFn(arg);
      ({ rerender } = utils);
      return utils;
    },
    routerMock,
  };
}

async function populateDetailsAboutYouFields() {
  userEvent.type(screen.getByLabelText('First name'), 'Jon');
  userEvent.type(screen.getByLabelText('Last name'), 'Doe');
  userEvent.type(screen.getByLabelText('Street address'), '5th street');
  userEvent.type(screen.getByLabelText('ZIP code'), '10001');

  await screen.findByText(/New York, NY/);
  userEvent.type(screen.getByLabelText('Your birth date (MM/DD/YYYY)'), '07101993');

  await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());
}

async function populateContactInfoFields() {
  userEvent.type(screen.getByLabelText('Email address'), validEmail);
  userEvent.type(screen.getByLabelText('Phone number'), '5128675309');
  userEvent.type(screen.getByLabelText('Password'), validPassword);

  await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled());
}

describe('LTCG account creation', () => {
  it('should render the "details about you" form', async () => {
    const { renderFn } = preRender();
    renderFn(AccountCreation);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeDisabled());

    expect(screen.getByText('Share a few details about yourself.')).toBeInTheDocument();
  });

  it('should render the "contact info" form after filling out the "details about you" form', async () => {
    const { renderFn } = preRender();
    renderFn(AccountCreation);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeDisabled());

    await populateDetailsAboutYouFields();
    userEvent.click(nextButton);

    await screen.findByText(
      'Share your contact info so we can help you through the process and set up your account.'
    );
  });

  it('should navigate to the success page once the account creation forms are submitted', async () => {
    const AuthServiceMock = AuthService as jest.Mock;
    const redirectLoginSpy = jest.fn();
    AuthServiceMock.mockImplementation(() => {
      return {
        redirectLogin: redirectLoginSpy,
      };
    });

    const { renderFn } = preRender();
    renderFn(AccountCreation);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeDisabled());

    await populateDetailsAboutYouFields();
    userEvent.click(nextButton);

    await screen.findByText(
      'Share your contact info so we can help you through the process and set up your account.'
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeDisabled());

    await populateContactInfoFields();
    userEvent.click(submitButton);

    await waitFor(() =>
      expect(redirectLoginSpy).toHaveBeenCalledWith(
        `/app/enrollment${LTCG_ROUTES.SUCCESS}`,
        'authToken',
        'oneTimeToken'
      )
    );
  }, 7000);

  it('should display any errors that occur when the account creation forms are submitted', async () => {
    const { renderFn } = preRender();
    renderFn(AccountCreation);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeDisabled());

    await populateDetailsAboutYouFields();
    userEvent.clear(screen.getByLabelText('Last name'));
    userEvent.type(screen.getByLabelText('Last name'), 'Errors-a-lot');
    userEvent.click(nextButton);

    await screen.findByText(
      'Share your contact info so we can help you through the process and set up your account.'
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeDisabled());

    await populateContactInfoFields();
    userEvent.click(submitButton);

    await waitFor(() => expect(screen.getByText(/I don't know, LOL/)).toBeVisible());
    expect(screen.getByText('oh look, another error')).toBeVisible();
  }, 10000);

  it('should display a general error message when the account creation fails due to a network error', async () => {
    const { renderFn } = preRender();
    renderFn(AccountCreation);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeDisabled());

    await populateDetailsAboutYouFields();
    userEvent.clear(screen.getByLabelText('Last name'));
    userEvent.type(screen.getByLabelText('Last name'), 'Failure');
    userEvent.click(nextButton);

    await screen.findByText(
      'Share your contact info so we can help you through the process and set up your account.'
    );

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => expect(submitButton).toBeDisabled());

    await populateContactInfoFields();
    userEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred creating your account, please try again./)
      ).toBeVisible()
    );
  }, 10000);
});
