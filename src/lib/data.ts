import type { Board, ImageItem, ViewSettings } from './types';

const defaultViewSettings: ViewSettings = {
  viewMode: 'moodboard',
  gridColumns: 3,
  listShowCover: true,
  listShowTitle: true,
  listShowNotes: true,
  listShowTags: true,
  listCoverPosition: 'left',
  backgroundPattern: 'dots',
};

export const initialData: { boards: Board[], activeBoardId: string } = {
  boards: [
    {
      id: "board-1752155521738",
      name: "Graphic Design",
      images: [
        {
          url: "https://i.pinimg.com/736x/66/49/f7/6649f7187201f052af354f9a01110a35.jpg",
          title: "Chromakopia: Tyler, the Creator Album Art",
          notes: "The image is a stylized album cover with a collage-like aesthetic, combining vibrant colors and geometric shapes to create a bold and energetic mood.  It features a unique, mask-like portrait, hinting at a concept album with themes of identity and transformation.",
          tags: ["album", "collage", "music", "vibrant", "geometric"],
          colors: ["Green", "Yellow", "Brown"],
          id: "img-1752156821238",
          x: -105.62088224317893,
          y: 48.92580104998672,
          width: 351.62056263576517,
          height: 438.092467305702
        },
        {
          url: "https://i.pinimg.com/736x/b4/c4/93/b4c4930530e7accb0188d5392250b415.jpg",
          title: "Lost Again: A Minimalist Graphic",
          notes: "A minimalist graphic design with a strong, emotional message.  The yellow figure against a pale blue sky evokes feelings of isolation and loss.",
          tags: ["lost", "alone", "sad", "minimal", "yellow"],
          colors: ["Yellow", "Blue"],
          id: "img-1752156815690",
          x: 319.29299296950245,
          y: 244.15109211377393,
          width: 313.01317122305454,
          height: 313.01317122305454
        },
        {
          url: "https://i.pinimg.com/736x/f2/1f/43/f21f435dec2df347f507a1fd6131ca4f.jpg",
          title: "The Answer: Allen Iverson, stylized portrait",
          notes: "A stylized image of Allen Iverson, known as \"The Answer\", in a basketball pose. The color palette and geometric style create a vintage feel.",
          tags: ["basketball", "allen iverson", "nba", "vintage", "retro"],
          colors: ["Brown", "Red", "Black"],
          id: "img-1752156793550",
          x: 234.9207264525083,
          y: 596.99137737661,
          width: 413.29875793276335,
          height: 516.6234474159542
        },
        {
          url: "https://i.pinimg.com/736x/e1/f4/42/e1f4423a2b810cc370d95f80b29cc0df.jpg",
          title: "Digital Melancholy: A Nostalgic Collage",
          notes: "A surreal, digital collage featuring a dark-skinned man with blue hands, surrounded by nostalgic computer icons, evoking a blend of melancholy and technological reminiscence.",
          tags: ["collage", "surreal", "digital", "nostalgia", "technology"],
          colors: ["Blue", "Red", "Black"],
          id: "img-1752156786968",
          x: 292.04477087213587,
          y: -239.41613650351292,
          width: 335.49353572882814,
          height: 447.1727697689951
        },
        {
          url: "https://i.pinimg.com/736x/bd/ed/68/bded68ed912202ddc1694c57fa3e80a3.jpg",
          title: "Sensory Overload: A Red and Black Collage",
          notes: "The image is a bold, graphic design featuring a collage of human senses and symbols, creating a striking contrast between the red background and black and white elements. It evokes a vintage feel with its halftone style and strong imagery.",
          tags: ["collage", "graphic", "red", "vintage", "bold"],
          colors: ["Red", "Black", "White"],
          id: "img-1752155603533",
          x: 706.9594592820434,
          y: 396.2979676620739,
          width: 496.2814321103895,
          height: 490.20451661516023
        },
        {
          url: "https://i.pinimg.com/736x/0e/b8/9a/0eb89a37d3f4b0248fe16bbd96aea0b0.jpg",
          title: "Fragmented Portrait with Gold Teeth",
          notes: "The image is a bold and striking collage featuring a fragmented portrait of a man with exaggerated gold teeth, creating a vibrant and slightly unsettling mood. It's a dynamic piece that blends portraiture with graphic design elements.",
          tags: ["collage", "portrait", "bold", "graphic", "gold"],
          colors: ["Brown", "Red", "Gold"],
          id: "img-1752155575388",
          x: 667.4315563787206,
          y: -14.382989522136143,
          width: 368,
          height: 368
        }
      ],
      viewSettings: {
        viewMode: "moodboard",
        gridColumns: 3,
        listShowCover: true,
        listShowTitle: true,
        listShowNotes: true,
        listShowTags: true,
        listCoverPosition: "left",
        backgroundPattern: "none"
      }
    }
  ],
  activeBoardId: "all"
};

    