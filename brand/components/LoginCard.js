// Sign-in form. Both dashboards mount this on their /login page. The handlers
// live in brand/functions/auth.js; the input binding follows the platform
// idiom — value from root state, preventFetch on every keystroke.
export const LoginCard = {
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
      text: (el, s) => s.title || 'Sign in'
    },
    Lead: {
      tag: 'p',
      margin: '0',
      fontSize: 'Z',
      color: 'caption',
      text: (el, s) => s.lead || ''
    }
  },

  ErrorBanner: {
    show: (el, s) => !!s.root.authError,
    padding: 'Y A',
    borderRadius: 'Z',
    background: 'red.14',
    border: '1px solid red.4',
    color: '#ff8a86',
    fontSize: 'Y1',
    fontWeight: '500',
    text: (el, s) => s.root.authError || ''
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
        text: 'Email',
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
        border: '1px solid white.14',
        background: 'white.06',
        color: 'title',
        fontSize: 'Z',
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ':focus': { borderColor: 'gold', boxShadow: '0 0 0 3px rgba(229,179,90,.14)' },
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
        text: 'Password',
        fontSize: 'Y1',
        fontWeight: '600',
        color: 'paragraph'
      },
      Input: {
        tag: 'input',
        type: 'password',
        autocomplete: 'current-password',
        placeholder: 'Your password',
        required: true,
        value: (el, s) => s.root.signinPassword || '',
        padding: 'Z A',
        borderRadius: 'Z',
        border: '1px solid white.14',
        background: 'white.06',
        color: 'title',
        fontSize: 'Z',
        fontFamily: 'inherit',
        outline: 'none',
        width: '100%',
        transition: 'border-color .15s ease, box-shadow .15s ease',
        ':focus': { borderColor: 'gold', boxShadow: '0 0 0 3px rgba(229,179,90,.14)' },
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
      text: (el, s) => (s.root.authLoading ? 'Signing in…' : 'Sign in')
    }
  },

  Note: {
    tag: 'p',
    margin: '0',
    textAlign: 'center',
    fontSize: 'Y',
    color: 'caption',
    text: (el, s) => s.note || 'Access is provisioned by the Fractyco team.'
  }
}
