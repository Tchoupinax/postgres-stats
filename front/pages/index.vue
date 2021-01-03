<template>
  <div class="relative flex flex-col bg-yin">
    <button
      class="absolute top-0 right-0 flex justify-center px-4 py-2 mr-16 text-sm rounded-lg display bg-yang text-yin"
      @click="showGraph"
    >
      <span class="mr-3 text-lg">
        {{ blockShowGraphButtonText }}
      </span>

      <svg
        class="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    </button>

    <div class="flex flex-col w-full px-8 pt-8">
      <!-- Data blocks -->
      <div
        class="flex flex-wrap"
        :class="{
          'flex-col': blockShowGraph,
        }"
      >
        <div :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data">
              {{ activeConnections }}
            </p>

            <p class="text">
              actives connections
            </p>
          </div>

          <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series['activeConnections']"
          />
        </div>

        <div :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data">
              {{ getMaxAllowedConnections }}
            </p>

            <p class="text">
              allowed connections
            </p>
          </div>

          <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series['getMaxAllowedConnections']"
          />
        </div>

        <div v-if="!blockShowGraph" :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data">
              {{
                Math.floor((activeConnections / getMaxAllowedConnections) * 100)
              }}
              %
            </p>

            <p class="text little">
              allowed connections used
            </p>
          </div>

          <!-- <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series"
          /> -->
        </div>

        <div :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data littletitle">
              {{ getCacheHitRatio.toFixed(1) }} %
            </p>

            <p class="title text">
              cache hit ratio
            </p>
            <p class="text subtitle">
              ( good if >90% )
            </p>
          </div>

          <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series['getCacheHitRatio']"
          />
        </div>

        <!-- DATABASE SIZE -->
        <div :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data littletitle">
              {{ displayBigNumber(getDatabaseSize) }}
            </p>

            <p class="text">
              database size
            </p>
          </div>

          <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series['getDatabaseSize']"
          />
        </div>
        <!-- END # DATABASE SIZE -->

        <!-- Count of tables -->
        <div :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data">
              {{ getCountOfTables }}
            </p>

            <p class="text">
              tables created
            </p>
          </div>

          <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series['getCountOfTables']"
          />
        </div>
        <!-- END # Count of tables -->

        <!-- Total count of rows -->
        <div :class="{ 'block-graph': blockShowGraph }">
          <div class="block">
            <p class="data littletitle">
              {{ displayBigNumber(getTotalCountOfRows) }}
            </p>

            <p class="text">
              rows in the database
            </p>
          </div>

          <apexchart
            v-if="blockShowGraph"
            class="graph"
            type="line"
            height="350"
            :options="chartOptions"
            :series="series['getTotalCountOfRows']"
          />
        </div>
        <!-- END # Count of tables -->
      </div>
      <!-- END # Data blocks -->

      <!-- Data list -->
      <div class="flex flex-col items-center justify-center bg-pink-400">
        <div
          v-for="(table, index) of Object.keys(listUnusedIndexes)"
          :key="index"
          class="flex w-1/2 bg-yellow-100"
        >
          <div class="flex items-center justify-center w-1/2 p-3 font-bold">
            {{ table }}
          </div>

          <div class="w-1/2">
            <div
              v-for="indexName of listUnusedIndexes[table]"
              :key="indexName"
              class="flex flex-col"
            >
              {{ indexName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import Vue from 'vue';

import darkModeEvent from '../pages/dark-mode-event';

import 'highlight.js/styles/default.css';
Vue.use(VueApexCharts);
Vue.component('Apexchart', VueApexCharts);

const chartOptions = JSON.parse(JSON.stringify({
  theme: {
    mode: 'light',
    palette: 'palette3',
    monochrome: {
      enabled: false,
      color: '#255aee',
      shadeTo: 'light',
      shadeIntensity: 0.65,
    },
  },
  // tooltip: {
  //   theme: 'dark',
  // },
  // colors: ['#F44336', '#E91E63', '#9C27B0'],
  chart: {
    height: 200,
    type: 'line',
    zoom: {
      enabled: false,
    },
  },
  // dataLabels: {
  //   enabled: false,
  //   style: {
  //     colors: ['#F44336', '#E91E63', '#9C27B0'],
  //   },
  // },
  stroke: {
    curve: 'straight',
  },
  title: {
    text: 'Product Trends by Month',
    align: 'left',
  },
  // markers: {
  //   colors: ['#F44336', '#E91E63', '#9C27B0'],
  // },
  // grid: {
  //   row: {
  //     colors: ['beige', 'white'],
  //     opacity: 0.5,
  //   },
  // },
  xaxis: {
    categories: ['Jan', 'Feb'],
  },
}));

export default {
  async asyncData ({ $axios }) {
    const { data } = await $axios({
      url: 'http://localhost:12000/postgres/global-stats',
    });

    return {
      ...data,
    };
  },
  data () {
    return {
      darkMode: false,
      blockShowGraph: false,
      blockShowGraphButtonText: 'Display graphs',
      chartOptions,
      series: {
        activeConnections: [],
        getMaxAllowedConnections: [],
      },

    };
  },
  mounted () {
    darkModeEvent.$on('toggle', (mode) => {
      setTimeout(() => {
        this.darkMode = mode;
        const chartOptionsTmp = JSON.parse(JSON.stringify(chartOptions));
        chartOptionsTmp.theme.mode = mode;
        chartOptionsTmp.theme.monochrome.mode = mode;
        this.chartOptions = { ...chartOptionsTmp };
      }, 500);
    });

    const queries = [
      ['acb2c1d7286d284301fdaed9154b26e3b321455f020aa88c8904de611d91d4c3', 'activeConnections'],
      ['5191f078951827293f4362aed1f5cf4f6081f53524f47eaca381661742ccfb6d', 'getMaxAllowedConnections'],
      ['4d15e1b063d7338bce676a3e63a631580e845235d3336072066afd67f65ef88c', 'getCacheHitRatio'],
      ['43ad634a8be93a1cfb27a19e18237bedf92bd36be7dda6d46ec9dd90b1f31c59', 'getDatabaseSize'],
      ['69dd1de7dbdc051f8e9bd4b015f8f651f1823640e371b9562b8e7acc5b9e2e89', 'getCountOfTables'],
      ['5b621bda4c429ea5b7d2467d28e086380b0aa70e8c449ac97d8c3ade8a1926d7', 'getTotalCountOfRows'],
    ];

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];

      this.$axios({
        url: `http://localhost:12000/data?queryHash=${query[0]}&limit=50`,
      })
        .then(({ data }) => {
          this.$set(this.series, query[1], [{ name: query[1], data: data.map(v => v.value).map(parseFloat).reverse() }]);
        });
    }
  },
  methods: {
    displayBigNumber (n) {
      if (n === null || n === undefined) {
        return;
      }

      if (n > 1e9) {
        return `${(n / 1e9).toFixed(1)} G`;
      }

      if (n > 1e6) {
        return `${(n / 1e6).toFixed(1)} M`;
      }

      if (n > 1e3) {
        return `${(n / 1e3).toFixed(1)} K`;
      }

      return n;
    },
    showGraph () {
      if (!this.blockShowGraph) {
        this.blockShowGraphButtonText = 'Loading...';
        setTimeout(() => {
          this.blockShowGraph = !this.blockShowGraph;
          this.blockShowGraphButtonText = 'Hide graphs';
        }, 1);
      } else {
        this.blockShowGraphButtonText = 'Display graphs';
        this.blockShowGraph = !this.blockShowGraph;
      }
    },
  },
};
</script>

<style lang="scss">
.display {
  margin-top: -40px;
}

.hljs {
  font-size: 22px;
}

.block {
  @apply relative w-56 h-56 px-6 py-4 rounded-lg m-4;
  @apply shadow-md from-blue-200 to-blue-400 bg-gradient-to-br dark:from-yellow-400 dark:to-yellow-600;

  .data {
    @apply text-6xl font-bold text-white;

    &.littletitle {
      @apply text-5xl mt-1;
    }
  }

  .text {
    @apply absolute bottom-0 text-2xl font-bold text-white mb-4;

    &.title {
      @apply mb-10;
    }

    &.subtitle {
      @apply text-base;
    }

    &.little {
      @apply text-base;
    }
  }
}

.block-graph {
  @apply flex w-full justify-center items-center;

  .graph {
    @apply flex-1;
  }
}
</style>
