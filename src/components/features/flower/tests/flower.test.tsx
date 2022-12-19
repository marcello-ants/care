import { render } from '@testing-library/react';
import Flower from '../flower';

const flowerSVGProps = {
  viewBox: { minX: 50, minY: 0, width: 50, height: 42 },
  width: {
    mobile: 88,
    desktop: 176,
  },
  height: {
    mobile: 72,
    desktop: 144,
  },
  fillColor: '#FBD4D0',
};

describe('Flower SVG', () => {
  it('should match the snapshot with default props', () => {
    const { asFragment } = render(<Flower />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match the snapshot with custom props', () => {
    const { asFragment } = render(
      <Flower
        viewBox={flowerSVGProps.viewBox}
        width={flowerSVGProps.width}
        height={flowerSVGProps.height}
        fillColor={flowerSVGProps.fillColor}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
