import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import HearAboutUs, { HearAboutUsOptions } from '../HearAboutUs';

const mockValue = HearAboutUsOptions[0].value;
const mockHelpText = 'This is a helper text';
const mockOnChangeHandler = jest.fn();
const mockOnBlurHandler = jest.fn();

describe('HearAboutUs', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <HearAboutUs
        name="source"
        id="source"
        value={mockValue}
        onChange={mockOnChangeHandler}
        onBlur={mockOnBlurHandler}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with the default text', () => {
    render(
      <HearAboutUs
        name="source"
        id="source"
        onChange={mockOnChangeHandler}
        onBlur={mockOnBlurHandler}
      />
    );
    expect(screen.getByText('How did you hear about us?')).toBeInTheDocument();
  });

  HearAboutUsOptions.forEach((currentOption) => {
    it(`should display ${currentOption.label} if passing ${currentOption.value}`, () => {
      render(
        <HearAboutUs
          name="source"
          id="source"
          value={currentOption.value}
          onChange={mockOnChangeHandler}
          onBlur={mockOnBlurHandler}
        />
      );

      expect(screen.getByText(currentOption.label)).toBeInTheDocument();
    });
  });

  it('should call the onChange and onBlur handlers', async () => {
    render(
      <HearAboutUs
        name="source"
        id="source"
        helpText={mockHelpText}
        onChange={mockOnChangeHandler}
        onBlur={mockOnBlurHandler}
      />
    );

    fireEvent.mouseDown(screen.getByRole('button'));
    const listbox = within(screen.getByRole('listbox'));
    fireEvent.click(listbox.getByText('Cable TV Ad'));

    await act(() => new Promise<undefined>((resolve) => setTimeout(resolve, 0)));

    expect(mockOnChangeHandler).toHaveBeenCalled();
    fireEvent.blur(screen.getByRole('button'));
    expect(mockOnBlurHandler).toHaveBeenCalled();
  });

  it('should show helper text', () => {
    render(
      <HearAboutUs
        name="source"
        id="source"
        value={mockValue}
        helpText={mockHelpText}
        onChange={mockOnChangeHandler}
        onBlur={mockOnBlurHandler}
      />
    );
    expect(screen.getByText(mockHelpText)).toBeInTheDocument();
  });
});
