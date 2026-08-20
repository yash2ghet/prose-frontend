import { Alert } from "@/components/ui/alert"

type BlogAlertProps = {
  type: "success" | "error"
  children: React.ReactNode
}

export function BlogAlert({
  type,
  children,
}: BlogAlertProps) {
  if (type === "success") {
    return (
      <Alert>
        <span className="text-success">✓</span>
        <span>{children}</span>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      {children}
    </Alert>
  )
}