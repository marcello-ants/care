import {
  ENTERING,
  ENTERED,
  EXITING,
  UNMOUNTED,
  TransitionStatus,
} from 'react-transition-group/Transition';
import { TRANSLATE_3D_POSITION } from '..';

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
    expectedTranslationString: TRANSLATE_3D_POSITION.LEFT,
  },
  {
    state: UNMOUNTED,
    expectedTranslationString: TRANSLATE_3D_POSITION.NONE,
  },
];

export default transformAnimationCases;
