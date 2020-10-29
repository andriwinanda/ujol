<template>
  <div>
    <b-notification
      v-if="id"
      type="is-danger"
      aria-close-label="Close notification"
      role="alert"
    >If you change the question bank that is used on the quiz that will start in 5 minutes, then the quiz uses an old version of this bank</b-notification>
    <div class="flat-card">
      <div class="card-content">
        <p class="is-size-3 dynamic-title">
          {{ id? 'Edit question bank':'Create new question bank'}}
          <b-button
            class="is-pulled-right"
            type="is-secondary"
            rounded
            :loading="isLoading"
            @click="submitQuestion()"
          >Save</b-button>
        </p>
        <br />
        <form>
          <b-field label="Title">
            <b-input required v-model="title" placeholder="Type title" />
          </b-field>
          <b-field label="Description">
            <b-input required v-model="description" type="textarea" placeholder="Type description" />
          </b-field>
        </form>
      </div>
    </div>
    <br />
    <div
      class="flat-card"
      style="margin-bottom: 10px"
      v-for="(item, index) in listQuestion"
      :key="index"
    >
      <div class="card-content">
        <p>
          <span class="is-size-4 dynamic-title">Question {{index+1}}</span>
          <small class="is-capitalized dynamic-subtitle">{{item.questionType}}</small>
          <button
            v-if="listQuestion.length == (index+1)"
            class="delete is-pulled-right"
            @click="listQuestion.splice(index, 1)"
          ></button>
        </p>
        <br />
        <template v-if="item.questionType === 'MULTIPLECHOICE'">
          <b-field label="Question">
            <b-input
              required
              type="textarea"
              placeholder="Type question"
              v-model="listQuestion[index].question"
            ></b-input>
          </b-field>
          <b-field label="Options" />
          <b-field grouped group-multiline>
            <b-input
              required
              v-for="(item, i) in listQuestion[index].answer"
              :key="i"
              type="textarea"
              :placeholder="'Option '+ (i+1)"
              v-model="listQuestion[index].answer[i]"
            ></b-input>
            <b-button icon-left="plus" @click="listQuestion[index].answer.push('')">Add option</b-button>
          </b-field>
          <br />
          <b-field grouped>
            <b-field label="Answer Key">
              <b-select placeholder="Select answer key" v-model="listQuestion[index].answerKey">
                <option
                  v-for="(item, i) in listQuestion[index].answer"
                  :value="item"
                  :key="i"
                >{{(item.length > 25)? item.substring(0,25)+'...': item}}</option>
              </b-select>
            </b-field>
            <b-field label="Potential Score">
              <b-input
                required
                v-model="listQuestion[index].score"
                min="1"
                type="number"
                placeholder="Score"
              />
            </b-field>
          </b-field>
        </template>
        <template v-else>
          <b-field label="Question">
            <b-input
              required
              type="textarea"
              placeholder="Type question"
              v-model="listQuestion[index].question"
            ></b-input>
          </b-field>
          <b-field grouped>
            <b-field label="Answer Key" expanded>
              <b-input
                required
                type="textarea"
                placeholder="Type answer key"
                v-model="listQuestion[index].answerKey"
              ></b-input>
            </b-field>
            <b-field label="Potential Score">
              <b-input
                required
                v-model="listQuestion[index].score"
                min="1"
                type="number"
                placeholder="Score"
              />
            </b-field>
          </b-field>
        </template>
      </div>
    </div>
    <br />
    <p class="has-text-right">
      <b-tooltip label="Add Question" position="is-left">
        <b-dropdown aria-role="list" position="is-top-left">
          <b-button
            style="width: 50px; height: 50px"
            type="is-primary"
            size="is-medium"
            icon-right="plus"
            slot="trigger"
            rounded
          />
          <b-dropdown-item aria-role="listitem" @click="addMultipleChoice()">Multiple Choice</b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="addEssay()">Essay</b-dropdown-item>
        </b-dropdown>
      </b-tooltip>
    </p>
  </div>
</template>
<script>
import { getToken } from "../../localstorage-helper";
export default {
  data() {
    return {
      isLoading: false,
      indexQuestion: 0,
      id: "",
      title: "",
      description: "",
      listQuestion: []
    };
  },
  methods: {
    addMultipleChoice() {
      let data = {
        questionType: "MULTIPLECHOICE",
        answer: []
      };
      this.listQuestion.push(data);
      this.indexQuestion++;
    },
    addEssay() {
      let data = {
        questionType: "ESSAY"
      };
      this.listQuestion.push(data);
      this.indexQuestion++;
    },
    submitQuestion() {
      let submit;
      let execute = false;
      let questions = [];
      for (var i = 0; i < this.listQuestion.length; i++) {
        if (this.listQuestion[i].questionType == "MULTIPLECHOICE") {
          if (
            this.listQuestion[i].question &&
            this.listQuestion[i].answer.length >= 2 &&
            this.listQuestion[i].answerKey &&
            this.listQuestion[i].score
          ) {
            questions.push(this.listQuestion[i]);
            execute = true;
          } else {
            this.$buefy.toast.open("Wrong format at Question " + (i + 1));
            execute = false;
            break;
          }
        } else if (this.listQuestion[i].questionType == "ESSAY") {
          if (
            this.listQuestion[i].question &&
            this.listQuestion[i].answerKey &&
            this.listQuestion[i].score
          ) {
            questions.push(this.listQuestion[i]);
            execute = true;
          } else {
            this.$buefy.toast.open("Wrong format at Question " + (i + 1));
            execute = false;
            break;
          }
        } else {
          this.$buefy.toast.open("Wrong format at Question " + (i + 1));
          execute = false;
          break;
        }
      }
      let data = {
        title: this.title,
        description: this.description,
        listQuestion: questions
      };
      if (data.title && data.description && data.listQuestion.length) {
        if (execute) {
          this.isLoading = true;
          if (this.id) {
            submit = this.axios.put(
              `/api/instructor/question-bank/update`,
              data,
              {
                params: {
                  access_token: this.$store.state.login.token,
                  idQuestionBank: this.id
                }
              }
            );
          } else {
            submit = this.axios.post(
              "/api/instructor/question-bank/create",
              data,
              {
                params: {
                  access_token: this.$store.state.login.token
                }
              }
            );
          }
          submit
            .then(res => {
              this.isLoading = false;
              this.$router.back();
              this.$buefy.toast.open({
                duration: 1000,
                message: "Success",
                type: "is-secondary",
                position: "is-top"
              });
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
        }
      } else {
        this.$buefy.toast.open("Data can't be null");
      }
    },
    getBankDetail() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/question`, {
          params: {
            access_token: this.$store.state.login.token,
            idQuestionBank: this.id
          }
        })
        .then(res => {
          let data = res.data;
          this.title = data.title;
          this.description = data.description;
          this.listQuestion = data.listQuestion;
          this.indexQuestion = data.listQuestion.length;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    }
  },
  created() {
    let id = this.$route.params.id;
    if (id) {
      this.id = id;
      this.getBankDetail();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>