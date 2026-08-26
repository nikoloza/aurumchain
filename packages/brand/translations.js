// Shared copy for everything that lives in this library — the app chrome
// (rail, topbar, auth card), the components all three surfaces render, and
// the brand sheet this package publishes as its own page.
//
// Each surface merges these into its own dictionary in its config.js, so a
// string that appears on more than one surface is written and translated once.
//
// Keys are flat and dotted, namespaced by area: `common.*` for words that
// appear everywhere, then one namespace per component family.
//
// Georgian glossary — keep these renderings consistent everywhere:
//   asset აქტივი · offering შეთავაზება · wallet საფულე · payout გადახდა
//   portfolio პორტფელი · compliance შესაბამისობა · eligibility დაშვება
//   registry რეესტრი · issuance ემისია · token ტოკენი · yield სარგებელი
//   secondary market მეორადი ბაზარი · settlement ანგარიშსწორება
//   pause შეჩერება · audit trail აუდიტის კვალი · authority უფლებამოსილება
// Product and chain names stay Latin: Fractyco, Solana, Devnet, USDC, KYC.

export const en = {
  'common.signIn': 'Sign in',
  'common.signOut': 'Sign out',
  'common.openAccount': 'Open an account',
  'common.talkToUs': 'Talk to us',
  'common.change': 'Change',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.view': 'View',
  'common.close': 'Close',
  'common.loading': 'Loading',
  'common.export': 'Export',
  'common.on': 'On',
  'common.off': 'Off',
  'common.network': 'Network',
  'common.wallet': 'Wallet',
  'common.language': 'Language',
  'common.theme': 'Theme',

  'lang.choose': 'Choose a language',
  'theme.switch': 'Switch color theme',
  'logo.home': 'Fractyco — home',

  'auth.title': 'Sign in',
  'auth.lead': 'Use the email you registered with.',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.emailPlaceholder': 'you@company.com',
  'auth.passwordPlaceholder': 'Your password',
  'auth.submit': 'Sign in',
  'auth.working': 'Signing in…',
  'auth.note': 'Access is provisioned by the Fractyco team.',
  'auth.errRequired': 'Email and password are required.',
  'auth.errCredentials': 'Wrong email or password.',
  'auth.errFailed': 'Sign-in failed.',

  'table.empty': 'Nothing here yet.',

  // Status vocabulary lives here, once — StatusPill tones off the segment
  // after the last dot, so every surface must pass the same key for the same
  // word or the two would drift apart in Georgian.
  'status.funding': 'Funding',
  'status.funded': 'Funded',
  'status.pending': 'Pending',
  'status.paused': 'Paused',
  'status.feature': 'Feature',
  'status.active': 'Active',
  'status.closed': 'Closed',

  'offering.subscribe': 'Subscribe',
  'offering.perToken': 'per token',
  'offering.min': 'min',
  'offering.raised': 'raised',
  'offering.closes': 'closes',

  'position.list': 'List on marketplace',
  'position.viewPayouts': 'View payouts',
  'position.tokens': 'Tokens',
  'position.invested': 'Invested',
  'position.avgPrice': 'Avg price',
  'position.return': 'Return',

  'stat.portfolioValue': 'Portfolio value',
  'stat.unclaimedPayouts': 'Unclaimed payouts',
  'stat.positions': 'Positions',

  'program.anchorProgram': 'Anchor program',

  // ── The brand sheet ───────────────────────────────────────────────────────
  'brand.meta.title': 'Fractyco — Brand',
  'brand.meta.description':
    'The Fractyco brand system, rendered live: palette, typography, the mark, and the component library shared by every surface.',
  'brand.chip': 'Brand 2.0',

  'brand.hero.eyebrow': 'Fractyco · Brand system',
  'brand.hero.titleTop': 'One identity,',
  'brand.hero.title': 'three surfaces',
  'brand.hero.lead':
    'Deep navy ink on a soft ivory ground, slate structure, mist accents — flat by rule, condensed at display size, mono for every figure. This sheet renders from the live tokens, so what you see here is what every surface ships.',
  'brand.hero.m1': '4 brand colors',
  'brand.hero.m2': '4 type roles',
  'brand.hero.m3': '2 schemes · light-first',

  'brand.color.eyebrow': 'Brand color',
  'brand.color.titleTop': 'Four colors,',
  'brand.color.title': 'every shade by modifier.',
  'brand.color.lead':
    'The palette lives once in the design system. Components read semantic pairs — title, caption, hairline, accentInk — that flip with the scheme, so nothing is written twice.',
  'brand.color.rolePrimary': 'Primary · 45%',
  'brand.color.roleNeutral': 'Neutral · 35%',
  'brand.color.roleSecondary': 'Secondary · 15%',
  'brand.color.roleAccent': 'Accent · 5%',
  'brand.color.modsNote': 'Every shade is a modifier — never a new hex',

  'brand.scale.eyebrow': 'Scale & shape',
  'brand.scale.titleTop': 'One ladder',
  'brand.scale.title': 'for space, type, and radius.',
  'brand.scale.lead':
    'Spacing and type share the letter sequence (base 16, ratio 1.25) — em-relative, so everything breathes with the reading size. Radii are fixed pixels, so product geometry never drifts with the font.',

  'brand.type.eyebrow': 'Typography',
  'brand.type.titleTop': 'Condensed voice,',
  'brand.type.title': 'grotesk body, mono figures.',
  'brand.type.roleBrand': 'Brand — wordmark & display',
  'brand.type.roleDisplay': 'Display — headings',
  'brand.type.roleDefault': 'Default — body & interface',
  'brand.type.roleMono': 'Mono — every figure',

  'brand.logo.eyebrow': 'Brand logo',
  'brand.logo.titleTop': 'The arcs and the diamond,',
  'brand.logo.title': 'from the brandbook vectors.',
  'brand.logo.lead':
    'Two open arcs hold the value diamond. The mark ships as a 24×24 currentColor icon, so it takes any ink the chrome gives it — never stretched, never shadowed, never gradiented.',

  'brand.motion.eyebrow': 'Motion',
  'brand.motion.titleTop': 'Flat moves,',
  'brand.motion.title': 'never decoration.',
  'brand.motion.lead':
    'Every keyframe lives in the design system and respects prefers-reduced-motion. No gradients, no blurs — opacity, transform, and time.',

  'brand.icons.eyebrow': 'Iconography',
  'brand.icons.titleTop': 'One stroke weight,',
  'brand.icons.title': 'twenty-five glyphs.',
  'brand.icons.lead':
    'Rendered through Icon from designSystem/icons.js — 24-viewbox, currentColor, no fills. The mark itself is one of them.',

  'brand.cmp.eyebrow': 'Components',
  'brand.cmp.titleTop': 'The library,',
  'brand.cmp.title': 'wearing the identity.',
  'brand.cmp.lead':
    'Every control below is the shared component itself — the same objects the landing, the investor app, and the governance console compose.',
  'brand.cmp.seeHow': 'See how it works',
  'brand.cmp.ghost': 'Ghost',
  'brand.cmp.onNavy': 'On the navy band',
  'brand.cmp.neutral': 'Neutral',
  'brand.cmp.accent': 'Accent',
  'brand.cmp.deltaEpoch': '+4.2% this epoch',
  'brand.cmp.claimToWallet': 'claim to wallet',
  'brand.cmp.listedOnMarket': '2 listed on market',

  'brand.surfaces.eyebrow': 'The surfaces',
  'brand.surfaces.titleTop': 'Same tokens,',
  'brand.surfaces.title': 'three applications.',
  'brand.surfaces.landingName': 'Landing',
  'brand.surfaces.landingPurpose':
    'The public story: what tokenization is, how eligibility works, what an offering looks like.',
  'brand.surfaces.appName': 'Investor app',
  'brand.surfaces.appPurpose':
    'Positions, payouts, subscriptions, and the secondary market for signed-in investors.',
  'brand.surfaces.govName': 'Governance',
  'brand.surfaces.govPurpose':
    'The operator console: registry, compliance queues, distributions, and audit.',

  'brand.band.titleTop': 'Publish brand first,',
  'brand.band.title': 'then the surfaces.',
  'brand.band.lead':
    'The surfaces embed this library at their own publish time. The developer reference lives in docs/BRAND.md; the source identity in Brandbook.ai at the repo root.'
}

export const ka = {
  'common.signIn': 'შესვლა',
  'common.signOut': 'გასვლა',
  'common.openAccount': 'ანგარიშის გახსნა',
  'common.talkToUs': 'დაგვიკავშირდით',
  'common.change': 'შეცვლა',
  'common.cancel': 'გაუქმება',
  'common.confirm': 'დადასტურება',
  'common.save': 'შენახვა',
  'common.view': 'ნახვა',
  'common.close': 'დახურვა',
  'common.loading': 'იტვირთება',
  'common.export': 'ექსპორტი',
  'common.on': 'ჩართული',
  'common.off': 'გამორთული',
  'common.network': 'ქსელი',
  'common.wallet': 'საფულე',
  'common.language': 'ენა',
  'common.theme': 'თემა',

  'lang.choose': 'აირჩიეთ ენა',
  'theme.switch': 'ფერის თემის გადართვა',
  'logo.home': 'Fractyco — მთავარი',

  'auth.title': 'შესვლა',
  'auth.lead': 'გამოიყენეთ ელფოსტა, რომლითაც დარეგისტრირდით.',
  'auth.email': 'ელფოსტა',
  'auth.password': 'პაროლი',
  'auth.emailPlaceholder': 'you@company.com',
  'auth.passwordPlaceholder': 'თქვენი პაროლი',
  'auth.submit': 'შესვლა',
  'auth.working': 'მიმდინარეობს შესვლა…',
  'auth.note': 'წვდომას Fractyco-ს გუნდი გასცემს.',
  'auth.errRequired': 'ელფოსტა და პაროლი აუცილებელია.',
  'auth.errCredentials': 'ელფოსტა ან პაროლი არასწორია.',
  'auth.errFailed': 'შესვლა ვერ მოხერხდა.',

  'table.empty': 'ჯერ არაფერია.',

  'status.funding': 'ფინანსდება',
  'status.funded': 'დაფინანსებული',
  'status.pending': 'მოლოდინში',
  'status.paused': 'შეჩერებული',
  'status.feature': 'რჩეული',
  'status.active': 'აქტიური',
  'status.closed': 'დახურული',

  'offering.subscribe': 'ხელმოწერა',
  'offering.perToken': 'თითო ტოკენზე',
  'offering.min': 'მინ.',
  'offering.raised': 'მოზიდული',
  'offering.closes': 'იხურება',

  'position.list': 'მეორად ბაზარზე გატანა',
  'position.viewPayouts': 'გადახდების ნახვა',
  'position.tokens': 'ტოკენები',
  'position.invested': 'ინვესტირებული',
  'position.avgPrice': 'საშ. ფასი',
  'position.return': 'უკუგება',

  'stat.portfolioValue': 'პორტფელის ღირებულება',
  'stat.unclaimedPayouts': 'გაუტანელი გადახდები',
  'stat.positions': 'პოზიციები',

  'program.anchorProgram': 'Anchor-პროგრამა',

  // ── The brand sheet ───────────────────────────────────────────────────────
  'brand.meta.title': 'Fractyco — ბრენდი',
  'brand.meta.description':
    'Fractyco-ს ბრენდის სისტემა ცოცხლად: პალიტრა, ტიპოგრაფია, ნიშანი და კომპონენტების ბიბლიოთეკა, რომელსაც ყველა ზედაპირი იზიარებს.',
  'brand.chip': 'ბრენდი 2.0',

  'brand.hero.eyebrow': 'Fractyco · ბრენდის სისტემა',
  'brand.hero.titleTop': 'ერთი იდენტობა,',
  'brand.hero.title': 'სამი ზედაპირი',
  'brand.hero.lead':
    'ღრმა ლურჯი მელანი რბილ სპილოსძვლისფერ ფონზე, ფიქლისფერი სტრუქტურა, ნისლისფერი აქცენტები — წესით ბრტყელი, სათაურებში შეკუმშული, ყველა ციფრი მონოშრიფტით. ეს ფურცელი ცოცხალი ტოკენებით იხატება, ამიტომ აქ ნანახი ზუსტად ისაა, რასაც ყველა ზედაპირი იყენებს.',
  'brand.hero.m1': '4 ბრენდის ფერი',
  'brand.hero.m2': '4 ტიპოგრაფიული როლი',
  'brand.hero.m3': '2 სქემა · ღია პირველი',

  'brand.color.eyebrow': 'ბრენდის ფერი',
  'brand.color.titleTop': 'ოთხი ფერი,',
  'brand.color.title': 'ყველა ტონი მოდიფიკატორით.',
  'brand.color.lead':
    'პალიტრა დიზაინ-სისტემაში ერთხელ წერია. კომპონენტები კითხულობენ სემანტიკურ წყვილებს — title, caption, hairline, accentInk — რომლებიც სქემასთან ერთად იცვლება, ასე რომ არაფერი იწერება ორჯერ.',
  'brand.color.rolePrimary': 'ძირითადი · 45%',
  'brand.color.roleNeutral': 'ნეიტრალური · 35%',
  'brand.color.roleSecondary': 'მეორეხარისხოვანი · 15%',
  'brand.color.roleAccent': 'აქცენტი · 5%',
  'brand.color.modsNote': 'ყოველი ტონი მოდიფიკატორია — არასოდეს ახალი hex',

  'brand.scale.eyebrow': 'მასშტაბი და ფორმა',
  'brand.scale.titleTop': 'ერთი კიბე',
  'brand.scale.title': 'სივრცის, ტიპოგრაფიისა და რადიუსისთვის.',
  'brand.scale.lead':
    'სივრცე და ტიპოგრაფია ერთსა და იმავე ასოთა თანმიმდევრობას იზიარებს (ბაზა 16, კოეფიციენტი 1.25) — em-ზე დამოკიდებული, ამიტომ ყველაფერი კითხვის ზომასთან ერთად სუნთქავს. რადიუსები ფიქსირებულ პიქსელებშია, ამიტომ პროდუქტის გეომეტრია შრიფტს არ მიჰყვება.',

  'brand.type.eyebrow': 'ტიპოგრაფია',
  'brand.type.titleTop': 'შეკუმშული ხმა,',
  'brand.type.title': 'გროტესკული ტექსტი, მონო ციფრები.',
  'brand.type.roleBrand': 'Brand — ლოგოტიპი და სათაურები',
  'brand.type.roleDisplay': 'Display — სათაურები',
  'brand.type.roleDefault': 'Default — ტექსტი და ინტერფეისი',
  'brand.type.roleMono': 'Mono — ყველა ციფრი',

  'brand.logo.eyebrow': 'ბრენდის ლოგო',
  'brand.logo.titleTop': 'რკალები და რომბი,',
  'brand.logo.title': 'ბრენდბუქის ვექტორებიდან.',
  'brand.logo.lead':
    'ორი ღია რკალი ღირებულების რომბს იჭერს. ნიშანი 24×24 currentColor იკონად მოდის, ამიტომ ნებისმიერ მელანს იღებს, რომელსაც გარემო აძლევს — არასოდეს იჭიმება, არასოდეს აქვს ჩრდილი ან გრადიენტი.',

  'brand.motion.eyebrow': 'მოძრაობა',
  'brand.motion.titleTop': 'ბრტყელი მოძრაობა,',
  'brand.motion.title': 'არასოდეს დეკორაცია.',
  'brand.motion.lead':
    'ყველა კადრი დიზაინ-სისტემაში ცხოვრობს და prefers-reduced-motion-ს პატივს სცემს. არც გრადიენტი, არც ბუნდოვნება — მხოლოდ გამჭვირვალობა, ტრანსფორმაცია და დრო.',

  'brand.icons.eyebrow': 'იკონოგრაფია',
  'brand.icons.titleTop': 'ერთი ხაზის სისქე,',
  'brand.icons.title': 'ოცდახუთი გლიფი.',
  'brand.icons.lead':
    'იხატება Icon-ით designSystem/icons.js-დან — 24-viewbox, currentColor, შევსების გარეშე. თავად ნიშანიც მათ შორისაა.',

  'brand.cmp.eyebrow': 'კომპონენტები',
  'brand.cmp.titleTop': 'ბიბლიოთეკა,',
  'brand.cmp.title': 'იდენტობით შემოსილი.',
  'brand.cmp.lead':
    'ქვემოთ ყოველი ელემენტი თავად საზიარო კომპონენტია — იგივე ობიექტები, რომლებსაც სალენდინგო გვერდი, საინვესტიციო აპი და მმართველობის კონსოლი აწყობს.',
  'brand.cmp.seeHow': 'როგორ მუშაობს',
  'brand.cmp.ghost': 'გამჭვირვალე',
  'brand.cmp.onNavy': 'ლურჯ ზოლზე',
  'brand.cmp.neutral': 'ნეიტრალური',
  'brand.cmp.accent': 'აქცენტი',
  'brand.cmp.deltaEpoch': '+4.2% ამ ეპოქაში',
  'brand.cmp.claimToWallet': 'საფულეში გატანა',
  'brand.cmp.listedOnMarket': '2 ბაზარზეა გატანილი',

  'brand.surfaces.eyebrow': 'ზედაპირები',
  'brand.surfaces.titleTop': 'იგივე ტოკენები,',
  'brand.surfaces.title': 'სამი აპლიკაცია.',
  'brand.surfaces.landingName': 'სალენდინგო გვერდი',
  'brand.surfaces.landingPurpose':
    'საჯარო ისტორია: რა არის ტოკენიზაცია, როგორ მუშაობს დაშვება და როგორ გამოიყურება შეთავაზება.',
  'brand.surfaces.appName': 'საინვესტიციო აპი',
  'brand.surfaces.appPurpose':
    'პოზიციები, გადახდები, ხელმოწერები და მეორადი ბაზარი შესული ინვესტორებისთვის.',
  'brand.surfaces.govName': 'მმართველობა',
  'brand.surfaces.govPurpose':
    'ოპერატორის კონსოლი: რეესტრი, შესაბამისობის რიგები, განაწილებები და აუდიტი.',

  'brand.band.titleTop': 'ჯერ ბრენდი გამოაქვეყნე,',
  'brand.band.title': 'შემდეგ ზედაპირები.',
  'brand.band.lead':
    'ზედაპირები ამ ბიბლიოთეკას საკუთარი გამოქვეყნებისას ჩაიდებენ. დეველოპერის ცნობარი docs/BRAND.md-შია; საწყისი იდენტობა კი Brandbook.ai-ში, რეპოზიტორიის ფესვში.'
}

export default { en, ka }
