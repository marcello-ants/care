// Internal Dependencies
import { DaycareProviderProfile } from '@/types/seekerCC';
import { CenterType } from '@/__generated__/globalTypes';
import { convertDaycareLeadsToCrmEventFormat, daycareLeadFormatted } from '../daycareHelper';

describe('Daycare Helper', () => {
  it('converts daycare leads to Iterable format', () => {
    const daycareLeads: DaycareProviderProfile[] = [
      {
        __typename: 'Provider',
        address: {
          __typename: 'Address',
          addressLine1: '11012 Harris Branch Parkway',
          addressLine2: '',
          city: 'Austin',
          latitude: 30.3444587,
          longitude: -97.6143446,
          state: 'TX',
          zip: '78754',
        },
        centerType: CenterType.SMALL_MEDIUM_BUSINESS,
        avgReviewRating: 2,
        description: 'The foundation of a lifetime of success is formed here.',
        hasCoordinates: true,
        id: '7bec04b7-8974-4df2-9a1c-6abef2844a0e',
        images: [],
        license: {
          __typename: 'License',
          administrativeArea: 'TX',
          externalUrl: null,
          name: 'Child Care',
          verifiedDate: '2021-07-15',
          certified: true,
        },
        logo: {
          __typename: 'ProfileImage',
          urlOriginal:
            'https://s3.amazonaws.com/galore-staging/provider_avatar_1681_original.?1626296505',
        },
        name: 'The Courtyard of Austin',
        reviews: [],
        selected: true,
      },
      {
        __typename: 'Provider',
        address: {
          __typename: 'Address',
          addressLine1: '11012 Harris Branch Parkway',
          addressLine2: '',
          city: 'Austin',
          latitude: 30.3444587,
          longitude: -97.6143446,
          state: 'TX',
          zip: '78754',
        },
        centerType: CenterType.SMALL_MEDIUM_BUSINESS,
        avgReviewRating: 2,
        description: 'The foundation of a lifetime of success is formed here.',
        hasCoordinates: true,
        id: '7bec04b7-8974-4df2-9a1c-6abef2844a0e',
        images: [],
        license: {
          __typename: 'License',
          administrativeArea: 'TX',
          externalUrl: null,
          name: 'Child Care',
          verifiedDate: '2021-07-15',
          certified: true,
        },
        logo: {
          __typename: 'ProfileImage',
          urlOriginal:
            'https://s3.amazonaws.com/galore-staging/provider_avatar_1681_original.?1626296505',
        },
        name: 'The Courtyard of Austin',
        reviews: [],
        selected: false,
      },
    ];

    const daycareLeadsFormatted: daycareLeadFormatted[] = [
      {
        businessName: 'The Courtyard of Austin',
        phoneNumber: null,
        address: {
          addressLine1: '11012 Harris Branch Parkway',
          city: 'Austin',
          state: 'TX',
          zip: '78754',
        },
      },
    ];

    expect(daycareLeadsFormatted).toEqual(convertDaycareLeadsToCrmEventFormat(daycareLeads));
    expect(convertDaycareLeadsToCrmEventFormat(daycareLeads).length).toBe(1);
  });
});
