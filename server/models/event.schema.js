import { mongoose, Schema } from "mongoose";

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        bannerImage: {
            type: String,
            default:"https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&auto=format&fit=crop&q=60",
            
        },

        bannerImagePublicId: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["OFFLINE", "ONLINE"],
            default: "OFFLINE",
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        // OFFLINE EVENT LOCATION

        location: {
            type: String,
            trim: true,

            required: function () {
                return this.type === "OFFLINE";
            }
        },

        city: {
            type: String,
            trim: true,

            required: function () {
                return this.type === "OFFLINE";
            }
        },

        coordinates: {

            lat: {
                type: Number,
            },

            lng: {
                type: Number,
            }
        },

        platform: {
            type: String,
            default : null
        },
        meetingLink: {
            type: String,
            trim: true,
            default :""
        },
        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        ticketSold: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "PUBLISHED",
                "SOLD_OUT",
                "COMPLETED"
            ],
            default: "PUBLISHED"
        },

        organiserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            immutable: true
        },

        tags: [
            {
                type: String,
                trim: true
            }
        ],

        isFeatured: {
            type: Boolean,
            default: false
        },

        refundPolicy: {
            type: String,
            default: ""
        },

        ageRestriction: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("Event", eventSchema);

export { Event };