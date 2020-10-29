<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <p class="dynamic-title">
          Course
          <a style="float: right" @click="$router.push('/course')">more</a>
        </p>
        <br />
        <div class="row">
          <div class="columns is-vcentered">
            <template v-if="isLoading">
              <div class="column is-2-desktop" v-for="i in 5" :key="i">
                <b-skeleton height="100px" size="is-large"></b-skeleton>
              </div>
              <b-skeleton size="is-large"></b-skeleton>
            </template>
            <template v-else>
              <a
                v-for="(item, i) in shortcutList"
                :key="i"
                @click.prevent="selectCourse(item)"
                tag="a"
                class="column is-2-desktop has-text-centered"
              >
                <div class="shortcut has-background-primary">
                  <p
                    class="has-text-centered"
                    style="display: block; margin: 0 auto;"
                  >{{(item.name.length > 20)? item.name.substring(0,20)+'...': item.name}}</p>
                </div>
              </a>

              <div class="column is-2-desktop has-text-centered">
                <b-button
                  type="is-secondary"
                  @click="$router.push('/course/create')"
                  rounded
                >Create course</b-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div class="row">
      <div class="columns">
        <div class="column">
          <div class="flat-card">
            <div class="card-content">
              <p class="dynamic-subtitle">
                Recent complaint
                <a style="float: right" @click="$router.push('/complaint')">more</a>
              </p>
              <b-table class :data="complaintList" :loading="isLoading" :hoverable="true">
                <template slot="empty" v-if="!isLoading">
                  <p
                    class="dynamic-subtitle has-text-centered"
                    style="padding: 10px"
                  >No data available in table</p>
                </template>

                <template slot-scope="props">
                  <b-table-column label="Name">{{ props.row.name }}</b-table-column>
                  <b-table-column label="Decription">{{ props.row.description }}</b-table-column>
                  <b-table-column label="Course">{{props.row.course}}</b-table-column>
                  <b-table-column label="Score" centered>{{props.row.score}}</b-table-column>
                  <b-table-column label="Status" centered>
                    <b-tag v-if="props.row.status == 'APPROVE'" type=" is-success">
                      <span class="is-capitalized">{{props.row.status}}</span>
                    </b-tag>
                    <b-tag v-else-if="props.row.status == 'DECLINE'" type=" is-danger">
                      <span class="is-capitalized">{{props.row.status}}</span>
                    </b-tag>
                    <b-tag v-else>
                      <span class="is-capitalized">{{props.row.status}}</span>
                    </b-tag>
                  </b-table-column>
                  <b-table-column label="Action" centered>
                    <div class="buttons has-addons is-centered">
                      <b-button
                        type="is-success"
                        size="is-small"
                        icon-left="eye"
                        @click="$router.push({path: `complaint/detail`, query: {idComplaint: props.row.idComplaint}})"
                      ></b-button>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="flat-card">
            <div class="card-content">
              <p class="dynamic-subtitle">
                Recent Question Bank
                <a
                  style="float: right"
                  @click="$router.push('/questionbank')"
                >more</a>
              </p>
              <b-table class :data="qBankList" :loading="isLoading" :hoverable="true">
                <template slot="empty" v-if="!isLoading">
                  <p
                    class="dynamic-subtitle has-text-centered"
                    style="padding: 10px"
                  >No data available in table</p>
                </template>

                <template slot-scope="props">
                  <b-table-column label="Title">{{ props.row.title }}</b-table-column>
                  <b-table-column label="Decription">{{ props.row.description }}</b-table-column>
                  <b-table-column
                    label="Number of question"
                    centered
                  >{{ props.row.listIdQuestion? props.row.listIdQuestion.length: 0 }}</b-table-column>
                  <b-table-column label="Action" centered style="min-width: 80px">
                    <div class="buttons has-addons is-centered">
                      <b-button
                        type="is-success"
                        size="is-small"
                        icon-left="pencil"
                        @click="$router.push(`/questionbank/edit/${props.row.idQuestionBank}`)"
                      ></b-button>
                      <b-button
                        type="is-danger"
                        size="is-small"
                        icon-left="delete"
                        @click="deleteBank(props.row.idQuestionBank)"
                      ></b-button>
                    </div>
                  </b-table-column>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "../localstorage-helper";
export default {
  data() {
    return {
      isLoading: false,
      shortcutList: [],
      complaintList: [],
      qBankList: []
    };
  },
  methods: {
    getDashboard() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/dashboard`, {
          params: {
            access_token: this.$store.state.login.token
          }
        })
        .then(res => {
          let data = res.data;
          this.shortcutList = data.courseList;
          this.complaintList = data.complaintList;
          this.qBankList = data.questionBankList;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    selectCourse(item) {
      this.$router.push(`/course/detail/${item.idCourse}`);
    },
    deleteBank(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting question bank",
        message:
          "Are you sure you want to <b>delete</b> this question bank? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`/api/instructor/question-bank/delete`, {
              params: {
                access_token: this.$store.state.login.token,
                idQuestionBank: id
              }
            })
            .then(res => {
              this.$buefy.toast.open("Question bank deleted!");
              this.isLoading = false;
              this.totalPage = 0;
              this.indexPage = 0;
              this.qBankList = [];
              this.getBank();
            })
            .catch(err => {
              this.isLoading = false;
              this.$buefy.toast.open(err.response.data.message);
            });
        }
      });
    }
  },
  created() {
    this.getDashboard();
  }
};
</script>
<style lang="scss" scoped>
.shortcut {
  padding: 7px;
  display: flex;
  align-items: center;
  height: 100px;
  border-radius: 15px;
  color: white;
  max-width: 100%;
}
.shortcut:hover {
  color: gainsboro;
}
</style>