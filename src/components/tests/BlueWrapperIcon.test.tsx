import { render } from '@testing-library/react';
import { Icon24InfoSeniorCare, Icon24InfoChildCare } from '@care/react-icons';
import BlueWrapperIcon from '../BlueWrapperIcon';

describe('BlueWrapperIcon Tests', () => {
  it('matches snapshot with SC Icon', () => {
    expect(
      render(
        <BlueWrapperIcon icon={<Icon24InfoSeniorCare />} iconColor="#fff" iconSize="39px" />
      ).asFragment()
    ).toMatchSnapshot();
  });

  it('matches snapshot with CC Icon', () => {
    expect(
      render(
        <BlueWrapperIcon icon={<Icon24InfoChildCare />} iconColor="#fff" iconSize="39px" />
      ).asFragment()
    ).toMatchSnapshot();
  });
});
