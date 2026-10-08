export const CLUBS = [
  {
    name: "Art",
    description: "Make, experiment, and share your creative work.",
    category: "Create",
  },
  {
    name: "Chess",
    description: "Learn new strategies and play with fellow thinkers.",
    category: "Think",
  },
  {
    name: "Debate",
    description: "Build confidence by exploring ideas and making a case.",
    category: "Speak",
  },
  {
    name: "Drama",
    description: "Bring stories to life on stage and behind the scenes.",
    category: "Perform",
  },
  {
    name: "Robotics",
    description: "Design, build, and bring clever machines to life.",
    category: "Build",
  },
  {
    name: "Student Council",
    description: "Share student ideas and help make school better.",
    category: "Lead",
  },
] as const;

export type ClubName = (typeof CLUBS)[number]["name"];

export function isClubName(value: string): value is ClubName {
  return CLUBS.some((club) => club.name === value);
}
