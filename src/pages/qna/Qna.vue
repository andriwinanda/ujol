<template>
  <div>
    <div class="has-text-centered" v-if="!isLoading && !qna.qnaList.length">
      <img width="60%" v-if="!isLoading" src="../../assets/imgs/empty.svg" alt />
      <p class="dynamic-subtitle">
        <b class="is-size-3">Awww sorry...</b>
        <br />What you are look'in for is not yet available
        <br />Try another filter
      </p>
    </div>
    <template v-if="qna.qnaList.length">
      <div v-for="(item) in qna.qnaList" :key="item.idChapter">
        <div class="flat-card" style="margin-bottom: 10px">
          <div class="card-content">
            <p>
              <span class="is-size-4 is-capitalized dynamic-title">{{item.title}}</span>
              <small class="dynamic-title">{{new Date(item.createdAt) | moment("from", "now")}}</small>
              <b-dropdown aria-role="list" position="is-bottom-left" class="is-pulled-right">
                <a class="dynamic-subtitle" slot="trigger" role="button">
                  <b-icon icon="dots-vertical" size="is-small" type="is-grey"></b-icon>
                </a>
                <b-dropdown-item aria-role="listitem" @click="editQna(item)">Edit</b-dropdown-item>
                <b-dropdown-item aria-role="listitem" @click="deleteQna(item.idPost)">Delete</b-dropdown-item>
              </b-dropdown>
            </p>
            <p class="dynamic-subtitle">{{item.body}}</p>
            <hr />
            <div>
              <small class="dynamic-subtitle is-italic">{{item.totalComment}} Replies</small>
              <b-button
                class="is-pulled-right"
                type="is-secondary"
                size="is-small"
                @click="$router.push({path:'/qna/forum', query: { id: item.idPost, title: item.title, message: item.body, date: new Date(item.createdAt).toString(), user:item.name}})"
                rounded
              >Show</b-button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="isLoading">
      <div v-for="(i,index) in 5" :key="index" style="margin-bottom: 10px">
        <b-skeleton height="150px"></b-skeleton>
      </div>
    </template>
    <a
      class="has-text-centered dynamic-subtitle"
      v-if="qna.indexPage < (qna.totalPage - 1)"
      @click="moreChapter()"
    >
      <br />
      <p>Load more</p>
      <p>
        <b-icon icon="chevron-down" size="is-small"></b-icon>
      </p>
    </a>

    <p class="has-text-right float-btn">
      <b-dropdown aria-role="list" :scrollable="true" :max-height="250" position="is-top-left">
        <b-button type="is-primary" size="is-medium" icon-left="filter" slot="trigger" rounded>
          <small
            v-if="filter.name"
          >{{(filter.name.length > 20)? filter.name.substring(0,20)+'...': filter.name}}</small>
          <small v-else>Filter</small>
        </b-button>
        <b-dropdown-item v-if="filter.id" @click="resetFilter()" aria-role="listitem">Reset filter</b-dropdown-item>
        <b-dropdown-item
          v-for="item in courseList"
          :value="item.idCourse"
          :key="item.idCourse"
          @click="filterQna(item.idCourse, item.name)"
          aria-role="listitem"
        >{{(item.name.length > 20)? item.name.substring(0,20)+'...': item.name}}</b-dropdown-item>
      </b-dropdown>

      <b-button
        type="is-primary"
        size="is-medium"
        icon-left="plus"
        @click="isQnaModalActive = true"
        rounded
      >
        <small>Create</small>
      </b-button>
    </p>

    <!-- Modal qna -->
    <b-modal
      :active.sync="isQnaModalActive"
      @close="qnaClose()"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
    >
      <div class="modal-card" style>
        <header class="modal-card-head">
          <p class="modal-card-title">Create new Q&A</p>
        </header>
        <section class="modal-card-body">
          <form>
            <b-field label="Title">
              <b-input required placeholder="Title" v-model="create.title" expanded />
            </b-field>
            <b-field label="Message">
              <b-input
                type="textarea"
                placeholder="Message"
                required
                v-model="create.message"
                expanded
              />
            </b-field>
            <b-field label="Course" v-if="!create.id">
              <b-select placeholder="Select course" v-model="create.idCourse">
                <option
                  v-for="option in courseList"
                  :value="option.idCourse"
                  :key="option.courseId"
                >{{ (option.name.length > 20)? option.name.substring(0,20)+'...': option.name }}</option>
              </b-select>
            </b-field>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            @click.prevent="isQnaModalActive = false 
            qnaClose()"
          >Close</button>
          <b-button type="is-primary" :loading="isLoading" @click.prevent="postQna()">Submit</b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isQnaModalActive: false,
      isLoading: false,
      id: "",
      filter: {
        id: "",
        name: "",
        idCourse: ""
      },
      selectedCourse: {},
      create: {
        id: "",
        title: "",
        message: "",
        idCourse: ""
      },
      courseList: [],
      qna: {
        qnaList: [],
        totalPage: 0,
        indexPage: 0
      }
    };
  },
  methods: {
    filterQna(id, name) {
      this.filter.id = id;
      this.filter.name = name;
      this.id = id;
      this.$router.replace({
        query: { id: this.id }
      });
      this.qna.totalPage = 0;
      this.qna.indexPage = 0;
      this.qna.qnaList = [];
      this.getQna();
    },
    resetFilter() {
      this.filter.id = "";
      this.filter.name = "";
      this.id = "";
      this.$router.replace({
        query: {}
      });
      this.qna.totalPage = 0;
      this.qna.indexPage = 0;
      this.qna.qnaList = [];
      this.getQna();
    },
    getQna() {
      this.isLoading = true;
      let paramFilter = {
        access_token: this.$store.state.login.token,
        page: this.qna.indexPage
      };
      if (this.id) paramFilter.id_course = this.id;
      this.axios
        .get(`/api/instructor/course/qna/post`, {
          params: paramFilter
        })
        .then(res => {
          let data = res.data;
          data.content.map(el => {
            this.qna.qnaList.push(el);
          });
          this.qna.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    moreQna() {
      if (this.qna.indexPage < this.qna.totalPage - 1) {
        this.qna.indexPage++;
        this.getQna();
      }
    },
    getCourse() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/course`, {
          params: {
            access_token: this.$store.state.login.token
          }
        })
        .then(res => {
          this.courseList = res.data;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    getCourseDetail() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/course/details`, {
          params: {
            access_token: this.$store.state.login.token,
            idCourse: this.id
          }
        })
        .then(res => {
          let data = res.data.course;
          this.filter.name = data.name;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    postQna() {
      let submit;
      if (this.create.title && this.create.message) {
        this.isLoading = true;
        if (this.create.id) {
          submit = this.axios.put(
            `/api/instructor/course/qna/post`,
            {},
            {
              params: {
                access_token: this.$store.state.login.token,
                id_post: this.create.id,
                title: this.create.title,
                body: this.create.message
              }
            }
          );
        } else {
          submit = this.axios.post(
            `/api/instructor/course/qna/post`,
            {},
            {
              params: {
                access_token: this.$store.state.login.token,
                id_course: this.create.idCourse,
                title: this.create.title,
                body: this.create.message
              }
            }
          );
        }
        submit
          .then(res => {
            this.isLoading = false;
            this.isQnaModalActive = false;
            this.qna.totalPage = 0;
            this.qna.indexPage = 0;
            this.qna.qnaList = [];
            this.getQna();
          })
          .catch(err => {
            this.isLoading = false;
          });
      } else {
        this.$buefy.toast.open({
          duration: 1000,
          message: "Data can't be null",
          type: "is-danger",
          position: "is-top"
        });
      }
    },
    qnaClose() {
      this.create = {
        id: "",
        title: "",
        message: "",
        idCourse: ""
      };
    },
    editQna(item) {
      this.create.id = item.idPost;
      this.create.title = item.title;
      this.create.message = item.body;
      this.create.idCourse = item.idCourse;
      this.isQnaModalActive = true;
    },
    deleteQna(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting Q&A",
        message:
          "Are you sure you want to <b>delete</b> this Q&A? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`api/instructor/course/qna/post`, {
              params: {
                access_token: this.$store.state.login.token,
                id_post: id
              }
            })
            .then(res => {
              this.$buefy.toast.open("Qna deleted!");
              this.qna.totalPage = 0;
              this.qna.indexPage = 0;
              this.qna.qnaList = [];
              this.isLoading = true;
              this.getQna();
            })
            .catch(err => {
              this.$buefy.toast.open("Error!");
              this.isLoading = true;
            });
        }
      });
    }
  },
  created() {
    let id = this.$route.query.id;
    this.filter.id = id;
    this.id = id;
    this.getCourseDetail();
    this.getCourse();
    this.getQna();
  }
};
</script>
<style lang="scss" scoped>
.float-btn {
  position: fixed !important;
  bottom: 30px;
  right: 50px;
}
</style>