<template>
  <div class="p-8 bg-yin">
    <div v-for="{ query, queryHash } of queries" :key="queryHash" class="flex p-2">
      <div class="w-1/2 p-4">
        <div v-if="series[queryHash]" id="chart">
          <div class="toolbar">
            <button
              id="one_month"
              :class="{active: selection==='one_month'}"
              @click="updateData('one_month')"
            >
              1M
            </button>

            <button
              id="six_months"
              :class="{active: selection==='six_months'}"
              @click="updateData('six_months')"
            >
              6M
            </button>

            <button
              id="one_year"

              :class="{active: selection==='one_year'}"
              @click="updateData('one_year')"
            >
              1Y
            </button>

            <button
              id="ytd"
              :class="{active: selection==='ytd'}"
              @click="updateData('ytd')"
            >
              YTD
            </button>

            <button
              id="all"
              :class="{active: selection==='all'}"
              @click="updateData('all')"
            >
              ALL
            </button>
          </div>

          <div id="chart-timeline">
            <apexchart ref="chart" type="area" height="350" :options="chartOptions" :series="series[queryHash]" />
          </div>
        </div>
      </div>
      <div class="w-1/2 p-4">
        <!-- {{ queryHash }} -->
        <highlightjs autodetect :code="query" />
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import Vue from 'vue';

import sqlFormatter from 'sql-formatter';
import 'highlight.js/styles/default.css';
Vue.use(VueApexCharts);
Vue.component('Apexchart', VueApexCharts);

const queriesDisplayCount = 30;

export default {
  async asyncData ({ $axios }) {
    const { data } = await $axios({
      url: `http://localhost:12000/postgres/most-invoked-queries?limit=${queriesDisplayCount}`,
    });

    const queries = data.map(({ query, ...rest }) => ({
      query: `${sqlFormatter.format(query)};`,
      ...rest,
    }));

    return {
      queries,
    };
  },
  data () {
    return {
      selection: 'one_year',
      series: {},
      chartOptions: {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          min: new Date(),
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: 'HH:mm',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },

    };
  },
  mounted () {
    this.queries.forEach(async ({ query, queryHash }) => {
      const { data } = await this.$axios({
        url: `http://localhost:12000/data?queryHash=${queryHash}&limit=500`,
      });

      const dataArray = [];
      data.forEach((d) => {
        dataArray.push([new Date(d.date).getTime(), d.callCountSinceLast]);
      });

      this.series[queryHash] = [{ data: dataArray }];
      this.series = { ...this.series };
    });
  },
  methods: {
    sql: sqlFormatter.format,

    updateData (timeline) {
      this.selection = timeline;

      switch (timeline) {
        case 'one_month':
          this.$refs.chart.zoomX(
            new Date('28 Jan 2013').getTime(),
            new Date('27 Feb 2013').getTime(),
          );
          break;
        case 'six_months':
          this.$refs.chart.zoomX(
            new Date('27 Sep 2012').getTime(),
            new Date('27 Feb 2013').getTime(),
          );
          break;
        case 'one_year':
          this.$refs.chart.zoomX(
            new Date('27 Feb 2012').getTime(),
            new Date('27 Feb 2013').getTime(),
          );
          break;
        case 'ytd':
          this.$refs.chart.zoomX(
            new Date('01 Jan 2013').getTime(),
            new Date('27 Feb 2013').getTime(),
          );
          break;
        case 'all':
          this.$refs.chart.zoomX(
            new Date('23 Jan 2012').getTime(),
            new Date('27 Feb 2013').getTime(),
          );
          break;
        default:
      }
    },
  },
};
</script>

<style>
.hljs {
  font-size: 14px;
}
</style>
