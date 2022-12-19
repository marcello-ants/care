import { caregivers } from '@/components/pages/seeker/sc/recap/recap';
import { render } from '@testing-library/react';

import RecapPage from '../RecapPage';

describe('RecapPage', () => {
  it('should render snapshot with provided texts', () => {
    const info = '100% of caregivers are required to complete our background check';
    const title = 'Looking for caregivers...';
    const { asFragment } = render(
      <RecapPage title={title} info={info} onComplete={() => false} caregivers={caregivers} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
