import { Pets } from '@/types/seekerPC';

const getSingle = (key: string) => {
  switch (key) {
    case 'dogs':
      return 'dog';
    case 'cats':
      return 'cat';
    default:
      return 'other';
  }
};

const getAnimalTypes = (pets: Pets) =>
  Object.entries(pets)
    .map(([key, value]) => ({ animalType: getSingle(key).toUpperCase(), count: value }))
    .filter(({ count }) => count);

export default getAnimalTypes;
