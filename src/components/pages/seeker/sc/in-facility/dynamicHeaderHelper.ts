// This function generates the header for the different In-Facility flow pages depending on the 'whoNeedsCare' value

const generateDynamicHeader = (
  whoNeedsCare: string,
  selfHeader: string,
  prefix: string,
  suffix: string
) => {
  return ['OTHER', 'PARENT', 'SPOUSE'].includes(whoNeedsCare!)
    ? `${prefix} ${
        whoNeedsCare === 'OTHER' ? 'loved one' : whoNeedsCare?.toLocaleLowerCase()
      }${suffix}`
    : selfHeader;
};

export default generateDynamicHeader;
