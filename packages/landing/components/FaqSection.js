export const FaqSection = {
  extends: 'Section',
  id: 'faq',

  Inner: {
    SectionHeading: {
      state: {
        num: '07',
        eyebrow: 'faq.eyebrow',
        title: 'faq.title'
      }
    },

    List: {
      flow: 'y',
      width: '100%',
      maxWidth: 'J',
      childExtends: 'FaqItem',
      childrenAs: 'state',
      children: [
        { open: false, n: 'Q1', q: 'faq.q1', a: 'faq.a1' },
        { open: false, n: 'Q2', q: 'faq.q2', a: 'faq.a2' },
        { open: false, n: 'Q3', q: 'faq.q3', a: 'faq.a3' },
        { open: false, n: 'Q4', q: 'faq.q4', a: 'faq.a4' },
        { open: false, n: 'Q5', q: 'faq.q5', a: 'faq.a5' },
        { open: false, n: 'Q6', q: 'faq.q6', a: 'faq.a6' }
      ]
    }
  }
}
