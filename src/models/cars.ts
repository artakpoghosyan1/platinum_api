export interface Image {
  id: number;
  carId: number;
  filename: string;
  url: string;
}

export interface Rates {
  usd: number;
  rur: number;
}

export interface Car {
  make: string;
  model: string;
  year: number | string;
  vinCode: string | null;
  price: number | string;
  rates?: Rates;
  description: string | null;
  color: string;
  mileage: number | string;
  engine: string;
  bodyType: string;
  images: File[];
  id?: number;
}

export interface ServerCar extends Omit<Car, "images"> {
  images: Image[];
}
