import { render, screen } from '@testing-library/react';
import { cloneDeep } from 'lodash-es';
import { NextRouter, useRouter } from 'next/router';
import { AppState } from '@/types/app';
import { initialAppState } from '@/state';
import { AppStateProvider } from '@/components/AppState';
import userEvent from '@testing-library/user-event';
import { testingCommunity } from '@/components/pages/seeker/sc/in-facility/community-list/tests/CommunityHelper';
import CommunityCard from '../CommunityCard';

const onCheck: jest.Mock = jest.fn();
const onClick = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
let handleChangeMock: jest.Mock;
let mockRouter: Pick<NextRouter, 'push' | 'asPath' | 'pathname'>;

const props = {
  key: '1',
  selectedCommunity: testingCommunity,
  checked: true,
  index: 0,
  onCheck,
  onClick,
  displayCheckbox: true,
};

const propsAutoLeadTest = {
  key: '1',
  selectedCommunity: testingCommunity,
  checked: true,
  index: 0,
  onCheck,
  onClick,
  displayCheckbox: false,
};

const clonedAppState = cloneDeep(initialAppState);
const appState: AppState = {
  ...clonedAppState,
  flow: {
    ...clonedAppState.flow,
    memberId: '123',
    userHasAccount: false,
  },
};

function renderCard(overrideState?: AppState) {
  handleChangeMock = jest.fn();
  const pathname = '/seeker/sc/in-facility/community-list';
  mockRouter = {
    push: jest.fn(),
    asPath: pathname,
    pathname,
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AppStateProvider initialStateOverride={overrideState || appState}>
      <CommunityCard {...props} onCheck={handleChangeMock} />
    </AppStateProvider>
  );
}

describe('CommunityCard', () => {
  it('matches snapshot', () => {
    const view = renderCard();
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('calls onCheck when checkmark is selected', () => {
    renderCard();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    checkbox.click();
    expect(handleChangeMock).toHaveBeenCalled();
  });

  it('calls onClick when card is clicked', () => {
    renderCard();
    const image = screen.getByTestId('image');
    userEvent.click(image);
    expect(onClick).toHaveBeenCalled();
  });

  it('should not append the index when not passed', () => {
    const overrideProps = { ...props };
    render(<CommunityCard {...overrideProps} />);
    expect(screen.getByText('1. Signature Senior Living', { exact: true })).toBeInTheDocument();
  });

  it('should not display checkboxes', () => {
    const overrideProps = { ...propsAutoLeadTest };
    render(<CommunityCard {...overrideProps} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
