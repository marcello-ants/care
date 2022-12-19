import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ContactMethod from '@/components/pages/seeker/cc/account-creation/ContactMethod';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import { CLIENT_FEATURE_FLAGS } from '@/constants';

describe('Contact Method for daycare', () => {
  it('Matches snapshot and logs test exposure event', async () => {
    const logTestExposure = jest.spyOn(AnalyticsHelper, 'logTestExposure');
    const { asFragment } = render(<ContactMethod error={false} onChange={() => {}} value="" />);
    expect(asFragment()).toMatchSnapshot();
    expect(logTestExposure).toBeCalledTimes(1);
    expect(logTestExposure.mock.calls[0][0]).toBe(CLIENT_FEATURE_FLAGS.CC_DC_CONTACT_METHOD);
  });

  [
    {
      label: 'Call me',
      value: 'PHONE',
    },
    {
      label: 'Email me',
      value: 'MAIL',
    },
  ].forEach(({ label, value }) =>
    it(`Calls onChage for click on '${label}' radio button with value '${value}'`, async () => {
      const onChangeMock = jest.fn();
      render(<ContactMethod error={false} onChange={onChangeMock} value="" />);
      fireEvent.click(screen.getByText(label));
      expect(onChangeMock).toBeCalledTimes(1);

      expect(onChangeMock.mock.calls[0][0].target.value).toBe(value);
    })
  );

  it('Displays error message when `error` flag is `true`', async () => {
    render(<ContactMethod error onChange={() => {}} value="" />);
    expect(screen.getByText('Contact method is required')).toBeInTheDocument();
  });
});
