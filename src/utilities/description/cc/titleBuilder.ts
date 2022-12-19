import { CareKind, DefaultCareKind } from '../../../types/seekerCC';

const ONE_CHILD = '1 child';
const TWO_CHILDREN = '2 children';
const THREE_CHILDREN = '3 children';
const FOUR_CHILDREN = 'my children';

const BABYSITTER = 'Babysitter';
const NANNY = 'Nanny';

function careTypeAsString(careType: CareKind) {
  switch (careType) {
    case DefaultCareKind.NANNIES_RECURRING_BABYSITTERS:
      return [NANNY];
    default:
      return [BABYSITTER];
  }
}

export function childrenNumberAsString(numberOfChildren: number) {
  switch (numberOfChildren) {
    case 1:
      return ONE_CHILD;
    case 2:
      return TWO_CHILDREN;
    case 3:
      return THREE_CHILDREN;
    default:
      return FOUR_CHILDREN;
  }
}

export function buildTitle(careType: CareKind, numberOfChildren: number, city: string) {
  return `${careTypeAsString(careType)} needed for ${childrenNumberAsString(
    numberOfChildren
  )} in ${city}.`;
}
