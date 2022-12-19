export default () => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const { DateTimeFormat } = Intl;

  jest
    .spyOn(global.Intl, 'DateTimeFormat')
    .mockImplementation(() => new DateTimeFormat('en-US', options));
};
