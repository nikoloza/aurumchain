// Raises the app's transient notice (AppToast renders it from root state).
// Used by actions whose real effect is an on-chain / backend write that the
// preview does not perform yet — the click must acknowledge instead of
// silently doing nothing. The sequence number keeps a stale dismiss timer
// from hiding a newer notice.
export const appNotify = function appNotify (message) {
  const el = this
  const root = el.getRootState()
  const seq = (Number(root.appNoticeSeq) || 0) + 1
  root.update({
    // A translation key, not copy — AppToast resolves it through polyglot.
    appNotice: message || 'toast.notWired',
    appNoticeOn: true,
    appNoticeSeq: seq
  }, { preventFetch: true })
  const win = el.node && el.node.ownerDocument.defaultView
  if (!win) return
  win.setTimeout(() => {
    try {
      const rs = el.getRootState()
      if ((Number(rs.appNoticeSeq) || 0) === seq) {
        rs.update({ appNoticeOn: false }, { preventFetch: true })
      }
    } catch (e) {}
  }, 3200)
}
