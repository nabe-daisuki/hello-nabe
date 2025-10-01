class MenuData {
  static _branch = [
    {
      num: 1,
      parts: [
        {
          text: "、",
          count: 0
        },
        {
          text: "は",
          count: 0
        },
        {
          text: "も",
          count: 0
        },
        {
          text: "のみ",
          count: 0
        },
        {
          text: "しか",
          count: 0
        }
      ]
    },
    {
      num: 2,
      parts: [
        {
          text: "、",
          count: 0
        }
      ]
    }
  ];
  
  static _data = [
    {
      keyword: "の",
      branch: [
        {
          text: "ため",
          count: 0,
          branch: [
            {
              text: "、",
              count: 0
            },
            {
              text: "に",
              count: 0
            }
          ]
        },
        {
          text: "場合",
          count: 0,
          branch: 1
        },
        {
          text: "中",
          count: 0,
          branch: [
            {
              text: "で",
              count: 0,
              branch: 1
            },
            {
              text: "に",
              count: 0,
              branch: 1
            }
          ]
        },
        {
          text: "ように",
          count: 0,
          branch: 1
        },
        {
          text: "ような",
          count: 0,
          branch: [
            {
              text: "場合",
              count: 0,
            },
            {
              text: "中",
              count: 0,
              branch: [
                {
                  text: "で",
                  count: 0,
                  branch: 1
                },
                {
                  text: "に",
                  count: 0,
                  branch: 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      keyword: "に",
      texts: [
        {
          text: "について",
          count: 0,
          branch: 1
        },
        {
          text: "により",
          count: 0,
          branch: 2
        }
      ]
    },
    {
      keyword: "で",
      texts: [
        {
          text: "であり",
          count: 0
        },
        {
          text: "であるが",
          count: 0
        },
        {
          text: "での",
          count: 0
        },
        {
          text: "であるため",
          count: 0
        }
      ]
    },
    {
      keyword: "と",
      texts: [
        {
          text: "となるため",
          count: 0
        },
        {
          text: "という場合",
          count: 0
        },
        {
          text: "という場合も",
          count: 0
        },
        {
          text: "としては",
          count: 0
        },
        {
          text: "としても",
          count: 0
        },
        {
          text: "との",
          count: 0
        }
      ]
    },
    {
      keyword: "さ",
      texts: [
        {
          text: "されている",
          count: 0
        },
        {
          text: "されているが",
          count: 0
        },
        {
          text: "される",
          count: 0
        },
        {
          text: "されるが",
          count: 0
        },
        {
          text: "され"
        }

      ]
    }
  ];

  static get(){
    return this._data;
  }
}