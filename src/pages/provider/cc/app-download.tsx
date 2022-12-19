import AppDownload, {
  AppDownloadHeader,
  AppDownloadLayout,
} from '@/components/pages/provider/AppDownload';

const AppDownloadPage = () => {
  return <AppDownload />;
};

AppDownloadPage.Header = <AppDownloadHeader />;
AppDownloadPage.Layout = AppDownloadLayout;

export default AppDownloadPage;
