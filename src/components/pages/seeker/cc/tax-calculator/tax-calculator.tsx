import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, useTheme, useMediaQuery, Container } from '@material-ui/core';
import { CoreGlobalFooter, CoreVisitorGlobalHeader } from '@care/navigation';
import getConfig from 'next/config';
import { Typography } from '@care/react-component-lib';
import {
  IconIllustrationSmallNannies,
  IconIllustrationSmallDaycareCenters,
} from '@care/react-icons';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import SavingCard from '@/components/SavingCard';
import TaxCalculatorInputs from '@/components/TaxCalculatorInputs';
import SectionWithTitle from '@/components/SectionWithTitle';
import { CZEN_DESKTOP_ENROLL_SEEKER_PATH, SKIP_AUTH_CONTEXT_KEY } from '@/constants';
import { useSeekerState } from '@/components/AppState';
import { GET_TAX_CALCULATOR_PRICING } from '@/components/request/GQL';
import {
  calculateChildCareTaxCreditSaving,
  calculateChildCareTaxCreditSavingVariables,
} from '@/__generated__/calculateChildCareTaxCreditSaving';
import { SubServiceType } from '@/__generated__/globalTypes';
import {
  UserInfoTaxCalculator,
  CardDetailsTaxCalculator,
  CardsDataTaxCalculator,
} from '@/types/seekerCC';

const {
  publicRuntimeConfig: { CZEN_GENERAL },
} = getConfig();

const useStyles = makeStyles((theme) => ({
  fullWidthContainer: {
    backgroundColor: theme.palette.care?.grey[50],
  },
  savingsContainer: {
    marginTop: (props: any) =>
      props && props.isDownSmScreen ? theme.spacing(6) : theme.spacing(8),
    marginBottom: theme.spacing(5),
    padding: (props: any) =>
      props && props.isDownSmScreen ? theme.spacing(0, 3) : theme.spacing(0, 1.5),
  },
  cardsContainer: {
    marginTop: theme.spacing(3),
    columnGap: theme.spacing(3),
    display: 'flex',
    justifyContent: (props: any) => (props && props.isDownSmScreen ? 'center' : 'flex-start'),
    alignItems: 'center',
    '& .MuiCard-root': {
      margin: (props: any) =>
        props && props.isDownSmScreen && !props.isDownXsScreen
          ? theme.spacing(1.5)
          : theme.spacing(1.5, 0),
    },
  },
  textSectionsContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    maxWidth: '620px',
  },
}));

const buildRedirectLink = (subService: string, zip: string) => {
  return `${CZEN_GENERAL}${CZEN_DESKTOP_ENROLL_SEEKER_PATH(subService, zip)}`;
};

const getMeta = () => {
  return (
    <>
      <title>Cost of Full-Time Child Care in your Area - Care.com</title>
      <link rel="canonical" href={`${CZEN_GENERAL}/app/enrollment/seeker/cc/tax-calculator`} />
      <link rel="image_src" href={`${CZEN_GENERAL}/img/care-no-tag.jpg`} />
      <link rel="shortcut icon" href={`${CZEN_GENERAL}/img/favicon_new.ico`} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content="babysitter, nanny, child care, home care, sitter, care" />
      <meta name="verify-v1" content="zz15lR180u9eCqTfur/9l+bMP75AampYtDEm6OnbkWY=" />
      <meta name="fb:app_id" content="296867961907" />
      <meta name="fb:page_id" content="6030284861" />
      <meta name="og:title" content="Cost of Full-Time Child Care in your Area - Care.com" />
      <meta name="og:type" content="website" />
      <meta name="og:image:type" content="image/png" />
      <meta name="og:image:width" content="318" />
      <meta name="og:image:height" content="305" />
      <meta name="og:site_name" content="Care.com" />
      <meta name="og:url" content={`${CZEN_GENERAL}/app/enrollment/seeker/cc/tax-calculator`} />
      <meta
        name="og:image"
        content={`${CZEN_GENERAL}/img/vw/nannyShare/cost-of-childcare-social-icon.png`}
      />
      <meta
        name="description"
        content="Check estimated costs and info associated with different full-time child care options in your area. Its simple and free. Enter the number of children, their ages and your location."
      />
    </>
  );
};

function TaxCalculator() {
  const theme = useTheme();
  const isDownSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isDownXsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isDownSmScreen, isDownXsScreen });
  const { zipcode, city, state } = useSeekerState();
  const [userInfo, setUserInfo] = useState<UserInfoTaxCalculator>({
    location: {
      zipcode: (zipcode || '78746') as string,
      city: city || 'Austin',
      state: state || 'TX',
    },
    kidsNumber: 1,
    hoursNumber: 40,
  });
  const [cardsData, setCardsData] = useState<CardsDataTaxCalculator>([]);
  const [isZipError, setIsZipError] = useState(false);
  const [isPricingError, setIsPricingError] = useState(false);
  const [calculateChildCareTaxCredit, { loading, data }] = useLazyQuery<
    calculateChildCareTaxCreditSaving,
    calculateChildCareTaxCreditSavingVariables
  >(GET_TAX_CALCULATOR_PRICING, {
    context: { [SKIP_AUTH_CONTEXT_KEY]: true },
  });

  const cardDetails: CardDetailsTaxCalculator = [
    {
      key: SubServiceType.NANNY,
      title: 'Nanny',
      icon: <IconIllustrationSmallNannies size="100px" />,
      link: buildRedirectLink('nannyBabysiiter', userInfo.location.zipcode),
    },
    {
      key: SubServiceType.DAY_CARE,
      title: 'Daycare',
      icon: <IconIllustrationSmallDaycareCenters size="100px" />,
      link: buildRedirectLink('dayCare', userInfo.location.zipcode),
    },
  ];

  useEffect(() => {
    if (!isZipError) {
      calculateChildCareTaxCredit({
        variables: {
          input: {
            zipcode: userInfo.location.zipcode,
            numberOfChildren: userInfo.kidsNumber,
            weeklyHours: userInfo.hoursNumber,
          },
        },
      });

      if (
        data?.calculateChildCareTaxCreditSaving.__typename ===
        'ChildCareTaxCreditSavingCalculationSuccess'
      ) {
        const {
          calculateChildCareTaxCreditSaving: { options },
        } = data;
        setCardsData(options);
        setIsPricingError(false);
      } else {
        setIsPricingError(true);
      }
    }
  }, [userInfo, isZipError, data]);

  const changeInfo = (newUserInfo: UserInfoTaxCalculator) => {
    setUserInfo(newUserInfo);
  };

  const findCareType = (key: string) => {
    const matchingCard = cardsData.find((cardElement) => cardElement.subServiceType === key);
    if (matchingCard) {
      return {
        price: Number(matchingCard.originalTotal.amount),
      };
    }
    return {};
  };

  return (
    <>
      <div className={classes.fullWidthContainer}>
        <TaxCalculatorInputs
          onChangeInfo={changeInfo}
          userInfo={userInfo}
          handleError={setIsZipError}
        />
      </div>
      <Container maxWidth="md" disableGutters>
        <Grid container className={classes.savingsContainer}>
          <Grid item xs={12}>
            <Typography variant="h2">
              Childcare costs for a family in {userInfo.location.city}, {userInfo.location.state}
            </Typography>
            <Grid container className={classes.cardsContainer}>
              {cardDetails.map((element) => {
                return (
                  <SavingCard
                    key={element.key}
                    careType={element.title}
                    icon={element.icon}
                    link={element.link}
                    isLoading={loading || isPricingError}
                    {...findCareType(element.key)}
                  />
                );
              })}
            </Grid>
            <Grid className={classes.textSectionsContainer}>
              <SectionWithTitle title="Where our rates come from">
                We show the average rate of our caregivers in your selected area.
              </SectionWithTitle>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

TaxCalculator.Layout = FullWidthLayout;
TaxCalculator.Header = <CoreVisitorGlobalHeader />;
TaxCalculator.Footer = <CoreGlobalFooter />;
TaxCalculator.HeadTags = getMeta();

export default TaxCalculator;
