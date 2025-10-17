/**
 * Swagger/OpenAPI Configuration
 * API documentation using OpenAPI 3.0 specification
 * 
 * @module config/swagger
 */

const swaggerJsdoc = require('swagger-jsdoc');
const { getConfig } = require('./appConfig');

const config = getConfig();

/**
 * Swagger definition
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'YoohooGuru API',
    version: config.apiVersion || '1.0.0',
    description: 'API documentation for the yoohoo.guru skill-sharing platform',
    contact: {
      name: 'YoohooGuru Support',
      url: 'https://yoohoo.guru',
      email: 'support@yoohoo.guru'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: config.nodeEnv === 'production' 
        ? 'https://api.yoohoo.guru' 
        : 'http://localhost:3001',
      description: config.nodeEnv === 'production' 
        ? 'Production server' 
        : 'Development server'
    },
    {
      url: 'https://api.yoohoo.guru/api/v1',
      description: 'Production API v1'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Firebase JWT token'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'session',
        description: 'Session cookie authentication'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'An error occurred'
              },
              details: {
                type: 'array',
                items: {
                  type: 'object'
                }
              }
            }
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          displayName: {
            type: 'string',
            description: 'User display name'
          },
          photoURL: {
            type: 'string',
            format: 'uri',
            description: 'User profile photo URL'
          },
          tier: {
            type: 'string',
            enum: ['free', 'premium', 'enterprise'],
            description: 'User subscription tier'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp'
          }
        }
      },
      Skill: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Skill ID'
          },
          title: {
            type: 'string',
            description: 'Skill title'
          },
          description: {
            type: 'string',
            description: 'Skill description'
          },
          category: {
            type: 'string',
            description: 'Skill category'
          },
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            description: 'Skill proficiency level'
          },
          userId: {
            type: 'string',
            description: 'User ID who created the skill'
          }
        }
      },
      HealthCheck: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'OK'
          },
          timestamp: {
            type: 'string',
            format: 'date-time'
          },
          uptime: {
            type: 'object',
            properties: {
              seconds: {
                type: 'number'
              },
              formatted: {
                type: 'string'
              }
            }
          },
          environment: {
            type: 'string'
          },
          version: {
            type: 'string'
          },
          services: {
            type: 'object'
          }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication required',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              error: {
                message: 'Authentication required'
              }
            }
          }
        }
      },
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              error: {
                message: 'Validation failed',
                details: [
                  {
                    field: 'email',
                    message: 'Must be a valid email address'
                  }
                ]
              }
            }
          }
        }
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Health',
      description: 'System health and status endpoints'
    },
    {
      name: 'Authentication',
      description: 'User authentication and authorization'
    },
    {
      name: 'Users',
      description: 'User management endpoints'
    },
    {
      name: 'Skills',
      description: 'Skill management and exchange'
    },
    {
      name: 'Gurus',
      description: 'Guru/subdomain content endpoints'
    },
    {
      name: 'Admin',
      description: 'Administrative endpoints (requires admin authentication)'
    }
  ]
};

/**
 * Swagger JSDoc options
 */
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/routes/v1/*.js',
    './src/index.js'
  ]
};

/**
 * Generate Swagger specification
 */
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec, swaggerOptions };
