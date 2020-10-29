<template>
  <div id="#app">
    <div class="backdrop section hero gradientbg" style="min-height:230px;">
      <div
        class="columns is-vcentered"
        v-if="$store.state.login.isLoggedIn && $route.path != '/login'"
      >
        <div class="column sidebar is-3-desktop is-3-tablet is-3-mobile">
          <img style=" display: block; margin: 0 auto" width="100" src="./assets/logo-white.png" alt />
        </div>
        <div class="column is-hidden-mobile">
          <div class="columns is-vcentered">
            <div class="column">
              <div class="columns is-vcentered">
                <div class="column is-1-desktop is-5-mobile is-12-tablet is-2">
                  <a class="has-text-white" @click="$router.back()">
                    <b-icon icon="arrow-left" />
                  </a>
                  <a class="has-text-white" @click="$router.forward()">
                    <b-icon icon="arrow-right" />
                  </a>
                </div>

                <div
                  class="column has-text-white"
                  v-if="$route.meta.title"
                >{{(($route.meta.title.length > 25)? $route.meta.title.substring(0,25)+'...': $route.meta.title)}}</div>

                <div class="column has-text-right">
                  <b-button
                    icon-left="logout"
                    type="is-light"
                    size="is-small"
                    @click="logout()"
                  >Logout</b-button>
                </div>
              </div>
              <!-- <p
                  class="is-size-5 has-text-secondary has-text-weight-semibold is-capitalized"
              >{{$route.name? (($route.name).replace("_", " ") + " - ") : ""}}{{company}}</p>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <template v-if="$store.state.login.isLoggedIn && $route.path != '/login'">
        <section class="section no-padding-bottom">
          <div class="columns">
            <div class="column sidebar is-3-desktop is-hidden-touch">
              <Sidebar />
            </div>
            <div class="column scrollable">
              <transition name="fade" mode="out-in">
                <router-view />
              </transition>
            </div>
          </div>
        </section>
      </template>
      <template v-else>
        <router-view />
      </template>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import { getCompany } from "@/localstorage-helper";
import mapState from "vuex";

export default {
  name: "App",
  components: { Sidebar },
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$store.dispatch("login/logout");
      this.$buefy.toast.open({
        duration: 1000,
        message: "Logged out",
        type: "is-light",
        position: "is-top"
      });
      this.$router.push("/login");
    }
  },
  watch: {
    $route() {
      document.title = `${this.$route.meta.title} | UjOL` || "UjOL";
    }
  },
  created() {
    document.title = `${this.$route.meta.title} | UjOL` || "UjOL";
  },
  mounted() {
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
  }
};
</script>

<style lang="scss" scoped>
// Transition
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
  opacity: 0;
}
// Scroll
.scrollable {
  max-height: 85vh;
  min-height: 85vh;
  overflow-y: auto;
}
.scrollable::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.scrollable::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px #c8c8d3;
  border-radius: 10px;
}

/* Handle */
.scrollable::-webkit-scrollbar-thumb {
  background: #bfbec5;
  border-radius: 10px;
  position: absolute;
  right: 0;
}

/* Handle on hover */
.scrollable::-webkit-scrollbar-thumb:hover {
  background: #9b9aa5;
}
#app {
  display: block;
}
.main-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 5rem;
}
.section {
  padding-top: 1.5rem !important;
}
.no-padding-bottom {
  padding-bottom: 0 !important;
}
.sidebar {
  width: 270px !important;
  -moz-transition: all 0.4s ease-in;
  -o-transition: all 0.4s ease-in;
  -webkit-transition: all 0.4s ease-in;
  transition: all 0.4s ease-in;
}
.info-device {
  font-size: 11pt;
}
</style>
