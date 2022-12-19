import clsx from 'clsx';
import { ReactNode } from 'react';

function RebrandedWrapper(
  Component: (arg: { [key: string]: string }) => ReactNode,
  classes: { [key: string]: string }
) {
  const { root, rebrandedRoot, content, rebrandedContent } = classes;
  const newClasses = {
    root: clsx(root, rebrandedRoot),
    content: clsx(content, rebrandedContent),
  };

  return <>{Component(newClasses)}</>;
}

export default RebrandedWrapper;
