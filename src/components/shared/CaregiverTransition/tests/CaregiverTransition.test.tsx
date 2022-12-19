import React from 'react';
import { Transition } from 'react-transition-group';
import { render } from '@testing-library/react';

import {
  ENTERING,
  ENTERED,
  EXITING,
  UNMOUNTED,
  TransitionStatus,
} from 'react-transition-group/Transition';

import CaregiverTransition, {
  getTransformAnimation,
  TRANSLATE_3D_POSITION,
} from '../CaregiverTransition';

interface TransformAnimationCase {
  state: TransitionStatus;
  expectedTranslationString: string;
}

const transformAnimationCases: TransformAnimationCase[] = [
  {
    state: ENTERING,
    expectedTranslationString: TRANSLATE_3D_POSITION.RIGHT,
  },
  {
    state: ENTERED,
    expectedTranslationString: TRANSLATE_3D_POSITION.CENTER,
  },
  {
    state: EXITING,
    expectedTranslationString: TRANSLATE_3D_POSITION.BOTTOM,
  },
  {
    state: UNMOUNTED,
    expectedTranslationString: TRANSLATE_3D_POSITION.NONE,
  },
];

jest.mock('react-transition-group', () => {
  const FakeTransition = jest.fn(({ children }) => children);
  return { Transition: FakeTransition };
});

describe('CaregiverTransition -', () => {
  describe('Component', () => {
    it('should call  transition', () => {
      render(
        <CaregiverTransition appear in timeout={300}>
          <span key="someKey">Hello world</span>
        </CaregiverTransition>
      );
      const children = expect.any(Function);
      expect(Transition).toHaveBeenCalledWith(
        { children, appear: true, in: true, timeout: 300, unmountOnExit: true },
        expect.any(Object)
      );
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
