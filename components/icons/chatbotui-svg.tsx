import { FC } from "react"

interface ChatbotUISVGProps {
  theme: "dark" | "light"
  scale?: number
}

export const ChatbotUISVG: FC<ChatbotUISVGProps> = ({ theme, scale = 1 }) => {
  return (
    <svg
      width={189 * scale}
      height={194 * scale}
      viewBox="0 0 189 194"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="12.5"
        y="12.5"
        width="164"
        height="127"
        rx="37.5"
        fill={`${theme === "dark" ? "#000" : "#fff"}`}
        stroke={`${theme === "dark" ? "#fff" : "#000"}`}
        strokeWidth="25"
      />
      <text
        fill={`${theme === "dark" ? "#fff" : "#000"}`}
        fontSize="80"
        fontWeight="bold"
        fontFamily="Lato Black"
        x="55"
        y="105"
      >
        AI
      </text>
    </svg>
  )
}
