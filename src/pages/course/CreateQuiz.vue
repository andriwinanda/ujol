<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <form>
          <b-field label="Title" expanded>
            <b-input v-model="title" @input="updateTitle" placeholder="Type title" required></b-input>
          </b-field>

          <b-field label="Description">
            <b-input
              type="textarea"
              placeholder="Type description"
              v-model="description"
              @input="updateDesc"
              required
            ></b-input>
          </b-field>
          <b-field grouped>
            <b-field label="Start">
              <b-datetimepicker
                :min-datetime="new Date(Date.parse(new Date())+120000)"
                v-model="startDate"
                placeholder="Click to select..."
              >
                <template slot="right">
                  <button class="button is-danger" @click.prevent="startDate = null">
                    <b-icon icon="close"></b-icon>
                    <span>Clear</span>
                  </button>
                </template>
              </b-datetimepicker>
            </b-field>
          </b-field>
          <b-field grouped>
            <b-field label="Question Bank">
              <b-dropdown
                :value="qBankSelect.idQuestionBank"
                v-model="qBankSelect"
                type="is-light"
                aria-role="list"
                required
              >
                <button class="button" type="button" slot="trigger">
                  <span>{{qBankSelect.title || 'Select Question'}}</span>
                  <b-icon icon="menu-down"></b-icon>
                </button>

                <b-dropdown-item
                  v-for="(item, i) in qBankList"
                  :value="item"
                  :key="i"
                  aria-role="listitem"
                >
                  <span>{{(item.title.length > 15)? item.title.substring(0,15)+'...': item.title}}</span>
                </b-dropdown-item>

                <b-dropdown-item @click="$router.push('/questionbank/create')" aria-role="listitem">
                  <span>Create new</span>
                </b-dropdown-item>
              </b-dropdown>
            </b-field>
            <b-field label="Duration">
              <b-input
                type="number"
                placeholder="Set duration in minutes"
                v-model="duration"
                @input="updateDuration"
                required
              ></b-input>
            </b-field>
          </b-field>
          <!-- <div class="control">
            <b-switch v-model="create.showAnswerKey">Show answer key after student finish</b-switch>
          </div>-->
          <p class="has-text-right">
            <b-button type="is-light" icon-left="chevron-left" @click.prevent="$router.back()">Back</b-button>
            <b-button type="is-warning" @click.prevent="resetState()">Clear</b-button>
            <b-button type="is-primary" @click.prevent="submitQuiz()" :loading="isLoading">Submit</b-button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      qBankList: [],
      qBankSelect: {},
      id: "",
      idQuiz: "",
      startDate: null,
      create: {
        idCourse: ""
        // idQuestionBank: "",
        // title: "",
        // description: "",
        // duration: 0
      }
    };
  },
  methods: {
    getBank() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/question-bank`, {
          params: {
            access_token: this.$store.state.login.token,
            page: 0
          }
        })
        .then(res => {
          let data = res.data;
          this.qBankList = data.content;
          if (this.qBankSelect.idQuestionBank) {
            data.content.find(el => {
              el.idQuestionBank == this.qBankSelect.id;
              return (this.qBankSelect.title = el.title);
            });
          }
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    submitQuiz() {
      let submit;
      let data = {
        idCourse: this.id,
        idQuestionBank: this.qBankSelect.idQuestionBank,
        title: this.title,
        description: this.description,
        duration: this.duration * 60000,
        startDate: this.startDate ? this.startDate.setSeconds(0) : 0
      };
      if (
        data.title &&
        data.description &&
        data.idQuestionBank &&
        data.startDate &&
        data.duration
      ) {
        this.isLoading = true;
        data.idCourse = this.id;
        if (this.id) {
          submit = this.axios.post(`/api/instructor/quiz/create`, data, {
            params: {
              access_token: this.$store.state.login.token
            }
          });
        } else {
          delete data.idQuiz;
          submit = this.axios.post("/api/instructor/quiz/create", data, {
            params: {
              access_token: this.$store.state.login.token
            }
          });
        }
        submit
          .then(res => {
            this.isLoading = false;
            this.$buefy.toast.open({
              duration: 1000,
              message: res.data.message,
              type: "is-light",
              position: "is-top"
            });
            this.$router.back();
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
    resetState() {
      this.$store.commit("quiz/resetState");
    },
    updateTitle(value) {
      this.$store.commit("quiz/updateTitle", value);
    },
    updateDesc(value) {
      this.$store.commit("quiz/updateDesc", value);
    },
    updateQuestionBank(value) {
      this.$store.commit("quiz/updateQuestionBank", value);
    },
    updateDuration(value) {
      this.$store.commit("quiz/updateDuration", value);
    }
  },
  created() {
    this.id = this.$route.params.idCourse;
    let data = this.$route.query;
    if (data.idQuiz) {
      this.idQuiz = data.idQuiz;
      this.updateTitle(data.title);
      this.updateDesc(data.description);
      this.updateDuration(data.duration / 60000);
      this.updateStart(new Date(data.startDate));
      this.updateQuestionBank(data.idQuestionBank);
    }
    this.getBank();
  },
  computed: {
    ...mapState({
      title: state => state.quiz.title,
      description: state => state.quiz.description,
      idQuestionBank: state => state.quiz.idQuestionBank,
      duration: state => state.quiz.duration
    })
  }
};
</script>