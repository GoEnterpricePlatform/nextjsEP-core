import Image from "next/image";

interface UserAvatarProps {
  email: string;
  imgUrl?: string;
  size?: number;
  className?: string;
}

export const UserAvatar = ({
  email,
  imgUrl,
  size = 38,
  className = "",
}: UserAvatarProps) => {
  return imgUrl ? (
    <Image
      src={imgUrl}
      width={size}
      height={size}
      alt="User avatar"
      className={`rounded-full border border-white/20 object-cover ${className}`}
      unoptimized
    />
  ) : (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600 ${className}`}
    >
      {email.charAt(0).toUpperCase()}
    </div>
  );
};
