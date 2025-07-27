interface AppLogoProps {
  size?: "small" | "medium" | "large" | "extralarge";
}

export const AppLogo = ({ size = "large" }: AppLogoProps) => {
  const sizeClasses = {
    small: "text-l",
    medium: "text-xl",
    large: "text-2xl",
    extralarge: "text-4xl",
  };

  return (
    <span
      className={`font-bold bg-gradient-to-b from-[#6a85dd] to-[#1e3799] bg-clip-text text-transparent select-none font-clash ${sizeClasses[size]}`}
    >
      Socinize
    </span>
  );
};
