import { ProviderProfile } from '@/components/pages/seeker/lc/types';
import { SeniorCareProviderProfile } from '@/types/seeker';
import { Badge } from '@care/react-component-lib';
import { Icon24UtilityCheckmark } from '@care/react-icons';

// TODO get this from provider profile values - skills + aboutMe + education
// take from src/pages/provider/cc/profile.tsx
// https://jira.infra.carezen.net/browse/GROW-1521
const badgesTexts: { [key: string]: string } = {
  certifiedNursingAssistant: 'Certified nursing assistant',
  certifiedRegisterNurse: 'Certified register nurse',
  certifiedTeacher: 'Certified Teacher',
  childDevelopmentAssociate: 'Child Development Associate',
  comfortableWithPets: 'Comfortable with pets',
  cprTrained: 'CPR trained',
  crn: 'CRN',
  doesNotSmoke: 'Not smoking',
  doula: 'Doula',
  earlyChildDevelopmentCoursework: 'Early child development coursework',
  earlyChildhoodEducation: 'Early childhood education',
  firstAidTraining: 'First aid training',
  nafccCertified: 'NAFCC certified',
  ownTransportation: 'Own transportation',
  specialNeedsCare: 'Special needs care',
  trustlineCertifiedCalifornia: 'Trustline certified California',
};

// TODO extract or check provider properties
// https://jira.infra.carezen.net/browse/GROW-1521
const helpWithMapServices: { [key: string]: string } = {
  carpooling: 'Carpool',
  craftAssistance: 'Crafts',
  errands: 'Errands',
  groceryShopping: 'Grocery shopping',
  laundryAssistance: 'Laundry',
  lightHousekeeping: 'Light housekeeping',
  mealPreparation: 'Cooking/meal prep',
  swimmingSupervision: 'Swimming supervision',
  travel: 'Travel',
};

export const isSCProviderProfile = (
  profile: SeniorCareProviderProfile | ProviderProfile
): profile is SeniorCareProviderProfile =>
  (profile as SeniorCareProviderProfile).attributeTags !== undefined;

export const buildArrFromAttributes = (attributesObj: any, map: { [key: string]: string }) => {
  const result: any[] = [];
  Object.keys(attributesObj).forEach((key) => {
    if (attributesObj[key]) {
      result.push(map[key]);
    }
  });
  return result;
};

export const buildBadgesFromObject = (provider: ProviderProfile, className: string) => {
  const badgeGenerator = (keyString: string, cssClassName: string) => {
    return (
      <Badge
        className={cssClassName}
        icon={<Icon24UtilityCheckmark size="16px" />}
        text={keyString}
        key={keyString}
      />
    );
  };

  const { qualities = {} } = provider;
  const tagsArr = buildArrFromAttributes(qualities, badgesTexts);

  return tagsArr.map((tag) => badgeGenerator(tag, className));
};

export const buildArrFromServices = (servicesObj: any) =>
  buildArrFromAttributes(servicesObj, helpWithMapServices);
