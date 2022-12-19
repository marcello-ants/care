import React, { useRef } from 'react';
import { ProfileAvatar, Typography } from '@care/react-component-lib';
import { Grid, useMediaQuery } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import useResizeObserver from '@/components/hooks/useResizeObserver';

import { Caregiver } from '@/types/common';

const CareGiverCard = ({
  avgReviewRating,
  yearsOfExperience,
  member: { displayName, imageURL },
}: Caregiver) => {
  const resizableRef = useRef<HTMLDivElement>(null);
  const contentRect = useResizeObserver(resizableRef);
  // 345px = manually found this breakpoint
  // when device gets really small it will wrap content, otherwise it will be displayed inline
  const isReallySmallDevice = useMediaQuery('(max-width:345px)');
  // thumbnail width                       = 48
  // padding around thumbnail's container  = 16
  // total                                 = 64

  // for ellipsis to work properly we need a fixed width but we need it to also be relative to parent
  // so we are getting the containers width and substracting the thumbnail width + the padding around it
  const width = contentRect?.width ? contentRect?.width - 64 : 0;

  return (
    <Grid
      container
      spacing={1}
      wrap={isReallySmallDevice ? 'wrap' : 'nowrap'}
      justifyContent="flex-start"
      ref={resizableRef}>
      <Grid item>
        <ProfileAvatar alt={displayName} src={imageURL} variant="rounded" />
      </Grid>
      <Grid item>
        <div
          style={{
            minWidth: 100,
            width: isReallySmallDevice ? '100%' : width,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
          <strong>{displayName}</strong>
        </div>
        <div style={{ width: '100%' }}>
          {avgReviewRating > 0 ? (
            <Rating value={avgReviewRating} readOnly />
          ) : (
            <Typography careVariant="body3">{yearsOfExperience} yrs exp</Typography>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default CareGiverCard;
