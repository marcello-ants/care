import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { preRenderPage } from '@/__setup__/testUtil';
import { GET_ZIP_CODE_SUMMARY } from '@/components/request/GQL';
import { LTCG_ROUTES } from '@/constants';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import WherePage from '../where';

const mocks = [
  {
    request: {
      query: GET_ZIP_CODE_SUMMARY,
      variables: {
        zipcode: '78701',
      },
    },
    result: {
      data: {
        getZipcodeSummary: {
          __typename: 'ZipcodeSummary',
          city: 'Austin',
          state: 'TX',
          zipcode: '78701',
          latitude: 3,
          longitude: 3,
        },
      },
    },
  },
  {
    request: {
      query: GET_ZIP_CODE_SUMMARY,
      variables: {
        zipcode: '90631',
      },
    },
    result: {
      data: {
        getZipcodeSummary: {
          __typename: 'ZipcodeSummary',
          city: 'La Habra',
          state: 'CA',
          zipcode: '90631',
          latitude: 3,
          longitude: 3,
        },
      },
    },
  },
];

describe('LTCG Where Page', () => {
  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(WherePage);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should enable the CTA once a valid zip is entered', async () => {
    const { renderFn } = preRenderPage({ mocks, addTypeName: true });
    renderFn(WherePage);

    const zipCode = await screen.findByLabelText('ZIP code');
    await userEvent.type(zipCode, '78701', { delay: 1 });
    await screen.findByText('Austin, TX');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled());
  });

  it('should navigate to location eligible page when zip code is eligible', async () => {
    const { renderFn, routerMock } = preRenderPage({ mocks, addTypeName: true });
    renderFn(WherePage);

    const zipCode = await screen.findByLabelText('ZIP code');
    await userEvent.type(zipCode, '78701', { delay: 1 });
    await screen.findByText('Austin, TX');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.click(nextButton);
    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith(LTCG_ROUTES.WHEN));
  });

  it('should navigate to location ineligible page when zip code is ineligible', async () => {
    const { renderFn, routerMock } = preRenderPage({ mocks, addTypeName: true });
    renderFn(WherePage);

    const zipCode = await screen.findByLabelText('ZIP code');
    await userEvent.type(zipCode, '90631', { delay: 1 });
    await screen.findByText('La Habra, CA');
    const nextButton = screen.getByRole('button', { name: 'Next' });
    await waitFor(() => expect(nextButton).toBeEnabled());

    userEvent.click(nextButton);
    await waitFor(() =>
      expect(routerMock.push).toHaveBeenCalledWith(LTCG_ROUTES.LOCATION_INELIGIBLE)
    );
  });

  it('should pre-populate with the value from app state', async () => {
    const appState: AppState = {
      ...initialAppState,
      ltcg: {
        ...initialAppState.ltcg,
        location: {
          city: '',
          state: '',
          zipcode: '90631',
        },
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(WherePage);

    const zipCode = await screen.findByLabelText('ZIP code');
    expect(zipCode).toHaveValue(90631);
  });
});
