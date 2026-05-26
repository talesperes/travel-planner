export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
}

export interface CreateItineraryInput {
  title: string;
}
