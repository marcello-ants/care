// External Dependencies
import { screen, waitFor } from '@testing-library/react';

// Internal Dependencies
import { preRenderPage } from '@/__setup__/testUtil';
import Enrollment from '../Enrollment';

// Helper Functions

function customRender() {
  const { renderFn } = preRenderPage();
  const view = renderFn(<Enrollment />);

  return view;
}

describe('<Enrollment>', () => {
  it('matches snapshot - Provider Form', async () => {
    const { asFragment } = customRender();
    await waitFor(() => {
      expect(screen.getByText(new RegExp('You must be 18 years', 'i'))).toBeInTheDocument();
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
