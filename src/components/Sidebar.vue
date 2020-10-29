<template>
  <div class="columns is-narrow-mobile">
    <div class="column is-12 is-sidebar-menu">
      <aside class="menu mySidebar flat-card">
        <div class="header">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <div class="image is-48x48" style="display: block; margin: 0 auto">
                  <img
                    class="is-rounded profile-pict"
                    src="https://www.sejasa.com/assets/icons/profile_pic-9f51819994c099de0ac9fee7b3f9bb341d7181d5af9eb33ec4fc7fc98b9bbb95.png"
                  />
                  <!-- <b-icon
                    style="position: relative; right:0"
                    icon="pencil"
                    size="is-small"
                    type="is-info"
                  ></b-icon>-->
                </div>
                <p class="has-text-centered dynamic-title" style="margin-top: 10px ;margin-bottom: 0 !important">
                  <small>{{name}}</small>
                </p>
                <p class="has-text-centered">
                  <router-link tag="a" to="/profile" class="text-color-info">
                    <small>Edit profile</small>
                  </router-link>
                </p>
              </div>
            </div>
          </article>
          <br />
          <div class="columns is-multiline dynamic-subtitle">
            <div
              v-for="(item, index) in menuList"
              :key="index"
              class="column is-6 has-text-centered custom-padding"
            >
              <router-link
                tag="div"
                :to="item.path"
                :class="['menu-btn', {'active-menu has-text-white' : ($route.path).startsWith(item.path)}]"
              >
                <b-icon :icon="item.icon" size="is-medium"></b-icon>
                <p>
                  <small>{{item.name}}</small>
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import swal from "sweetalert";
import { getToken, getDataUser } from "../localstorage-helper";
import { capitalizeLetter } from "../function-helper";

export default {
  data() {
    return {
      active: "",
      // activePage: "",
      menuList: [
        {
          name: this.$i18n.t('menu.dashboard'),
          icon: "chart-pie",
          path: "/dashboard"
        },
        {
          name: this.$i18n.t('menu.course'),
          icon: "book-open",
          path: "/course"
        },
        {
          name: this.$i18n.t('menu.qbank'),
          icon: "locker-multiple",
          path: "/questionbank"
        },
        {
          name: this.$i18n.t('menu.qna'),
          icon: "forum",
          path: "/qna"
        },
        {
          name: this.$i18n.t('menu.setting'),
          icon: "cog",
          path: "/settings"
        },
        {
          name: this.$i18n.t('menu.complaint'),
          icon: "content-paste",
          path: "/complaint"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      name: state => state.login.dataUser.name
    })
  },
  methods: {
    capitalize(str) {
      return capitalizeLetter(str);
    }
  },
  mounted() {
    // Keep in active
    this.active = this.$route.path;
  }
};
</script>



<style lang="scss" scoped>

.menu-btn:hover {
  background: #ecececad;
}
.custom-padding {
  padding: 0.3rem;
}
.no-margin-right {
  margin-right: 0;
}
.profile-pict {
  // clip: rect(0px,60px,60px,0px);
  max-height: 52px;
  max-width: 52px;
  min-height: 52px;
  min-width: 52px;
}
.logout:hover {
  background-color: #ffffff23;
}
</style>

