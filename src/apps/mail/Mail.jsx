import { useEffect, useRef, useState } from 'react'
import { buildGmailLink, buildMailto, looksLikeEmail, mail } from '../../content/mail.js'
import { getIconSource } from '../../os/icons.js'
import { useWindowStore } from '../../windows/windowStore.js'

const flagSource = getIconSource('mail-flag')

function ToolbarButton({ icon, label, onClick, disabled, pressed }) {
  const source = getIconSource(icon)
  return (
    <button
      aria-pressed={pressed}
      className={`mail-tool${pressed ? ' is-pressed' : ''}`}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      type="button"
    >
      <span className="mail-tool-icon">{source && <img src={source} alt="" draggable="false" />}</span>
      <span>{label}</span>
    </button>
  )
}

/** Compose window. Sends through the visitor's own mail app (mailto), with a Gmail fallback. */
function Mail({ windowId }) {
  const close = useWindowStore((state) => state.close)
  const toggleMaximise = useWindowStore((state) => state.toggleMaximise)
  const maximised = useWindowStore((state) => state.windows.find((win) => win.id === windowId)?.maximised)
  const [from, setFrom] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [spell, setSpell] = useState(true)
  const [showToolbar, setShowToolbar] = useState(true)
  const [textSize, setTextSize] = useState('Normal')
  const [mono, setMono] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [status, setStatus] = useState(null)
  const [links, setLinks] = useState(null)
  const [sending, setSending] = useState(false)
  const lastSent = useRef(0)
  const honeypot = useRef(null)
  const barRef = useRef(null)
  const fieldRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!openMenu) return undefined
    function handlePointerDown(event) {
      if (!barRef.current?.contains(event.target)) setOpenMenu(null)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMenu])

  /** The field the Edit commands act on: whichever of From/Subject/message was last focused. */
  function target() {
    const field = fieldRef.current ?? bodyRef.current
    field?.focus()
    return field
  }

  function validate() {
    if (!looksLikeEmail(from)) return mail.status.needFrom
    if (!body.trim()) return mail.status.needBody
    return null
  }

  function fallbackLinks(message) {
    return { gmail: buildGmailLink(message), mailto: buildMailto(message) }
  }

  async function send() {
    const problem = validate()
    setLinks(null)
    if (problem) {
      setStatus({ kind: 'error', text: problem })
      return
    }
    if (sending) return
    if (Date.now() - lastSent.current < mail.cooldownMs) {
      setStatus({ kind: 'error', text: mail.status.wait })
      return
    }

    const message = { from, subject, body }
    const key = import.meta.env.VITE_MAIL_KEY

    // No key configured (for example a deploy without the env var): use the visitor's mail app.
    if (!key) {
      setLinks(fallbackLinks(message))
      setStatus({ kind: 'info', text: mail.status.sent })
      window.location.href = buildMailto(message)
      return
    }

    // A bot filled the hidden field: pretend it worked and send nothing.
    if (honeypot.current?.value) {
      setStatus({ kind: 'info', text: mail.status.delivered })
      return
    }

    setSending(true)
    setStatus({ kind: 'info', text: mail.status.sending })
    try {
      const response = await fetch(mail.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject: subject.trim() || mail.subjectDefault,
          from_name: from.trim(),
          email: from.trim(),
          replyto: from.trim(),
          message: `${body.trim()}\n\n(Reply to: ${from.trim()})`,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error('send failed')
      lastSent.current = Date.now()
      setBody('')
      setSubject('')
      setStatus({ kind: 'info', text: mail.status.delivered })
    } catch {
      setLinks(fallbackLinks(message))
      setStatus({ kind: 'error', text: mail.status.failed })
    } finally {
      setSending(false)
    }
  }

  function check() {
    setLinks(null)
    setStatus(
      looksLikeEmail(from)
        ? { kind: 'info', text: mail.status.namesOk }
        : { kind: 'error', text: mail.status.needFrom },
    )
  }

  function run(command) {
    target()
    document.execCommand(command)
  }

  async function paste() {
    const field = target()
    try {
      const text = await navigator.clipboard.readText()
      if (field && text) document.execCommand('insertText', false, text)
    } catch {
      setLinks(null)
      setStatus({ kind: 'error', text: 'Your browser blocked paste. Use Ctrl+V instead.' })
    }
  }

  function selectAll() {
    target()?.select()
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(mail.address)
      setStatus({ kind: 'info', text: mail.status.copied })
    } catch {
      setStatus({ kind: 'error', text: mail.status.copyFailed })
    }
  }

  function insertText(text) {
    bodyRef.current?.focus()
    document.execCommand('insertText', false, text)
  }

  function pick(id) {
    setOpenMenu(null)
    if (id === 'send') send()
    else if (id === 'close') close(windowId)
    else if (id === 'undo') run('undo')
    else if (id === 'cut') run('cut')
    else if (id === 'copy') run('copy')
    else if (id === 'paste') paste()
    else if (id === 'select-all') selectAll()
    else if (id === 'check') check()
    else if (id === 'spell') setSpell((value) => !value)
    else if (id === 'toolbar') setShowToolbar((value) => !value)
    else if (id === 'maximise') toggleMaximise(windowId)
    else if (id === 'mono') setMono((value) => !value)
    else if (id === 'date') insertText(new Date().toLocaleDateString(undefined, { dateStyle: 'long' }))
    else if (id === 'help') {
      setLinks(null)
      setStatus({ kind: 'info', text: mail.help })
    } else if (id.startsWith('size:')) setTextSize(id.slice(5))
    else if (id.startsWith('smiley:')) insertText(id.slice(7))
  }

  const menuItems = {
    File: [{ id: 'send', label: 'Send' }, { id: 'close', label: 'Close' }],
    Edit: [
      { id: 'undo', label: 'Undo' },
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
      { id: 'select-all', label: 'Select All' },
    ],
    View: [
      { id: 'toolbar', label: 'Toolbar', checked: showToolbar },
      { id: 'maximise', label: maximised ? 'Restore window' : 'Maximize window' },
    ],
    Insert: [
      ...mail.smileys.map((smiley) => ({ id: `smiley:${smiley}`, label: `Smiley  ${smiley}` })),
      { id: 'date', label: "Today's date" },
    ],
    Format: [
      ...Object.keys(mail.textSizes).map((name) => ({ id: `size:${name}`, label: `${name} text`, checked: textSize === name })),
      { id: 'mono', label: 'Typewriter font', checked: mono },
    ],
    Tools: [
      { id: 'spell', label: 'Check spelling as I type', checked: spell },
      { id: 'check', label: 'Check Names' },
    ],
    Help: [{ id: 'help', label: 'About this window' }],
  }

  return (
    <form className="mail" onSubmit={(event) => event.preventDefault()}>
      <div className="mail-menubar" ref={barRef} role="menubar">
        {mail.menus.map((name) => {
          return (
            <div className="mail-menu" key={name}>
              <button
                aria-expanded={openMenu === name}
                aria-haspopup="menu"
                className={`mail-menu-button${openMenu === name ? ' is-open' : ''}`}
                onClick={() => setOpenMenu((current) => (current === name ? null : name))}
                role="menuitem"
                type="button"
              >
                {name}
              </button>
              {openMenu === name && menuItems[name] && (
                <div className="mail-dropdown" role="menu">
                  {menuItems[name].map((item) => (
                    <button
                      className={item.checked ? 'is-checked' : undefined}
                      key={item.id}
                      onClick={() => pick(item.id)}
                      role="menuitem"
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        <span className="mail-flag">{flagSource && <img src={flagSource} alt="" draggable="false" />}</span>
      </div>

      {showToolbar && <div className="mail-toolbar" role="toolbar" aria-label="Message">
        <span className="mail-grip" aria-hidden="true" />
        <ToolbarButton disabled={sending} icon="mail-send" label="Send" onClick={send} />
        <span className="mail-sep" aria-hidden="true" />
        <ToolbarButton icon="mail-cut" label="Cut" onClick={() => run('cut')} />
        <ToolbarButton icon="mail-copy" label="Copy" onClick={() => run('copy')} />
        <ToolbarButton icon="mail-paste" label="Paste" onClick={paste} />
        <ToolbarButton icon="mail-undo" label="Undo" onClick={() => run('undo')} />
        <span className="mail-sep" aria-hidden="true" />
        <ToolbarButton icon="mail-check" label="Check" onClick={check} />
        <ToolbarButton icon="mail-spelling" label="Spelling" onClick={() => setSpell((value) => !value)} pressed={spell} />
      </div>}
      <div className="mail-strip" aria-hidden="true" />

      <div className="mail-fields">
        <label htmlFor={`${windowId}-to`}>To:</label>
        <input id={`${windowId}-to`} readOnly value={mail.toName} />
        <label htmlFor={`${windowId}-from`}>From:</label>
        <input
          autoComplete="email"
          id={`${windowId}-from`}
          inputMode="email"
          onChange={(event) => setFrom(event.target.value)}
          onFocus={(event) => { fieldRef.current = event.target }}
          placeholder={mail.fromPlaceholder}
          type="email"
          value={from}
        />
        <label htmlFor={`${windowId}-subject`}>Subject:</label>
        <input
          id={`${windowId}-subject`}
          onChange={(event) => setSubject(event.target.value)}
          onFocus={(event) => { fieldRef.current = event.target }}
          value={subject}
        />
      </div>

      <input
        aria-hidden="true"
        autoComplete="off"
        className="mail-honeypot"
        name="website"
        ref={honeypot}
        tabIndex={-1}
        type="text"
      />

      <div className="mail-body">
        <textarea
          aria-label="Message"
          onChange={(event) => setBody(event.target.value)}
          onFocus={(event) => { fieldRef.current = event.target }}
          placeholder={mail.bodyPlaceholder}
          ref={bodyRef}
          spellCheck={spell}
          style={{ fontSize: mail.textSizes[textSize], fontFamily: mono ? "'Courier New', monospace" : undefined }}
          value={body}
        />
        {status && (
          <div className={`mail-status is-${status.kind}`} role="status">
            <span>{status.text}</span>
            {links && (
              <span className="mail-status-links">
                <button onClick={copyAddress} type="button">Copy address</button>
                <a href={links.mailto}>Open mail app</a>
                <a href={links.gmail} rel="noopener noreferrer" target="_blank">Open in Gmail</a>
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

export default Mail