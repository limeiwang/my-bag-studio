export interface CanvasMaterial {
  id: string;
  name: string;
  color: string;
  description: string;
  origin: string;
  imageUrl: string;
}

export interface LeatherMaterial {
  id: string;
  name: string;
  color: string;
  description: string;
  origin: string;
  imageUrl: string;
}

export interface HardwareMaterial {
  id: string;
  name: string;
  color: string;
  textureClass: string;
  description: string;
}

export interface MonogramConfig {
  text: string;
  font: "Serif" | "Sans" | "Mono";
  style: "Gold Foil" | "Silver Foil" | "Debossed";
  position: "Pocket Center" | "Leather Tag";
}

export interface AtmosphereConfig {
  id: string;
  name: string;
  bgColor: string;
  ambientLight: string;
  shadowColor: string;
  intensity: number;
}

export interface BagSizeConfig {
  id: string;
  name: string;
  dimensions: string;
  additionalPrice: number;
  description: string;
}

export interface BagConfiguration {
  canvas: CanvasMaterial;
  leather: LeatherMaterial;
  hardware: HardwareMaterial;
  size: BagSizeConfig;
  monogram: MonogramConfig;
  shoulderStrap: boolean;
  keyClasp: boolean;
  dustBag: boolean;
  atmosphere: AtmosphereConfig;
}

export interface SavedDesign {
  id: string;
  name: string;
  config: BagConfiguration;
  createdAt: string;
  likes: number;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
