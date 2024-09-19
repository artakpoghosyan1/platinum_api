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
  id?: number;
}
