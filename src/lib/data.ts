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
      id: "board-1752595471219",
      name: "Cutout Style",
      images: [
        {
          url: "https://i.pinimg.com/736x/2e/df/ba/2edfbaf81aefa29cab45d93c63ee4bd6.jpg",
          title: "Raiders Style: Collared Coat and Beanie",
          notes: "",
          tags: ["cutout", "character"],
          colors: ["Purple"],
          id: "img-1752595690012",
          x: -555.0900683145687,
          y: -193.24640389460086,
          width: 977.1005231350971,
          height: 1214.7377427562687
        },
        {
          url: "https://i.pinimg.com/736x/8e/ab/55/8eab55855d01049f71ba63eb55ed2747.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752595629383",
          x: 472.33946894256167,
          y: -753.4428986025529,
          width: 689.7101368332051,
          height: 689.7101368332051
        },
        {
          url: "https://i.pinimg.com/736x/61/bf/86/61bf86d90d2b097fc9e84e9ae8ccbf39.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752595618461",
          x: 1320.7251218277947,
          y: 449.87610508101477,
          width: 457.6106483145196,
          height: 323.1291516669873
        },
        {
          url: "https://i.pinimg.com/736x/e7/32/b4/e732b4f3c149fa25bd16fb7cb4c93dc4.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752595554977",
          x: 461.8987985042745,
          y: 304.7676839807509,
          width: 811.1484621716021,
          height: 811.1484621716021
        },
        {
          url: "https://i.pinimg.com/736x/0d/57/12/0d57125b2d4647b5fdc1db93f4bde8ce.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752595524701",
          x: 401.1022841437423,
          y: -93.50921768688511,
          width: 409.8119981649608,
          height: 405.9143297041528
        },
        {
          url: "https://i.pinimg.com/736x/3b/07/f6/3b07f6c3f0ec87e113a7910ecc1bde9f.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752595500388",
          x: 1426.0679459757623,
          y: 78.34458126290164
        },
        {
          url: "https://i.pinimg.com/1200x/39/a3/03/39a30387bf634804de0c8dbf0b05a125.jpg",
          title: "",
          notes: "",
          tags: ["cutout"],
          colors: ["Green", "Red"],
          id: "img-1752595479354",
          x: 902.4078831739363,
          y: -332.38555107123165,
          width: 455.41810303391446,
          height: 569.272628792393
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
    },
    {
      id: "board-1752595943587",
      name: "Graphic Design",
      images: [
        {
          url: "https://i.pinimg.com/736x/2f/2c/18/2f2c18b99d8c0ec8c0b227cdc90d22e6.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752596991181",
          x: 100,
          y: 100
        }
      ],
      viewSettings: {
        viewMode: "moodboard",
        gridColumns: 4,
        listShowCover: true,
        listShowTitle: true,
        listShowNotes: true,
        listShowTags: true,
        listCoverPosition: "left",
        backgroundPattern: "none"
      }
    },
    {
      id: "board-1752598810595",
      name: "Typography",
      images: [
        {
          url: "https://i.pinimg.com/1200x/b8/cd/db/b8cddbb8d54ca2fc5e010d22ccb0db1e.jpg",
          title: "",
          notes: "",
          tags: [],
          colors: [],
          id: "img-1752599012523",
          x: 100,
          y: 100
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
    },
    {
      id: "board-1752638780517",
      name: "Board 4",
      images: [],
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
  activeBoardId: "board-1752595471219"
};

