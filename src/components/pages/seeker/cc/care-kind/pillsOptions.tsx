import { makeStyles } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';
import { Tag } from '@care/react-component-lib';
import {
  CareKindLabels,
  DayCareKindLabels,
  DayCareKind,
  DefaultCareKind,
  CareKindDescriptions,
} from '@/types/seekerCC';

const useStyles = makeStyles(() => ({
  boldText: {
    fontWeight: 'bold',
  },
  sticker: {
    marginLeft: theme.spacing(1.5),
  },
}));

type PillOptions = { label: string; value: string; description?: string };

const getPills = ({
  shouldShowDayCareOptions,
  ibMerchandisingFlagValue,
}: {
  shouldShowDayCareOptions: boolean;
  ibMerchandisingFlagValue: number;
}) => {
  const classes = useStyles();

  const DAYCARE_OPTIONS = (): Array<PillOptions> => [
    {
      label: DayCareKindLabels.DAY_CARE_CENTERS,
      value: DayCareKind.DAY_CARE_CENTERS,
    },
    {
      label: DayCareKindLabels.PRESCHOOL_CENTERS,
      value: DayCareKind.PRESCHOOL_CENTERS,
    },
    {
      label: DayCareKindLabels.AFTER_SCHOOL_CENTERS,
      value: DayCareKind.AFTER_SCHOOL_CENTERS,
    },
  ];

  const DEFAULT_OPTIONS = (): Array<PillOptions> => {
    const getOneTimePill = () => {
      const oneTimePillControl = {
        label: CareKindLabels.ONE_TIME_BABYSITTERS,
        value: DefaultCareKind.ONE_TIME_BABYSITTERS,
        description: CareKindDescriptions.ONE_TIME_BABYSITTERS,
      };

      const oneTimeIbPillVariant1 = {
        ...oneTimePillControl,
        description: (
          <>
            <span className={classes.boldText}>Try instant book</span>
            {' – the fastest, most convenient way to book a great babysitter'}
          </>
        ),
      };

      const oneTimeIbPillVariant2 = {
        ...oneTimePillControl,
        label: (
          <>
            {CareKindLabels.ONE_TIME_BABYSITTERS}
            <Tag careColor="positive" className={classes.sticker}>
              BOOK NOW
            </Tag>
          </>
        ),
      };

      if (ibMerchandisingFlagValue === 2) {
        return oneTimeIbPillVariant1;
      }
      if (ibMerchandisingFlagValue === 3) {
        return oneTimeIbPillVariant2;
      }
      return oneTimePillControl;
    };

    const recurringPill = {
      label: CareKindLabels.NANNIES_RECURRING_BABYSITTERS,
      value: DefaultCareKind.NANNIES_RECURRING_BABYSITTERS,
      description: CareKindDescriptions.NANNIES_RECURRING_BABYSITTERS,
    };

    const dayCarePill = {
      label: CareKindLabels.DAY_CARE_CENTERS,
      value: DefaultCareKind.DAY_CARE_CENTERS,
      description: CareKindDescriptions.DAY_CARE_CENTERS,
    };
    // @ts-ignore
    return [recurringPill, getOneTimePill(), dayCarePill];
  };

  if (shouldShowDayCareOptions) {
    return DAYCARE_OPTIONS();
  }

  return DEFAULT_OPTIONS();
};

export default getPills;
