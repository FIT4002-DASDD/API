// {
//         "page": 0,
//         "per_page": 30,
//         "page_count": 30,
//         "total_count": 137303,
//         "links": {
//             "self": "/google/ads?offset=0&limit=30",
//             "next": "/google/ads?offset=30&limit=30",
//             "previous": "/google/ads?offset=0&limit=30",
//             "first": "/google/ads?offset=0&limit=30",
//             "last": "/google/ads?offset=137280&limit=30"
//         }

export const paginationMetadataDef = {
  type: "object",
  properties: {
    page: {
      type: "integer",
    },
    per_page: {
      type: "integer",
    },
    page_count: {
      type: "integer",
    },
    total_count: {
      type: "integer",
    },
    links: {
      type: "object",
      properties: {
        self: {
          type: "string",
        },
        next: {
          type: "string",
        },
        previous: {
          type: "string",
        },
        first: {
          type: "string",
        },
        last: {
          type: "string",
        },
      },
    },
  },
};
