import { Schema, model, Types } from 'mongoose';

/*
  FIX: Switched to destructuring imports (Schema, model, Types) to resolve 
  the 'TypeError: Cannot read properties of undefined (reading 'ObjectId')' 
  issue in the test environment (ESM/Jest).
*/

const ApiKeySchema = new Schema(
  {
    // The 'app' field references the App model using ObjectId
    app: {
      type: Types.ObjectId, // FIXED: Now uses the imported 'Types.ObjectId'
      ref: "App",
      required: true,
      index: true,
    },
    // The hashed value of the API key for secure storage
    keyHash: {
      type: String,
      required: true,
      unique: true,
      index: true, // Improve lookup speed
    },
    // A user-defined label for the key (e.g., "Production Key", "Dev Test Key")
    label: { 
      type: String, 
      default: "Default API Key" 
    },
    // Status flag: true if the key has been manually revoked
    revoked: { 
      type: Boolean, 
      default: false,
      index: true, // Allow filtering out revoked keys easily
    },
    // Optional expiration date for the key
    expiresAt: { 
      type: Date, 
      default: null 
    },
  },
  { 
    // Enable timestamps for automatic 'createdAt' and 'updatedAt' fields
    timestamps: true,
    collection: 'apiKeys'
  }
);

// Export the model, which will create the 'apiKeys' collection in MongoDB
export default model("ApiKey", ApiKeySchema);