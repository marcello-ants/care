import { render } from '@testing-library/react';
import FullWidthWithPaddingLayout from '../FullWidthWithPaddingLayout';

describe('FullWidthWithPadding Layout component', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<FullWidthWithPaddingLayout>test</FullWidthWithPaddingLayout>);
    expect(asFragment()).toMatchSnapshot();
  });
});
