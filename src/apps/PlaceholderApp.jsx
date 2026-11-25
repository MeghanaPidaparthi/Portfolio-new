/** Shown for any app that has not been built yet. Real apps replace it in registry.jsx. */
function PlaceholderApp({ title }) {
  return (
    <div className="placeholder-app">
      <p>{title} is not built yet. It arrives in a later step.</p>
    </div>
  )
}

export default PlaceholderApp