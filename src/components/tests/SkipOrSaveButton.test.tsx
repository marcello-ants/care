import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkipOrSaveButton from '../SkipOrSaveButton';

let renderResult: RenderResult;
const onSkip = jest.fn();
const onSave = jest.fn();

const props = {
  onSkip,
  onSave,
  showToastMessage: false,
  isDrawerView: false,
  saveButtonText: 'Save',
  passButtonText: 'Skip',
};

describe('CommunityCard', () => {
  it('matches snapshot', () => {
    renderResult = render(<SkipOrSaveButton {...props} />);
    expect(renderResult.asFragment()).toMatchSnapshot();
  });

  it('should display default text when no skipButtonText and no saveButtonText are passed', () => {
    const noDefaultTextProps = {
      onSkip,
      onSave,
      showToastMessage: false,
      isDrawerView: false,
    };
    renderResult = render(<SkipOrSaveButton {...noDefaultTextProps} />);
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Add to list')).toBeInTheDocument();
  });
  it('should display heart icon and text when no skipButtonText and no saveButtonText are passed', () => {
    const noDefaultTextProps = {
      onSkip,
      onSave,
      showToastMessage: true,
      isDrawerView: false,
      saveButtonText: 'Like',
      heartSaveButtonIcon: true,
    };
    renderResult = render(<SkipOrSaveButton {...noDefaultTextProps} />);
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Like')).toBeInTheDocument();
    expect(screen.getByText('Caregiver favorited!')).toBeInTheDocument();
  });

  it('calls onSave on save button click', () => {
    renderResult = render(<SkipOrSaveButton {...props} />);
    const saveButton = screen.getByText('Save');
    userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('calls onSkip on skip button click', () => {
    renderResult = render(<SkipOrSaveButton {...props} />);
    const skipButton = screen.getByText('Skip');
    userEvent.click(skipButton);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
