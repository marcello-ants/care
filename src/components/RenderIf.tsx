import React, { ReactElement } from 'react';

interface IProps {
  condition: boolean;
  children: React.ReactChild;
}

const RenderIf = ({ condition, children }: IProps): ReactElement => {
  if (condition) {
    return <>{children}</>;
  }
  return <></>;
};

export default RenderIf;
