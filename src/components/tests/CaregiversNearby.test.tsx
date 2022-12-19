import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { GET_CAREGIVERS_NEARBY } from '../request/GQL';
import useNearbyCaregivers from '../hooks/useNearbyCaregivers';

const testingZipCode = '78665';

function generateMock(desiredRadius: number, numCaregiversNearby: number, subService: any = null) {
  const caregiversNearbyFlagContainer = {
    flag: false,
  };

  const variables = {
    zipcode: testingZipCode,
    serviceType: 'SENIOR_CARE',
    radius: desiredRadius,
    subServiceType: subService,
  };

  const caregiversNearbyMock = {
    request: {
      query: GET_CAREGIVERS_NEARBY,
      variables,
    },
    result: () => {
      caregiversNearbyFlagContainer.flag = true;
      return {
        data: {
          getCaregiversNearby: numCaregiversNearby,
        },
      };
    },
  };

  return { caregiversNearbyMock, caregiversNearbyFlagContainer };
}

const {
  caregiversNearbyMock: caregiversNearby1MileMock,
  caregiversNearbyFlagContainer: caregiversNearby1Mile,
} = generateMock(1, 50);

const {
  caregiversNearbyMock: noCaregiversNearby1MileMock,
  caregiversNearbyFlagContainer: noCaregiversNearby1Mile,
} = generateMock(1, 0);

const {
  caregiversNearbyMock: caregiversNearby3MilesMock,
  caregiversNearbyFlagContainer: caregiversNearby3Miles,
} = generateMock(3, 20);

const {
  caregiversNearbyMock: noCaregiversNearby3MilesMock,
  caregiversNearbyFlagContainer: noCaregiversNearby3Miles,
} = generateMock(3, 0);

const {
  caregiversNearbyMock: caregiversNearby5MilesMock,
  caregiversNearbyFlagContainer: caregiversNearby5Miles,
} = generateMock(5, 20);

const {
  caregiversNearbyMock: noCaregiversNearby5MilesMock,
  caregiversNearbyFlagContainer: noCaregiversNearby5Miles,
} = generateMock(5, 0);

const {
  caregiversNearbyMock: caregiversNearby10MilesMock,
  caregiversNearbyFlagContainer: caregiversNearby10Miles,
} = generateMock(10, 20);

const {
  caregiversNearbyMock: noCaregiversNearby10MilesMock,
  caregiversNearbyFlagContainer: noCaregiversNearby10Miles,
} = generateMock(10, 0);

const {
  caregiversNearbyMock: caregiversNearby20MilesMock,
  caregiversNearbyFlagContainer: caregiversNearby20Miles,
} = generateMock(20, 60);

const {
  caregiversNearbyMock: noCaregiversNearby20MilesMock,
  caregiversNearbyFlagContainer: noCaregiversNearby20Miles,
} = generateMock(20, 0);

const caregiversNearbyMockError = {
  request: {
    query: GET_CAREGIVERS_NEARBY,
    variables: {
      zipcode: testingZipCode,
      serviceType: 'SENIOR_CARE',
      radius: 1,
      subServiceType: null,
    },
  },
  error: new Error('aw shucks'),
};

function Gadget() {
  const { displayCaregiverMessage, numCaregivers } = useNearbyCaregivers(testingZipCode);
  return (
    <>
      <div>
        <p data-testid="CanBeDisplayed">{displayCaregiverMessage.toString()}</p>
      </div>
      <div>
        <p data-testid="NumberCaregivers">{numCaregivers.toString()}</p>
      </div>
    </>
  );
}

async function extractFromGadget(mocksAndFlags: any) {
  const mocks = mocksAndFlags.map((entry: any[]) => entry[0]);
  const flags = mocksAndFlags
    .filter((entry: any[]) => entry.length > 1)
    .map((entry: any[]) => entry[1]);
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Gadget />
    </MockedProvider>
  );

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < flags.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await waitFor(() => expect(flags[index].flag).toEqual(true));
  }

  const displayLabel = screen.getByTestId('CanBeDisplayed');
  expect(displayLabel).toBeInTheDocument();

  const numberLabel = screen.getByTestId('NumberCaregivers');
  expect(numberLabel).toBeInTheDocument();

  const caregiverText = displayLabel?.textContent?.trim() ?? undefined;
  const displayCaregiverMessage =
    caregiverText !== undefined ? caregiverText.trim() === 'true' : caregiverText;

  const numCaregiversText = numberLabel?.textContent?.trim() ?? undefined;
  const numCaregivers =
    numCaregiversText !== undefined && Number.isInteger(numCaregiversText)
      ? parseInt(numCaregiversText, 10)
      : numCaregiversText;

  return { displayCaregiverMessage, numCaregivers };
}

beforeEach(() => {
  caregiversNearby1Mile.flag = false;
  noCaregiversNearby1Mile.flag = false;
  caregiversNearby3Miles.flag = false;
  noCaregiversNearby3Miles.flag = false;
  caregiversNearby5Miles.flag = false;
  noCaregiversNearby5Miles.flag = false;
  caregiversNearby10Miles.flag = false;
  noCaregiversNearby10Miles.flag = false;
  caregiversNearby20Miles.flag = false;
  noCaregiversNearby20Miles.flag = false;
});

describe('Caregivers Nearby', () => {
  it('Gets number of caregivers 1 mile away', async () => {
    const { displayCaregiverMessage, numCaregivers } = await extractFromGadget([
      [caregiversNearby1MileMock, caregiversNearby1Mile],
    ]);

    expect(displayCaregiverMessage).toEqual(true);
    expect(numCaregivers).toEqual('50');
  });

  it('Returns appropriate value when 0 caregivers all radii', async () => {
    const { displayCaregiverMessage, numCaregivers } = await extractFromGadget([
      [noCaregiversNearby1MileMock, noCaregiversNearby1Mile],
      [noCaregiversNearby3MilesMock, noCaregiversNearby3Miles],
      [noCaregiversNearby5MilesMock, noCaregiversNearby5Miles],
      [noCaregiversNearby10MilesMock, noCaregiversNearby10Miles],
      [noCaregiversNearby20MilesMock, noCaregiversNearby20Miles],
    ]);

    expect(displayCaregiverMessage).toEqual(false);
    expect(numCaregivers).toEqual('0');
  });

  it('Returns appropriate value in case of error', async () => {
    const { displayCaregiverMessage, numCaregivers } = await extractFromGadget([
      [caregiversNearbyMockError],
    ]);

    expect(displayCaregiverMessage).toEqual(false);
    expect(numCaregivers).toEqual('0');
  });

  it('Gets number of caregivers 3 miles away', async () => {
    const { displayCaregiverMessage, numCaregivers } = await extractFromGadget([
      [noCaregiversNearby1MileMock, noCaregiversNearby1Mile],
      [caregiversNearby3MilesMock, caregiversNearby3Miles],
      [noCaregiversNearby5MilesMock, noCaregiversNearby5Miles],
      [noCaregiversNearby10MilesMock, noCaregiversNearby10Miles],
      [noCaregiversNearby20MilesMock, noCaregiversNearby20Miles],
    ]);

    expect(displayCaregiverMessage).toEqual(true);
    expect(numCaregivers).toEqual('20');
  });

  it('Gets number of caregivers 20 miles away since that is the first > 50', async () => {
    const { displayCaregiverMessage, numCaregivers } = await extractFromGadget([
      [noCaregiversNearby1MileMock, noCaregiversNearby1Mile],
      [caregiversNearby3MilesMock, caregiversNearby3Miles],
      [caregiversNearby5MilesMock, caregiversNearby5Miles],
      [caregiversNearby10MilesMock, caregiversNearby10Miles],
      [caregiversNearby20MilesMock, caregiversNearby20Miles],
    ]);

    expect(displayCaregiverMessage).toEqual(true);
    expect(numCaregivers).toEqual('60');
  });
});
