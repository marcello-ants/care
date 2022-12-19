import { render, screen } from '@testing-library/react';
import ProgressDots from '../ProgressDots';

describe('ProgressDots', () => {
  it('should render snapshot', () => {
    const { asFragment } = render(<ProgressDots stepNumber={1} totalSteps={5} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render 5 dots', () => {
    render(<ProgressDots stepNumber={1} totalSteps={5} />);
    expect(screen.getAllByRole('listitem').length).toBe(5);
  });
});
