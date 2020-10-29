<template>
  <div>
    <!-- Create New Course -->
    <template v-if="!id">
      <div class="flat-card">
        <div class="card-content">
          <form>
            <b-field label="Title">
              <b-input v-model="updateAbout.name" required></b-input>
            </b-field>
            <b-field label="Course ID">
              <b-input v-model="courseId" required></b-input>
            </b-field>
            <b-field label="Message">
              <b-input maxlength="200" required v-model="updateAbout.description" type="textarea"></b-input>
            </b-field>
            <b-field class="has-text-right">
              <b-button @click="createCourse()" type="is-primary" :loading="isLoading">Create New</b-button>
            </b-field>
          </form>
        </div>
      </div>
    </template>
    <!-- Course Detail -->
    <template v-else>
      <b-tabs
        type="is-toggle"
        v-model="activeIndex"
        @change="if(activeIndex == 4) $router.push({path:'/qna', query: { id: id }})"
        expanded
      >
        <!-- ================== About Course ================== -->
        <b-tab-item label="About">
          <div class="flat-card">
            <div class="card-content">
              <b-field label="Title">
                <b-input :value="courseInfo.name" @input="updateAbout.name = $event"></b-input>
              </b-field>

              <b-field label="Message">
                <b-input
                  maxlength="200"
                  :value="courseInfo.description"
                  @input="updateAbout.description = $event"
                  type="textarea"
                ></b-input>
              </b-field>
              <b-field class="has-text-right">
                <b-button
                  type="is-primary"
                  :loading="isLoading"
                  @click="updateCourse('about')"
                  :disabled="courseInfo.name == updateAbout.name && courseInfo.description == updateAbout.description"
                >Save change</b-button>
              </b-field>
            </div>
          </div>
          <br />
          <div class="flat-card" v-if="this.id">
            <div class="card-content">
              <span class="is-size-3 dynamic-title">Course ID</span>
              <a @click="editID = !editID">
                <small>
                  <b-icon
                    v-if="!editID"
                    style="position: relative; right:0"
                    icon="pencil"
                    size="is-small"
                    type="is-info"
                  ></b-icon>
                  {{editID? 'Cancel': 'Edit'}}
                </small>
              </a>
              <div class="row">
                <div class="columns is-vcentered">
                  <div class="column">
                    <div class="section has-background-light has-text-centered">
                      <template v-if="!editID">
                        <span class="title is-3">{{courseInfo.courseId}}</span>
                        <p>
                          <small>Password: {{courseInfo.coursePassword}}</small>
                        </p>
                        <a
                          @click.prevent="copy(courseInfo.name, courseInfo.courseId, courseInfo.coursePassword)"
                        >
                          <b-icon icon="content-copy" size="is-small"></b-icon>
                          <small>Copy</small>
                        </a>
                      </template>
                      <template v-else>
                        <b-field horizontal label="Course ID">
                          <b-input
                            :value="courseInfo.courseId"
                            @input="updateCourseId.courseId = $event"
                          ></b-input>
                        </b-field>
                        <b-field horizontal label="Password">
                          <b-input
                            :value="courseInfo.coursePassword"
                            @input="updateCourseId.password = $event"
                          ></b-input>
                        </b-field>
                        <b-field>
                          <b-button @click="updateCourse('ID')" :loading="isLoadingID">Submit</b-button>
                        </b-field>
                      </template>
                    </div>
                    <small class="dynamic-subtitle">
                      <i>*) Show this code to your students for join your course with PIN, click show QR on the side for showing QR</i>
                    </small>
                  </div>
                  <div class="column is-3-desktop has-text-centered">
                    <b-button
                      type="is-secondary float-right"
                      rounded
                      @click="showQR = true"
                    >Show QR Code</b-button>
                    <b-modal :active.sync="showQR">
                      <img :src="courseInfo.qr" />
                      <p
                        class="has-text-white has-text-weight-bold"
                      >Password : {{courseInfo.coursePassword}}</p>
                    </b-modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div class="flat-card">
            <div class="card-content">
              <div class="columns is-vcentered">
                <div class="column">
                  <p class="is-size-3 dynamic-subtitle">Danger area</p>
                  <small
                    class="dynamic-subtitle"
                  >Move this course to archive, member that joined will be reset</small>
                </div>
                <div class="column is-3 has-text-centered">
                  <b-button rounded type="is-danger" @click="deleteCourse()">Move to archive</b-button>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>

        <!-- ================== Chapter ================== -->
        <b-tab-item label="Chapter">
          <chapter v-bind="{id: id}" />
        </b-tab-item>

        <!-- ================== Quiz ================== -->
        <b-tab-item label="Quiz">
          <no-data v-if="!quiz.quizList.length && !isLoading" />
          <div v-for="(item) in quiz.quizList" :key="item.idQuiz">
            <div class="flat-card" style="margin-bottom: 10px">
              <div class="card-content">
                <p>
                  <span class="is-size-4 is-capitalized dynamic-title">{{item.title}}</span>
                  <small class="dynamic-subtitle">Duration {{item.duration | duration('humanize')}}</small>
                  <b-dropdown aria-role="list" position="is-bottom-left" class="is-pulled-right">
                    <a class="dynamic-subtitle" slot="trigger" role="button">
                      <b-icon icon="dots-vertical" size="is-small" type="is-grey"></b-icon>
                    </a>
                    <b-dropdown-item
                      aria-role="listitemlistitem"
                      v-if="item.status != 'ONGOING' && item.status != 'FINISHED' "
                      @click="editQuiz(item)"
                    >Edit</b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="deleteQuiz(item.idQuiz)">Delete</b-dropdown-item>
                  </b-dropdown>
                </p>
                <small class="dynamic-title">Rules :</small>
                <p class="dynamic-subtitle">{{item.description}}</p>
                <hr />
                <small v-if="item.status == 'INCOMING'" class="dynamic-subtitle is-italic">
                  Quiz start on
                  <b>{{new Date(item.startDate) | moment("dddd, MMMM Do YYYY, HH:mm")}}</b>
                </small>
                <div v-else-if="item.status == 'ONGOING'">
                  <small class="dynamic-subtitle is-italic">Quiz in progress</small>
                  <b-button
                    class="is-pulled-right"
                    type="is-secondary"
                    size="is-small"
                    @click="$router.push(`/course/quiz/recapt/${item.idQuiz}`)"
                    rounded
                  >Quiz Recapt</b-button>
                </div>
                <div v-else>
                  <small class="dynamic-subtitle is-italic">Quiz has finished</small>
                  <b-button
                    class="is-pulled-right"
                    type="is-secondary"
                    size="is-small"
                    @click="$router.push(`/course/quiz/recapt/${item.idQuiz}`)"
                    rounded
                  >Quiz Recapt</b-button>
                </div>
              </div>
            </div>
          </div>
          <template v-if="isLoading">
            <div v-for="(i,index) in 5" :key="index" style="margin-bottom: 10px">
              <b-skeleton height="150px"></b-skeleton>
            </div>
          </template>
          <a
            class="has-text-centered dynamic-subtitle"
            v-if="quiz.indexPage < (quiz.totalPage - 1)"
            @click="moreQuiz()"
          >
            <br />
            <p>Load more</p>
            <p>
              <b-icon icon="chevron-down" size="is-small"></b-icon>
            </p>
          </a>

          <b-button
            class="floating-btn"
            type="is-primary"
            size="is-medium"
            icon-right="plus"
            @click="$router.push(`/course/${id}/quiz/create`)"
            rounded
          />
        </b-tab-item>

        <!-- ================== Resource ================== -->

        <b-tab-item label="Resource">
          <div class="flat-card">
            <div class="card-content">
              <b-table class :data="resource.resourceList" :loading="isLoading" :hoverable="true">
                <template slot="empty" v-if="!isLoading">
                  <p
                    class="dynamic-subtitle has-text-centered"
                    style="padding: 10px"
                  >No data available</p>
                </template>

                <template slot-scope="props">
                  <b-table-column
                    label="Title"
                  >{{ (props.row.fileName > 15)? props.row.fileName.substring(0,15)+'...': props.row.fileName }}</b-table-column>
                  <!-- <b-table-column label="Author">{{ props.row.author }}</b-table-column> -->
                  <b-table-column label="Action" centered style="min-width: 80px">
                    <div class="buttons has-addons is-centered">
                      <b-tooltip label="Download" type="is-light" position="is-bottom">
                        <a
                          :href="props.row.link"
                          target="_blank"
                          class="button is-success is-small"
                        >
                          <b-icon icon="download" size="is-small" />
                        </a>
                      </b-tooltip>
                      <b-button
                        type="is-danger"
                        size="is-small"
                        icon-left="delete"
                        @click="deleteResource(props.row.fileName)"
                      ></b-button>
                    </div>
                  </b-table-column>
                </template>
              </b-table>

              <b-button
                class="floating-btn"
                type="is-primary"
                size="is-medium"
                icon-right="plus"
                @click="isResourceModalActive = true"
                rounded
              />
            </div>
          </div>
        </b-tab-item>

        <!-- ================== Q&A ================== -->

        <b-tab-item label="Q&A"></b-tab-item>

        <!-- ================== Member ================== -->

        <b-tab-item label="Member">
          <div class="flat-card">
            <div class="card-content">
              <b-table class :data="member.memberList" :loading="isLoading" :hoverable="true">
                <template slot="empty" v-if="!isLoading">
                  <p
                    class="dynamic-subtitle has-text-centered"
                    style="padding: 10px"
                  >No data available in table</p>
                </template>

                <template slot-scope="props">
                  <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                  <b-table-column label="Action" centered style="min-width: 80px">
                    <div class="buttons has-addons is-centered">
                      <b-tooltip label="Remove" type="is-light" position="is-bottom">
                        <b-button
                          type="is-danger"
                          size="is-small"
                          icon-left="delete"
                          @click="deleteMember(props.row.idStudent)"
                        ></b-button>
                      </b-tooltip>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
    </template>

    <!-- ============ Modals ============ -->

    <!-- ============ Resource Modal ============ -->
    <b-modal
      :active.sync="isResourceModalActive"
      @close="resourceClose()"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
    >
      <form>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Upload Resource</p>
          </header>
          <section class="modal-card-body">
            <b-field>
              <b-upload v-model="resource.upload" drag-drop>
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large"></b-icon>
                    </p>
                    <p>Drop your files here or click to upload</p>
                  </div>
                </section>
              </b-upload>
            </b-field>

            <p class="has-text-centered" v-if="resource.upload">{{resource.upload.name}}</p>
          </section>
          <footer class="modal-card-foot">
            <button
              class="button"
              type="button"
              @click.prevent="isResourceModalActive = false 
            resourceClose()"
            >Close</button>
            <b-button
              type="is-primary"
              :loading="isLoading"
              @click.prevent="submitResource()"
            >Submit</b-button>
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>
<script>
import moment from "vue-moment";
import { durationMil } from "../../function-helper";
import NoData from "../../components/NoData.vue";
import chapter from "./Chapter.vue";
export default {
  components: {
    NoData,
    chapter
  },
  data() {
    return {
      isResourceModalActive: false,
      isLoading: false,
      isLoadingID: false,
      activeIndex: 0,
      editID: false,
      showQR: false,
      id: "",
      courseId: "",
      updateAbout: {
        name: "",
        description: ""
      },
      updateCourseId: {
        courseId: "",
        password: ""
      },
      courseInfo: {},
      quiz: {
        quizList: [],
        totalPage: 0,
        indexPage: 0
      },
      resource: {
        resourceList: [],
        upload: null,
        totalPage: 0,
        indexPage: 0
      },
      member: {
        memberList: [{}],
        totalPage: 0,
        indexPage: 0
      }
    };
  },
  methods: {
    durationTime(milisecs) {
      return durationMil(milisecs);
    },
    copy(title, id, pass) {
      let text = `Title : ${title}
CourseID : ${id}
Password : ${pass}`;
      navigator.clipboard.writeText(text);
      this.$buefy.toast.open({
        duration: 1000,
        message: "Copied to clipboard",
        type: "is-light",
        position: "is-top"
      });
    },

    // ================== Course About ==================

    createCourse() {
      let data = this.updateAbout;
      data.courseId = this.courseId;
      data.status = "AVAILABLE";
      if (data.name && data.courseId && data.description) {
        this.isLoading = true;
        this.axios
          .post(`/api/instructor/course/create`, data, {
            params: {
              access_token: this.$store.state.login.token
            }
          })
          .then(res => {
            // this.shortcutList = res.data;
            this.$buefy.toast.open({
              duration: 1000,
              message: "New course added",
              type: "is-light",
              position: "is-top"
            });
            this.$router.push(`/course`);
            this.isLoading = false;
          })
          .catch(err => {
            this.isLoading = false;
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            });
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
    updateCourse(type) {
      let data;
      if (type == "about") {
        data = this.updateAbout;
        this.isLoading = true;
      } else {
        data = {};
        if (this.updateCourseId.courseId && !this.updateCourseId.password) {
          data.courseId = this.updateCourseId.courseId;
        } else if (
          !this.updateCourseId.courseId &&
          this.updateCourseId.password
        ) {
          data.coursePassword = this.updateCourseId.password;
        } else {
          data.courseId = this.updateCourseId.courseId;
          data.coursePassword = this.updateCourseId.password;
        }

        // this.updateCourseId.courseId = data.courseId;
        // this.updateCourseId.password = data.coursePassword;
        this.isLoadingID = true;
      }
      data.idCourse = this.id;
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
            message: "Course updated",
            type: "is-light",
            position: "is-top"
          });
          this.isLoading = false;
          this.isLoadingID = false;
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
          this.isLoadingID = false;
        });
    },
    getCourse() {
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
          this.courseInfo = data;
          this.updateAbout.name = data.name;
          this.updateAbout.description = data.description;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },

    deleteCourse(id) {
      this.$buefy.dialog.prompt({
        title: "Move Course to Archive",
        message:
          "Are you sure you want to move this course to <b>archive</b> this Course? Course that moved can be restore on the archive menu. Type name of this course",
        type: "is-danger",
        inputAttrs: {
          placeholder: this.courseInfo.name
        },
        hasIcon: true,
        onConfirm: value => {
          this.isLoading = true;
          if (value.toLowerCase() == this.courseInfo.name.toLowerCase()) {
            this.axios
              .put(
                `api/instructor/course/archive`,
                {},
                {
                  params: {
                    access_token: this.$store.state.login.token,
                    id_course: this.id
                  }
                }
              )
              .then(res => {
                this.$buefy.toast.open("Course Moved!");
                this.$router.push(`/course`);
              })
              .catch(err => {
                this.$buefy.toast.open("Error!");
                this.isLoading = true;
              });
          } else {
            this.$buefy.toast.open("Invalid course name!");
          }
        }
      });
    },

    // ================== Quiz ==================
    getQuiz() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/quiz`, {
          params: {
            access_token: this.$store.state.login.token,
            id_course: this.id,
            page: this.quiz.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          data.content.map(el => {
            let now = Date.now();
            if (now < el.startDate) el.status = "INCOMING";
            else if (now >= el.startDate && now <= el.endDate)
              el.status = "ONGOING";
            else el.status = "FINISHED";
            this.quiz.quizList.push(el);
          });
          this.quiz.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    moreQuiz() {
      if (this.quiz.indexPage < this.quiz.totalPage - 1) {
        this.quiz.indexPage++;
        this.getQuiz();
      }
    },
    deleteQuiz(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting quiz",
        message:
          "Are you sure you want to <b>delete</b> this quiz? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`api/instructor/quiz/delete`, {
              params: {
                access_token: this.$store.state.login.token,
                id_quiz: id
              }
            })
            .then(res => {
              this.$buefy.toast.open("Quiz deleted!");
              this.quiz.totalPage = 0;
              this.quiz.indexPage = 0;
              this.quiz.quizList = [];
              this.isLoading = true;
              this.getQuiz();
            })
            .catch(err => {
              this.$buefy.toast.open(err.response.data.message);
              this.isLoading = true;
            });
        }
      });
    },
    editQuiz(item) {
      this.$router.push({ path: `/course/${this.id}/quiz/edit`, query: item });
    },

    // ================== Resource ==================
    getResource() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/course/resource`, {
          params: {
            access_token: this.$store.state.login.token,
            idCourse: this.id,
            page: this.resource.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          this.resource.resourceList = data.resourceList;
          this.resource.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },

    deleteResource(name) {
      this.$buefy.dialog.confirm({
        title: "Deleting file",
        message:
          "Are you sure you want to <b>delete</b> this file? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`api/instructor/course/resource`, {
              params: {
                access_token: this.$store.state.login.token,
                idCourse: this.id,
                fileName: name
              }
            })
            .then(res => {
              this.$buefy.toast.open("File deleted!");
              this.resource.totalPage = 0;
              this.resource.indexPage = 0;
              this.resource.resourceList = [];
              this.isLoading = true;

              this.getResource();
            })
            .catch(err => {
              this.$buefy.toast.open("Error!");
              this.isLoading = true;
            });
        }
      });
    },
    resourceClose() {
      this.resource.upload = [];
    },
    submitResource() {
      let data = new FormData();
      data.append("file", this.resource.upload);
      if (this.resource.upload) {
        this.isLoading = true;
        this.axios
          .post("/api/instructor/course/resource", data, {
            params: {
              access_token: this.$store.state.login.token,
              idCourse: this.id
            }
          })
          .then(res => {
            this.resource.totalPage = 0;
            this.resource.indexPage = 0;
            this.isResourceModalActive = false;
            this.isLoading = false;
            this.getResource();
            this.$buefy.toast.open({
              duration: 1000,
              message: "File uploaded successfuly",
              type: "is-success",
              position: "is-top"
            });
          })
          .catch(err => {
            this.isLoading = false;
          });
      } else {
        this.$buefy.toast.open({
          duration: 1000,
          message: "File can't be empty",
          type: "is-danger",
          position: "is-top"
        });
      }
    },

    // ================== Member ==================
    getMember() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/course/members`, {
          params: {
            access_token: this.$store.state.login.token,
            idCourse: this.id,
            page: this.member.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          this.member.memberList = data;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    deleteMember(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting member",
        message:
          "Are you sure you want to <b>delete</b> this member? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .put(
              `api/instructor/course/delete-member`,
              {},
              {
                params: {
                  access_token: this.$store.state.login.token,
                  idUser: id,
                  idCourse: this.id
                }
              }
            )
            .then(res => {
              this.$buefy.toast.open("Member deleted!");
              this.member.memberList = [];
              this.isLoading = true;
              this.getMember();
            })
            .catch(err => {
              this.$buefy.toast.open(err.response.data.message);
              this.isLoading = true;
            });
        }
      });
    }
  },
  watch: {
    activeIndex() {
      this.$router.replace({
        query: { active: this.activeIndex },
        silent: true
      });
    }
  },
  created() {
    this.activeIndex = Number(this.$route.query.active);
    if (!this.$route.query.active) this.activeIndex = 0;
    let id = this.$route.params.id;
    if (id) {
      this.id = id;
      // if (this.activeIndex == 0) this.getCourse();
      // else if (this.activeIndex == 1) this.getChapter();
      // else if (this.activeIndex == 2) this.getQuiz();
      // else if (this.activeIndex == 3) this.getResource();
      // else if (this.activeIndex == 3) this.getMember();
      this.getCourse();
      // this.getChapter();
      this.getQuiz();
      this.getResource();
      this.getMember();
    }
  }
};
</script>