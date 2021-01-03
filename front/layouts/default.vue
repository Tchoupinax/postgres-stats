<template>
  <div class="flex flex-col h-screen dark:text-yang">
    <nav class="flex items-center justify-between p-4 px-8 bg-yin">
      <h1 class="mx-4 text-xl font-bold">
        Postgres stats
      </h1>

      <div class="theme-switch-wrapper">
        <label class="theme-switch" for="checkbox">
          <input id="checkbox" v-model="darkMode" type="checkbox" @change="updateTheme">
          <div class="slider round" />
        </label>
        <em class="ml-3">Dark mode</em>
      </div>
    </nav>

    <div class="flex px-6 pl-16 border-t-2 border-gray-300 bg-yin">
      <nuxt-link
        to="/"
        class="px-2 py-6 mr-8 font-bold border-yang"
        :class="{ 'border-b-4' : $route.path === '/' }"
      >
        Home
      </nuxt-link>

      <nuxt-link
        to="/diagnose"
        class="px-2 py-6 mr-8 font-bold border-yang"
        :class="{ 'border-b-4' : $route.path === '/diagnose' }"
      >
        Diagnose
      </nuxt-link>
    </div>

    <Nuxt class="flex-1" />

    <footer class="bottom-0 flex items-center justify-between p-4 bg-yin">
      <h1 class="mt-8 mb-2 ml-4 font-bold">
        Made with madness 🦄
      </h1>
    </footer>
  </div>
</template>

<script>
import darkModeEvent from '../pages/dark-mode-event';

export default {
  data () {
    return {
      darkMode: false,
    };
  },
  mounted () {
    this.darkMode = localStorage.theme === 'dark';
    if (this.darkMode) {
      document.querySelector('html').classList.add('dark');
    } else {
      document.querySelector('html').classList.remove('dark');
    }
  },
  methods: {
    updateTheme () {
      darkModeEvent.$emit('toggle', this.darkMode ? 'dark' : 'light');
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
      if (this.darkMode) {
        document.querySelector('html').classList.add('dark');
      } else {
        document.querySelector('html').classList.remove('dark');
      }
    },
  },
};
</script>

<style>
html,
body,
#__layout {
  @apply h-screen;
}

/*slider switch css */
.theme-switch-wrapper {
  display: flex;
  align-items: center;

  em {
    margin-left: 10px;
    font-size: 1rem;
  }
}
.theme-switch {
  display: inline-block;
  height: 34px;
  position: relative;
  width: 60px;
}

.theme-switch input {
  display:none;
}

.slider {
  background-color: #ccc;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s;
}

.slider:before {
  background-color: #fff;
  bottom: 4px;
  content: "";
  height: 26px;
  left: 4px;
  position: absolute;
  transition: .4s;
  width: 26px;
}

input:checked + .slider {
  background-color: #66bb6a;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
