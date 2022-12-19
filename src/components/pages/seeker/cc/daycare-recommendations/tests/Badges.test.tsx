import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { RatingBadge, LicenseBadge, DaycareCenterBadge, InHomeDaycareBadge } from '../Badges';

describe('<Badges />', () => {
  it('RatingBadge renders correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <RatingBadge label="test 1" />
      </ThemeProvider>
    );
    expect(screen.getByText('test 1')).toBeInTheDocument();
  });

  it('LicenseBadge renders correctly', async () => {
    render(
      <ThemeProvider theme={theme}>
        <LicenseBadge name="abc care" verifiedDate="8/22/2020" />
      </ThemeProvider>
    );
    expect(screen.getByText('License Verified')).toBeInTheDocument();
  });

  it('Daycare Badge renders correctly when expanded', async () => {
    render(
      <ThemeProvider theme={theme}>
        <DaycareCenterBadge />
      </ThemeProvider>
    );

    const badge = screen.getByText('Daycare center');
    userEvent.click(badge);

    await screen.findByText(
      'verifies on a monthly basis that this childcare center has an active license to operate.'
    );
    expect(screen.getByText('Daycare center')).toBeInTheDocument();
  });

  it('In-home care Badge renders correctly when expanded', async () => {
    render(
      <ThemeProvider theme={theme}>
        <InHomeDaycareBadge />
      </ThemeProvider>
    );

    const badge = screen.getByText('In-home daycare');
    userEvent.click(badge);

    await screen.findByText('This is an in-home daycare.');
    expect(screen.getByText('In-home daycare')).toBeInTheDocument();
  });
});
