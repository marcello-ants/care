import { render, screen, waitFor } from '@testing-library/react';
import { useMediaQuery } from '@material-ui/core';
import { CareType } from '../CareTypeCard';
import SeniorLivingPreview from '../SeniorLivingPreview';

jest.mock('@material-ui/core', () => {
  const originalMUI = jest.requireActual('@material-ui/core');

  return {
    __esModule: true,
    ...originalMUI,
    useMediaQuery: jest.fn().mockReturnValue(false),
  };
});

describe('SeniorLivingPreview', () => {
  const defaultSeniorLivingTypes: CareType[] = [
    {
      description: 'Independent Living',
    },
    {
      description: 'Assisted Living',
    },
    {
      description: 'Memory care',
    },
  ];

  let onComplete: jest.Mock;
  beforeEach(() => {
    onComplete = jest.fn();
  });

  function renderComponent(seniorLivingTypes?: CareType[]) {
    return render(
      <SeniorLivingPreview
        seniorLivingTypes={seniorLivingTypes || defaultSeniorLivingTypes}
        onComplete={onComplete}
      />
    );
  }

  it('should match the snapshot', () => {
    expect(renderComponent().asFragment()).toMatchSnapshot();
  });

  it('should call onComplete after displaying the passed Senior Living Types', async () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderComponent([defaultSeniorLivingTypes[0]]);
    await waitFor(() => expect(screen.getByText('Independent Living')).toBeVisible(), {
      timeout: 2000,
    });
    await waitFor(() => expect(onComplete).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('should display the 4 Living Types passed', () => {
    renderComponent([
      ...defaultSeniorLivingTypes,
      {
        description: 'Test',
      },
    ]);

    expect(screen.getByText('Independent Living')).toBeInTheDocument();
    expect(screen.getByText('Assisted Living')).toBeInTheDocument();
    expect(screen.getByText('Memory care')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
