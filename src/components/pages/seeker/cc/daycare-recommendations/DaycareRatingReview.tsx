import { Rating } from '@care/react-component-lib';
import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';

interface DaycareRatingReviewProps {
  author: string;
  rating: number;
  text: string;
}

export default function DaycareRatingReview({ author, rating, text }: DaycareRatingReviewProps) {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h4">{author}</Typography>
      </Grid>
      <Grid item>
        <Box marginTop={1} marginBottom={1}>
          <Rating precision={0.1} value={rating} readOnly size="large" />
        </Box>
      </Grid>
      <Grid item>
        <Typography variant="body2">{text}</Typography>
      </Grid>
    </Grid>
  );
}
