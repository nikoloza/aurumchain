// Sample offerings. An offering fixes the token symbol, the supply cap, the
// unit price, and the subscription window.
export const OfferingsSection = {
  extends: 'Section',
  id: 'offerings',

  Inner: {
    SectionHeading: {
      state: {
        num: '03',
        eyebrow: 'Offerings',
        titleTop: 'Each asset becomes',
        title: 'a supply-capped token.',
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
        // The one navy tile in the row — explicit fills so it holds in both
        // page schemes (themeModifier emits unresolved vars in this runner).
        background: 'navy',
        border: '1px solid navy',
        ':hover': { transform: 'translateY(-3px)', borderColor: 'mist.5' },
        Head: {
          Titles: {
            H3: { color: 'ivory' },
            Loc: { color: 'mist.72' }
          },
          ChipAccent: { background: 'mist.18', color: 'mist', border: '1px solid mist.25' }
        },
        Bar: {
          background: 'ivory.14',
          Fill: { background: 'mist' }
        },
        Meta: {
          Raised: { color: 'ivory' },
          Pct: { color: 'mist' }
        },
        Footer: {
          borderTopColor: 'ivory.16',
          Token: { color: 'mist.65' },
          Apr: { color: 'green+28' }
        },
        state: {
          revealDelay: '0s',
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
          revealDelay: '.1s',
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
          revealDelay: '.2s',
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
      width: '100%',
      paddingTop: 'Z',
      borderTop: '1px dashed',
      borderTopColor: 'hairline',
      fontFamily: 'Mono',
      fontSize: 'Y1',
      letterSpacing: '.04em',
      color: 'caption',
      text:
        'The figures above are illustrative devnet data. Live offerings appear in the investor application after identity approval.'
    }
  }
}
