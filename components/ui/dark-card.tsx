import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DarkCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function DarkCard({ title, description, children, className }: DarkCardProps) {
  return (
    <Card className={cn("bg-card/80 backdrop-blur-xl border-border/30", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-foreground">{title}</CardTitle>}
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}