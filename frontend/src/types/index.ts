export interface Chat {
  id: number;
  nombre: string;
}

export interface Message {
  id: number;
  message: string;
  role: "user" | "bot";
  datetime: string;
}