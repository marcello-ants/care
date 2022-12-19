import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LTCG_ROUTES } from '@/constants';
import { preRenderPage } from '@/__setup__/testUtil';
import { initialAppState } from '@/state';
import { AppState } from '@/types/app';
import { InsuranceCarrierEnum } from '@/types/ltcg';
import InsuranceCarrier from '../insurance-carrier';

function renderComponent() {
  const { renderFn, routerMock } = preRenderPage({
    pathname: '/ltcg/insurance-carrier',
  });

  const utils = renderFn(InsuranceCarrier);
  return { ...utils, mockRouter: routerMock };
}

describe('InsuranceCarrier', () => {
  it('matches snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(InsuranceCarrier);
    expect(asFragment()).toMatchSnapshot();
  });

  it('redirects to correct path when cna is selected', () => {
    const { mockRouter } = renderComponent();
    const cnaOption = screen.getByLabelText('CNA');
    userEvent.click(cnaOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('redirects to correct path when John Hancock is selected', () => {
    const { mockRouter } = renderComponent();
    const cnaOption = screen.getByLabelText('John Hancock');
    userEvent.click(cnaOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('redirects to correct path when MetLife is selected', () => {
    const { mockRouter } = renderComponent();
    const noneOption = screen.getByLabelText('MetLife');
    userEvent.click(noneOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('redirects to correct path when Bankers Life is selected', () => {
    const { mockRouter } = renderComponent();
    const noneOption = screen.getByLabelText('Bankers Life');
    userEvent.click(noneOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.ELIGIBLE_POLICY);
  });
  it('redirects to correct path when TransAmerica is selected', () => {
    const { mockRouter } = renderComponent();
    const noneOption = screen.getByLabelText('Transamerica');
    userEvent.click(noneOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('redirects to correct path when Mutual of Omaha is selected', () => {
    const { mockRouter } = renderComponent();
    const noneOption = screen.getByLabelText('Mutual of Omaha');
    userEvent.click(noneOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('redirects to correct path when Senior Health Insurance Company of Pennsylvania is selected', () => {
    const { mockRouter } = renderComponent();
    const noneOption = screen.getByLabelText('Senior Health Insurance Company of Pennsylvania');
    userEvent.click(noneOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('redirects to correct path when none is selected', () => {
    const { mockRouter } = renderComponent();
    const noneOption = screen.getByLabelText('None of the above');
    userEvent.click(noneOption);
    const nextButton = screen.getByText('Next');
    userEvent.click(nextButton);
    expect(mockRouter.push).toBeCalledTimes(1);
    expect(mockRouter.push).toBeCalledWith(LTCG_ROUTES.POLICY_INELIGIBLE);
  });

  it('should pre-select the value from app state', () => {
    const appState: AppState = {
      ...initialAppState,
      ltcg: {
        ...initialAppState.ltcg,
        insuranceCarrier: InsuranceCarrierEnum.JOHN_HANCOCK,
      },
    };
    const { renderFn } = preRenderPage({ appState });
    renderFn(InsuranceCarrier);
    const johnHancock = screen.getByLabelText('John Hancock');
    expect(johnHancock).toBeChecked();
  });

  it('should highlight the selected option when clicked', () => {
    const { renderFn } = preRenderPage();
    renderFn(InsuranceCarrier);
    const johnHancock = screen.getByLabelText('John Hancock');
    expect(johnHancock).not.toBeChecked();
    userEvent.click(johnHancock);
    expect(johnHancock).toBeChecked();
  });
});
