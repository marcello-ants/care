// External Dependencies
import { render } from '@testing-library/react';

// Internal Dependencies
import SimpleHeader from '../index';

// Helper Functions

function customRender() {
  const view = render(<SimpleHeader />);

  return view;
}

describe('<SimpleHeader>', () => {
  it('matches snapshot', () => {
    const { asFragment } = customRender();
    expect(asFragment()).toMatchSnapshot();
  });
});
