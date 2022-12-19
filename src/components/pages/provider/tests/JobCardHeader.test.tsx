import { theme } from '@care/material-ui-theme';
import { ThemeProvider } from '@material-ui/core';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import JobCardHeader from '../JobCardHeader';

describe('Provider JobCardHeader', () => {
  const renderComponent = (props: ComponentProps<typeof JobCardHeader>) =>
    render(
      <ThemeProvider theme={theme}>
        <JobCardHeader {...props} />
      </ThemeProvider>
    );

  const getStringFromMultipleElements = (startsWith: string) => {
    const firstNode = screen.getByText((content) => content.startsWith(startsWith));
    if (!firstNode) return `Couldn't find nodes starting with the text "${startsWith}".`;

    const { parentElement } = firstNode;
    if (!parentElement) return "Couldn't find parent node.";

    const stringBuilder: string[] = [];
    parentElement.childNodes.forEach(
      ({ textContent }) => textContent && stringBuilder.push(textContent)
    );

    // Replace &nbsp; with actual spaces for testing purposes
    return stringBuilder.join('').replace(new RegExp('\u00a0', 'g'), ' ');
  };

  it('has expected text when jobsLength is equal to 1', () => {
    renderComponent({ jobsLength: 1, numberOfJobsNear: 1 });
    expect(getStringFromMultipleElements('There is')).toEqual(
      'There is 1 new job that matches your specified skills.'
    );
  });

  it('has expected text when jobsLength is equal to numberOfJobsNearby', () => {
    renderComponent({ jobsLength: 2, numberOfJobsNear: 2 });
    expect(getStringFromMultipleElements('Here are')).toEqual(
      'Here are 2 of 2 jobs that match your skills.'
    );
  });

  it('has expected text when jobsLength is less than numberOfJobsNearby', () => {
    renderComponent({ jobsLength: 2, numberOfJobsNear: 3 });
    expect(getStringFromMultipleElements('Here are')).toEqual(
      'Here are 2 of 3 jobs that match your skills.'
    );
  });

  it('has expected text when jobsLength is more than numberOfJobsNearby', () => {
    renderComponent({ jobsLength: 2, numberOfJobsNear: 1 });
    expect(getStringFromMultipleElements('Here are')).toEqual(
      'Here are 2 new jobs that match your skills.'
    );
  });
});
