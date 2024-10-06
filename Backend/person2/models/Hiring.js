import mongoose from 'mongoose';

const hiringSchema = new mongoose.Schema(
  {
    ProjectOwnerId: {
      type: String,
      ref: 'User',
      required: true,
    },
    ContributerId: {
      type: String,
      ref: 'User',
      required: true,
    },
    ProjectOwnerDetails: {
      type: Array,
      required: true,
    },
    ContributerDetails: {
      type: Array,
      required: true,
    },
    hiringState: {
      type: String,
      // enum: ['Accept', 'Reject'],
      default: 'Accept',
    },
  },
  {
    timestamps: true, 
  }
);

const hireModel = mongoose.model.Hiring || mongoose.model('Hiring', hiringSchema);

export default hireModel
