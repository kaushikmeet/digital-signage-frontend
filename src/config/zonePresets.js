export const ZONE_PRESETS = [
  {
    id: "fullscreen",
    name: "Fullscreen",
    zones: [
      {
        name: "Main",
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        zIndex: 1
      }
    ]
  },

  {
    id: "video-sidebar",
    name: "Video + Sidebar",
    zones: [
      {
        name: "Main Video",
        x: 0,
        y: 0,
        w: 0.7,
        h: 1,
        zIndex: 1
      },
      {
        name: "Sidebar",
        x: 0.7,
        y: 0,
        w: 0.3,
        h: 1,
        zIndex: 2
      }
    ]
  },

  {
    id: "header-footer",
    name: "Header + Content + Footer",
    zones: [
      {
        name: "Header",
        x: 0,
        y: 0,
        w: 1,
        h: 0.15,
        zIndex: 3
      },
      {
        name: "Content",
        x: 0,
        y: 0.15,
        w: 1,
        h: 0.7,
        zIndex: 2
      },
      {
        name: "Footer",
        x: 0,
        y: 0.85,
        w: 1,
        h: 0.15,
        zIndex: 3
      }
    ]
  }
];
