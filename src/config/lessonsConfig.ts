export const LESSONS_CONFIG: Record<
  string,
  {
    type: "video" | "image";
    folder: string;
    order: string[];
    files: Record<string, string>;
  }
> = {
  colors: {
    type: "video",
    folder: "Colors",
    order: [
      "black",
      "blue",
      "brown",
      "green",
      "grey",
      "orange",
      "pink",
      "red",
      "white",
      "yellow",
    ],
    files: {
      black: "Black.mp4",
      blue: "Blue.mp4",
      brown: "Brown.mp4",
      green: "Green.mp4",
      grey: "Grey.mp4",
      orange: "Orange.mp4",
      pink: "Pink.mp4",
      red: "Red.mp4",
      white: "White.mp4",
      yellow: "Yellow.mp4",
    },
  },

  food: {
    type: "video",
    folder: "Food",
    order: ["breakfast", "lunch", "dinner"],
    files: {
      breakfast: "Breakfast.mp4",
      lunch: "Lunch.mp4",
      dinner: "Dinner.mp4",
    },
  },

  numbers: {
    type: "image",
    folder: "Numbers",
    order: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    files: {
      "1": "1.png",
      "2": "2.png",
      "3": "3.png",
      "4": "4.png",
      "5": "5.png",
      "6": "6.png",
      "7": "7.png",
      "8": "8.png",
      "9": "9.png",
      "10": "10.png",
    },
  },
};
