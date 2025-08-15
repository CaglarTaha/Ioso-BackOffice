export type CategorizedEvents = {
  [date: string]: {
    [hour: string]: {
      id: number;
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      eventType: string;
      availability: string;
      isVisible: boolean;
      attendees: {
        userId: number;
        firstName: string;
        lastName: string;
        status: 'going' | 'maybe' | 'declined';
      }[];
    }[];
  };
};