import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const formatLabel = (str) => {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`
        const isLast = index === pathnames.length - 1

        return (
          <div key={name} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{formatLabel(name)}</span>
            ) : (
              <Link to={routeTo} className="hover:text-foreground transition-colors">
                {formatLabel(name)}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
