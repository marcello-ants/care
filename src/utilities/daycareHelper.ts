// Internal Dependencies
import { DaycareProviderProfile } from '@/types/seekerCC';

// Custom types

export interface daycareLeadFormatted {
  businessName: string;
  phoneNumber: string | null;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
  };
}

/**
 * Takes the existing list of daycare providers, and returns it in the
 * format expected by Iterable.
 *
 * @param daycareLeads List of daycare providers.
 * @returns List of daycare providers in the format for Iterable event.
 */
export function convertDaycareLeadsToCrmEventFormat(
  daycareLeads: DaycareProviderProfile[]
): daycareLeadFormatted[] {
  const daycareLeadsFormatted: daycareLeadFormatted[] = [];

  daycareLeads.forEach((daycareLead) => {
    if (daycareLead.selected) {
      const daycareLeadFormatted: daycareLeadFormatted = {
        businessName: daycareLead.name as string,
        phoneNumber: null, // Sending null, CRM will handle this on their side.
        address: {
          addressLine1: daycareLead.address?.addressLine1 || '',
          city: daycareLead.address?.city || '',
          state: daycareLead.address?.state || '',
          zip: daycareLead.address?.zip || '',
        },
      };

      daycareLeadsFormatted.push(daycareLeadFormatted);
    }
  });

  return daycareLeadsFormatted;
}
