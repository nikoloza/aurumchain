// Landing copy, in both locales. Merged with the shared library dictionary in
// config.js — see packages/brand/translations.js for the glossary that keeps
// the Georgian consistent across surfaces.
//
// Keys are flat and dotted, namespaced by the section that renders them.
// Anything that is a name rather than a word — Fractyco, Solana, Devnet,
// USDC, KYC, Anchor, program instructions, token symbols, the demo projects
// and their locations — stays Latin and never becomes a key.

export const en = {
  'nav.how': 'How it works',
  'nav.offerings': 'Offerings',
  'nav.compliance': 'Compliance',
  'nav.platform': 'Platform',
  'nav.company': 'Company',
  'nav.faq': 'FAQ',
  'nav.menu': 'Menu',

  'world.above': 'Above ground',
  'world.under': 'Underground',
  'world.aria': 'Choose a world',

  // Calls to action that recur across the hero and the closing bands.
  'cta.seeHow': 'See how it works',
  'cta.tokenize': 'Tokenize an asset',
  'cta.platform': 'Read the platform',

  // Mono chips on the inner-page heroes.
  'chip.kycApproved': 'KYC approved',
  'chip.walletVerified': 'Wallet verified',
  'chip.cappedMint': 'Supply-capped mint',
  'chip.epochPayouts': 'Epoch payouts',
  'chip.devnetData': 'Devnet data',
  'chip.transferHook': 'Transfer hook',
  'chip.eligibilityRecord': 'Eligibility record',
  'chip.auditTrail': 'Audit trail',
  'chip.usdcSettlement': 'USDC settlement',
  'chip.founded': 'Founded 2024',
  'chip.devnetLive': 'Devnet live',
  'chip.fourPrograms': 'Four programs',
  'chip.auditInProgress': 'Audit in progress',

  // ── hero ──
  'hero.above.eyebrow': 'For investors',
  'hero.above.titleTop': 'Real assets,',
  'hero.above.title': 'made liquid',
  'hero.above.lead':
    'Buy compliant fractions of real-world assets on Solana. The registry caps every supply, the transfer hook clears every move, and payouts settle back to your wallet.',
  'hero.under.eyebrow': 'For asset owners',
  'hero.under.titleTop': 'Solid value,',
  'hero.under.title': 'made divisible',
  'hero.under.lead':
    'A mine in Ashanti, a plant in Minas Gerais, a grain belt in the Mallee — if it produces yield, the registry can cap it, split it, and pay its holders. You keep the asset; the chain keeps the books.',
  'hero.stat.assets': 'Real assets worldwide',
  'hero.stat.minimum': 'Minimum subscription',
  'hero.stat.yield': 'Target annual yield',
  'hero.stat.settlement': 'On-chain settlement',
  'hero.stat.classes': 'Asset classes live',
  'hero.stat.capped': 'Supply-capped issues',
  'hero.stat.fee': 'Secondary-market fee',
  'hero.stat.programs': 'Anchor programs',

  // ── ticker ──
  'ticker.realEstate': 'Real estate',
  'ticker.mining': 'Mining & metals',
  'ticker.energy': 'Energy',
  'ticker.infrastructure': 'Infrastructure',
  'ticker.agriculture': 'Agriculture',
  'ticker.credit': 'Private credit',
  'ticker.fractions': 'Compliant fractions',
  'ticker.payouts': 'On-chain payouts',
  'ticker.capped': 'Supply-capped tokens',
  'ticker.cleared': 'Transfer-hook cleared',
  'ticker.settlement': 'T+0 settlement',
  'ticker.registry': 'Registry enforced',

  // ── how it works ──
  'how.eyebrow': 'How it works',
  'how.titleTop': 'Four states between',
  'how.title': 'signing up and getting paid.',
  'how.lead':
    'Eligibility is a state machine, not a checkbox. An account advances one step at a time, and the on-chain compliance record advances with it.',
  'how.step1.title': 'Verify identity',
  'how.step1.body':
    'Complete the identity checks through the KYC provider. Approval writes an eligibility record and unlocks subscription.',
  'how.step2.title': 'Link a wallet',
  'how.step2.body':
    'Sign a server-issued nonce to prove wallet ownership. The compliance program then records the verified wallet on-chain.',
  'how.step3.title': 'Subscribe',
  'how.step3.body':
    'Commit stablecoin to an open offering. The operator finalizes the subscription and the registry mints tokens to the wallet.',
  'how.step4.title': 'Hold and earn',
  'how.step4.body':
    'Positions accrue a payout each distribution epoch. Claim to the linked wallet, or list the position on the secondary market.',

  // ── asset classes ──
  'assets.eyebrow': 'Asset classes',
  'assets.titleTop': 'If it produces yield,',
  'assets.title': 'it can be tokenized.',
  'assets.lead':
    'The registry holds the asset class as metadata; the mechanics stay identical. One supply cap, one compliance hook, one payout path — whatever the underlying.',
  'assets.realEstate.name': 'Real estate',
  'assets.realEstate.line': 'Rental income distributes as USDC each epoch.',
  'assets.mining.name': 'Mining & metals',
  'assets.mining.line': 'Extraction revenue settles against the registry.',
  'assets.energy.name': 'Energy',
  'assets.energy.line': 'Generation contracts pay out on delivery.',
  'assets.infrastructure.name': 'Infrastructure',
  'assets.infrastructure.line': 'Long-dated concessions, fractioned to entry size.',
  'assets.agriculture.name': 'Agriculture',
  'assets.agriculture.line': 'Harvest cycles map onto distribution epochs.',
  'assets.credit.name': 'Private credit',
  'assets.credit.line': 'Repayment schedules stream to token holders.',

  // ── offerings ──
  'offerings.eyebrow': 'Offerings',
  'offerings.titleTop': 'Each asset becomes',
  'offerings.title': 'a supply-capped token.',
  'offerings.lead':
    'An offering fixes the token symbol, the supply cap, the unit price, and the subscription window. The registry enforces every one of them.',
  'offerings.note':
    'The figures above are illustrative devnet data. Live offerings appear in the investor application after identity approval.',

  // ── compliance ──
  'compliance.eyebrow': 'Compliance',
  'compliance.titleTop': 'The token itself refuses',
  'compliance.title': 'a non-compliant transfer.',
  'compliance.lead':
    'Compliance is not a screen in front of the ledger. It runs inside the transfer path, so an unverified wallet cannot receive tokens even through a direct transfer.',
  'compliance.f1.title': 'A transfer hook on every movement',
  'compliance.f1.body':
    'The token uses the SPL Token-2022 transfer hook. Each transfer calls the compliance program, which validates the wallet, the pause flags, and the lockup window before it allows the move.',
  'compliance.f2.title': 'Eligibility as the single source of truth',
  'compliance.f2.body':
    'One eligibility record per account holds the can-invest, can-withdraw, and can-receive-payout flags. The application reads that record, never a display tier.',
  'compliance.f3.title': 'Wallet ownership proven by signature',
  'compliance.f3.body':
    'A wallet links only after the holder signs a server-issued nonce. The signature and its timestamp stay on the wallet-link record.',
  'compliance.f4.title': 'An append-only audit trail',
  'compliance.f4.body':
    'Identity decisions, eligibility changes, subscriptions, and payouts write an immutable audit row that carries the actor, the role, and the before and after state.',
  'compliance.hook.walletA': 'WALLET A',
  'compliance.hook.walletB': 'WALLET B',
  'compliance.hook.node': 'TRANSFER HOOK',
  'compliance.hook.caption':
    'compliance_transfer validates the wallet, the pause flags, and the lockup — a failed check reverts the move.',

  // ── on-chain ──
  'chain.eyebrow': 'On-chain',
  'chain.titleTop': 'Four programs,',
  'chain.title': 'one settlement path.',
  'chain.lead':
    'The registry owns supply. Compliance owns permission. Distribution owns payouts. The market owns resale.',
  'chain.registry.purpose':
    'Creates projects, binds the mint, caps supply per round, issues tokens directly to an investor wallet, and revokes the mint authority when the raise closes.',
  'chain.compliance.purpose':
    'Records verified wallets, validates every transfer through the SPL transfer hook, and holds the subscription record from commitment to settlement.',
  'chain.distribution.purpose':
    'Opens a payout epoch at a fixed profit per token, then pays each holder against a balance snapshot taken at the epoch boundary.',
  'chain.market.purpose':
    'Escrows a seller position behind a sell order, fills orders against stablecoin, and takes a fee in basis points. Trades still clear the compliance hook.',
  'chain.log.title': 'settlement — devnet',
  'chain.log.live': 'live',
  'chain.log.cleared': 'compliance_transfer ▸ destination wallet verified · hook cleared',
  'chain.log.minted': 'project_registry ▸ 12,400 RBX-001 minted → 7xKt…9fQ2',
  'chain.log.snapshot': 'allocation_distribution ▸ epoch 14 snapshot sealed · 312 holders',
  'chain.log.payout': 'payout 0.42 USDC / token · settlement T+0 · slot 289,441,102',

  // ── secondary market ──
  'market.eyebrow': 'Secondary market',
  'market.titleTop': 'Exit before',
  'market.title': 'the asset completes.',
  'market.lead':
    'A holder lists part of a position at a chosen price. A buyer fills it in whole or in part. The escrow releases the tokens, the seller receives stablecoin, and both portfolios update from the trade.',
  'market.fig1.label': 'Taker fee, sent on-chain',
  'market.fig2.label': 'Of listed tokens held in escrow',
  'market.fig3.label': 'Order book, no market hours',
  'market.step1.step': 'LIST',
  'market.step1.title': 'Create a sell order',
  'market.step1.body':
    'The tokens move into a program escrow. The order records the amount, the unit price, and a sequence seed that makes the order address unique.',
  'market.step2.step': 'FILL',
  'market.step2.title': 'Fill in part or in full',
  'market.step2.body':
    'A buyer takes any amount up to the remainder. The fee is taken in basis points and sent to the fee destination.',
  'market.step3.step': 'SETTLE',
  'market.step3.title': 'Positions rebalance',
  'market.step3.body':
    'A database trigger reduces the seller position at its average cost and raises the buyer position at the paid price.',

  // ── faq ──
  'faq.eyebrow': 'FAQ',
  'faq.title': 'The questions we get first.',
  'faq.q1': 'Who can invest?',
  'faq.a1':
    'An account can subscribe after identity approval and wallet verification. The eligibility record carries the can-invest flag, and the application checks that flag before it opens the subscription form.',
  'faq.q2': 'Where do the tokens live?',
  'faq.a2':
    'The tokens mint directly to the investor wallet on Solana. Fractyco does not custody them. The registry keeps the supply ledger and the wallet keeps the balance.',
  'faq.q3': 'What stops a token from reaching an unverified wallet?',
  'faq.a3':
    'The transfer hook. Every transfer calls the compliance program first. The program checks the destination wallet record, the global pause flag, the project pause flag, and the lockup window. A failed check reverts the transfer.',
  'faq.q4': 'How is a payout calculated?',
  'faq.a4':
    'An operator opens an epoch at a fixed profit per token. Each payout multiplies that rate by the holder balance snapshot for the epoch, so a transfer after the snapshot does not change the entitlement.',
  'faq.q5': 'Can I sell before the project completes?',
  'faq.a5':
    'Yes, on the secondary market, when the project is not paused and the lockup window has passed. Listings are peer-to-peer and settle in stablecoin.',
  'faq.q6': 'Which network is live today?',
  'faq.a6':
    'The programs run on Solana devnet. Mainnet deployment follows the audit of the four programs and the compliance review of the first offering.',

  // ── closing band ──
  'closing.above.titleTop': 'Open an account,',
  'closing.above.title': 'see the offerings',
  'closing.above.lead':
    'Identity approval takes minutes. Wallet verification takes one signature. Subscription opens as soon as both clear.',
  'closing.under.titleTop': 'Your asset stays yours,',
  'closing.under.title': 'its yield goes liquid',
  'closing.under.lead':
    'The registry caps the supply, the hook clears every holder, and payout epochs settle in USDC. You keep custody; the chain keeps the books.',

  // ── footer ──
  'footer.lead':
    'Fractyco issues asset-backed tokens on Solana and settles investor payouts on-chain.',
  'footer.col.product': 'Product',
  'footer.col.investors': 'Investors',
  'footer.col.company': 'Company',
  'footer.link.verify': 'Verify identity',
  'footer.link.support': 'Support',
  'footer.link.about': 'About',
  'footer.link.contact': 'Contact',
  'footer.copy': 'Fractyco. Tokenized real-world assets.',
  'footer.legal': 'Devnet build — not an offer to sell securities.',

  // ── inner page heroes ──
  'page.how.eyebrow': 'How it works',
  'page.how.titleTop': 'From signed up,',
  'page.how.title': 'to getting paid',
  'page.how.lead':
    'Eligibility is a state machine, not a checkbox. An account advances one step at a time — and the on-chain compliance record advances with it, so the application never has to trust a display tier.',
  'page.offerings.eyebrow': 'Offerings',
  'page.offerings.titleTop': 'Every asset,',
  'page.offerings.title': 'a capped issue',
  'page.offerings.lead':
    'One offering, four fixed terms: the token symbol, the supply cap, the unit price, and the subscription window. The mint authority is revoked at close, so the cap stops being a promise and becomes a property of the chain.',
  'page.compliance.eyebrow': 'Compliance',
  'page.compliance.titleTop': 'Policy that',
  'page.compliance.title': 'executes itself',
  'page.compliance.lead':
    'Compliance is not a screen in front of the ledger — it runs inside the transfer path. An unverified wallet cannot receive tokens even through a direct transfer, because the token itself refuses the move.',
  'page.platform.eyebrow': 'Platform · Solana devnet',
  'page.platform.titleTop': 'One asset,',
  'page.platform.title': 'four authorities',
  'page.platform.lead':
    'No single key can mint, move, pay, and pause. Each power lives with a different program authority, and every use of it lands in the audit trail.',
  'page.company.eyebrow': 'Company',
  'page.company.titleTop': 'The asset layer',
  'page.company.title': 'for real things',
  'page.company.lead':
    'A mine in Ashanti and a solar plant in Minas Gerais should be as easy to hold a fraction of as a public stock — without giving up the compliance that makes them real investments.',
  'page.faq.eyebrow': 'FAQ',
  'page.faq.titleTop': 'Asked first,',
  'page.faq.title': 'answered straight',
  'page.faq.lead':
    'The short version of everything the longer pages explain — eligibility, custody, transfers, payouts, and what is live on devnet today.',

  // ── /platform sections ──
  'platform.authority.eyebrow': 'Authority model',
  'platform.authority.titleTop': 'Separate keys',
  'platform.authority.title': 'for separate powers.',
  'platform.authority.lead':
    'The mint authority issues. The compliance authority permits. The distribution authority pays. The market authority pauses. None of them can do another one’s job.',
  'platform.authority.mint.role': 'Mint authority',
  'platform.authority.mint.scope': 'Issues tokens against an open round, revoked at close',
  'platform.authority.mint.limit': 'Hard cap: the round supply. After revoke: none, forever.',
  'platform.authority.compliance.role': 'Compliance authority',
  'platform.authority.compliance.scope': 'Records verified wallets, validates every transfer',
  'platform.authority.compliance.limit': 'Cannot mint, cannot move funds — permission only.',
  'platform.authority.distribution.role': 'Distribution authority',
  'platform.authority.distribution.scope': 'Opens payout epochs at a fixed profit per token',
  'platform.authority.distribution.limit': 'Pays only against the sealed balance snapshot.',
  'platform.authority.market.role': 'Market authority',
  'platform.authority.market.scope': 'Sets the fee destination and the per-project pause',
  'platform.authority.market.limit': 'Pause stops listings — it cannot touch escrowed funds.',

  'platform.settle.eyebrow': 'Settlement path',
  'platform.settle.titleTop': 'One subscription,',
  'platform.settle.title': 'end to end.',
  'platform.settle.lead':
    'From the stablecoin commitment to the tokens in the wallet, every hop is a program instruction — nothing settles by spreadsheet.',
  'platform.settle.commit.step': 'COMMIT',
  'platform.settle.commit.body':
    'USDC moves to the offering vault. The subscription record opens with the amount and the wallet.',
  'platform.settle.clear.step': 'CLEAR',
  'platform.settle.clear.body':
    'The hook checks the destination record, both pause flags, and the lockup window before anything moves.',
  'platform.settle.mint.step': 'MINT',
  'platform.settle.mint.body':
    'The registry mints against the round cap, straight to the investor wallet. Supply can never exceed the cap.',
  'platform.settle.pay.step': 'PAY',
  'platform.settle.pay.body':
    'Each epoch pays profit-per-token against the sealed snapshot. Claims settle to the linked wallet, T+0.',

  'platform.safety.eyebrow': 'Safety',
  'platform.safety.titleTop': 'Built to stop',
  'platform.safety.title': 'as well as to run.',
  'platform.safety.lead':
    'Every moving part has a brake: a global pause, a per-project pause, lockup windows, and a mint that can be revoked outright.',
  'platform.safety.f1.title': 'Two pause switches',
  'platform.safety.f1.body':
    'A global flag halts every transfer on the platform; a per-project flag halts one asset. Both are checked inside the hook, so a paused token simply refuses to move.',
  'platform.safety.f2.title': 'Lockups enforced on-chain',
  'platform.safety.f2.body':
    'A subscription can carry a lockup window. Until it passes, the transfer hook rejects any move out of the wallet — including to the secondary market.',
  'platform.safety.f3.title': 'Mint revocation is final',
  'platform.safety.f3.body':
    'When a raise closes, revoke_mint_authority burns the power to issue. The supply cap stops being a promise and becomes a property of the chain.',
  'platform.safety.f4.title': 'Everything lands in the audit trail',
  'platform.safety.f4.body':
    'Every authority action is a transaction with a signer, a slot, and an account trail. The governance console reads the same records you can read on any explorer.',

  // ── /company sections ──
  'company.mission.quote':
    'Most of the world’s value sits in assets that never trade: land, plants, concessions, credit. We give each one a supply-capped token, a compliance hook, and a payout path — and leave custody with the owner.',
  'company.mission.cite': '— The reason the four programs exist',
  'company.values.eyebrow': 'Principles',
  'company.values.titleTop': 'Rules we wrote',
  'company.values.title': 'into the programs.',
  'company.values.lead':
    'A principle you can’t enforce is a slogan. Each of ours is a constraint the chain checks on every transaction.',
  'company.values.physics.name': 'Compliance is physics',
  'company.values.physics.line':
    'The token itself refuses a non-compliant transfer — policy lives in the transfer path, not in a terms page.',
  'company.values.custody.name': 'Custody stays with you',
  'company.values.custody.line':
    'Tokens mint to the investor wallet. We keep the ledger honest; we never hold the asset.',
  'company.values.audit.name': 'Auditable by anyone',
  'company.values.audit.line':
    'Every authority action is a public transaction. Our console reads the same records an explorer does.',
  'company.values.yield.name': 'Yield settles on-chain',
  'company.values.yield.line':
    'Payouts distribute in USDC against sealed snapshots — no cheques, no quarters, no trust required.',

  'company.milestones.eyebrow': 'Milestones',
  'company.milestones.titleTop': 'Shipping order,',
  'company.milestones.title': 'not press-release order.',
  'company.milestones.m1': 'First registry program on devnet — supply caps enforced on mint',
  'company.milestones.m2': 'Transfer hook clears its first compliant transfer end-to-end',
  'company.milestones.m3': 'Distribution epochs pay 312 devnet holders from one snapshot',
  'company.milestones.m4': 'Secondary market escrow fills its first partial order',
  'company.milestones.m5': 'Program audit of all four programs',
  'company.milestones.m6': 'Mainnet — first regulated offering opens',
  'company.milestones.shipped': '✓ shipped',
  'company.milestones.ahead': '— ahead',

  'company.contact.titleTop': 'Building the rails?',
  'company.contact.title': 'Come build them here',
  'company.contact.lead':
    'We are a small team across Tbilisi and Lisbon: Rust on-chain, TypeScript off it, and one shared standard — if the chain can enforce it, don’t ask a human to.'
}

export const ka = {
  'nav.how': 'როგორ მუშაობს',
  'nav.offerings': 'შეთავაზებები',
  'nav.compliance': 'შესაბამისობა',
  'nav.platform': 'პლატფორმა',
  'nav.company': 'კომპანია',
  'nav.faq': 'ხშირი კითხვები',
  'nav.menu': 'მენიუ',

  'world.above': 'ზედაპირზე',
  'world.under': 'მიწისქვეშ',
  'world.aria': 'აირჩიეთ სამყარო',

  'cta.seeHow': 'ნახეთ, როგორ მუშაობს',
  'cta.tokenize': 'აქტივის ტოკენიზაცია',
  'cta.platform': 'გაეცანით პლატფორმას',

  'chip.kycApproved': 'KYC დამტკიცებული',
  'chip.walletVerified': 'საფულე დადასტურებული',
  'chip.cappedMint': 'ლიმიტირებული ემისია',
  'chip.epochPayouts': 'ეპოქის გადახდები',
  'chip.devnetData': 'Devnet მონაცემები',
  'chip.transferHook': 'ტრანსფერ-ჰუკი',
  'chip.eligibilityRecord': 'დაშვების ჩანაწერი',
  'chip.auditTrail': 'აუდიტის კვალი',
  'chip.usdcSettlement': 'USDC ანგარიშსწორება',
  'chip.founded': 'დაარსდა 2024',
  'chip.devnetLive': 'Devnet აქტიურია',
  'chip.fourPrograms': 'ოთხი პროგრამა',
  'chip.auditInProgress': 'აუდიტი მიმდინარეობს',

  // ── hero ──
  'hero.above.eyebrow': 'ინვესტორებისთვის',
  'hero.above.titleTop': 'რეალური აქტივები,',
  'hero.above.title': 'ლიკვიდურად',
  'hero.above.lead':
    'იყიდეთ რეალური აქტივების წილები Solana-ზე, სრული შესაბამისობით. რეესტრი ზღუდავს ყოველ ემისიას, ტრანსფერ-ჰუკი ამოწმებს ყოველ გადატანას, გადახდები კი პირდაპირ თქვენს საფულეში ანგარიშსწორდება.',
  'hero.under.eyebrow': 'აქტივების მფლობელებისთვის',
  'hero.under.titleTop': 'მყარი ღირებულება,',
  'hero.under.title': 'დანაწილებადად',
  'hero.under.lead':
    'მაღარო Ashanti-ში, ქარხანა Minas Gerais-ში, მარცვლეულის სარტყელი Mallee-ში — თუ აქტივი სარგებელს გამოიმუშავებს, რეესტრი მას დაუწესებს ლიმიტს, დაანაწილებს და მფლობელებს გადაუხდის. აქტივი თქვენთან რჩება; აღრიცხვას ჯაჭვი ინახავს.',
  'hero.stat.assets': 'რეალური აქტივები მსოფლიოში',
  'hero.stat.minimum': 'მინიმალური ხელმოწერა',
  'hero.stat.yield': 'სამიზნე წლიური სარგებელი',
  'hero.stat.settlement': 'ონჩეინ ანგარიშსწორება',
  'hero.stat.classes': 'აქტიური კლასი',
  'hero.stat.capped': 'ლიმიტირებული ემისია',
  'hero.stat.fee': 'მეორადი ბაზრის საკომისიო',
  'hero.stat.programs': 'Anchor პროგრამა',

  // ── ticker ──
  'ticker.realEstate': 'უძრავი ქონება',
  'ticker.mining': 'მოპოვება და ლითონები',
  'ticker.energy': 'ენერგეტიკა',
  'ticker.infrastructure': 'ინფრასტრუქტურა',
  'ticker.agriculture': 'სოფლის მეურნეობა',
  'ticker.credit': 'კერძო კრედიტი',
  'ticker.fractions': 'შესაბამისი წილები',
  'ticker.payouts': 'ონჩეინ გადახდები',
  'ticker.capped': 'ლიმიტირებული ტოკენები',
  'ticker.cleared': 'ტრანსფერ-ჰუკით გავლილი',
  'ticker.settlement': 'T+0 ანგარიშსწორება',
  'ticker.registry': 'რეესტრით გამყარებული',

  // ── how it works ──
  'how.eyebrow': 'როგორ მუშაობს',
  'how.titleTop': 'ოთხი მდგომარეობა რეგისტრაციასა',
  'how.title': 'და პირველ გადახდას შორის.',
  'how.lead':
    'დაშვება მდგომარეობათა მანქანაა და არა უბრალო მონიშვნა. ანგარიში ნაბიჯ-ნაბიჯ მიიწევს წინ, და მასთან ერთად ვითარდება ონჩეინ შესაბამისობის ჩანაწერიც.',
  'how.step1.title': 'იდენტიფიკაციის გავლა',
  'how.step1.body':
    'გაიარეთ იდენტიფიკაცია KYC პროვაიდერთან. დამტკიცება ქმნის დაშვების ჩანაწერს და ხსნის ხელმოწერის შესაძლებლობას.',
  'how.step2.title': 'საფულის მიბმა',
  'how.step2.body':
    'ხელი მოაწერეთ სერვერის მიერ გაცემულ nonce-ს და დაადასტურეთ საფულის მფლობელობა. შესაბამისობის პროგრამა დადასტურებულ საფულეს ონჩეინ აღრიცხავს.',
  'how.step3.title': 'ხელმოწერა შეთავაზებაზე',
  'how.step3.body':
    'გამოყავით სტეიბლკოინი ღია შეთავაზებისთვის. ოპერატორი ასრულებს ხელმოწერას და რეესტრი ტოკენებს პირდაპირ საფულეში ჭრის.',
  'how.step4.title': 'ფლობა და შემოსავალი',
  'how.step4.body':
    'პოზიციები განაწილების ყოველ ეპოქაზე აგროვებს გადახდას. გაიტანეთ მიბმულ საფულეში ან გაიტანეთ პოზიცია მეორად ბაზარზე.',

  // ── asset classes ──
  'assets.eyebrow': 'აქტივების კლასები',
  'assets.titleTop': 'თუ სარგებელს გამოიმუშავებს,',
  'assets.title': 'მისი ტოკენიზაცია შესაძლებელია.',
  'assets.lead':
    'რეესტრი აქტივის კლასს მეტამონაცემად ინახავს — მექანიკა კი უცვლელი რჩება. ერთი ლიმიტი, ერთი შესაბამისობის ჰუკი, ერთი გადახდის გზა, რაც უნდა იდგეს ტოკენის უკან.',
  'assets.realEstate.name': 'უძრავი ქონება',
  'assets.realEstate.line': 'საიჯარო შემოსავალი ყოველ ეპოქაზე USDC-ით ნაწილდება.',
  'assets.mining.name': 'მოპოვება და ლითონები',
  'assets.mining.line': 'მოპოვების შემოსავალი რეესტრის მიხედვით ანგარიშსწორდება.',
  'assets.energy.name': 'ენერგეტიკა',
  'assets.energy.line': 'გენერაციის კონტრაქტები მიწოდებისთანავე იხდის.',
  'assets.infrastructure.name': 'ინფრასტრუქტურა',
  'assets.infrastructure.line': 'გრძელვადიანი კონცესიები, დანაწილებული ხელმისაწვდომ ზომამდე.',
  'assets.agriculture.name': 'სოფლის მეურნეობა',
  'assets.agriculture.line': 'მოსავლის ციკლები განაწილების ეპოქებს ემთხვევა.',
  'assets.credit.name': 'კერძო კრედიტი',
  'assets.credit.line': 'დაფარვის გრაფიკები ტოკენის მფლობელებთან მიედინება.',

  // ── offerings ──
  'offerings.eyebrow': 'შეთავაზებები',
  'offerings.titleTop': 'ყოველი აქტივი ხდება',
  'offerings.title': 'ლიმიტირებული ტოკენი.',
  'offerings.lead':
    'შეთავაზება განსაზღვრავს ტოკენის სიმბოლოს, ემისიის ლიმიტს, ერთეულის ფასს და ხელმოწერის ფანჯარას. რეესტრი თითოეულ მათგანს ასრულებს.',
  'offerings.note':
    'ზემოთ მოცემული ციფრები საილუსტრაციო devnet მონაცემებია. რეალური შეთავაზებები ინვესტორის აპლიკაციაში იდენტიფიკაციის დამტკიცების შემდეგ ჩნდება.',

  // ── compliance ──
  'compliance.eyebrow': 'შესაბამისობა',
  'compliance.titleTop': 'ტოკენი თავად უარყოფს',
  'compliance.title': 'შეუსაბამო ტრანზაქციას.',
  'compliance.lead':
    'შესაბამისობა არ არის ეკრანი ლეჯერის წინ — ის თავად ტრანსფერის გზაზე მუშაობს, ამიტომ დაუდასტურებელი საფულე ტოკენებს პირდაპირი გადატანითაც ვერ მიიღებს.',
  'compliance.f1.title': 'ტრანსფერ-ჰუკი ყოველ მოძრაობაზე',
  'compliance.f1.body':
    'ტოკენი იყენებს SPL Token-2022 ტრანსფერ-ჰუკს. ყოველი ტრანსფერი იძახებს შესაბამისობის პროგრამას, რომელიც გადატანამდე ამოწმებს საფულეს, შეჩერების დროშებს და ლოქაპის ფანჯარას.',
  'compliance.f2.title': 'დაშვება — ჭეშმარიტების ერთადერთი წყარო',
  'compliance.f2.body':
    'ანგარიშზე ერთი დაშვების ჩანაწერი ინახავს ინვესტირების, გატანისა და გადახდის მიღების ნებართვებს. აპლიკაცია სწორედ ამ ჩანაწერს კითხულობს და არა ვიზუალურ სტატუსს.',
  'compliance.f3.title': 'საფულის მფლობელობა ხელმოწერით დადასტურებული',
  'compliance.f3.body':
    'საფულე მიებმება მხოლოდ მას შემდეგ, რაც მფლობელი სერვერის მიერ გაცემულ nonce-ს ხელს მოაწერს. ხელმოწერა და მისი დროის ნიშნული საფულის ჩანაწერზე რჩება.',
  'compliance.f4.title': 'აუდიტის კვალი, რომელიც მხოლოდ ივსება',
  'compliance.f4.body':
    'იდენტიფიკაციის გადაწყვეტილებები, დაშვების ცვლილებები, ხელმოწერები და გადახდები ქმნის უცვლელ აუდიტის ჩანაწერს, რომელშიც ფიქსირდება მოქმედი პირი, მისი როლი და მდგომარეობა ცვლილებამდე და მის შემდეგ.',
  'compliance.hook.walletA': 'საფულე A',
  'compliance.hook.walletB': 'საფულე B',
  'compliance.hook.node': 'ტრანსფერ-ჰუკი',
  'compliance.hook.caption':
    'compliance_transfer ამოწმებს საფულეს, შეჩერების დროშებს და ლოქაპს — წარუმატებელი შემოწმება ტრანზაქციას აბრუნებს.',

  // ── on-chain ──
  'chain.eyebrow': 'ონჩეინ',
  'chain.titleTop': 'ოთხი პროგრამა,',
  'chain.title': 'ერთი ანგარიშსწორების გზა.',
  'chain.lead':
    'რეესტრი განკარგავს ემისიას. შესაბამისობა — ნებართვას. განაწილება — გადახდებს. ბაზარი — გადაყიდვას.',
  'chain.registry.purpose':
    'ქმნის პროექტებს, აბამს მინტს, ზღუდავს ემისიას რაუნდზე, ტოკენებს პირდაპირ ინვესტორის საფულეში გასცემს და რაუნდის დახურვისას ემისიის უფლებამოსილებას აუქმებს.',
  'chain.compliance.purpose':
    'აღრიცხავს დადასტურებულ საფულეებს, ყოველ ტრანსფერს SPL ტრანსფერ-ჰუკით ამოწმებს და ხელმოწერის ჩანაწერს ვალდებულებიდან ანგარიშსწორებამდე ინახავს.',
  'chain.distribution.purpose':
    'ხსნის გადახდის ეპოქას ტოკენზე ფიქსირებული მოგებით, შემდეგ კი თითოეულ მფლობელს უხდის ეპოქის საზღვარზე დაფიქსირებული ბალანსის მიხედვით.',
  'chain.market.purpose':
    'გამყიდველის პოზიციას ესქროუში ათავსებს გასაყიდი ორდერის უკან, ორდერებს სტეიბლკოინით ავსებს და საკომისიოს საბაზისო პუნქტებში იღებს. გარიგებები მაინც გადის შესაბამისობის ჰუკს.',
  'chain.log.title': 'ანგარიშსწორება — devnet',
  'chain.log.live': 'აქტიური',
  'chain.log.cleared': 'compliance_transfer ▸ დანიშნულების საფულე დადასტურებულია · ჰუკი გავლილია',
  'chain.log.minted': 'project_registry ▸ დაიჭრა 12,400 RBX-001 → 7xKt…9fQ2',
  'chain.log.snapshot': 'allocation_distribution ▸ ეპოქა 14 დაფიქსირდა · 312 მფლობელი',
  'chain.log.payout': 'გადახდა 0.42 USDC / ტოკენი · ანგარიშსწორება T+0 · სლოტი 289,441,102',

  // ── secondary market ──
  'market.eyebrow': 'მეორადი ბაზარი',
  'market.titleTop': 'გასვლა აქტივის',
  'market.title': 'დასრულებამდე.',
  'market.lead':
    'მფლობელი პოზიციის ნაწილს სასურველ ფასად გააქვს გასაყიდად. მყიდველი მას სრულად ან ნაწილობრივ ავსებს. ესქროუ ტოკენებს ათავისუფლებს, გამყიდველი სტეიბლკოინს იღებს, ორივე პორტფელი კი გარიგების მიხედვით ახლდება.',
  'market.fig1.label': 'მყიდველის საკომისიო, ონჩეინ',
  'market.fig2.label': 'გატანილი ტოკენებიდან ესქროუშია',
  'market.fig3.label': 'ორდერების წიგნი, სავაჭრო საათების გარეშე',
  'market.step1.step': 'გატანა',
  'market.step1.title': 'გასაყიდი ორდერის შექმნა',
  'market.step1.body':
    'ტოკენები პროგრამულ ესქროუში გადადის. ორდერი აფიქსირებს რაოდენობას, ერთეულის ფასს და თანმიმდევრობის სიდს, რომელიც ორდერის მისამართს უნიკალურს ხდის.',
  'market.step2.step': 'შევსება',
  'market.step2.title': 'შევსება ნაწილობრივ ან სრულად',
  'market.step2.body':
    'მყიდველი იღებს ნებისმიერ რაოდენობას ნაშთის ფარგლებში. საკომისიო საბაზისო პუნქტებში იჭრება და საკომისიოს მისამართზე იგზავნება.',
  'market.step3.step': 'ჩარიცხვა',
  'market.step3.title': 'პოზიციების გადაანგარიშება',
  'market.step3.body':
    'ბაზის ტრიგერი გამყიდველის პოზიციას საშუალო თვითღირებულებით ამცირებს და მყიდველის პოზიციას გადახდილი ფასით ზრდის.',

  // ── faq ──
  'faq.eyebrow': 'ხშირი კითხვები',
  'faq.title': 'კითხვები, რომლებსაც პირველად გვისვამენ.',
  'faq.q1': 'ვის შეუძლია ინვესტირება?',
  'faq.a1':
    'ანგარიშს ხელმოწერა შეუძლია იდენტიფიკაციის დამტკიცებისა და საფულის დადასტურების შემდეგ. დაშვების ჩანაწერი ინახავს ინვესტირების ნებართვას, აპლიკაცია კი ამ ნებართვას ხელმოწერის ფორმის გახსნამდე ამოწმებს.',
  'faq.q2': 'სად ინახება ტოკენები?',
  'faq.a2':
    'ტოკენები პირდაპირ ინვესტორის საფულეში იჭრება Solana-ზე. Fractyco მათ არ ინახავს. რეესტრი აწარმოებს ემისიის აღრიცხვას, ბალანსი კი საფულეშია.',
  'faq.q3': 'რა უშლის ხელს ტოკენს დაუდასტურებელ საფულეში მოხვედრაში?',
  'faq.a3':
    'ტრანსფერ-ჰუკი. ყოველი ტრანსფერი ჯერ შესაბამისობის პროგრამას იძახებს. პროგრამა ამოწმებს დანიშნულების საფულის ჩანაწერს, გლობალურ და პროექტის შეჩერების დროშებს და ლოქაპის ფანჯარას. წარუმატებელი შემოწმება ტრანზაქციას აბრუნებს.',
  'faq.q4': 'როგორ ითვლება გადახდა?',
  'faq.a4':
    'ოპერატორი ხსნის ეპოქას ტოკენზე ფიქსირებული მოგებით. თითოეული გადახდა ამ განაკვეთს ამრავლებს ეპოქისთვის დაფიქსირებულ ბალანსზე, ამიტომ ფიქსაციის შემდეგ განხორციელებული ტრანსფერი უფლებას აღარ ცვლის.',
  'faq.q5': 'შემიძლია გაყიდვა პროექტის დასრულებამდე?',
  'faq.a5':
    'დიახ, მეორად ბაზარზე, თუ პროექტი შეჩერებული არ არის და ლოქაპის ფანჯარა გასულია. განცხადებები პირდაპირ მხარეებს შორისაა და სტეიბლკოინით ანგარიშსწორდება.',
  'faq.q6': 'რომელი ქსელია დღეს აქტიური?',
  'faq.a6':
    'პროგრამები მუშაობს Solana devnet-ზე. Mainnet-ზე გაშვება მოჰყვება ოთხივე პროგრამის აუდიტს და პირველი შეთავაზების შესაბამისობის განხილვას.',

  // ── closing band ──
  'closing.above.titleTop': 'გახსენით ანგარიში,',
  'closing.above.title': 'ნახეთ შეთავაზებები',
  'closing.above.lead':
    'იდენტიფიკაციის დამტკიცებას წუთები სჭირდება. საფულის დადასტურებას — ერთი ხელმოწერა. ხელმოწერა ორივეს გავლისთანავე იხსნება.',
  'closing.under.titleTop': 'აქტივი თქვენი რჩება,',
  'closing.under.title': 'მისი სარგებელი კი ლიკვიდური ხდება',
  'closing.under.lead':
    'რეესტრი ზღუდავს ემისიას, ჰუკი ამოწმებს ყოველ მფლობელს, გადახდის ეპოქები კი USDC-ით ანგარიშსწორდება. მფლობელობა თქვენთან რჩება; აღრიცხვას ჯაჭვი ინახავს.',

  // ── footer ──
  'footer.lead':
    'Fractyco გამოსცემს აქტივებით უზრუნველყოფილ ტოკენებს Solana-ზე და ინვესტორების გადახდებს ონჩეინ ანგარიშსწორებს.',
  'footer.col.product': 'პროდუქტი',
  'footer.col.investors': 'ინვესტორები',
  'footer.col.company': 'კომპანია',
  'footer.link.verify': 'იდენტიფიკაციის გავლა',
  'footer.link.support': 'მხარდაჭერა',
  'footer.link.about': 'ჩვენ შესახებ',
  'footer.link.contact': 'კონტაქტი',
  'footer.copy': 'Fractyco. ტოკენიზებული რეალური აქტივები.',
  'footer.legal': 'Devnet ვერსია — არ წარმოადგენს ფასიანი ქაღალდების შეთავაზებას.',

  // ── inner page heroes ──
  'page.how.eyebrow': 'როგორ მუშაობს',
  'page.how.titleTop': 'რეგისტრაციიდან',
  'page.how.title': 'პირველ გადახდამდე',
  'page.how.lead':
    'დაშვება მდგომარეობათა მანქანაა და არა უბრალო მონიშვნა. ანგარიში ნაბიჯ-ნაბიჯ მიიწევს წინ — და მასთან ერთად ვითარდება ონჩეინ შესაბამისობის ჩანაწერიც, ამიტომ აპლიკაციას ვიზუალურ სტატუსზე დაყრდნობა არასოდეს სჭირდება.',
  'page.offerings.eyebrow': 'შეთავაზებები',
  'page.offerings.titleTop': 'ყოველი აქტივი —',
  'page.offerings.title': 'ლიმიტირებული ემისია',
  'page.offerings.lead':
    'ერთი შეთავაზება, ოთხი ფიქსირებული პირობა: ტოკენის სიმბოლო, ემისიის ლიმიტი, ერთეულის ფასი და ხელმოწერის ფანჯარა. დახურვისას ემისიის უფლებამოსილება უქმდება, ამიტომ ლიმიტი დაპირებიდან ჯაჭვის თვისებად იქცევა.',
  'page.compliance.eyebrow': 'შესაბამისობა',
  'page.compliance.titleTop': 'წესები, რომლებიც',
  'page.compliance.title': 'თავად სრულდება',
  'page.compliance.lead':
    'შესაბამისობა არ არის ეკრანი ლეჯერის წინ — ის ტრანსფერის გზაზე მუშაობს. დაუდასტურებელი საფულე ტოკენებს პირდაპირი გადატანითაც ვერ მიიღებს, რადგან ტოკენი თავად უარყოფს გადატანას.',
  'page.platform.eyebrow': 'პლატფორმა · Solana devnet',
  'page.platform.titleTop': 'ერთი აქტივი,',
  'page.platform.title': 'ოთხი უფლებამოსილება',
  'page.platform.lead':
    'ვერცერთი გასაღები ვერ ჭრის, ვერ გადააქვს, ვერ იხდის და ვერ აჩერებს ერთდროულად. თითოეული უფლებამოსილება ცალკე პროგრამას ეკუთვნის და მისი ყოველი გამოყენება აუდიტის კვალში ილექება.',
  'page.company.eyebrow': 'კომპანია',
  'page.company.titleTop': 'აქტივების ფენა',
  'page.company.title': 'რეალური საქმისთვის',
  'page.company.lead':
    'მაღარო Ashanti-ში და მზის სადგური Minas Gerais-ში ისევე ადვილად უნდა იყოფოდეს წილებად, როგორც საჯარო აქცია — შესაბამისობაზე უარის თქმის გარეშე, რაც მათ ნამდვილ ინვესტიციად აქცევს.',
  'page.faq.eyebrow': 'ხშირი კითხვები',
  'page.faq.titleTop': 'პირველი კითხვები,',
  'page.faq.title': 'პირდაპირი პასუხები',
  'page.faq.lead':
    'მოკლედ ყველაფერი, რასაც ვრცელი გვერდები ხსნის — დაშვება, მფლობელობა, ტრანსფერები, გადახდები და ის, რაც დღეს devnet-ზე მუშაობს.',

  // ── /platform sections ──
  'platform.authority.eyebrow': 'უფლებამოსილების მოდელი',
  'platform.authority.titleTop': 'ცალკე გასაღები',
  'platform.authority.title': 'ცალკე უფლებამოსილებისთვის.',
  'platform.authority.lead':
    'ემისიის უფლებამოსილება ჭრის. შესაბამისობის უფლებამოსილება რთავს. განაწილების უფლებამოსილება იხდის. ბაზრის უფლებამოსილება აჩერებს. ვერცერთი ვერ შეასრულებს მეორის საქმეს.',
  'platform.authority.mint.role': 'ემისიის უფლებამოსილება',
  'platform.authority.mint.scope': 'ჭრის ტოკენებს ღია რაუნდზე, დახურვისას უქმდება',
  'platform.authority.mint.limit': 'მკაცრი ლიმიტი: რაუნდის ემისია. გაუქმების შემდეგ — არაფერი, სამუდამოდ.',
  'platform.authority.compliance.role': 'შესაბამისობის უფლებამოსილება',
  'platform.authority.compliance.scope': 'აღრიცხავს დადასტურებულ საფულეებს, ამოწმებს ყოველ ტრანსფერს',
  'platform.authority.compliance.limit': 'ვერ ჭრის, ვერ ამოძრავებს სახსრებს — მხოლოდ ნებართვა.',
  'platform.authority.distribution.role': 'განაწილების უფლებამოსილება',
  'platform.authority.distribution.scope': 'ხსნის გადახდის ეპოქებს ტოკენზე ფიქსირებული მოგებით',
  'platform.authority.distribution.limit': 'იხდის მხოლოდ დაფიქსირებული ბალანსის მიხედვით.',
  'platform.authority.market.role': 'ბაზრის უფლებამოსილება',
  'platform.authority.market.scope': 'განსაზღვრავს საკომისიოს მისამართს და პროექტის შეჩერებას',
  'platform.authority.market.limit': 'შეჩერება ჩერდება განცხადებებს — ესქროუს სახსრებს ვერ ეხება.',

  'platform.settle.eyebrow': 'ანგარიშსწორების გზა',
  'platform.settle.titleTop': 'ერთი ხელმოწერა,',
  'platform.settle.title': 'თავიდან ბოლომდე.',
  'platform.settle.lead':
    'სტეიბლკოინის ვალდებულებიდან საფულეში ტოკენებამდე ყოველი ნაბიჯი პროგრამის ინსტრუქციაა — არაფერი ანგარიშსწორდება ცხრილში.',
  'platform.settle.commit.step': 'ჩადება',
  'platform.settle.commit.body':
    'USDC გადადის შეთავაზების ვოლთში. ხელმოწერის ჩანაწერი იხსნება თანხითა და საფულით.',
  'platform.settle.clear.step': 'შემოწმება',
  'platform.settle.clear.body':
    'ჰუკი ამოწმებს დანიშნულების ჩანაწერს, ორივე შეჩერების დროშას და ლოქაპის ფანჯარას, სანამ რამე დაიძვრება.',
  'platform.settle.mint.step': 'ემისია',
  'platform.settle.mint.body':
    'რეესტრი ჭრის რაუნდის ლიმიტის ფარგლებში, პირდაპირ ინვესტორის საფულეში. ემისია ლიმიტს ვერასოდეს გადააჭარბებს.',
  'platform.settle.pay.step': 'გადახდა',
  'platform.settle.pay.body':
    'ყოველი ეპოქა იხდის ტოკენზე მოგებას დაფიქსირებული ბალანსის მიხედვით. გატანა მიბმულ საფულეში ანგარიშსწორდება, T+0.',

  'platform.safety.eyebrow': 'უსაფრთხოება',
  'platform.safety.titleTop': 'აგებულია გასაჩერებლადაც,',
  'platform.safety.title': 'არა მხოლოდ სამუშაოდ.',
  'platform.safety.lead':
    'ყოველ მოძრავ ნაწილს თავისი მუხრუჭი აქვს: გლობალური შეჩერება, პროექტის შეჩერება, ლოქაპის ფანჯრები და ემისია, რომელიც სრულად შეიძლება გაუქმდეს.',
  'platform.safety.f1.title': 'ორი შეჩერების ჩამრთველი',
  'platform.safety.f1.body':
    'გლობალური დროშა აჩერებს პლატფორმაზე ყველა ტრანსფერს; პროექტის დროშა — ერთ აქტივს. ორივე ჰუკის შიგნით მოწმდება, ამიტომ შეჩერებული ტოკენი უბრალოდ არ იძვრება.',
  'platform.safety.f2.title': 'ლოქაპები ონჩეინ სრულდება',
  'platform.safety.f2.body':
    'ხელმოწერას შეიძლება ჰქონდეს ლოქაპის ფანჯარა. სანამ ის არ გავა, ტრანსფერ-ჰუკი უარყოფს საფულიდან ნებისმიერ გატანას — მეორად ბაზარზეც.',
  'platform.safety.f3.title': 'ემისიის გაუქმება საბოლოოა',
  'platform.safety.f3.body':
    'რაუნდის დახურვისას revoke_mint_authority ანადგურებს ემისიის უფლებას. ლიმიტი დაპირებიდან ჯაჭვის თვისებად იქცევა.',
  'platform.safety.f4.title': 'ყველაფერი აუდიტის კვალში ილექება',
  'platform.safety.f4.body':
    'უფლებამოსილების ყოველი მოქმედება ტრანზაქციაა ხელმომწერით, სლოტითა და ანგარიშების კვალით. მმართველობის კონსოლი იმავე ჩანაწერებს კითხულობს, რასაც ნებისმიერ ექსფლორერში ნახავთ.',

  // ── /company sections ──
  'company.mission.quote':
    'მსოფლიოს ღირებულების უდიდესი ნაწილი აქტივებშია, რომლებიც არასოდეს იყიდება: მიწა, ქარხნები, კონცესიები, კრედიტი. თითოეულს ვაძლევთ ლიმიტირებულ ტოკენს, შესაბამისობის ჰუკს და გადახდის გზას — მფლობელობას კი მფლობელს ვუტოვებთ.',
  'company.mission.cite': '— რისთვისაც ეს ოთხი პროგრამა არსებობს',
  'company.values.eyebrow': 'პრინციპები',
  'company.values.titleTop': 'წესები, რომლებიც',
  'company.values.title': 'პროგრამებში ჩავწერეთ.',
  'company.values.lead':
    'პრინციპი, რომლის აღსრულებაც არ შეგიძლია, ლოზუნგია. ჩვენი თითოეული პრინციპი შეზღუდვაა, რომელსაც ჯაჭვი ყოველ ტრანზაქციაზე ამოწმებს.',
  'company.values.physics.name': 'შესაბამისობა ფიზიკაა',
  'company.values.physics.line':
    'ტოკენი თავად უარყოფს შეუსაბამო ტრანსფერს — წესები ტრანსფერის გზაზე ცხოვრობს და არა პირობების გვერდზე.',
  'company.values.custody.name': 'მფლობელობა თქვენთან რჩება',
  'company.values.custody.line':
    'ტოკენები ინვესტორის საფულეში იჭრება. ჩვენ აღრიცხვის სისწორეს ვინახავთ; აქტივს არასოდეს ვიჭერთ.',
  'company.values.audit.name': 'ყველასთვის შემოწმებადი',
  'company.values.audit.line':
    'უფლებამოსილების ყოველი მოქმედება საჯარო ტრანზაქციაა. ჩვენი კონსოლი იმავე ჩანაწერებს კითხულობს, რასაც ექსფლორერი.',
  'company.values.yield.name': 'სარგებელი ონჩეინ ანგარიშსწორდება',
  'company.values.yield.line':
    'გადახდები USDC-ით ნაწილდება დაფიქსირებული ბალანსების მიხედვით — ჩეკების, კვარტლების და ნდობის გარეშე.',

  'company.milestones.eyebrow': 'ეტაპები',
  'company.milestones.titleTop': 'გაშვების თანმიმდევრობით,',
  'company.milestones.title': 'და არა პრესრელიზების.',
  'company.milestones.m1': 'პირველი რეესტრის პროგრამა devnet-ზე — ემისიის ლიმიტები ძალაშია',
  'company.milestones.m2': 'ტრანსფერ-ჰუკმა გაატარა პირველი შესაბამისი ტრანსფერი ბოლომდე',
  'company.milestones.m3': 'განაწილების ეპოქებმა ერთი ფიქსაციით 312 devnet მფლობელს გადაუხადა',
  'company.milestones.m4': 'მეორადი ბაზრის ესქროუმ შეავსო პირველი ნაწილობრივი ორდერი',
  'company.milestones.m5': 'ოთხივე პროგრამის აუდიტი',
  'company.milestones.m6': 'Mainnet — იხსნება პირველი რეგულირებული შეთავაზება',
  'company.milestones.shipped': '✓ გაშვებული',
  'company.milestones.ahead': '— წინ',

  'company.contact.titleTop': 'რელსებს აშენებ?',
  'company.contact.title': 'მოდი, აქ ააშენე',
  'company.contact.lead':
    'ჩვენ პატარა გუნდი ვართ თბილისსა და ლისაბონში: Rust ჯაჭვზე, TypeScript მის გარეთ და ერთი საერთო წესი — თუ ჯაჭვს შეუძლია აღსრულება, ადამიანს ნუ სთხოვ.'
}

export default { en, ka }
