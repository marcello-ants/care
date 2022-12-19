import { render } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render snapshot', () => {
    const { asFragment } = render(<ProgressBar stepNumber={1} totalSteps={5} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
