import { ReactChild, ReactFragment, ReactPortal } from 'react';

export interface ILayoutProps {
  children: boolean | ReactChild | ReactFragment | ReactPortal;
}
