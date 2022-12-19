import React, { ReactElement, useState } from 'react';

import { Typography } from '@care/react-component-lib';
import { useTheme } from '@material-ui/core/styles';

export interface ShowMoreByHeightProps {
  heightLimit: number;
  children: ReactElement;
  showMoreLabel: string;
  showLessLabel: string;
}

function ShowMore({ heightLimit, children, showMoreLabel, showLessLabel }: ShowMoreByHeightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  return (
    <>
      <div
        style={{
          height: isOpen ? 'auto' : heightLimit,
          overflow: 'hidden',
          marginBottom: isOpen ? 0 : 21,
        }}>
        {children}
      </div>
      <span style={{ color: theme?.palette?.care?.blue[700], cursor: 'pointer' }}>
        <Typography variant="h4" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? showLessLabel : showMoreLabel}
        </Typography>
      </span>
    </>
  );
}

export default ShowMore;
