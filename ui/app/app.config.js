angular
  .module('SwimResultinator')
  .constant('Config', {
    meet_types: ["Level 1", "Level 2", "Level 3", "Level 4"],
    lanes: ["6", "8", "10"],
    genders: {
      "B": "Boys",
      "G": "Girls",
      "M": "Men",
      "W": "Women"
    },
    meet_age_types: [
      {name: "Age on entry", code: "AOE"},
      {name: "Age on meet date", code: "AMD"},
      {name: "Age on 31st December", code: "AOD"}
    ],
    strokes: {
      "FS": {name: "Freestyle", code: "FS", distances: {
          "SC": {1:"25m", 2:"50m", 4:"100m", 8:"200m", 16:"400m", 32:"800m", 60:"1500m"},
          "LC": {1:"50m", 2:"100m", 4:"200m", 8:"400m", 16:"800m", 30:"1500m"}
        }
      },
      "BS": {name: "Backstroke", code: "BS", distances: {
          "SC": {1:"25m", 2:"50m", 4:"100m", 8:"200m"},
          "LC": {1:"50m", 2:"100m", 4:"200m"}
        }
      },
      "BR": {name: "Breastroke", code: "BR", distances: {
          "SC": {1:"25m", 2:"50m", 4:"100m", 8:"200m"},
          "LC": {1:"50m", 2:"100m", 4:"200m"}
        }
      },
      "BF": {name: "Butterfly", code: "BF", distances: {
          "SC": {1:"25m", 2:"50m", 4:"100m", 8:"200m"},
          "LC": {1:"50m", 2:"100m", 4:"200m"}
        }
      },
      "IM": {name: "Individual medley", code: "IM", distances: {
          "SC": {4:"100m", 8:"200m", 16:"400m"},
          "LC": {4:"200m", 8:"400m"}
        }
      },
      "MR": {name: "Medley relay", code: "MR", distances: {
          "SC": {4:"4x25m", 8:"4x50m", 16:"4x100m"},
          "LC": {4:"4x50m", 8:"4x100m"}
        }
      },
      "FR": {name: "Freestyle relay", code: "FR", distances: {
          "SC": {4:"4x25m", 8:"4x50m", 16:"4x100m"},
          "LC": {4:"4x50m", 8:"4x100m"}
        }
      },
    },
    event_types: [
      {name: "Heat declared winner", code: "HDW"},
      {name: "Final decides winner", code: "FDW"}
    ],
    course_types: [
      {name: "Short course (25m)", code: "SC"},
      {name: "Long course (50m)", code: "LC"}
    ],
  });
