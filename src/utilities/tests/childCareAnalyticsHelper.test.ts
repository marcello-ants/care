import { VERTICALS_NAMES } from '@/constants';
import { AnalyticsHelper } from '../analyticsHelper';
import { logChildCareEvent } from '../childCareAnalyticsHelper';

describe('Child care analytics', () => {
  const analyticsMock = jest
    .spyOn(AnalyticsHelper, 'logEvent')
    .mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const defaultEnrollmentEventData = {
    cta_clicked: 'next',
    enrollment_flow: 'MW VHP',
    final_step: false,
    vertical: VERTICALS_NAMES.CHILD_CARE,
  };

  const defaultPAJEventData = {
    cta_clicked: 'next',
    final_step: false,
    job_flow: 'MW VHP',
    vertical: VERTICALS_NAMES.CHILD_CARE,
  };

  const extraData = {
    whatever: 'we send',
    is_added: 'to the event',
  };
  describe("'Member enrollment' events", () => {
    test('Care Location default event data', () => {
      logChildCareEvent('Member Enrolled', 'Care Location');
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Care Location',
          ...defaultEnrollmentEventData,
        },
      });
    });
    test('Care Location sends correct flow', () => {
      const flowName = 'Some flow name';
      logChildCareEvent('Member Enrolled', 'Care Location', flowName);
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Care Location',
          ...defaultEnrollmentEventData,
          enrollment_flow: flowName,
        },
      });
    });
    test('Care Location sends additional data', () => {
      logChildCareEvent('Member Enrolled', 'Care Location', undefined, extraData);
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Care Location',
          ...defaultEnrollmentEventData,
          ...extraData,
        },
      });
    });
    test('Care Location sends clicked CTA', () => {
      const clickedCTA = 'A button name';
      logChildCareEvent('Member Enrolled', 'Care Location', undefined, undefined, clickedCTA);
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Care Location',
          ...defaultEnrollmentEventData,
          cta_clicked: clickedCTA,
        },
      });
    });
    test('Care Location sends final = false', () => {
      logChildCareEvent('Member Enrolled', 'Care Location', undefined, undefined, undefined, false);
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Care Location',
          ...defaultEnrollmentEventData,
          final_step: false,
        },
      });
    });
    test('Care Location sends final = true', () => {
      logChildCareEvent('Member Enrolled', 'Care Location', undefined, undefined, undefined, true);
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Member Enrolled',
        data: {
          enrollment_step: 'Care Location',
          ...defaultEnrollmentEventData,
          final_step: true,
        },
      });
    });
  });

  describe("'Job Posted' events", () => {
    test('PAJ - Start default event data', () => {
      logChildCareEvent('Job Posted', 'PAJ - Start');
      expect(analyticsMock).toHaveBeenCalledWith({
        name: 'Job Posted',
        data: {
          job_step: 'PAJ - Start',
          ...defaultPAJEventData,
        },
      });
    });
  });
});
