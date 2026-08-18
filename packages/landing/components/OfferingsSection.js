// Sample offerings. An offering fixes the token symbol, the supply cap, the
// unit price, and the subscription window.
export const OfferingsSection = {
  extends: 'Section',
  id: 'offerings',

  Inner: {
    SectionHeading: {
      state: {
        eyebrow: 'Offerings',
        title: 'Each asset becomes a supply-capped token.',
        lead:
          'An offering fixes the token symbol, the supply cap, the unit price, and the subscription window. The registry enforces every one of them.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'A',
      '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@mobileL': { gridTemplateColumns: '1fr' },

      OfferingCard: {
        state: {
          name: 'Riverbend Extraction',
          location: 'Ashanti, Ghana',
          status: 'Funding',
          raised: '$1.84M',
          goal: '$2.40M',
          pct: 77,
          symbol: 'RBX-001',
          price: '$25.00',
          apr: '11.4%'
        }
      },
      OfferingCard_1: {
        extends: 'OfferingCard',
        state: {
          name: 'Kalgoorlie Tailings',
          location: 'Western Australia',
          status: 'Funding',
          raised: '$620K',
          goal: '$1.50M',
          pct: 41,
          symbol: 'KGT-002',
          price: '$10.00',
          apr: '9.2%'
        }
      },
      OfferingCard_2: {
        extends: 'OfferingCard',
        state: {
          name: 'Serra Verde Plant',
          location: 'Minas Gerais, Brazil',
          status: 'Closed',
          raised: '$3.10M',
          goal: '$3.10M',
          pct: 100,
          symbol: 'SVP-003',
          price: '$50.00',
          apr: '12.8%'
        }
      }
    },

    Note: {
      tag: 'p',
      margin: '0',
      fontSize: 'Y1',
      color: 'caption',
      text:
        'The figures above are illustrative devnet data. Live offerings appear in the investor application after identity approval.'
    }
  }
}
