import * as React from "react";
import {
  ApparelConfig,
  FoodConfig,
  HolidayConfig,
  StagingConfig,
  DEFAULT_APPAREL_CONFIG,
  DEFAULT_FOOD_CONFIG,
  DEFAULT_HOLIDAY_CONFIG,
  DEFAULT_STAGING_CONFIG,
  WorkflowType,
} from "@/types/workflow";

interface WorkflowOptionsState {
  apparel: ApparelConfig;
  food: FoodConfig;
  holiday: HolidayConfig;
  staging: StagingConfig;
}

interface WorkflowOptionsContextType extends WorkflowOptionsState {
  updateApparel: (updates: Partial<ApparelConfig>) => void;
  updateFood: (updates: Partial<FoodConfig>) => void;
  updateHoliday: (updates: Partial<HolidayConfig>) => void;
  updateStaging: (updates: Partial<StagingConfig>) => void;
  getConfigForWorkflow: (workflowType: WorkflowType) => ApparelConfig | FoodConfig | HolidayConfig | StagingConfig;
}

const WorkflowOptionsContext = React.createContext<WorkflowOptionsContextType | undefined>(undefined);

export function WorkflowOptionsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<WorkflowOptionsState>({
    apparel: DEFAULT_APPAREL_CONFIG,
    food: DEFAULT_FOOD_CONFIG,
    holiday: DEFAULT_HOLIDAY_CONFIG,
    staging: DEFAULT_STAGING_CONFIG,
  });

  const updateApparel = React.useCallback((updates: Partial<ApparelConfig>) => {
    setState((prev) => ({
      ...prev,
      apparel: { ...prev.apparel, ...updates },
    }));
  }, []);

  const updateFood = React.useCallback((updates: Partial<FoodConfig>) => {
    setState((prev) => ({
      ...prev,
      food: { ...prev.food, ...updates },
    }));
  }, []);

  const updateHoliday = React.useCallback((updates: Partial<HolidayConfig>) => {
    setState((prev) => ({
      ...prev,
      holiday: { ...prev.holiday, ...updates },
    }));
  }, []);

  const updateStaging = React.useCallback((updates: Partial<StagingConfig>) => {
    setState((prev) => ({
      ...prev,
      staging: { ...prev.staging, ...updates },
    }));
  }, []);

  const getConfigForWorkflow = React.useCallback(
    (workflowType: WorkflowType) => {
      switch (workflowType) {
        case "apparel":
          return state.apparel;
        case "food":
          return state.food;
        case "holiday":
          return state.holiday;
        case "staging":
          return state.staging;
      }
    },
    [state],
  );

  const value = React.useMemo(
    () => ({
      ...state,
      updateApparel,
      updateFood,
      updateHoliday,
      updateStaging,
      getConfigForWorkflow,
    }),
    [state, updateApparel, updateFood, updateHoliday, updateStaging, getConfigForWorkflow],
  );

  return <WorkflowOptionsContext.Provider value={value}>{children}</WorkflowOptionsContext.Provider>;
}

export function useWorkflowOptions() {
  const context = React.useContext(WorkflowOptionsContext);
  if (context === undefined) {
    throw new Error("useWorkflowOptions must be used within a WorkflowOptionsProvider");
  }
  return context;
}
