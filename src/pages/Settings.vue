<template>
  <div class="flat-card" style="margin-bottom: 10px">
    <div class="card-content">
      <section class="section">
        <p class="is-size-3 dynamic-title">Night Mode</p>
        <br />
        <br />
        <!-- <input type="checkbox" class="theme-switch" v-model="darkMode" /> -->
        <b-icon
          :icon="darkMode? 'moon-waxing-crescent':'white-balance-sunny'"
          :type="darkMode? 'is-grey-lighter': 'is-warning'"
          class="bulb animation-trans"
          style="padding-left: 5rem"
        />

        <br />
        <br />
        <br />

        <b-switch class="dynamic-subtitle" v-model="darkMode">{{ darkMode? 'ON': 'OFF' }}</b-switch>
        <br />
        <br />
        <!-- Language -->
        <!-- <b-field :label="$t('langLabel')"> -->

        <!-- <p>{{ $t('langLabel') }}:</p> -->
        <!-- <div class="buttons">
          <b-button
            v-for="entry in languages"
            :key="entry.title"
            :type="lang == entry.language?'is-primary': ''"
            @click="changeLocale(entry.language)"
          > -->
            <!-- <flag :iso="entry.flag" v-bind:squared="false" /> -->
            <!-- {{entry.title}}
          </b-button>
        </div> -->
        <!-- </b-field> -->
      </section>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import i18n from "../translate.js";
export default {
  data() {
    return {
      darkMode: false,
      lang: "en",
      languages: [
        { flag: "us", language: "en", title: "English" },
        { flag: "id", language: "id", title: "Bahasa Indonesia" }
      ]
    };
  },
  methods: {
    changeLocale(locale) {
      i18n.locale = locale;
      this.lang = locale
      localStorage.setItem("lang", locale);
    }
  },
  mounted() {
    this.lang = localStorage.getItem("lang");

    // check for active theme
    let htmlElement = document.documentElement;
    let theme = localStorage.getItem("theme");

    if (theme === "dark") {
      htmlElement.setAttribute("theme", "dark");
      this.darkMode = true;
    } else {
      htmlElement.setAttribute("theme", "light");
      this.darkMode = false;
    }
  },
  watch: {
    darkMode: function() {
      // add/remove class to/from html tag
      let htmlElement = document.documentElement;

      if (this.darkMode) {
        localStorage.setItem("theme", "dark");
        htmlElement.setAttribute("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
        htmlElement.setAttribute("theme", "light");
      }
    }
  },
  computed: {
    // ...mapState({
    //   darkMode: state => state.darkMode
    // })
  }
};
</script>
<style lang="scss">
.animation-trans{
  -moz-transition: all 0.4s ease-in;
  -o-transition: all 0.4s ease-in;
  -webkit-transition: all 0.4s ease-in;
  transition: all 0.4s ease-in;
}
</style>