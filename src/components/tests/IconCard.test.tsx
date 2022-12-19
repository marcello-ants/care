import { render } from '@testing-library/react';
import { IconIllustrationSmallPolaroids } from '@care/react-icons';
import IconCard, { IconCardProps } from '../IconCard';

describe('CaregiverCard', () => {
  const defaultProps: IconCardProps = {
    icon: <IconIllustrationSmallPolaroids size="64px" />,
    iconTitle: 'Need in-home care while you wait?',
    header: 'Need in-home care while you wait?',
    description: 'Share a few more details in a job post to help you match with caregivers.',
    linkContent: 'Find a caregiver',
    onClick: () => () => {},
  };

  function renderComponent(props?: IconCardProps) {
    return render(<IconCard {...(props || defaultProps)} />);
  }

  it('should match the snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot();
  });
});
