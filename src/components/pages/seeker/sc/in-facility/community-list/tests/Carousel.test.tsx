import { render, screen, fireEvent } from '@testing-library/react';
import { useMediaQuery } from '@material-ui/core';
import userEvent from '@testing-library/user-event';
import Carousel from '../Carousel';

jest.mock('@material-ui/core', () => ({
  // @ts-ignore
  ...jest.requireActual('@material-ui/core'),
  useMediaQuery: jest.fn(),
}));

const props = {
  steps: [
    {
      label: 'San Francisco – Oakland Bay Bridge, United States1',
      imgPath: `app/enrollment/community-list/1.jpg`,
    },
    {
      label: 'San Francisco – Oakland Bay Bridge, United States2',
      imgPath: `app/enrollment/community-list/2.jpg`,
    },
    {
      label: 'San Francisco – Oakland Bay Bridge, United States3',
      imgPath: `app/enrollment/community-list/3.jpg`,
    },
    {
      label: 'San Francisco – Oakland Bay Bridge, United States4',
      imgPath: `app/enrollment/community-list/4.jpg`,
    },
    {
      label: 'San Francisco – Oakland Bay Bridge, United States5',
      imgPath: `app/enrollment/community-list/5.jpg`,
    },
  ],
};

const createClientXYObject = (x?: number, y?: number) => ({
  clientX: x,
  clientY: y,
});
// Create touch event
const cte = ({ x, y }: { x?: number; y?: number }) => ({
  touches: [createClientXYObject(x, y)],
});

function renderComponent({ isDesktop }: { isDesktop: boolean }) {
  (useMediaQuery as jest.Mock).mockReturnValue(isDesktop);

  return render(<Carousel {...props} />);
}

describe('Carousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  it('matches snapshot mobile', () => {
    const view = renderComponent({ isDesktop: false });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot desktop', () => {
    const view = renderComponent({ isDesktop: true });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should match snapshot on right button click', () => {
    const view = renderComponent({ isDesktop: true });
    const rightButton = screen.getByTestId('rightButton');
    userEvent.click(rightButton);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should match snapshot on left button click', () => {
    const view = renderComponent({ isDesktop: true });
    const leftButton = screen.getByTestId('leftButton');
    userEvent.click(leftButton);
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should match snapshot on right swipe', () => {
    const view = renderComponent({ isDesktop: false });
    const touchArea = screen.getByTestId('0');
    fireEvent.touchStart(touchArea, cte({ x: 100, y: 0 }));
    fireEvent.touchMove(touchArea, cte({ x: 125, y: 0 }));
    fireEvent.touchEnd(touchArea, cte({}));
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should match snapshot on left swipe', () => {
    const view = renderComponent({ isDesktop: false });
    const touchArea = screen.getByTestId('0');
    fireEvent.touchStart(touchArea, cte({ x: 100, y: 0 }));
    fireEvent.touchMove(touchArea, cte({ x: 0, y: 0 }));
    fireEvent.touchEnd(touchArea, cte({}));
    expect(view.asFragment()).toMatchSnapshot();
  });
});
