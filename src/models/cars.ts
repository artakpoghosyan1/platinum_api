export interface Image {
  id: number;
  carId: number;
  filename: string;
  url: string;
}

export interface Car {
  make: string;
  model: string;
  year: number;
  vinCode: string | null;
  price: number;
  description: string | null;
  color: string;
  mileage: number;
  engine: string;
  bodyType: string;
  images: File[];
  id?: number;
}

export interface ServerCar extends Omit<Car, "images"> {
  images: Image[];
}
