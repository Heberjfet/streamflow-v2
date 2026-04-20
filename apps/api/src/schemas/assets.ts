export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      name: { type: 'string', minLength: 1 }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        name: { type: 'string' }
      }
    }
  }
};

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    }
  }
};

export const assetListSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', default: 1 },
      limit: { type: 'integer', default: 20 },
      categoryId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: { type: 'array' },
        total: { type: 'integer' },
        page: { type: 'integer' },
        limit: { type: 'integer' }
      }
    }
  }
};

export const createAssetSchema = {
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      categoryId: { type: 'string' }
    }
  }
};

export const uploadUrlSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  body: {
    type: 'object',
    required: ['filename', 'contentType'],
    properties: {
      filename: { type: 'string' },
      contentType: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        uploadUrl: { type: 'string' },
        key: { type: 'string' }
      }
    }
  }
};

export const processAssetSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        jobId: { type: 'string' }
      }
    }
  }
};

export const playbackSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        manifestUrl: { type: 'string' },
        thumbnailUrl: { type: 'string' }
      }
    }
  }
};

export const publicPlaybackSchema = {
  params: {
    type: 'object',
    required: ['playbackId'],
    properties: {
      playbackId: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        manifestUrl: { type: 'string' },
        thumbnailUrl: { type: 'string' }
      }
    }
  }
};
