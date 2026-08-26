// Sections for /platform — referenced from pages/platform.js by key.

// 01 — who holds which power.
export const AuthoritySection = {
  extends: 'Section',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '01',
        eyebrow: 'platform.authority.eyebrow',
        titleTop: 'platform.authority.titleTop',
        title: 'platform.authority.title',
        lead: 'platform.authority.lead'
      }
    },

    Grid: {
      display: 'grid',
      // Container-driven 2 → 1 (see AssetsSection).
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(430px, 100%), 1fr))',
      gap: 'A1',

      AuthorityCard: {
        state: {
          role: 'platform.authority.mint.role',
          holder: 'project_registry · PDA ["project", mint]',
          scope: 'platform.authority.mint.scope',
          limit: 'platform.authority.mint.limit',
          status: 'status.active'
        }
      },
      AuthorityCard_1: {
        extends: 'AuthorityCard',
        state: {
          role: 'platform.authority.compliance.role',
          holder: 'compliance_transfer · PDA ["config"]',
          scope: 'platform.authority.compliance.scope',
          limit: 'platform.authority.compliance.limit',
          status: 'status.active'
        }
      },
      AuthorityCard_2: {
        extends: 'AuthorityCard',
        state: {
          role: 'platform.authority.distribution.role',
          holder: 'allocation_distribution · PDA ["config"]',
          scope: 'platform.authority.distribution.scope',
          limit: 'platform.authority.distribution.limit',
          status: 'status.active'
        }
      },
      AuthorityCard_3: {
        extends: 'AuthorityCard',
        state: {
          role: 'platform.authority.market.role',
          holder: 'secondary_market · PDA ["market", mint]',
          scope: 'platform.authority.market.scope',
          limit: 'platform.authority.market.limit',
          status: 'status.active'
        }
      }
    }
  }
}

// 02 — one subscription, end to end.
export const SettleSection = {
  extends: 'Section',

  Inner: {
    SectionHeading: {
      state: {
        num: '02',
        eyebrow: 'platform.settle.eyebrow',
        titleTop: 'platform.settle.titleTop',
        title: 'platform.settle.title',
        lead: 'platform.settle.lead'
      }
    },

    Grid: {
      display: 'grid',
      // Container-driven 4 → 2 → 1 (see AssetsSection).
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
      gap: 'A1',

      StepCard: {
        state: {
          revealDelay: '0s',
          step: 'platform.settle.commit.step',
          title: 'subscribe_investment',
          body: 'platform.settle.commit.body'
        }
      },
      StepCard_1: {
        extends: 'StepCard',
        state: {
          revealDelay: '.09s',
          step: 'platform.settle.clear.step',
          title: 'transfer_validate',
          body: 'platform.settle.clear.body'
        }
      },
      StepCard_2: {
        extends: 'StepCard',
        state: {
          revealDelay: '.18s',
          step: 'platform.settle.mint.step',
          title: 'issue_tokens',
          body: 'platform.settle.mint.body'
        }
      },
      StepCard_3: {
        extends: 'StepCard',
        state: {
          revealDelay: '.27s',
          step: 'platform.settle.pay.step',
          title: 'execute_payout',
          body: 'platform.settle.pay.body'
        }
      }
    }
  }
}

// 03 — the controls that stop the machine.
export const SafetySection = {
  extends: 'Section',
  theme: 'surface',

  Inner: {
    Split: {
      display: 'grid',
      // Container-driven 2 → 1 (see AssetsSection).
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(430px, 100%), 1fr))',
      gap: 'D',
      alignItems: 'start',

      SectionHeading: {
        state: {
          num: '03',
          eyebrow: 'platform.safety.eyebrow',
          titleTop: 'platform.safety.titleTop',
          title: 'platform.safety.title',
          lead: 'platform.safety.lead'
        }
      },

      List: {
        tag: 'ul',
        flow: 'y',
        gap: 'A',
        margin: '0',
        padding: '0',

        FeatureItem: {
          state: {
            revealDelay: '.1s',
            title: 'platform.safety.f1.title',
            body: 'platform.safety.f1.body'
          }
        },
        FeatureItem_1: {
          extends: 'FeatureItem',
          state: {
            revealDelay: '.22s',
            title: 'platform.safety.f2.title',
            body: 'platform.safety.f2.body'
          }
        },
        FeatureItem_2: {
          extends: 'FeatureItem',
          state: {
            revealDelay: '.34s',
            title: 'platform.safety.f3.title',
            body: 'platform.safety.f3.body'
          }
        },
        FeatureItem_3: {
          extends: 'FeatureItem',
          state: {
            revealDelay: '.46s',
            title: 'platform.safety.f4.title',
            body: 'platform.safety.f4.body'
          }
        }
      }
    }
  }
}
