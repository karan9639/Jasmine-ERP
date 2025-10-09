import { Breadcrumbs } from "./Breadcrumbs"

export function PageShell({ title, toolbar, children }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumbs />
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default PageShell
