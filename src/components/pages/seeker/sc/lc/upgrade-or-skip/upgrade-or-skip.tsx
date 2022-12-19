import { Typography, makeStyles, Button, useMediaQuery, useTheme } from '@material-ui/core';
import { ProfileAvatar } from '@care/react-component-lib';
import { useFlowState, useSeekerState } from '@/components/AppState';
import { useRouter } from 'next/router';
import {
  CZEN_DESKTOP_NTH_DAY_RATE_CARD_PATH,
  CZEN_MOBILE_NTH_DAY_RATE_CARD_PATH,
  SEEKER_LEAD_CONNECT_ROUTES,
} from '@/constants';
import { useEffect } from 'react';
import { AnalyticsHelper } from '@/utilities/analyticsHelper';
import logger from '@/lib/clientLogger';
import FullWidthLayout from '@/components/layouts/FullWidthLayout';
import LcContainer from '@/components/LcContainer';
import Flower from '@/components/features/flower/flower';
import Cookies from 'universal-cookie';
import { providersToShow } from '../helpers';

const useStyles = makeStyles((theme) => ({
  root: {
    height: `calc(100vh - ${theme.spacing(6)}px - 56px)`, // substracting padding in mobile and the header height
    boxSizing: 'border-box',
    padding: theme.spacing(0, 3),

    [theme.breakpoints.up('md')]: {
      height: `calc(100vh - ${theme.spacing(12)}px - 56px)`, // substracting padding in desktop and the header height
    },
  },
  heading: {
    textAlign: 'center',
  },
  headingText: {
    // responsive font sizes; h2 on desktop should look like h1
    [theme.breakpoints.up('md')]: { ...theme.typography.h1 },
  },
  subHeading: {
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      // responsive font sizes; h4 on desktop should look like h2
      ...theme.typography.h2,
      marginTop: theme.spacing(4),
    },
  },
  careGivers: {
    margin: theme.spacing(4, 0, 4),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  careGiver: {
    '&:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  skipButton: {
    marginTop: 10,
    '& .MuiButton-label': {
      textDecoration: 'underline',
    },
    fontSize: 16,
    color: theme?.palette?.care?.grey[600],
  },
  icon: {
    width: '100%',
    paddingTop: 51,
    display: 'flex',
    justifyContent: 'center',
  },
  leftIcon: {
    position: 'absolute',
    top: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      top: 0,
    },
    left: -31,
    zIndex: 0,
  },
  rightIcon: {
    position: 'absolute',
    bottom: 0,
    right: -31,
  },
  lcContainer: {
    marginBottom: 0,
  },
  ctaContainer: {
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('md')]: {
      margin: '0 auto',
      paddingLeft: 0,
      paddingRight: 0,
      width: '295px',
    },
  },
}));

function UpgradeOrSkip() {
  const classes = useStyles();
  const router = useRouter();
  const seekerState = useSeekerState();
  const { memberId: seekerId } = useFlowState();
  const acceptedProviders = seekerState?.leadAndConnect?.acceptedProviders;
  const providers = providersToShow(acceptedProviders);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const amplitudeData = {
      screen_name: 'upgradeAndMessage',
      source: 'lead and connect',
      num_of_caregivers: acceptedProviders.length,
      user_id: seekerId,
    };
    AnalyticsHelper.logEvent({
      name: 'Screen Viewed',
      data: amplitudeData,
    });
  }, []);

  const logInteraction = (ctaClicked: string) => {
    const amplitudeData = {
      screen_name: 'upgradeAndMessage',
      source: 'lead and connect',
      num_of_caregivers: acceptedProviders.length,
      cta_clicked: ctaClicked,
      user_id: seekerId,
    };
    AnalyticsHelper.logEvent({
      name: 'CTA Interacted',
      data: amplitudeData,
    });
  };

  const upgradeClickHandler = () => {
    logInteraction('get started');
    logger.info({ event: 'LeadAndConnectUpgrade' });

    const cookies = new Cookies();
    cookies.set('lead_and_connect_origin', 'true', {
      path: '/',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    });

    if (isDesktop) {
      window.location.assign(CZEN_DESKTOP_NTH_DAY_RATE_CARD_PATH);
    } else {
      window.location.assign(CZEN_MOBILE_NTH_DAY_RATE_CARD_PATH);
    }
  };
  return (
    <>
      {/* TODO: svg icons will be removed as soon as they're added to the components repo */}
      <div className={classes.leftIcon}>
        <Flower />
      </div>
      <div className={classes.rightIcon}>
        <Flower />
      </div>
      <LcContainer classes={{ root: classes.lcContainer }}>
        <div className={classes.root}>
          <div className={classes.icon}>
            <svg width={100} height={100} viewBox="0 0 100 100" fill="none">
              <rect width={100} height={100} fill="url(#pattern0)" />
              <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
                  <use xlinkHref="#image0" transform="translate(-0.00374065) scale(0.00249377)" />
                </pattern>
                <image
                  id="image0"
                  width={404}
                  height={401}
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZQAAAGRCAYAAABCCEUTAAAACXBIWXMAACxKAAAsSgF3enRNAAAgAElEQVR4nO3dfWxk13nf8bOWLFkba8iVFGtsRVpKUWul1nipQHRiye3SmDhNgBRLO0Bko0BF1Y3RArWXQu34j8JdqjGaFwcV5ThAm8AWF3AT2WgtLuDazstEJFIptaeQSI+MrmwFIiVLHleriDOyJettWZyZ53IPz94Zzp15Zu49d74fgFiSO+S9MyTv757nvB3Y2dkxAAAM6g28ggAADQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBAxYW8jBimYqk8ZYyxb5PGmG1jzLQcbtN5f1s+tmaNMa8aY/6nfLwuXxu9Ge9r3O9t/12v1yrb/FCB0Tuws7PDy46eSDhEF+tp5yI+KUGw7Vz0p+Vif7iPV3erz69zNSRwNp1z2naCKDpX+/68MWbV+f9t+XiyXqts9nY4AAQKWoql8qy8G/27LYEwSDD0SyNQtDTk+yw7QWNfk/vrtcpWRs4RyAQCJaeKpfKkXPimnVaFDYY5Y0zdGPMm+TgqPU1k6JXIUqB0syav36o8ZltKbrRqMJYIlJwolspReMzLM+rWqnjKGHP1kJ95Q0LqpNf3Yc9rSc510vncurSO7MW5YIxpyueX5XE2CI/JRXzbKbFFF/MVedyUU86ackpyR51zGoUNOSe3xEb/DnKNQAlcsVRelovzkQTPJGkLoOGUfPx+iE3noj3ldLyvZO1OXcp6U07LzEiQuaW9KNzm5DnFBdAPjTFX9nkaW/Jatlo2Y9GaqRbO3TzMNFf3fTyCRaAESMpZC9Ia6ac09Iwx5m3y/j1OS2FO7qqjkFgfm4teDBmEMOn0K83Ja3O9MeZW+dxGwjD3NZzXPGrFhHvRrRai1uSsvMX9fjakZbnSeptp0mrLCQIlIHKBW5A/2G5B0nDej8o/y14JyYaFqdcq6+P+uvZDQr01CkzKjQtO4AwSMEZaMetO/8y0BHt2g6ZasL9bi8aY2xN+ZUNKoEsES/gIlADIxWtRWiSd+gC2nD6FVkmFen065Oc1HzNkeV4+7ncQRHRnb8NmORMtx/6DxNdoBTIlsaARKBknF6fVLne9tpN6MegyyZiJWjdOWahTaagXJ6VMtjTyV7FamJfWheZAhzvNTHP0zwUqCJQMk1LKaoc/WNsimSdI8kEGDCzISLZ+RKWj1siyobdeqoVlhVZJJyfNTHO+vy9FmgiUjCqWyvYP6t6Yszsld6SL4/4a5ZX0lUWmpW9mLkFL4O+MMb80lFBpd7p3azFroaUSIAIlg4qlsr143O+dmS1tLNGJPr6cuUZT+4zwi4Y1n6zXKnp3+qMLk8j7zUxzZUTHggICJWM6hYnqhQHBk36YqEzWrZPf9rHNDTxAY/RhYqSMN8Xor3AQKBkiF4lN7+JwT71WWRj31wbdFUvlRQmWG40xP+s9uCH9bf3f7VcLKwP07wzilJlpzqVwXPSB/VCyxR8WfIowQS+kT83+/tzhzUMy8jt1v7R+k6sWllIKE9M6brUw28PjkAG0UDJCOmLXnUCxF4VpFhpEP6S1ux7Tz/LeRCMDq4W4EuyorZmZJqESAFoo2THrtU7GdskTDE76TOJat8sSNvtrT1pczsCP4yitlDAQKNnhlyMY3YKBSJ/JnV4J7LCzU+Z+ljO0rQHD5ANAoGSA1Lb31KjrtUoW7gwROJlB75e49p/fUS0syJL/WXFUWkzIMAIlG/zWyUbPZQlgf0teK+WITJyNd259rqxhgErGESjZ4NeHB583AAjphPcvxt0uzlkqdbkYPpxxjPJKmYzuesI7i2QjcZB97bv+cyWbFFbVLZbKm96or0Pn3bhkY1RXNzeZmSarRWTUheP+AmSAXxfeIkxyoH1hjlYSPn92edXuctwqQ63vbjY1/AulLXM94H18rj+lPRs+631385S+sotASZ/fV8ISKyFrL+m+2ONy9BPS8W3fTphqYUtG99nNpoYxZNz/nv7NjPZS9MMwR6BkF30o6XPrwhu0TgJl902vFjZlheh+9zaxX3e8VQK1y8Mrz72QeU2nnE+dGz7cblENazl6TYeZk5JdBEr63D/iI97S5QhBu1XyyABBEuf2VnnKrqGlO1zW7TNpDwsOo9Tlyl4r3obc3rex/Dum5JWiYqn8Tu/oDWbHB6YdJnH71mg5JutZ3dMqpQ2+8u5qTEtkJYBSl2uuFYJprUJsW6PtysJs15We2/1ka/L6rgypjJkptFDS9S+doz/P7PjAtC8so9oE6nirD6RdmhrEnova/Z+b+kbGJjD2YmLk/SjtkuaSlDUfafV5tV+3/YLYPuZup4yZ6/llBEq63DusQzEzmpFto+7Ebq0abKqF1QFKKnsC5dnmG/+pzqmN3MJILs62BWpf73aIHB+wrHm73BTktg+IQEmX/4tF/0ko2heFtO7sj7aGG7eXR0nEL6k+dLqQyhNQMDG02fw2qKqFRWeQhebPeUL6xnI5mpNASZd/h0XJKxxpXxAmWqUUe9FLcsdbLUwdvPjsa9GHjRcvGNb5jcJx1QuzbfXZslS7FXdCeZCFb0lKprlCoKSkWCrHTXijQz4cWVkG5LDc8a5LeSa+DNS+WC42fnzhxoVv2NkdjPO3j106ynMdhqWBS0i2X6q9I+UTUpYaRRlzIrCRdT1hlFd6/PLWBut3BaLdf5G1UVFHpDxzr6kW1uTmZFN+z6ajm5eJn3rNNF861yopXPJ6muesISoh3WVmmr2XwNqtg3m5MRhmS6SbI62bgJlmboKFQMkOWifhyHpf19Fudf93XP2i+c5TB1vv23B59MmD5sZrXhzl+Q3DCSl/tZfr95exaQfIlPRbphkivoU8tVQIlPT4FyUWvMNIfPzYM+aOz12/e6iHHrs0D4FiJCTubr1XDWawwZFWizcnc1ToQ0mPX4Mf1XwGjDk/PAIe6ZUXuRlGTKBkB3s9YCSuvuLlPYf5xiPs5Zay3EwXIFDS44/wYlJjOIIvT/id8U+duTi1cwEtFAwgZntf1vAKSbve3Qj5KRQO7g0Uv9UC9INASYcfKIRJeIJuUTa9CY1ff/hQaueC/CBQUhDTGqHcFZ6gf2a3vefMno8nDr7W8bFArwiUbMjdEgxjgGVyAA+Bkh63Bs8M+dC0+1E28vJ0HnqMocMpyk2FgkBJQbFU9jflYUvTMDF3CBpy04dKoKTD75SnDyVMK6GO9rLLrbiePHNR2qc0znKzSgaBkg6/z4RRXiFqb0EbZF/KrTe8sOfja654JbVzGXON89YdCxiBko7cjPKKmVMzboazydOQ0SLJjFwN7mBxyHT4nfDBBUqxVLbLRfyRMebdxVL5gDHmz40x/8WG5bAnacpeMjcbY2zd5rF6rfIlxe89LSFhj/GofavXKv+64xfYzvlq4ZQx5pjWOYyCbaF8+cErdo8U+EZbISNQMDC35NUIbR+UYqk8L3tvuG6TN/v//8MY8+l6raLalC+WynOy3PdR7/M/Z/8wBzmehNSCFwy32rdiqfwT+XhTjuMH5lJogeIvtfLdZy5J7VzG2JaZaeYqUCh5pSPYxeCKpbK96H6my0NeMsb8ujHmkWKprLLPg/0+xVLZdn7/tw77fJyQ4630U4KT57TcJRSOy5tdGv1rNtj2HGemaVuYa0mPmya7J4pr5vofhXT6eZG7HRsJlHS4gRJMh7y0TOxF1dZK/r7Dw9ze3tuLpfJAfQxSgrLbstqJEq/u8/BfTtqn4TynXjdcsq2h+2NKFUH1pUQbbCE1jTwOOydQ0hdSucu9+7/MGLMT85i3eB+fkFBITMpQbv/SRIdjRmzdZk5aHP08p/24xz4qLaf21wfWSvnN99X3fOy3WDB0SzJKMFcIlHS4LZSQfqncC/VZY8yBHr8u8V4vEkIPxOzd3umYZ+Xfw955djvGVK+P7XDs2727zGBaKc0X6T5NUS5bJ4ZASY27F0oQgSKlIbcslOR3p5+VAOYTPt49n8PSgb+fWYW9xae9VsrWgN9vJPyJjU89xzDiEVrIY+vEECipCXF29SADCfqZqzLoH1wvgZI0tOIc8V6bIEbtfMkZMmxosYzShplp5q4zPkKgpMMt44Sy0vAgF8ojfYy+SlKK6pfWgAj3ZxjEnScbaqVmFL/XqSFQ0uG2UEIZQjzIhTLRXBul2fe9zEnRak24Jb0gfp4ESipOSlk0twiUdLgX14kQli+RyXz99g8k6oCU8Bm0LDDK0lO7hVItTPYzACEN7NA4co28t04MgZIavyM4lFZKP53rW32OaBlFnXldqRN9XcJkNWZUWib5LZRb3t4M4bRDltuOeBeBkr6tUCY3SivlzoQX4fV+lpaRZVTuSfp1Yq2X9cTkMf2E5Fn3g6/++/+7LT/DI52/JFtuvGbvvJOnnrs4+ycdrrU8d8S7CJT0BbVab71WWZKLcC+hslGvVfouAdVrlYU+JguuJRm9JaHy3oQj73b/bt799hfMzT/7o+OhtEwiV1++d7n6wiWvp3k6eZf7UleEQEnfRGhre9mLcL1WmZLWStyFuJH0wt7FXIJQsVvyzidd7bheq6zKzyBReNnZ5fd/8nSSL8mMiYOvBXneATqZp/1O9kOgpMO9u9/SXpV3VGxrpV6r2BbWtcaYm+RO375N12uVWY3nJeWyudYfZnc2DOb6XTrfHseeszHmjje/6fXn9nu8DZN7PvxEP4fKJAJmKMaiI97FbKb0BT+McNj7n0iozBdL5SX5A/VnuK9JGAx+rC9UbQhebkdB2cl/dkb592UWuS0LNV+6oBUmyx99nKG32E8u1+vqhkBJ31j9wg1CWjy7ZTRZPHJbuYXXGm78qz//fOstYvcPsZtQ+Z3ZofI74W/xtgTGwHK7Xlc3BEo63Lvr+XFrFmuRvg891YK/Xtku2xq5OsQXqQN/gy2oG7vWiaEPJROC2Q9lDAQxKVGDu6f8z3gjvqBiLIYJ+wiUEZO9Oty/4CsycWIwfc5JCZK7GCR9QepOmZnmWN4oEiij92ZjjLtW+OPj8sQDENRckkHY/qBIXvqFMmQsWyeGPpRUXO8d9B/Ztbz6mU2O8WJDwPZ9TBx83RQOvtb6t5MoMB46XWht92tLXPZ9Gx6XXPS6+dvHLt39ymcbbzTzf/gPdlsq9t/osVZ0LDu6zX7uodOXmquveCX2HOzoOPv19vNj3PLJ9QKQ3RAoo+fPjP9pqd2P7V0NzrFBYC/mRi7sTRsiz11sHjx9aevzdgizO6u9IBfu7zx5sDWkORra3Mn3YzbSWvnWZbvv2/6U6DHfeOT8RRzc/4/YoLGh5R7bfs6Gjj03G0L2/+xcF3u+bosoGhxgH2eHaOciiMawMz5CoIyevXs55h2V1knORXf1X5eLtL2TtxdPe9G2F9uCc6cfd9F3uYFh33cf3y1MNMSdmw0T/9j2c9HnO4mCyGUDywaODRcbLJ849nRrSHMUPPu1zDKhWpgzM80gNlrTdmBnZydfzygAxVLZf9H/sF6rfGzcX5fUVQvr/S7waAPDtiSuvvxlc9+DV+yWjKI7b7fElGVxLZC0RS0f++91xZ+Y4uSr5qkzF7UC+pYb2qsk/+pN21lq2Wy1tjQYw5YKgZKCYqlsWylH5ch1Y8yH67XK18bqRciiasFORDve65nZu+Y//ssrEwXGJRedNS+90v9YmGiIb7RUir173++O3d7V33j1i61WkC2hffZrbzWrj54bf/DXdz1qtn/cLlb81bcnzauvH9j9ntHe8/YCbo9lP7blNfu9ouCx5xRdzO3X2cc2XrxwT3lOq+X01kOvmB88f37g2ePY84smo9pgT3my5lZrjlnON9TyUfJKx185gVI0xrzLGEOgpG+5U6DYFsijUp6x5ap+WxyXX/paxxaAeyf+Dqef4YPvOWNuefsLauWez5y6as/HZ3cO7F58h3kRtq9h69/HCrsDDIwzgCDqB+rmgg5ZbL/Olg/dfh/7Ot72njPmI+/7YRqtFztB9gFTLWzI79X6OIQLLZQUyJIhDzhHPjXIMu/QUSyVp3/jljNfbb504VXRRc5e9Oxdfb932G442Iva8z+6sHVRtKUa22qwIWX/NSNc/uRTf3aN+ZO/vHL34/oXqiM5bi/s6/4daRVFr439N9ph8vEfvMk823xjX9/7V6QsZsPZXVYnBWsyoXk1b/ukECgpKJbKU3LXErVS7Lo/UwwdHj3ZfnlWlr+Z7ncuSjSqyV4Qb73hhdbHtiyVxTWyyifesacz/Cu/dTqYtbzagxna5T4bNH/8F8XW+0n7fWy4LH/0e0M5x4QaUhrLRSc+gZISCRV3/XNaKSMgr/ui7H8ymbQT3m1x2E53e7cbDY0NgQ28mU8c2dPieuxzD2d/5NQ+oiHHSfq0bOh/5ZOns/Lc78hDa4VASVGxVN70FiO8o16rMB9FkSx1My0BEm1kFrsAZBx7J2vLIzZIQgqOTmw/xgd+/4bd/7XP67t/9HDWTnNg0Xyep567qFW2tC2buFaMff62pZKRFtpNoW/GRaCkyBvtZSh96SiWynNOKyRJCaux24Fq98L/QtUG0b1Zfq5J2Tv4//Bn1+x+VYZKP0Nnw9QOSPBbL3aU2ifmnja33Xom7VO0uztq7HKaGkZ5pWvR65yfkM+xnH1C0hdi/xj/lb1GJAiSLekgjds6eF3mpiz3Oz8la/zyTmGMdmq0rZD7bzjd2jjtMytX7bZY7L+f+tN2yKYcKsGXvGmhpKxYKs/H3AXfabfXHbsXYwBO+fAlO92jy3fakJUJVlqtkF73VKkWFiTsg15A8uZPHNlT+rn33z6e9oin1PzBqavMH5x62+7hbfnL9qmkWtacaR5I7+CDI1BSJp3EqzF1fUKlB1LemveWs3FDZSsqYdkQGWh3x2phUu4iF5P0w2SFX+6ypZ7/85mN0J6GKn8ItX1N7v/k6fRm3RMoGJTMS1mKKavcU69VKH/FkCBe6VCK+qGsQDCvvD3wOdXCtATZXAjhYjumZ37rnXs+R6C0+aGSar8SgQINdlJdh1o9oRKjWCrHrbtlWyNLI2/ZVQtTEizTMqclUwFjO6M/9vnrzhvlVP39b7O5lowIK5+4cc/r8/Fjz5iPH3t61KeyYWaa06M+qCYCJUOcORK3e2e11qHTODEJrkn1/dhHSMpc9/uvUb1WycaOi+3SWBQu0/KWSsisfPMy8+n/fvV5YfKb7/uh+e0PPZnGKWWSP5zapNO/FPxcFAIlg4qlsg2VE96ZNSRU+ppR67SAoqG0J529WX5gjPnzaBl9GzZZ3fSrwyAGW7eZzfxw62ph1pkPM9vPxMpe2RKXnREft0fKOA0VTuJjn7/WfPnBcztyj/h12jIzzakeHpdpBEpGSQA8EnN2iTvrZUjto8aYaFXARsxoJfdzDSd0NmXQQPTLvuq3lKRlNTm0/oq9x4qbuzOt0XpLTbs/ZsppzUx6z7EjO2EvCo0vtZbNv3R3b5WoVeKucEyYdGZn2H/g927YE77/8UNPthaXHIHgJzUaAiXbYtb8ihxKcjdeLJX/whjzvi4Pse36QwlejIYETdTCmZQA2nBGVK1Li2ez07k662jZx6zbEO0WSvJ6rHvBtxD66gLyOkS18+3d16BamP76w4fetWPMz1935U+uq29f9M6XXn7DlfaCd9//uqKn1Xkjl735NfNLR7bNZz/8RE+PH1f+UOLfuPXMKF6zXCy7YgiUMMjyIXc7J3tXvVZZ7PXki6XyttciaUqIRHX9rRHU+Bvyb9SSiOtQj87hlARpdOdui/1n7dw0LxgfNMb8mhds225rxQmtKIw2e2nNSHgZ52tXnPNZcQLVluC+J1s5756DPHZdHrfplLmMs0PnlPM9/dah/37fbH+J7WAOfb2uUbAtvjs+d/3ukd799hdaLbohvXa5WhjSMFM+GH33DRRL5X/uXZT+zhjzAblIL8gFMOqN3O5juZJeRd+zU5+BG2jHYrZJjnOrBOOW00qyzzkKr+24oJT/35YL/pS8v+3t9++3Ck9470fH6PZa+YMreuF+v75/DvbO+oO3nglmFeGsiHaAjNhlWmxLcAiv46nW399MM9xSbQwCJQyT3ln2NLRQ+mG+6N3pfrFeq3xb3o9t5cjXTTt39dGQ2G1vyf24slca/NCY8P71TcjbIK2yLMyYbzilRWt99h2N07/3L7auPfzTL9+Wl+ViRsm2RGyrxF3vyy6TrxgoJ1ut75xutkWghKnXu5qoxBJd/J7q5Wulhu/2ZfTcJI/6QaLhyU74TXlBOOm0Csb9whfN5o/CedN523aCfVcPw75/R+bHzMtbcDP702KHCruBolDuOiUDW5bzvs88fSgBiNk7Zd85F8VSedkrudi72bkszz+JRotFHfnysX27WVpJtzoPf05uiKJy1ZGYPoc1+Xfd2f/EeOUu4/zr2/T+PwpAf+Sb9RFjzLecYJh2Wg6r8rkpL9CXRjbUuVqYkxJnT6PHxpm/qkDCDciiVuOq7Mg4VnvKEyiB8DrWuwZKh1n3Qc+49+bmNOq1il8GRC/ac2EWCZbu3EU07UZcyx993F9VoOENumi36nPWJ5IUJa9wrDgtjqN2/a8urY0FL0waScpWGeUu7R38eP3UtO+YZ3MeLA1pIazvXvS7zfFovxauyWebF95njLnYfu6xpy/58Vf+92ULx3/tB4/L9xrr0OiGQAlHkjty/w9kOeSlVoRbXiJQBrU3WOIWJg3Nmtw0rSaeIBhTlnr51fJ90Q3ca2cPvPI7X/mZx4/f9dhYla/6QaCEw6+1T8td2B6ycrHbAbsW+uKS0pfi9o3kZtx+6toX02lTLcwHuCz/KfldWBlCZ/e7nfcPJbyhG1tvGPcXIIf8ocB5mIHrt7goOWhrz9S2Nyl3OXNssmitNbPcXuRnmnOt8x7OyKmvex8HvTXvqBAo4fAvoufdMcmMercmvhH6siRiz9aoQa/blWX2wjzTjPbivydDZ7olQXetmWnODjFEXH4rONfDfbUQKOHwy1t7fsFlZJfbOmnkYY9qKXe5LZQs3z3nQztYFloX8PZEvDQ0JNRuaq3Ca4NutJ3hcSVm7INACYffItm9yEq/yarXz7CYkzv5We950SE/KvYCPtOcl2AZRSmsIQH2fjPTnGyFWnor8Pp/b1PO+m7ogE75cHTrFFzyJ/TlaD96/3kTKKPWbhkstt7anfdzPa611ostZ3RWlgZb+C2ULCy1k3kESjj8JnfrQuvMJnf1vBJxAJa9lZapZaep3Xm/LLtSzkkLMsm2x2vO/JDVrM7pkOWD/JUX+N3bB4ESDlvSOu6cbfTLveD90p/KwZwTlx+k/FFnQbtTfHnPKMLzJwi61gNcx2rdGeSykfK5BIFACYdf+pmU7XCPe5/PU+vEECAByfe6VUekRZaLjbCGhU75cPgX1smYUVyNUWzDO2J+C6XropiAIr8cx0ivfdBCCYf/y319zHIZeZx85QcInfIYlX3nfmEvWijh8Dvef8r7+GTcUiw54N8VMqkRo+L/rlF+3QeBEo79fpkXR7a3xmj5d4X8UWNUaKEkRKCEo1up564cL0fit7pooWBU1r3RXcGvPDFsBEpYnnbONtqX9GS9VsnbyC7Xnj6UHA46QEZJi99tETO5cR8ESjhKxpirnLO9QP79fF6fsLMlsPs5yg4YpT0tZFmAFR0QKOGwm1q/5p3tN+u1yt/k+DlPe3eFWzntJ0J2+b9vrOfVBYESCCn1POyc7VljzAfH7GWgdQJkGIESkHqt8guypLftKPzkGO4Lwk6NSBuDQrpgYmNgQt/ONyF/UiPlLoyaPwiE38EuCBRk2ViM6JLBB3Zi6rPGmEedu+BVjVao7Jfzu/L3/nF5XaeHsYhosVR+pzHmMlm1wQ4Y+bL9tCxTb0cjbtdrlZBamowqTIBAQZZdJxeiyJvy8NMqlsr/2Bjz76QFZhcb/DfGmIvkv3/deei3jDG/MMBxotbsp52VFR5w/v9T9Vrl0/1+/5jj2RC51/nU7c77h6P/K5bK/6xeq3xV67jDZAeBFEtl9wi0ULogUJBlBW+fjftC/mnJkOdVGSkUjV7zV4t23VgslZfrtUqiNdqklfBZZ+n1OC8ZY367WCrfbFsTg4yek+e14hzveWPMoQ4P/3tpJQURKDEY5dUFnfLIMn9UV7CrvUrZaV0W9OxlgtxzxpiD9i4/ydwHubhvyLylbl6V/zs2yKKiUq7b9MLrzR0e3pRy2FFpzYSIkYZdECjIMn/viSBHeRVLZbtkxxcT7GpoXe68n2TJ/ih8LpPWQCcF5/N3yzn2w99+2npjD8cMdRsCSl5dECjIMr+8ENzdoZ/kRv8AAAn1SURBVLQY/pO3ykFSx6QlsN+x7GNOOJ+6bJ8ved15f7mXY8Tod2/5uUBXPaDk1QWBgizLw2J89g7+5xS+Ty+vRdI13S5w3p9I2moolsqDlCAn2LAqfwgUZJl/NxjiBUirRNLL3fygZaSkXz8uu2e6Iw0JwS4IFGSZPwcgxBLJKDufk/TRxElazhl0jkyIs86PskBpZwQKQhLUBUhGdmkted7LBLuNHh7TTdKJjoO0vrYCWjqI5VZ6RKAgy0LvlNeaZb3V48V+0OMlDYhBjhfSHj5+oLDRVgcECrLM/0MO6k5Rcan9pR6/16CvT6IWipzTnX0cp1GvVfwh4VkW/GjDUSFQkGX+BS7ETuCTCR+/431sS0NLvXyh7Ny51cND45zqZzdMObekoRL6HT6rXndAoCDL8jCJzN6JNxI8/oDzfqOPi2+/q1H3vYq1hMr7e3z4HcNYlHLEKHl1QKAgs2RVWvdiHFypQS6es310mLfCJGmrQV6zuxJ8iW3R3DRoB7kc91rZr8fXkHO6NrBSV8S/sWG2fAcHdnb8FjaQHcVSedMZDrtWr1WCnPsgQ02XJFy6De/dkpLK0iAXeTne8j4z2W05boFtlbuzC3R6Kycf4jWLx2rDyLpt5wIc7B+xXIDmZXb5rJRNpmWk1LZ0qK9q7RUix4uWN1mQY05Jv5R9W+Gi2DM32Dd43TojUJB1m7JCr8nD6BopYa1La2UUx9sObIhuFrmjvBjh1QV9KMg6/oCRNjdQDsuEVcQgUJB1zFJG2t7qHP8Ffic7I1CQdfzxIjXS5/UPneNfyiivzggUhISVXjFq295k0bOUYTsjUBCSiQH34AASkaHbVzpfY6+Zv8irGI9AQdb5d4PcHWLUznrHK/ATiEegIOsIFKTtJ97x/YCBIFCQdQQK0uYHyrf4icQjUJB1/gRAFubDyEif3cvGmP/nHPMyfgLxCBRkWszKtEm3qQUGsSCLXr5Fvsd/zcFqyUNDoCAEp5xzPMJMZaTod3nxOyNQEAJ/CXcCBUMnNy5uiXUtoH3wU8HikAiB/0fMXBQMlYTJA94xWGRzH7RQECJGemHY/B0sN+g72R+BghD4aycd5aeGYSmWyvMxZVX2ke8BgYIQrPaxhS6QmAwTvtcu8+N87cao9q8JHYGCzJNNovZ0zBdLZerZGIa43yu2Se4RgYJQ+CO95mV7W0CFlLr8PfjvoO+kdwQKQmFr2A3nXO0+8/P89KBBRnX5Za2T9VplmRe4dwQKgiDj//1Wyt32rpKWCgZRLJUXZIiw32/ij/TCPg7s7OzwGiEIche5LK0Tl51JP0+dO//k5sFe6LfrtcpAHeVOq+SI9182TGb5fUqOQEFQiqXynIRKdDd5xhhzhZTDluq1Cp31AYhalfaiXSyVp2SY7qQzRHxKSppPyP9tyWi/WeeGYqteq/S1tpsM6piPuTkhTAZAoCAozh1q3MUgsiXlsehtlQtEOuTnFa1ssCChMS3B0enn16sX6rVK4s2upMR1t/fphozmos9kAAQKgiTlio8YYz7U5/lvyJIu7lsUOtMSRNHnpu1IHxkFFC0DYz8/KZ+fCnGNp17OO3qMtCKit8kuqxXMxiyNM9Hhsb3Y2id43ptkFJY8j3XvnE5K69bvo0NCBAqCJhf5aLRXGjPoG3Jxiv7d8Mo2DxpjvueE1qRzUTbyuXXnIh19ftv5PtH7cRfyTVnAcFv+jf7f/f7T3sducNqS4fedY0zH9Ck0BgyFQbiBEhcuW9Ky6Gkme7FUtn0mx51P3TloXwzOIVCQG1LKWEzx4ofkTjqB57b+jPSZGPm/FduCKJbKdxpj/rN3lG/Wa5Vf7OXIxVJ51bvxSNTCQXcECnLF6eDdln9nY1oDUUfupFeeIYiSa3gtKSOvr9tHco/z2u9pefXTtyWtUvs9d5yf2bW9lB2LpfK293MmUBQRKICQfplJp4Q261wEo/r6tLzZi+WaU4ZySzFploh8cWUi9/yeMca8TR63KWHglpiM81w3pdWwIv1HHS/gEux9BUYviqWyPZ9/4jzUTkLcd6Kr10Jp1GsV5jApIlCAAclIpqi1s+psyjQpQRTNnzESVrNOSEWr2rrBte28TTnlILf/ZdppaS3L4ze9PpRNp4w07Qw2mHTO7azskb4eXfxlgURrMxrWm7VBBxL+i1756o79RmkVS+UVb3mVQ4wA1EOgAAiSzCU54Zy7bXlNdQsIv1O+Xqsc4Kevh6VXAITKH+Y70cP6bntKXNLSgRICBUCQZKjwPd653+2U7OLQZzJEBAqAkC3FbL7WbU6K3yKh/0QRgQIgWDJYYM4LlcNxpSwZPOGPvgtuhYMsI1AABE1Cxe87OW+0l3TWs5X0EBEoAIIn63CddJ7HYVk5YZe0UNzViTcYMqyLQAGQF/7WBXfLBMvItFfy6mvpe3RGoADIBSl9nfSei7vwox8g9J8oI1AA5Im/LtcxmcxoYgKFcpcyAgVAnqzIltCu47KgpD8HhUUhlREoAHLDdrLXa5W5mFCxrZQPeJ+jhaKMQAGQRwvec4o2QXPRh6KMQAGQO9JB7y/LcqMx5mlZlt++vYWfvC4CBUBeLTp7ukSukv1d7Nt3+cnrIlAA5JJMWqTjfYQIFAB5thjTd2Kk095f/h4DIlAA5Jb0pdgRXq96z7HIsiv6CBQAeXevbHXselexVP4gP3ldBAqAXKvXKrZj/le853hA9tKHIgIFwDiw/SXPO8/zUWPMn/KT13VgZ2cnT88HADqSjbcO1muVr/Eq6SNQAAAqKHkBAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKAAAFQQKAEAFgQIAUEGgAABUECgAABUECgBABYECAFBBoAAAVBAoAAAVBAoAQAWBAgBQQaAAAFQQKACAwRlj/j8iRx8AgCqb6wAAAABJRU5ErkJggg=="
                />
              </defs>
            </svg>
          </div>

          <div className={classes.heading}>
            <Typography variant="h2" className={classes.headingText}>
              Let&apos;s get you started with evaluating these caregivers and many more like them.
            </Typography>
            <Typography variant="h4" color="textSecondary" className={classes.subHeading}>
              Send a quick message to start the process
            </Typography>
          </div>

          <div className={classes.careGivers}>
            {providers.map(({ imgSource, displayName, memberId }) => (
              <div className={classes.careGiver} key={memberId}>
                <ProfileAvatar
                  alt={displayName}
                  src={imgSource}
                  size={isSmallScreen ? 'medium' : 'large'}
                  variant="rounded"
                  online={false}
                />
              </div>
            ))}
          </div>
          <div className={classes.ctaContainer}>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              onClick={upgradeClickHandler}>
              Get started
            </Button>
            <Button
              fullWidth
              size="large"
              className={classes.skipButton}
              onClick={() => {
                logInteraction('not yet');
                router.push(SEEKER_LEAD_CONNECT_ROUTES.SKIP_FOR_NOW);
              }}>
              <span>Not yet</span>
            </Button>
          </div>
        </div>
      </LcContainer>
    </>
  );
}

UpgradeOrSkip.Layout = FullWidthLayout;

export default UpgradeOrSkip;
