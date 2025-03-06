import mongoose from "mongoose";

const lostFoundItemSchema = new mongoose.Schema(
  {
    reporterName: {
      type: String,
      required: true,
    },
    reporterId: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    itemName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "electronics",
        "documents",
        "jewelry",
        "accessories",
        "clothing",
        "other",
      ],
      default: "other",
    },
    description: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    imageUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text search index
lostFoundItemSchema.index(
  {
    itemName: "text",
    description: "text",
    location: "text",
    reporterName: "text",
  },
  {
    weights: {
      itemName: 10,
      description: 5,
      location: 3,
      reporterName: 1,
    },
  }
);

// Add method to check if item is resolved
lostFoundItemSchema.methods.isResolved = function () {
  return this.status === "resolved";
};

const LostFoundItem = mongoose.model("LostFoundItem", lostFoundItemSchema);
export default LostFoundItem;
