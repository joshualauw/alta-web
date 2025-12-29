<template>
  <ClientOnly>
    <VCard>
      <VCardHeader>
        <VCardTitle>Top Searched Source This Month</VCardTitle>
        <VCardDescription>{{ dayjs().format("MMMM YYYY") }}</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <VChartContainer :config="chartConfig" class="max-h-64">
          <VisXYContainer :data="chartData" :y-domain="[0, undefined]">
            <VisGroupedBar
              :x="(d: Data) => d.index"
              :y="(d: Data) => d.count"
              :color="chartConfig.count.color"
              :rounded-corners="10"
            />
            <VisAxis
              type="x"
              :x="(d: Data) => d.index"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="6"
              :tick-format="(idx: number) => chartData[idx]?.name"
              :tick-values="chartData.map((d) => d.index)"
            />
            <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
            <VChartTooltip />
            <VChartCrosshair
              :template="componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })"
              :color="chartConfig.count.color"
            />
          </VisXYContainer>
        </VChartContainer>
      </VCardContent>
    </VCard>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { ChartConfig } from "@/components/ui/chart";
import { VisAxis, VisGroupedBar, VisXYContainer } from "@unovis/vue";
import { componentToString, ChartTooltipContent } from "@/components/ui/chart";
import dayjs from "dayjs";

const props = defineProps<{
  data: {
    id: number;
    name: string;
    count: number;
  }[];
}>();

const chartData = [
  ...props.data.map((d, i) => ({
    ...d,
    index: i,
  })),
];

type Data = (typeof chartData)[number];

const chartConfig = {
  count: {
    label: "Count",
    color: "#14589c",
  },
} satisfies ChartConfig;
</script>
