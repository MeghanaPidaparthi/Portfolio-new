/** Everything the Mail window says. Edit text here, not in the component. */
export const mail = {
  /** Where messages go. Change it here and nowhere else. */
  address: 'pidaparthimeghana@gmail.com',
  toName: 'Meghana Pidaparthi',
  windowTitle: 'Contact me :)',
  bodyPlaceholder: 'Hit me up.. :)',
  fromPlaceholder: 'your email, so I can reply',
  subjectDefault: 'Hello from your portfolio',
  menus: ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'],
  /** Text snippets under Insert. */
  smileys: [':)', ':D', ':P', '<3', ':3'],
  /** Message text sizes under Format, in px. */
  textSizes: { Small: 11, Normal: 13, Large: 16 },
  help: 'This is a contact form. Fill in your email so I can reply, write a message and press Send. It lands straight in my inbox :)',
  /** Web3Forms endpoint. The access key comes from VITE_MAIL_KEY in .env (never hard-code it). */
  endpoint: 'https://api.web3forms.com/submit',
  cooldownMs: 30000,
  status: {
    sending: 'Sending...',
    delivered: 'Sent! Thank you, I will reply to your email soon :)',
    failed: 'Could not send it from here. Use one of these instead:',
    wait: 'Please wait a few seconds before sending another message.',
    needFrom: 'Please add a valid email address in the From box so I can reply.',
    needBody: 'The message is empty. Say something :)',
    namesOk: 'All names are valid.',
    sent: 'Your mail app should have opened with the message ready. Nothing opened? Use one of these:',
    copied: 'Address copied.',
    copyFailed: 'Could not copy. Select the address and copy it by hand.',
  },
}

/** Loose email shape check. Good enough to catch typos, not a deliverability test. */
export function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** mailto link with subject and body filled in. The visitor's address goes in the body. */
export function buildMailto({ from, subject, body }) {
  const fullBody = `${body.trim()}\n\n(Reply to: ${from.trim()})`
  const query = `subject=${encodeURIComponent(subject.trim() || mail.subjectDefault)}&body=${encodeURIComponent(fullBody)}`
  return `mailto:${mail.address}?${query}`
}

/** Gmail web compose link, for visitors with no desktop mail client. */
export function buildGmailLink({ from, subject, body }) {
  const fullBody = `${body.trim()}\n\n(Reply to: ${from.trim()})`
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: mail.address,
    su: subject.trim() || mail.subjectDefault,
    body: fullBody,
  })
  return `https://mail.google.com/mail/?${params.toString()}`
}