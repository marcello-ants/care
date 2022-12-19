import React from 'react';
import { SwitchTransition, Transition, config } from 'react-transition-group';
import { render } from '@testing-library/react';

import PageTransition, { getTransformAnimation } from '..';
import useBeforePopState from '../useBeforePopState';
import transformAnimationCases from './PageTransitionTestData';

jest.mock('react-transition-group', () => {
  const FakeSwitchTransition = jest.fn(() => null);
  return {
    SwitchTransition: FakeSwitchTransition,
    Transition: FakeSwitchTransition,
    config: { disabled: false },
  };
});

jest.mock('../useBeforePopState');

type TestTransitionProps = {
  path: string;
  key: string;
  children: string;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestTransition = ({ path, key, children }: TestTransitionProps) => {
  return <span />;
};
describe('PageTransition -', () => {
  describe('Component', () => {
    it('should disable transitions when isPoppingState is true', () => {
      const mockPopState = {
        isPoppingState: true,
      };
      (useBeforePopState as jest.Mock).mockReturnValue(mockPopState);

      render(
        <PageTransition>
          <span key="someKey">Hello world</span>
        </PageTransition>
      );

      expect(config.disabled).toBe(true);
    });

    it('should call switch transition', () => {
      const mockPopState = {
        isPoppingState: false,
      };
      (useBeforePopState as jest.Mock).mockReturnValue(mockPopState);

      render(
        <PageTransition>
          <span key="someKey">Hello world</span>
        </PageTransition>
      );
      const children = expect.any(Object);
      expect(SwitchTransition).toHaveBeenCalledWith(
        { mode: 'out-in', children },
        expect.any(Object)
      );
      expect(Transition).toHaveBeenCalled();
    });

    it('should call switch transition For Lead and Connect', () => {
      const mockPopState = {
        isPoppingState: false,
      };
      (useBeforePopState as jest.Mock).mockReturnValue(mockPopState);

      render(
        <PageTransition>
          <TestTransition key="someKey" path="seeker/sc/lc/caregiver-profile">
            Hello world
          </TestTransition>
        </PageTransition>
      );
      const children = expect.any(Object);
      expect(SwitchTransition).toHaveBeenCalledWith(
        { mode: 'out-in', children },
        expect.any(Object)
      );
      expect(Transition).toHaveBeenCalled();
    });
  });

  describe('getTransformation', () => {
    transformAnimationCases.forEach(({ state, expectedTranslationString }) => {
      it(`should get the ${expectedTranslationString} when state is ${state}`, () => {
        const translateString = getTransformAnimation({ state });

        expect(translateString).toBe(expectedTranslationString);
      });
    });
  });
});
