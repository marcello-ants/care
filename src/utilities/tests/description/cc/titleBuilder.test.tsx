import { buildTitle } from '../../../description/cc/titleBuilder';
import { DefaultCareKind } from '../../../../types/seekerCC';

describe('Job title builder', () => {
  it('Title generated successfully for Babysitter job', () => {
    expect(buildTitle(DefaultCareKind.ONE_TIME_BABYSITTERS, 1, 'Austin')).toEqual(
      'Babysitter needed for 1 child in Austin.'
    );
  });

  it('Title generated successfully for Nanny job', () => {
    expect(buildTitle(DefaultCareKind.NANNIES_RECURRING_BABYSITTERS, 1, 'Austin')).toEqual(
      'Nanny needed for 1 child in Austin.'
    );
  });

  it('Title generated successfully for 2 children', () => {
    expect(buildTitle(DefaultCareKind.NANNIES_RECURRING_BABYSITTERS, 2, 'Austin')).toEqual(
      'Nanny needed for 2 children in Austin.'
    );
  });

  it('Title generated successfully for 4 children', () => {
    expect(buildTitle(DefaultCareKind.NANNIES_RECURRING_BABYSITTERS, 4, 'Austin')).toEqual(
      'Nanny needed for my children in Austin.'
    );
  });
});
