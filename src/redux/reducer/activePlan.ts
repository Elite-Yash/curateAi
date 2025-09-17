import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the active plan state
export interface ActivePlanState {
  activePlanValue: boolean;
}

// Initial state
const initialState: ActivePlanState = {
  activePlanValue: false, // default value
};

// Create a slice for active plan
const activePlanSlice = createSlice({
  name: "activePlan",
  initialState,
  reducers: {
    // Set the active plan value
    setActivePlan: (state, action: PayloadAction<boolean>) => {
      state.activePlanValue = action.payload;
    },
    // Clear the active plan value (reset to false)
    clearActivePlan: (state) => {
      state.activePlanValue = false;
    },
  },
});

// Export the action creators
export const { setActivePlan, clearActivePlan } = activePlanSlice.actions;

// Export the reducer
export default activePlanSlice.reducer;
