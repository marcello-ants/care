import { screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { IconIllustrationLargeAssisted } from '@care/react-icons';

import Layout from '../layout';

describe('RecommendedFacilityType - Layout', () => {
  it('Match snapshot', () => {
    const LayoutComponent = (
      <Layout
        icon={<IconIllustrationLargeAssisted width="200px" height="167px" />}
        header="An independent living community may match your [parent]’s needs.">
        <div />
      </Layout>
    );
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(LayoutComponent);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should pass children component', () => {
    const LayoutComponent = (
      <Layout
        icon={<IconIllustrationLargeAssisted width="200px" height="167px" />}
        header="An independent living community may match your [parent]’s needs.">
        <div>dummy children component</div>
      </Layout>
    );
    const { renderFn } = preRenderPage();
    renderFn(LayoutComponent);

    expect(
      screen.getByText('An independent living community may match your [parent]’s needs.')
    ).toBeInTheDocument();
    expect(screen.getByText('dummy children component')).toBeInTheDocument();
  });
});
