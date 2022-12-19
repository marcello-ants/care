import { render } from '@testing-library/react';
import FullWidthLayout from '../FullWidthLayout';

describe('FullWidthLayout Layout component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<FullWidthLayout>test</FullWidthLayout>);
    expect(asFragment()).toMatchSnapshot();
  });
});
