import * as React from "react";
import { useWorkflowOptions } from "./WorkflowOptionsContext";
import { ApparelOptions } from "./ApparelOptions";
import { FoodOptions } from "./FoodOptions";
import { HolidayOptions } from "./HolidayOptions";
import { StagingOptions } from "./StagingOptions";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Shirt, Utensils, Gift, Camera } from "lucide-react";

interface WorkflowOptionTab {
  value: "apparel" | "food" | "holiday" | "staging";
  label: string;
  icon: React.ElementType;
}

const OPTION_TABS: WorkflowOptionTab[] = [
  { value: "apparel", label: "Apparel", icon: Shirt },
  { value: "food", label: "Food", icon: Utensils },
  { value: "holiday", label: "Holiday", icon: Gift },
  { value: "staging", label: "Staging", icon: Camera },
];

export function WorkflowOptions() {
  const { workflowType } = useWorkflowOptions();

  return (
    <div className="w-full">
      <Tabs defaultValue={workflowType} className="w-full">
        <div className="flex space-x-2 border-b">
          {OPTION_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => {}}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  workflowType === tab.value
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <TabsContent value="apparel" className="mt-0">
            <ApparelOptions />
          </TabsContent>
          <TabsContent value="food" className="mt-0">
            <FoodOptions />
          </TabsContent>
          <TabsContent value="holiday" className="mt-0">
            <HolidayOptions />
          </TabsContent>
          <TabsContent value="staging" className="mt-0">
            <StagingOptions />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
