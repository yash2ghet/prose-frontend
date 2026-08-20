import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type UserAvatarProps = {
  name: string
  image?: string
  size?: "sm" | "default" | "lg"
}

export function UserAvatar({
  name,
  image,
  size = "default",
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Avatar size={size}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}