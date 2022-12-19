import { useRouter } from 'next/router';
import { init } from '@sentry/nextjs';
import sentryTestkit from 'sentry-testkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ErrorPage from '@/pages/_error';

jest.mock('next/router', () => ({
  ...(jest.requireActual('next/router') as object),
  __esModule: true,
  useRouter: jest.fn(),
}));

describe('_error Page', () => {
  let mockRouter: any | null = null;
  const { testkit, sentryTransport } = sentryTestkit();

  beforeAll(() => {
    init({
      dsn: 'https://mydsn@sentry.io/123456790',
      transport: sentryTransport,
      defaultIntegrations: false,
    });
  });

  beforeEach(() => {
    mockRouter = {
      back: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    testkit.reset();
  });

  it('should render snapshot', async () => {
    const { asFragment } = render(<ErrorPage />);
    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should go back when the link is clicked', async () => {
    render(<ErrorPage />);
    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    fireEvent.click(screen.getByText('try again'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('should capture the exception', async () => {
    render(<ErrorPage err={new Error('ruh roh')} />);
    await waitFor(() => expect(testkit.reports()).toHaveLength(1));
    const [report] = testkit.reports();
    expect(report.error?.message).toBe('ruh roh');
  });
});
