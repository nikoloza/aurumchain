// Sign-in form. Both dashboards mount this on their /login page. The handlers
// live in brand/functions/auth.js; the input binding follows the platform
// idiom — value from root state, preventFetch on every keystroke.
export const LoginCard = {
  // Stored-session pickup. This lives HERE, not on the page or in openPage:
  // a component's onRender always has a real node, and the node is the only
  // reliable bridge to page-realm localStorage from handler code (bare
  // `localStorage` in this realm is a different store — the one place a
  // session is guaranteed NOT to be). The window flag makes the redirect
  // one-shot, so a re-render during the route transition cannot loop it.
  onRender: (el, s) => {
    try {
      const win = el.node.ownerDocument.defaultView
      if (win.__fcAutoSignin) return
      const sess = JSON.parse(win.localStorage.getItem('fractyco_session') || 'null')
      const live = sess && sess.expires_at &&
        (Date.now() / 1000) < (Number(sess.expires_at) - 30)
      if (!live) {
        if (sess) win.localStorage.removeItem('fractyco_session')
        return
      }
      win.__fcAutoSignin = true
      el.router('/', el.__ref.root)
    } catch (e) {}
  },

  flow: 'y',
  gap: 'A',
  width: '100%',
  maxWidth: 'H+C',
  padding: 'C',
  borderRadius: 'B',
  theme: 'card',

  Head: {
    flow: 'y',
    gap: 'Y',
    alignItems: 'center',
    textAlign: 'center',
    Logo: {},
    Title: {
      tag: 'h1',
      margin: '0',
      fontFamily: 'Display',
      fontSize: 'B1',
      fontWeight: '700',
      letterSpacing: '-.02em',
      color: 'title',
      text: (el, s) => el.call('polyglot', s.title || 'auth.title', s.root.lang)
    },
    Lead: {
      tag: 'p',
      margin: '0',
      fontSize: 'Z',
      color: 'caption',
      text: (el, s) => el.call('polyglot', s.lead || 'auth.lead', s.root.lang)
    }
  },

  ErrorBanner: {
    show: (el, s) => !!s.root.authError,
    padding: 'Y A',
    borderRadius: 'Z',
    background: 'red.14',
    border: '1px solid red.4',
    color: 'dangerInk',
    fontSize: 'Y1',
    fontWeight: '500',
    text: (el, s) => el.call('polyglot', s.root.authError || '', s.root.lang)
  },

  Form: {
    tag: 'form',
    flow: 'y',
    gap: 'A',
    onSubmit: (ev, el) => {
      ev.preventDefault()
      el.call('signin')
    },

    EmailField: {
      flow: 'y',
      gap: 'X',
      Label: {
        tag: 'label',
        text: '{{ auth.email | polyglot }}',
        fontSize: 'Y1',
        fontWeight: '600',
        color: 'paragraph'
      },
      Input: {
        tag: 'input',
        type: 'email',
        autocomplete: 'email',
        placeholder: 'you@fractyco.app',
        required: true,
        value: (el, s) => s.root.signinEmail || '',
        padding: 'Z A',
        borderRadius: 'Z',
        border: '1px solid hairline',
        background: 'veil',
        color: 'title',
        fontSize: 'Z',
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ':focus': { borderColor: 'slate', boxShadow: '0 0 0 3px rgba(96,125,148,.2)' },
        onInput: (e, el, s) => {
          s.root.update({ signinEmail: e.target.value, authError: null }, { preventFetch: true })
        }
      }
    },

    PasswordField: {
      flow: 'y',
      gap: 'X',
      Label: {
        tag: 'label',
        text: '{{ auth.password | polyglot }}',
        fontSize: 'Y1',
        fontWeight: '600',
        color: 'paragraph'
      },
      Input: {
        tag: 'input',
        type: 'password',
        autocomplete: 'current-password',
        placeholder: '{{ auth.passwordPlaceholder | polyglot }}',
        required: true,
        value: (el, s) => s.root.signinPassword || '',
        padding: 'Z A',
        borderRadius: 'Z',
        border: '1px solid hairline',
        background: 'veil',
        color: 'title',
        fontSize: 'Z',
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ':focus': { borderColor: 'slate', boxShadow: '0 0 0 3px rgba(96,125,148,.2)' },
        onInput: (e, el, s) => {
          s.root.update({ signinPassword: e.target.value, authError: null }, { preventFetch: true })
        }
      }
    },

    SubmitBtn: {
      tag: 'button',
      type: 'submit',
      width: '100%',
      padding: 'Z A',
      minHeight: 'B1',
      borderRadius: 'Z',
      fontSize: 'Z',
      fontWeight: '700',
      fontFamily: 'inherit',
      theme: 'primary',
      border: 'none',
      cursor: 'pointer',
      transition: 'opacity .15s ease',
      opacity: (el, s) => (s.root.authLoading ? '.6' : '1'),
      text: (el, s) => el.call('polyglot', s.root.authLoading ? 'auth.working' : 'auth.submit', s.root.lang)
    }
  },

  Note: {
    tag: 'p',
    margin: '0',
    textAlign: 'center',
    fontSize: 'Y',
    color: 'caption',
    text: (el, s) => el.call('polyglot', s.note || 'auth.note', s.root.lang)
  }
}
