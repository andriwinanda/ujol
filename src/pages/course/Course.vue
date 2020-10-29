<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">Course</p>
        <div class="row">
          <div class="columns">
            <div class="column">
              <p
                class="dynamic-subtitle"
              >Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem sed, iusto voluptates aperiam deleniti sit commodi officiis, culpa a facilis velit voluptate magni aut quis nesciunt quae quidem, earum nemo.</p>
            </div>
            <div class="column is-3-desktop has-text-right">
              <b-button
                type="is-secondary float-right"
                @click="$router.push('/course/create')"
                rounded
              >Create new course</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="field">
      <b-switch v-model="showArchive"></b-switch>
      <span class="dynamic-subtitle">Show archived course</span>
    </div>
    <div class="row">
      <div class="columns is-multiline is-vcentered">
        <template v-if="isLoading">
          <div class="column is-2-desktop" v-for="i in 8" :key="i">
            <b-skeleton height="100px" size="is-large"></b-skeleton>
          </div>
        </template>
        <template v-else>
          <a
            v-for="(item) in courseList"
            :key="item.idCourse"
            @click.prevent="selectCourse(item)"
            tag="a"
            class="column is-2-desktop has-text-centered"
          >
            <div class="shortcut has-background-primary shadow">
              <p
                class="has-text-centered is-size-6"
                style="display: block; margin: 0 auto;"
              >{{(item.name.length > 35)? item.name.substring(0,35)+'...': item.name}}</p>
            </div>
          </a>
          <template v-if="showArchive">
            <div
              v-for="(item) in archiveList"
              :key="item.idCourse"
              class="column is-2-desktop has-text-centered"
            >
              <div class="shortcut has-background-grey shadow">
                <p class="has-text-centered is-size-6" style="display: block; margin: 0 auto;">
                  {{(item.name.length > 35)? item.name.substring(0,35)+'...': item.name}}
                  <br />
                  <a @click="restore(item.idCourse)">Restore</a>
                </p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "../../localstorage-helper";
export default {
  data() {
    return {
      isLoading: false,
      showArchive: false,
      courseList: [],
      archiveList: []
    };
  },
  methods: {
    getCourse() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/course`, {
          params: {
            access_token: this.$store.state.login.token
          }
        })
        .then(res => {
          res.data.map(el => {
            if (el.status == "AVAILABLE") {
              this.courseList.push(el);
            } else {
              this.archiveList.push(el);
            }
          });

          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    selectCourse(item) {
      this.$router.push(`/course/detail/${item.idCourse}`);
    },
    restore(id) {
      this.isLoading = true;

      let data = {
        idCourse: id,
        status: "AVAILABLE"
      };
      this.axios
        .put(`/api/instructor/course/create`, data, {
          params: {
            access_token: this.$store.state.login.token
          }
        })
        .then(res => {
          // this.shortcutList = res.data;
          this.$buefy.toast.open({
            duration: 1000,
            message: "Restore success",
            type: "is-light",
            position: "is-top"
          });
          this.isLoading = false;
          this.archiveList = [];
          this.courseList = [];
          this.getCourse();
        })
        .catch(err => {
          this.$buefy.toast.open({
            duration: 1000,
            message: err.response.data.message,
            type: "is-danger",
            position: "is-top"
          });
          this.isLoading = false;
        });
    }
  },
  watch: {
    $route(to, from) {
      if (this.$route.path == "/archive") {
        this.showArchive = true;
      } else {
        this.showArchive = false;
      }
    }
  },
  created() {
    if (this.$route.path == "/archive") {
      this.showArchive = true;
    }
    this.getCourse();
  }
};
</script>
<style lang="scss" scoped>
.shortcut {
  min-height: 130px;
  border-radius: 15px;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
}
.shortcut:hover {
  color: gainsboro;
}
</style>