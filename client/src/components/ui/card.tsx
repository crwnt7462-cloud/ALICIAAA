import * as React from "react"
import { cn } from "@/lib/utils"

type WithChildren<T> = T & { children?: React.ReactNode }


export const Card = React.forwardRef<HTMLDivElement, WithChildren<React.ComponentProps<"div">>>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export function CardHeader(props: WithChildren<React.ComponentProps<"div">>) {
  const { className, children, ...rest } = props
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...rest}>{children}</div>
}

export function CardContent(props: WithChildren<React.ComponentProps<"div">>) {
  const { className, children, ...rest } = props
  return <div className={cn("p-6 pt-0", className)} {...rest}>{children}</div>
}

export function CardTitle(props: WithChildren<React.ComponentProps<"h3">>) {
  const { className, children, ...rest } = props
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...rest}>{children}</h3>
}

export function CardDescription(props: WithChildren<React.ComponentProps<"p">>) {
  const { className, children, ...rest } = props
  return <p className={cn("text-muted-foreground text-sm", className)} {...rest}>{children}</p>
}
