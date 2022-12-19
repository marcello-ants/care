import { fireEvent, screen } from '@testing-library/react';
import { preRenderPage } from '@/__setup__/testUtil';
import { IconIllustrationLargeIndependent, IconIllustrationLargeNursing } from '@care/react-icons';
import { SeniorLivingOptions } from '@/types/seeker';

import SeniorLivingCard from '../senior-living-card';

describe('SeniorLivingCard', () => {
  it('Match snapshot', () => {
    const { renderFn } = preRenderPage();
    const { asFragment } = renderFn(
      <SeniorLivingCard
        image={<IconIllustrationLargeIndependent width="96px" height="80" />}
        title="Independent living"
        text="For those who are still able to live an active lifestyle on their own, but prefer more socialization and support than they would typically get at home."
        type={SeniorLivingOptions.INDEPENDENT}
        recommended
        handleContinue={() => {}}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should not show Recommended label', () => {
    const { renderFn } = preRenderPage();
    renderFn(
      <SeniorLivingCard
        image={<IconIllustrationLargeIndependent width="96px" height="80" />}
        title="Independent living"
        text="For those who are still able to live an active lifestyle on their own, but prefer more socialization and support than they would typically get at home."
        handleContinue={() => {}}
        type={SeniorLivingOptions.INDEPENDENT}
      />
    );

    expect(screen.queryByText('Our recommendation')).not.toBeInTheDocument();
  });

  it('Should show Recommended label', () => {
    const { renderFn } = preRenderPage();
    renderFn(
      <SeniorLivingCard
        image={<IconIllustrationLargeIndependent width="96px" height="80" />}
        title="Independent living"
        text="For those who are still able to live an active lifestyle on their own, but prefer more socialization and support than they would typically get at home."
        handleContinue={() => {}}
        recommended
        type={SeniorLivingOptions.INDEPENDENT}
      />
    );

    expect(screen.getByText('Our recommendation')).toBeInTheDocument();
  });

  it('Should show Find caregivers text on button when passing nursing type', () => {
    const { renderFn } = preRenderPage();
    renderFn(
      <SeniorLivingCard
        image={<IconIllustrationLargeIndependent width="96px" height="80" />}
        title="Independent living"
        text="For those who are still able to live an active lifestyle on their own, but prefer more socialization and support than they would typically get at home."
        handleContinue={() => {}}
        type={SeniorLivingOptions.NURSING_HOME}
      />
    );

    expect(screen.getByText('Find caregivers')).toBeInTheDocument();
  });

  it('Should call handler', () => {
    const { renderFn } = preRenderPage();
    const handlerContinueMock = jest.fn();
    renderFn(
      <SeniorLivingCard
        image={<IconIllustrationLargeIndependent width="96px" height="80" />}
        title="Independent living"
        text="For those who are still able to live an active lifestyle on their own, but prefer more socialization and support than they would typically get at home."
        recommended
        type={SeniorLivingOptions.INDEPENDENT}
        handleContinue={handlerContinueMock}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handlerContinueMock).toHaveBeenCalledTimes(1);
  });
});

it('Should render new nursing home card for salc optimization test', () => {
  const { renderFn } = preRenderPage();
  const handlerContinueMock = jest.fn();
  renderFn(
    <SeniorLivingCard
      image={<IconIllustrationLargeNursing width="96px" height="80" />}
      title="Nursing home"
      text="For those needing more extensive support – whether in executing daily tasks or administrating medicine and care.'"
      recommended
      type={SeniorLivingOptions.NURSING_HOME}
      handleContinue={handlerContinueMock}
      flag
    />
  );

  fireEvent.click(screen.getByRole('button'));
  expect(handlerContinueMock).toHaveBeenCalledTimes(1);
});
