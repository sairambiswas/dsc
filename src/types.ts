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
  id: string;
  name: string;
  items: WheelItem[];
  spinDuration: number;
  overrideResultId: string | null;
  logoUrl: string | null;
  font: string;
  fontSize: number;
  appTitle: string;
  appSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  offerTitle: string;
  celebrationHeader: string;
  celebrationFooter: string;
  spinButtonText: string;
  spinButtonColor: string;
  footerText: string;
  gymEmail: string;
  gymPhone: string;
  gymLocation: string;
  gymAddress: string;
  updatedAt: number;
}

export interface DriveFile {
  id: string;
  name: string;
}