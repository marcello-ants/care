import { render } from '@testing-library/react';
import DidYouKnow from '../DidYouKnow';

describe('DidYouKnow', () => {
  it('should render snapshot with provided text', () => {
    const { asFragment } = render(
      <DidYouKnow info="100% of caregivers are required to complete our background check" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
