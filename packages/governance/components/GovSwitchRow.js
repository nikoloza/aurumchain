// SwitchRow with the console's row wash — a policy row brightens under the
// pointer the same way a table row does.
export const GovSwitchRow = {
  extends: 'SwitchRow',
  transition: 'background .15s ease',
  ':hover': { background: 'veil' }
}
