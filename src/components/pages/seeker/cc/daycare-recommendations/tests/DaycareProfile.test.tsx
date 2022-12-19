import React from 'react';
import { ThemeProvider, useMediaQuery } from '@material-ui/core';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { theme } from '@care/material-ui-theme';

import { DaycareProviderProfile } from '@/types/seekerCC';
import DaycareProfile from '../DaycareProfile';

jest.mock('next/config', () => () => {
  return {
    publicRuntimeConfig: {
      GOOGLE_MAPS_KEY: 'abc',
    },
  };
});

jest.mock('@material-ui/core', () => ({
  // @ts-ignore
  ...jest.requireActual('@material-ui/core'),
  useMediaQuery: jest.fn(),
}));

const dayCareSample: DaycareProviderProfile = {
  __typename: 'Provider',
  id: '1',
  description:
    'The Transportation Childrens Center, a non-profit child care facility, in downtown Boston, provides full day Infant, Toddler, Preschool and Pre-Kindergarten Programs year round. Open to the general public, the center is available to children 3 months through age five. The center is open from 8:00 a.m. to 6:00 p.m. with both part time and full time programs available. Every effort is made to keep tuition rates as low as possible while maintaining high quality services. The established and long-term professional staff hold degrees in early education and have extensive experience working with young children. The facility provides an outdoor roof-top play space, drop-off parking and is accessible by the MBTA.\r\nEstablished since 1986 the center is NAEYC Accredited. The beautifully designed and well-equipped center provides a stimulating and nurturing environment which will enhance the childrens self-esteem and future success in school. TCC has implemented the Creative Curriculum philosophy, a hands-on approach to learning and discovering where activities are planned to assure optimum growth and development of the whole child. Slots are filled on a first come, first served basis according to status on the wait list. Families are encouraged to visit the center and schedule a tour.',
  name: 'CARE AFTER SCHOOL - COLONIAL HILLS ELEMENTARY',
  logo: null,
  images: null,
  address: null,
  reviews: null,
  avgReviewRating: 3,
  license: null,
  selected: false,
  hasCoordinates: true,
  centerType: null,
};

let onCloseMock: jest.Mock;

function renderPage({ isDesktop }: { isDesktop: boolean }) {
  (useMediaQuery as jest.Mock).mockReturnValue(isDesktop);
  onCloseMock = jest.fn();

  return render(
    <ThemeProvider theme={theme}>
      <DaycareProfile isOpen onClose={onCloseMock} dayCare={dayCareSample} />
    </ThemeProvider>
  );
}

describe('<DaycareProfile />', () => {
  it('desktop matches snapshot', () => {
    const view = renderPage({ isDesktop: true });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('mobile matches snapshot', () => {
    const view = renderPage({ isDesktop: false });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('closes the drawer when clicking close CTA', () => {
    renderPage({ isDesktop: true });
    const button = screen.getByRole('button', { name: 'Close' });
    userEvent.click(button);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
