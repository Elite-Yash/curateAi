import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ActivePlanState } from "../reducer/activePlan";

// Selector to get the activePlan slice from the root state
const selectActivePlanState = (state: RootState): ActivePlanState => state.activePlan;

/**
 * Selector to get the activePlanValue from the activePlan state.
 * @returns boolean value of activePlanValue
 */
export const selectActivePlanValue = createSelector(
  selectActivePlanState,
  (activePlanState: ActivePlanState) => activePlanState.activePlanValue
);
