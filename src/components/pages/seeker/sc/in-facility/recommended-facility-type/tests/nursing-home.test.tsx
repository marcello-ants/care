import { screen, fireEvent } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import { SeniorCareRecipientRelationshipType } from '@/__generated__/globalTypes';
import { AppState } from '@/types/app';

import NursingHome from '../nursing-home';

const windowLocationAssignMock = jest.fn();

describe('RecommendedFacilityType - NursingHome', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = {
      assign: windowLocationAssignMock,
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Match Snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(NursingHome);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render information with PARENT header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.PARENT,
        },
      },
    });
    renderFn(NursingHome);

    expect(
      screen.getByText(
        'A nursing home may be a good fit for your parent given the extensive support needed.'
      )
    ).toBeInTheDocument();
  });

  it('Should render information with SPOUSE header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.SPOUSE,
        },
      },
    });
    renderFn(NursingHome);

    expect(
      screen.getByText(
        'A nursing home may be a good fit for your spouse given the extensive support needed.'
      )
    ).toBeInTheDocument();
  });

  it('Should render information with LOVED ONE header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.OTHER,
        },
      },
    });
    renderFn(NursingHome);

    expect(
      screen.getByText(
        'A nursing home may be a good fit for your loved one given the extensive support needed.'
      )
    ).toBeInTheDocument();
  });

  it('Should render information with SELF header', () => {
    const { renderFn } = preRenderPage({
      appState: {
        ...initialAppState,
        seeker: {
          ...initialAppState.seeker,
          whoNeedsCare: SeniorCareRecipientRelationshipType.SELF,
        },
      },
    });
    renderFn(NursingHome);

    expect(
      screen.getByText(
        'A nursing home may be a good fit for yourself given the extensive support needed.'
      )
    ).toBeInTheDocument();
  });

  it('Medicare website link should have href link', () => {
    const { renderFn } = preRenderPage();
    renderFn(NursingHome);
    const medicareLink = screen.getByText('Medicare website.');
    // @ts-ignore
    expect(medicareLink?.parentNode?.href).toBe(
      'https://www.medicare.gov/care-compare/?providerType=NursingHome&redirect=true'
    );
  });

  it('should redirect correctly to search results if clicked on in home card', () => {
    const appState: AppState = {
      ...initialAppState,
      seeker: {
        ...initialAppState.seeker,
        zipcode: '78665',
      },
    };

    const { renderFn } = preRenderPage({ appState });
    renderFn(NursingHome);

    const link = screen.getByRole('button', { name: 'Find a caregiver' });
    fireEvent.click(link);

    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      '/mwb/member/sitterSearchTest?serviceId=SENIRCARE&zip=78665&overrideMfeRedirect=true'
    );
  });

  it('Should redirect to correct path - questions-ask-assisted-living-facility?', () => {
    const { renderFn } = preRenderPage();
    renderFn(NursingHome);

    // @ts-ignore
    delete window.location;
    /* eslint-disable no-restricted-globals */
    (window.location as Pick<typeof window.location, 'assign'>) = {
      assign: windowLocationAssignMock,
    };

    const viewArticlesLink = screen.getByText('View articles and guides');
    fireEvent.click(viewArticlesLink);
    expect(windowLocationAssignMock).toHaveBeenCalledWith(
      'https://www.care.com/c/stories/15645/questions-ask-assisted-living-facility/'
    );
  });
});
