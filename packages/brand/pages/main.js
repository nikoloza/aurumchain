// The brand project's own page: the 2026 identity rendered by the system it
// documents. Every swatch, specimen, and control on this sheet is the live
// token or component — the preview cannot drift from the library.
export const main = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: '{{ brand.meta.title | polyglot }}',
    description: '{{ brand.meta.description | polyglot }}'
  },

  TopRow: {
    tag: 'header',
    flow: 'x',
    align: 'center space-between',
    gap: 'A',
    width: '100%',
    padding: 'Z C',
    theme: 'nav',
    borderBottom: '1px solid hairline',
    position: 'sticky',
    top: '0',
    zIndex: '40',
    backdropFilter: 'saturate(1.4) blur(12px)',
    '@tabletS': { padding: 'Z A' },

    Logo: {},
    Right: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      ChipAccent: { text: '{{ brand.chip | polyglot }}' },
      LangSwitch: {},
      ThemeToggle: {}
    }
  },

  Main: {
    tag: 'main',
    flow: 'y',
    width: '100%',

    BrandHero: {
      tag: 'section',
      flow: 'y',
      align: 'center center',
      position: 'relative',
      width: '100%',
      padding: 'E C D',
      overflow: 'hidden',
      '@tabletS': { padding: 'D A C' },

      Ghost: {
        position: 'absolute',
        top: '-8vw',
        right: '-8vw',
        pointerEvents: 'none',
        color: 'slate.12',
        '@dark': { color: 'mist.06' },
        Icon: { name: 'logo', width: '36vw', height: '36vw', display: 'block' },
        '@tabletS': { display: 'none' }
      },

      Inner: {
        flow: 'y',
        gap: 'B1',
        align: 'flex-start flex-start',
        width: '100%',
        maxWidth: '1120px',
        position: 'relative',

        Eyebrow: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Z',
          width: '100%',
          animationName: 'fcReveal',
          animationDuration: 'F',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' },

          Diamond: {
            tag: 'span',
            flexShrink: '0',
            width: 'X1',
            height: 'X1',
            background: 'accentInk',
            transform: 'rotate(45deg)'
          },
          Label: {
            tag: 'span',
            fontSize: 'Y1',
            fontWeight: '600',
            letterSpacing: '.18em',
            lineHeight: '1',
            textTransform: 'uppercase',
            color: 'caption',
            text: '{{ brand.hero.eyebrow | polyglot }}'
          },
          Rule: {
            flex: '1',
            alignSelf: 'center',
            borderTop: '1px dashed',
            borderTopColor: 'hairline'
          }
        },

        H1: {
          fontFamily: 'Brand',
          fontSize: 'H',
          lineHeight: '.94',
          fontWeight: '400',
          letterSpacing: '.008em',
          textTransform: 'uppercase',
          color: 'title',
          margin: '0',
          animationName: 'fcReveal',
          animationDuration: 'F',
          animationDelay: 'A',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' },
          '@tabletS': { fontSize: 'F' },

          Top: { tag: 'span', display: 'block', color: 'accentInk', text: '{{ brand.hero.titleTop | polyglot }}' },
          Main: {
            tag: 'span',
            display: 'block',
            text: '{{ brand.hero.title | polyglot }}',
            Dot: {
              tag: 'span',
              display: 'inline-block',
              width: '.11em',
              height: '.11em',
              background: 'mist',
              transform: 'rotate(45deg)',
              verticalAlign: '.07em',
              marginLeft: '.12em'
            }
          }
        },

        P: {
          fontSize: 'A2',
          lineHeight: '1.6',
          color: 'paragraph',
          margin: '0',
          maxWidth: 'I',
          animationName: 'fcReveal',
          animationDuration: 'F',
          animationDelay: 'B',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' },
          text: '{{ brand.hero.lead | polyglot }}'
        },

        Meta: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Z C',
          flexWrap: 'wrap',
          fontFamily: 'Mono',
          fontSize: 'Y1',
          color: 'caption',
          animationName: 'fcReveal',
          animationDuration: 'F',
          animationDelay: 'C',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' },

          M1: { tag: 'span', text: '{{ brand.hero.m1 | polyglot }}' },
          M2: { tag: 'span', text: '{{ brand.hero.m2 | polyglot }}' },
          M3: { tag: 'span', text: '{{ brand.hero.m3 | polyglot }}' },
          M4: { tag: 'span', text: 'fractyco/uikit 2.0.0' }
        }
      }
    },

    ColorSection: {
      extends: 'Section',
      id: 'color',
      theme: 'surface',

      Inner: {
        SectionHeading: {
          state: {
            num: '01',
            eyebrow: 'brand.color.eyebrow',
            titleTop: 'brand.color.titleTop',
            title: 'brand.color.title',
            lead: 'brand.color.lead'
          }
        },

        Swatches: {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'A',
          '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
          '@mobileM': { gridTemplateColumns: '1fr' },

          childExtends: 'BrandSwatch',
          childrenAs: 'state',
          children: [
            { token: 'navy', role: 'brand.color.rolePrimary', name: 'Deep Navy', hex: '#082439' },
            { token: 'ivory', role: 'brand.color.roleNeutral', name: 'Soft Ivory', hex: '#F5F2EC', light: true },
            { token: 'slate', role: 'brand.color.roleSecondary', name: 'Slate Blue', hex: '#607D94' },
            { token: 'mist', role: 'brand.color.roleAccent', name: 'Mist Blue', hex: '#A8C0CF' }
          ]
        },

        Pairs: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Y',
          flexWrap: 'wrap',

          childExtends: 'BrandPair',
          childrenAs: 'state',
          children: [
            { token: 'title', label: 'title' },
            { token: 'paragraph', label: 'paragraph' },
            { token: 'caption', label: 'caption' },
            { token: 'hairline', label: 'hairline' },
            { token: 'veil', label: 'veil' },
            { token: 'accentInk', label: 'accentInk' },
            { token: 'activeWash', label: 'activeWash' },
            { token: 'meter', label: 'meter' },
            { token: 'dangerInk', label: 'dangerInk' }
          ]
        },

        ModsNote: {
          tag: 'span',
          fontFamily: 'Mono',
          fontSize: 'Y1',
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'caption',
          marginTop: 'Z',
          text: '{{ brand.color.modsNote | polyglot }}'
        },
        Mods: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Y',
          flexWrap: 'wrap',

          childExtends: 'BrandPair',
          childrenAs: 'state',
          children: [
            { token: 'navy', label: 'navy' },
            { token: 'navy.32', label: 'navy.32' },
            { token: 'navy+24', label: 'navy+24' },
            { token: 'navy-24', label: 'navy-24' },
            { token: 'slate.45', label: 'slate.45' },
            { token: 'mist.16', label: 'mist.16' }
          ]
        }
      }
    },

    ScaleSection: {
      extends: 'Section',
      id: 'scale',

      Inner: {
        SectionHeading: {
          state: {
            num: '02',
            eyebrow: 'brand.scale.eyebrow',
            titleTop: 'brand.scale.titleTop',
            title: 'brand.scale.title',
            lead: 'brand.scale.lead'
          }
        },

        Split: {
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: 'D',
          alignItems: 'start',
          '@tabletL': { gridTemplateColumns: '1fr' },

          Ladder: {
            flow: 'y',
            gap: 'Z',
            childExtends: 'ScaleBar',
            childrenAs: 'state',
            children: [
              { token: 'X' },
              { token: 'Y' },
              { token: 'Z' },
              { token: 'A' },
              { token: 'B' },
              { token: 'C' },
              { token: 'D' },
              { token: 'E' }
            ]
          },

          Ramp: {
            flow: 'y',
            gap: 'Z',
            childExtends: 'TypeRamp',
            childrenAs: 'state',
            children: [
              { size: 'Y1', sample: 'Caption — 12/14' },
              { size: 'Z', sample: 'Interface label' },
              { size: 'A', sample: 'Body reading size' },
              { size: 'B1', sample: 'Lead paragraph' },
              { size: 'C1', sample: 'Section three' },
              { size: 'E', sample: 'Display' }
            ]
          }
        },

        Radii: {
          flow: 'x',
          align: 'flex-start flex-start',
          gap: 'C',
          flexWrap: 'wrap',
          childExtends: 'RadiusTile',
          childrenAs: 'state',
          children: [
            { radius: 'radiusControl', label: 'radiusControl · 10' },
            { radius: 'radiusCard', label: 'radiusCard · 16' },
            { radius: 'radiusSheet', label: 'radiusSheet · 22' },
            { radius: 'radiusPill', label: 'radiusPill' }
          ]
        }
      }
    },

    TypeSection: {
      extends: 'Section',
      id: 'type',

      Inner: {
        SectionHeading: {
          state: {
            num: '03',
            eyebrow: 'brand.type.eyebrow',
            titleTop: 'brand.type.titleTop',
            title: 'brand.type.title'
          }
        },

        Specimens: {
          flow: 'y',
          gap: 'Z',

          childExtends: 'TypeSpecimen',
          childrenAs: 'state',
          children: [
            { face: 'Anton', role: 'brand.type.roleBrand', fam: 'Brand', sample: 'Real assets, made liquid', size: 'D', caps: true, tracking: '.01em' },
            { face: 'Hanken Grotesk', role: 'brand.type.roleDisplay', fam: 'Display', sample: 'Four states between signing up and getting paid.', size: 'C', weight: '700', tracking: '-.02em' },
            { face: 'Inter', role: 'brand.type.roleDefault', fam: 'Default', sample: 'Every transfer clears a compliance hook, every position settles against a registry, and every payout distributes on-chain.', size: 'A', tone: 'body', tracking: '0' },
            { face: 'IBM Plex Mono', role: 'brand.type.roleMono', fam: 'Mono', sample: '$1.84M / $2.40M · 77% · T+0', size: 'B', weight: '600', tracking: '-.02em' }
          ]
        }
      }
    },

    LogoSection: {
      extends: 'Section',
      id: 'logo',
      theme: 'surface',

      Inner: {
        SectionHeading: {
          state: {
            num: '04',
            eyebrow: 'brand.logo.eyebrow',
            titleTop: 'brand.logo.titleTop',
            title: 'brand.logo.title',
            lead: 'brand.logo.lead'
          }
        },

        Tiles: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'A',
          '@mobileL': { gridTemplateColumns: '1fr' },

          OnIvory: {
            flow: 'x',
            align: 'center center',
            minHeight: 'G',
            padding: 'B',
            borderRadius: 'radiusCard',
            background: 'ivory',
            border: '1px solid line',
            Logo: { color: 'navy' }
          },
          OnNavy: {
            flow: 'x',
            align: 'center center',
            minHeight: 'G',
            padding: 'B',
            borderRadius: 'radiusCard',
            background: 'navy',
            Logo: { color: 'ivory' }
          }
        }
      }
    },

    MotionSection: {
      extends: 'Section',
      id: 'motion',
      theme: 'surface',

      Inner: {
        SectionHeading: {
          state: {
            num: '05',
            eyebrow: 'brand.motion.eyebrow',
            titleTop: 'brand.motion.titleTop',
            title: 'brand.motion.title',
            lead: 'brand.motion.lead'
          }
        },

        Grid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 'A',
          '@tabletL': { gridTemplateColumns: 'repeat(3, 1fr)' },
          '@mobileL': { gridTemplateColumns: 'repeat(2, 1fr)' },

          childExtends: 'MotionTile',
          childrenAs: 'state',
          children: [
            { anim: 'fcReveal', alt: true, dur: '1.4s' },
            { anim: 'lineUp', alt: true, dur: '1.4s' },
            { anim: 'skeletonPulse', dur: '1.6s' },
            { anim: 'floatY', dur: '4s' },
            { anim: 'pulseAccent', dur: '2.4s' },
            { anim: 'blink', dur: '1.1s' }
          ]
        }
      }
    },

    IconSection: {
      extends: 'Section',
      id: 'icons',

      Inner: {
        SectionHeading: {
          state: {
            num: '06',
            eyebrow: 'brand.icons.eyebrow',
            titleTop: 'brand.icons.titleTop',
            title: 'brand.icons.title',
            lead: 'brand.icons.lead'
          }
        },

        Grid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: 'Y',
          '@tabletL': { gridTemplateColumns: 'repeat(5, 1fr)' },
          '@mobileL': { gridTemplateColumns: 'repeat(3, 1fr)' },

          childExtends: 'IconCell',
          childrenAs: 'state',
          children: [
            { name: 'logo' },
            { name: 'wallet' },
            { name: 'chart' },
            { name: 'layers' },
            { name: 'shield' },
            { name: 'exchange' },
            { name: 'coins' },
            { name: 'receipt' },
            { name: 'document' },
            { name: 'user' },
            { name: 'users' },
            { name: 'cog' },
            { name: 'audit' },
            { name: 'arrowRight' },
            { name: 'arrowUp' },
            { name: 'arrowDown' },
            { name: 'check' },
            { name: 'close' },
            { name: 'chevronDown' },
            { name: 'globe' },
            { name: 'lock' },
            { name: 'alert' },
            { name: 'pause' },
            { name: 'logout' },
            { name: 'sun' }
          ]
        }
      }
    },

    ComponentSection: {
      extends: 'Section',
      id: 'components',

      Inner: {
        SectionHeading: {
          state: {
            num: '07',
            eyebrow: 'brand.cmp.eyebrow',
            titleTop: 'brand.cmp.titleTop',
            title: 'brand.cmp.title',
            lead: 'brand.cmp.lead'
          }
        },

        Buttons: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Z',
          flexWrap: 'wrap',
          PillButton: { text: '{{ common.openAccount | polyglot }}' },
          PillButton_1: { state: { tone: 'secondary' }, text: '{{ brand.cmp.seeHow | polyglot }}' },
          PillButton_2: { state: { tone: 'ghost' }, text: '{{ brand.cmp.ghost | polyglot }}' },
          ActionButton: { text: '{{ offering.subscribe | polyglot }}' },
          ActionButton_1: { state: { tone: 'secondary' }, text: '{{ common.export | polyglot }}' },
          ActionButton_2: { state: { tone: 'ghost' }, text: '{{ common.signOut | polyglot }}' }
        },

        NavyStrip: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Z',
          flexWrap: 'wrap',
          padding: 'A B',
          borderRadius: 'radiusCard',
          theme: 'inverted',
          PillButton: { state: { tone: 'inverse' }, text: '{{ brand.cmp.onNavy | polyglot }}' },
          PillButton_1: { state: { tone: 'outline' }, text: '{{ common.talkToUs | polyglot }}' }
        },

        Chips: {
          flow: 'x',
          align: 'center flex-start',
          gap: 'Y',
          flexWrap: 'wrap',
          Chip: { text: '{{ brand.cmp.neutral | polyglot }}' },
          ChipAccent: { text: '{{ brand.cmp.accent | polyglot }}' },
          Chip_1: { theme: 'chipPositive', text: '{{ status.funded | polyglot }}' },
          Chip_2: { theme: 'chipPending', text: '{{ status.pending | polyglot }}' },
          Chip_3: { theme: 'chipNegative', text: '{{ status.paused | polyglot }}' }
        },

        Stats: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'A',
          '@tabletS': { gridTemplateColumns: '1fr' },

          StatTile: { state: { label: 'stat.portfolioValue', value: '$12,480.20', delta: 'brand.cmp.deltaEpoch', tone: 'up' } },
          StatTile_1: { state: { label: 'stat.unclaimedPayouts', value: '$318.44', delta: 'brand.cmp.claimToWallet', tone: 'flat' } },
          StatTile_2: { state: { label: 'stat.positions', value: '7', delta: 'brand.cmp.listedOnMarket', tone: 'flat' } }
        },

        Offering: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'A',
          '@tabletS': { gridTemplateColumns: '1fr' },

          OfferingCard: {
            state: {
              name: 'Riverbend Extraction',
              location: 'Ashanti, Ghana',
              status: 'status.funding',
              raised: '$1.84M',
              goal: '$2.40M',
              pct: 77,
              symbol: 'RBX-001',
              price: '$25.00',
              apr: '11.4%'
            }
          },
          OfferingCard_1: {
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
              name: 'Serra Verde Plant',
              location: 'Minas Gerais, Brazil',
              status: 'status.feature',
              raised: '$3.10M',
              goal: '$3.10M',
              pct: 100,
              symbol: 'SVP-003',
              price: '$50.00',
              apr: '12.8%'
            }
          }
        }
      }
    },

    SurfacesSection: {
      extends: 'Section',
      id: 'surfaces',
      theme: 'surface',

      Inner: {
        SectionHeading: {
          state: {
            num: '08',
            eyebrow: 'brand.surfaces.eyebrow',
            titleTop: 'brand.surfaces.titleTop',
            title: 'brand.surfaces.title'
          }
        },

        Grid: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'A',
          '@tabletS': { gridTemplateColumns: '1fr' },

          childExtends: 'SurfaceCard',
          childrenAs: 'state',
          children: [
            {
              name: 'brand.surfaces.landingName',
              purpose: 'brand.surfaces.landingPurpose',
              url: 'https://fractyco--landing.at.symbo.ls',
              host: 'fractyco--landing.at.symbo.ls'
            },
            {
              name: 'brand.surfaces.appName',
              purpose: 'brand.surfaces.appPurpose',
              url: 'https://fractyco--app.at.symbo.ls',
              host: 'fractyco--app.at.symbo.ls'
            },
            {
              name: 'brand.surfaces.govName',
              purpose: 'brand.surfaces.govPurpose',
              url: 'https://fractyco--governance.at.symbo.ls',
              host: 'fractyco--governance.at.symbo.ls'
            }
          ]
        }
      }
    }
  },

  Band: {
    tag: 'footer',
    flow: 'y',
    align: 'center center',
    width: '100%',
    padding: 'D C 0',
    theme: 'inverted',
    position: 'relative',
    overflow: 'hidden',
    '@tabletS': { padding: 'C A 0' },

    Inner: {
      flow: 'y',
      gap: 'Z',
      width: '100%',
      maxWidth: '1120px',
      position: 'relative',

      H2: {
        fontFamily: 'Display',
        fontSize: 'C1',
        fontWeight: '700',
        letterSpacing: '-.025em',
        lineHeight: '1.1',
        color: 'ivory',
        margin: '0',
        Top: { tag: 'span', display: 'block', color: 'mist', text: '{{ brand.band.titleTop | polyglot }}' },
        Main: { tag: 'span', display: 'block', text: '{{ brand.band.title | polyglot }}' }
      },
      P: {
        margin: '0',
        fontSize: 'Z1',
        lineHeight: '1.6',
        color: 'ivory.6',
        maxWidth: 'I',
        text: '{{ brand.band.lead | polyglot }}'
      },

      GhostWord: {
        tag: 'span',
        display: 'block',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Brand',
        fontSize: 'M',
        lineHeight: '.72',
        letterSpacing: '.01em',
        textTransform: 'uppercase',
        color: 'ivory.05',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        marginTop: 'B',
        marginBottom: '-.32em',
        attr: { 'aria-hidden': 'true' },
        text: 'FRACTYCO',
        '@tabletS': { fontSize: 'H' }
      }
    }
  }
}
