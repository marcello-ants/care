// External Dependencies
import React from 'react';
import { Typography, FormControlLabel, Checkbox } from '@care/react-component-lib';
import { Grid, Box, useMediaQuery } from '@material-ui/core';
import { theme } from '@care/material-ui-theme';

// Internal Dependencies
import { DaycareProviderProfile } from '@/types/seekerCC';
import { CenterType } from '@/__generated__/globalTypes';
import { InHomeDaycareBadge, DaycareCenterBadge, LicenseBadge, RatingBadge } from '../Badges';
import CardImage from './CardImage';
import useStyles from './styles';

// Types + Interfaces
export type DayCareProps = {
  onSelectChange: (daycareId: string, isSelected: boolean) => void;
  onClick: (daycareId: string) => void;
  order: number;
  isSelected: boolean;
  isDisabled: boolean;
  daycareProfile: DaycareProviderProfile;
  photoIndex: number;
};

function RecommendationCard({
  onSelectChange,
  onClick,
  order,
  isSelected,
  isDisabled,
  daycareProfile,
  photoIndex,
}: DayCareProps) {
  // Styles
  const classes = useStyles();
  const isDesktopOrUp = useMediaQuery(theme.breakpoints.up('md'));
  const checkboxName = `${daycareProfile.id}-selected`;

  // Handlers
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectChange(daycareProfile.id, e.target.checked);
  };

  const handleSelect = () => {
    onClick(daycareProfile.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      handleSelect();
    }
  };

  return (
    <Grid container className={classes.daycare}>
      {isDesktopOrUp && (
        <Grid item xs={12} md={4} lg={3} className={classes.daycareIconImage}>
          <a
            className={`${classes.imageLink} ${classes.daycareIconImageContainer}`}
            tabIndex={0}
            role="button"
            aria-label="thumbnail"
            onKeyDown={handleKeyDown}
            onClick={handleSelect}>
            <CardImage photoIndex={photoIndex} isDesktopOrUp />
          </a>
        </Grid>
      )}
      <Grid item xs={12} md={8} lg={9}>
        <Grid container>
          <Grid item xs={10}>
            <Box pt={0} pr={0} pl={2} pb={2}>
              <div className={classes.daycareInfo}>
                {daycareProfile.license && daycareProfile.license.certified && (
                  <LicenseBadge
                    name={daycareProfile.license.name ?? ''}
                    verifiedDate={daycareProfile.license.verifiedDate}
                  />
                )}

                {daycareProfile.avgReviewRating > 0 && (
                  <RatingBadge label={daycareProfile.avgReviewRating.toFixed(1)} />
                )}

                {daycareProfile.centerType === CenterType.FCC ? (
                  <InHomeDaycareBadge />
                ) : (
                  <DaycareCenterBadge />
                )}
              </div>
              <div className={classes.daycareAddressContainer}>
                <div className={classes.daycareName}>
                  <Typography variant="h4" onClick={handleSelect}>
                    {order}. {daycareProfile.name}
                  </Typography>
                </div>
                {daycareProfile.address && (
                  <Box pt={1}>
                    <Typography
                      careVariant="body3"
                      onClick={handleSelect}
                      className={classes.address}>
                      {daycareProfile.address.addressLine1}, {daycareProfile.address.city},{' '}
                      {daycareProfile.address.state} {daycareProfile.address.zip}
                    </Typography>
                  </Box>
                )}
              </div>
            </Box>
            {!isDesktopOrUp && <CardImage photoIndex={photoIndex} />}
          </Grid>
          <Grid item xs={2} className={classes.daycareCheckBox}>
            <FormControlLabel
              label=""
              control={
                <Checkbox
                  name={checkboxName}
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={handleCheckboxChange}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RecommendationCard;
