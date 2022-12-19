import { NextComponentType } from 'next';
import { FC, ReactElement } from 'react';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { SeekerAction, SeekerState } from './seeker';
import { SeekerCCAction, SeekerCCState } from './seekerCC';
import { SeekerHKAction, SeekerHKState } from './seekerHK';
import { SeekerPCAction, SeekerPCState } from './seekerPC';
import { SeekerTUAction, SeekerTUState } from './seekerTU';
import { ProviderAction, ProviderState } from './provider';
import { ProviderCCAction, ProviderCCState } from './providerCC';
import { FlowAction, FlowState } from './flow';
import { LtcgAction, LtcgState } from './ltcg';
import { JobAction } from './job';

import { ILayoutProps } from './layout';

export interface AppState {
  flow: FlowState;
  seeker: SeekerState;
  seekerCC: SeekerCCState;
  seekerHK: SeekerHKState;
  seekerPC: SeekerPCState;
  seekerTU: SeekerTUState;
  provider: ProviderState;
  providerCC: ProviderCCState;
  ltcg: LtcgState;
  version: string;
}

export type AppAction =
  | SeekerAction
  | SeekerCCAction
  | ProviderAction
  | FlowAction
  | ProviderCCAction
  | SeekerHKAction
  | JobAction
  | SeekerPCAction
  | SeekerTUAction
  | LtcgAction;

export interface AppDispatch {
  (action: AppAction): void;
}

export type AppPageComponent = NextComponentType & {
  // whether the page requires an auth check (defaults to false)
  CheckAuthCookie?: boolean;
  // custom page footer
  Footer?: ReactElement;
  // custom page layout (otherwise uses DefaultLayout)
  Layout?: FC<ILayoutProps>;
  // custom page header
  Header?: ReactElement;
  // tags that should be added to the page's <head>
  HeadTags?: ReactElement;
  // whether the page should use the default page transition (defaults to true)
  usePageTransition?: boolean;
  // when not using the default page transition, the key to use to know when to reenable the page transition (defaults to the route name)
  transitionKey?: string;
  // custom background image
  backgroundImage?: (props?: any) => ClassNameMap<'background'>;
  // whether the automatic "Screen Viewed" amplitude event logging should be disabled
  disableScreenViewed?: boolean;
};
