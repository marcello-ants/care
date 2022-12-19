import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RateForAChild, { Props } from '../RateForAChild';

function renderComponent(props: Props) {
  return render(<RateForAChild {...props} />);
}

describe('RateForAChild', () => {
  it('matches snapshot for the first item', () => {
    const view = renderComponent({
      index: 0,
      onChange: () => {},
      min: 0,
      max: 0,
      value: 0,
    });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('matches snapshot for the last item', () => {
    const onRemove = jest.fn();
    const view = renderComponent({
      index: 1,
      onChange: () => {},
      onRemove,
      min: 0,
      max: 0,
      value: 0,
    });
    expect(view.asFragment()).toMatchSnapshot();
  });

  it('should call the callback on change', () => {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    renderComponent({
      index: 1,
      onChange,
      onRemove,
      min: 0,
      max: 0,
      value: 0,
    });
    // fireEvent.mouseDown(screen.getByTestId('rate-slider'));
    fireEvent.mouseDown(screen.getByRole('slider'));
    expect(onChange).toBeCalled();
  });

  it('should call the callback on remove', () => {
    const onChange = jest.fn();
    const onRemove = jest.fn();
    renderComponent({
      index: 1,
      onChange,
      onRemove,
      min: 0,
      max: 0,
      value: 0,
    });
    fireEvent.click(screen.getByTestId('remove-rate'));
    expect(onRemove).toBeCalled();
  });
});
