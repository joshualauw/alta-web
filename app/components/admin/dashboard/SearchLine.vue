<template>
  <ClientOnly>
    <VCard>
      <VCardHeader>
        <VCardTitle>Searches Distribution This Week</VCardTitle>
        <VCardDescription>{{
          `${dayjs().startOf("week").format("D MMMM")} - ${dayjs().endOf("week").format("D MMMM")}`
        }}</VCardDescription>
      </VCardHeader>
      <VCardContent>
        <VChartContainer :config="chartConfig" class="max-h-64">
          <VisXYContainer :data="chartData" :y-domain="[0, undefined]">
            <VisLine
              :x="(d: Data) => d.index"
              :y="(d: Data) => d.count"
              :color="chartConfig.count.color"
              :curve-type="CurveType.Linear"
            />
            <VisAxis
              type="x"
              :x="(d: Data) => d.index"
              :tick-line="false"
              :domain-line="false"
              :grid-line="false"
              :num-ticks="6"
              :tick-format="(idx: number) => dayjs(chartData[idx]?.date).format('YYYY-MM-DD')"
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
import { CurveType } from "@unovis/ts";
import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
import { ChartTooltipContent, componentToString } from "@/components/ui/chart";
import dayjs from "dayjs";

const props = defineProps<{
  data: {
    date: string;
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
