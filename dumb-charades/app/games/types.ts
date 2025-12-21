export interface GameConfig {
  id: string;
  title: string;
  description: string;
  color: {
    from: string;
    to: string;
    hover_from: string;
    hover_to: string;
  };
  textColor: string;
}

export interface GameProps {
  onBackHome: () => void;
}
