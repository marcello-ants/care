import { screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import { InsuranceCarrierEnum } from '@/types/ltcg';
import PolicyIneligible from '../policy-ineligible';

describe('PolicyIneligible Page', () => {
  it('matches snapshot', () => {
    const ltcgState = {
      ...initialAppState,
      ltcg: { ...initialAppState.ltcg, insuranceCarrier: InsuranceCarrierEnum.UNSURE },
    };
    const { renderFn } = preRenderPage({ appState: ltcgState });
    const { asFragment } = renderFn(PolicyIneligible);

    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render correctly (UNSURE carrier policy)', () => {
    const ltcgState = {
      ...initialAppState,
      ltcg: { ...initialAppState.ltcg, insuranceCarrier: InsuranceCarrierEnum.UNSURE },
    };
    const { renderFn } = preRenderPage({ appState: ltcgState });
    renderFn(PolicyIneligible);

    const headerText = screen.getByText(/Unfortunately, we’ll need to know your policy carrier./i);
    const bannerText = screen.getByText(
      /Call us to learn more about our offering so you can discuss it with your carrier./i
    );
    const bannerPhoneText = screen.getByText(/877-367-1959/i);
    expect(bannerText).toBeInTheDocument();
    expect(bannerPhoneText).toBeInTheDocument();
    expect(headerText).toBeInTheDocument();
  });

  it('Should render correctly (NONE carrier policy)', () => {
    const ltcgState = {
      ...initialAppState,
      ltcg: { ...initialAppState.ltcg, insuranceCarrier: InsuranceCarrierEnum.NONE },
    };
    const { renderFn } = preRenderPage({ appState: ltcgState });
    renderFn(PolicyIneligible);

    const headerText = screen.getByText(
      /We’re still working with your carrier on getting set up./i
    );
    const bannerText = screen.getByText(
      /Call us to learn more about our offering so you can discuss it with your carrier./i
    );
    const bannerPhoneText = screen.getByText(/877-367-1959/i);
    expect(bannerText).toBeInTheDocument();
    expect(bannerPhoneText).toBeInTheDocument();
    expect(headerText).toBeInTheDocument();
  });
});
