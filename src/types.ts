
export interface WheelItem {
  id: string;
  label: string;
  color: string;
}

export interface UserSession {
  email: string;
  phone: string;
  hasSpun: boolean;
  isVerified: boolean;
}

export interface WheelConfig {
  items: WheelItem[];
  spinDuration: number;
}
