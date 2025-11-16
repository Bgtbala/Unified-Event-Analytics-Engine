// src/swagger/swaggerSpec.js

import dotenv from "dotenv";
dotenv.config();

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Website Analytics API",
    version: "1.0.0",
    description:
      "A scalable analytics collection and reporting API that provides event collection, reporting, caching, and API key-based authentication.",
  },

  servers: [
    {
      url: process.env.SWAGGER_BASE_URL || "http://localhost:8000",
      description: "Local Server",
    },
  ],

  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
      },
    },

    schemas: {
      RegisterAppRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "My Website" },
          domain: { type: "string", example: "https://example.com" },
        },
      },

      RegisterAppResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "App registered successfully" },
          data: {
            type: "object",
            properties: {
              appId: { type: "string", example: "674adfbc8923a923a9ad12c3" },
              apiKey: { type: "string", example: "9a77bc0e1234123f..." },
            },
          },
        },
      },

      EventCollectRequest: {
        type: "object",
        required: ["event"],
        properties: {
          event: { type: "string", example: "login_button_click" },
          url: { type: "string", example: "https://example.com/login" },
          referrer: { type: "string", example: "https://google.com" },
          device: { type: "string", example: "mobile" },
          userId: { type: "string", example: "user_123" },
          ipAddress: { type: "string", example: "192.168.1.10" },
          timestamp: {
            type: "string",
            format: "date-time",
            example: "2024-02-20T12:34:56Z",
          },
          metadata: {
            type: "object",
            example: {
              browser: "Chrome",
              os: "Windows",
              screenSize: "1920x1080",
            },
          },
        },
      },

      EventSummaryResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              event: { type: "string", example: "login_button_click" },
              count: { type: "number", example: 3400 },
              uniqueUsers: { type: "number", example: 1200 },
              deviceData: {
                type: "object",
                properties: {
                  mobile: { type: "number", example: 2200 },
                  desktop: { type: "number", example: 1200 },
                },
              },
            },
          },
        },
      },

      UserStatsResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              userId: { type: "string", example: "user789" },
              totalEvents: { type: "number", example: 150 },
              lastEvent: {
                type: "string",
                format: "date-time",
              },
              device: {
                type: "array",
                items: { type: "string" },
              },
              browser: {
                type: "array",
                items: { type: "string" },
              },
              ipAddress: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },

  security: [{ ApiKeyAuth: [] }],

  paths: {
    // ---------------------------------------------------------------
    // AUTH ROUTES
    // ---------------------------------------------------------------
    "/api/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new app and generate API key",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterAppRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "App registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterAppResponse" },
              },
            },
          },
        },
      },
    },

    "/api/auth/regenerate": {
      post: {
        tags: ["Authentication"],
        summary: "Regenerate an API key for an app",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { appId: { type: "string" } },
              },
            },
          },
        },
        responses: {
          200: { description: "New API key generated" },
        },
      },
    },

    "/api/auth/revoke": {
      post: {
        tags: ["Authentication"],
        summary: "Revoke an existing API key",
        responses: {
          200: { description: "API key revoked" },
        },
      },
    },

    // ---------------------------------------------------------------
    // ANALYTICS ROUTES
    // ---------------------------------------------------------------

    "/api/analytics/collect": {
      post: {
        tags: ["Analytics"],
        summary: "Submit analytics events",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EventCollectRequest" },
            },
          },
        },
        responses: {
          201: { description: "Events collected successfully" },
        },
      },
    },

    "/api/analytics/event-summary": {
      get: {
        tags: ["Analytics"],
        summary: "Get event-based aggregated analytics",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "event", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string" } },
          { name: "endDate", in: "query", schema: { type: "string" } },
          { name: "app_id", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Analytics summary",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EventSummaryResponse" },
              },
            },
          },
        },
      },
    },

    "/api/analytics/user-stats": {
      get: {
        tags: ["Analytics"],
        summary: "Get analytics related to a specific user",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          { name: "userId", in: "query", required: true, schema: { type: "string" } },
          { name: "app_id", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "User analytics data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserStatsResponse" },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerSpec;
