<template>
  <div>
    <template v-if="isLoading">
      <b-skeleton size="is-large " height="240px" width="100%"></b-skeleton>
      <b-skeleton size="is-large " height="240px" width="100%"></b-skeleton>
      <b-skeleton size="is-large " height="240px" width="100%"></b-skeleton>
    </template>
    <div v-else class="flat-card" style="margin-bottom: 10px">
      <div class="card-content">
        <p>
          <span class="is-size-3 dynamic-title">{{review.title}}</span>
          <span class="is-pulled-right" v-if="idComplaint">
            <b-button type="is-danger" @click="isReasonModalActive = true" rounded>Decline request</b-button>
            <b-button
              type="is-primary"
              :loading="isLoading"
              @click="updateScore('APPROVE')"
              rounded
            >Send score change</b-button>
          </span>
        </p>
        <table class="dynamic-subtitle my-table">
          <tr>
            <td>Name</td>
            <td class="is-capitalized">: {{studentName}}</td>
          </tr>
          <tr>
            <td>Quiz Start</td>
            <td>: {{new Date(review.quizDate)| moment("D MMM YYYY, HH:mm")}}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>: {{durationTime(review.duration)}}</td>
          </tr>
          <tr>
            <td>Assigned at</td>
            <td>: {{new Date(review.assignAt)| moment("D MMM YYYY, HH:mm")}}</td>
          </tr>
          <tr>
            <td>Score</td>
            <td>
              :
              <strong class="dynamic-subtitle">{{review.score}}</strong>
            </td>
          </tr>
          <template v-if="idComplaint">
            <tr>
              <td>Description Complain</td>
              <td>: {{complaint.description}}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                :
                <b-tag v-if="complaint.status == 'APPROVE'" type=" is-success">
                  <span class="is-capitalized">{{complaint.status}}</span>
                </b-tag>
                <b-tag v-else-if="complaint.status == 'DECLINE'" type=" is-danger">
                  <span class="is-capitalized">{{complaint.status}}</span>
                </b-tag>
                <b-tag v-else>
                  <span class="is-capitalized">{{complaint.status}}</span>
                </b-tag>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>

    <!-- Questions -->
    <div
      class="flat-card"
      style="margin-bottom: 10px"
      v-for="(item, index) in review.reportQuizResponses"
      :key="index"
    >
      <div class="card-content">
        <p>
          <span class="is-size-4 dynamic-title">Question {{index+1}}</span>
          <small class="is-capitalized dynamic-subtitle">{{item.questionType}}</small>
          <b-field class="is-pulled-right" label="Potential Score">
            <p class="dynamic-title has-text-centered">{{item.score}}</p>
          </b-field>
        </p>

        <br />
        <template v-if="item.questionType === 'MULTIPLECHOICE'">
          <b-field label="Question">
            <p class="dynamic-title pre-formatted">{{item.question}}</p>
          </b-field>
          <b-field label="Students Answer">
            <div>
              <b-radio
                class="dynamic-title"
                :readonly="true"
                :disabled="true"
                v-for="opt in item.answer"
                :key="opt"
                name="answer"
                :native-value="opt"
                v-model="item.studentAnswer"
              >{{opt}}</b-radio>
            </div>
          </b-field>
          <br />
          <b-field grouped>
            <b-field label="Answer Key">
              <p class="dynamic-title pre-formatted">{{item.answerKey ? item.answerKey: '-'}}</p>
            </b-field>
            <b-field class="is-pulled-right" label="Student Score">
              <b-input
                v-if="idComplaint"
                v-model="item.studentScore"
                :max="item.score"
                :min="item.minScore"
                type="number"
                placeholder="Score"
              />
              <p
                v-else
                class="has-text-centered title is-4 has-text-primary dynamic-title"
              >{{item.studentScore}}</p>
            </b-field>
          </b-field>
        </template>
        <template v-else>
          <b-field label="Question">
            <p
              class="dynamic-title pre-formatted"
              v-html="item.question.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            />
          </b-field>
          <b-field label="Answer Key" expanded>
            <p
              class="dynamic-title pre-formatted"
              v-html="item.answerKey.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            />
          </b-field>
          <b-field grouped>
            <b-field label="Student Answer" expanded>
              <p
                class="dynamic-title pre-formatted"
                v-html="item.studentAnswer.replace(/(?:\r\n|\r|\n)/g, '<br />')"
              />
            </b-field>
            <b-field class="is-pulled-right" label="Student Score">
              <b-input
                v-if="idComplaint"
                v-model="item.studentScore"
                :max="item.score"
                :min="item.minScore"
                type="number"
                placeholder="Score"
              />
              <p
                v-else
                class="has-text-centered title is-4 has-text-primary dynamic-title"
              >{{item.studentScore}}</p>
            </b-field>
          </b-field>
          <b-button
            type="is-primary"
            @click="scoringSteps(item.ratioMap, item.studentAnswer, item.answerKey, item.score, item.studentScore)"
          >Scoring Steps</b-button>
        </template>
      </div>
    </div>

    <!-- Scoring steps -->
    <b-modal
      :active.sync="showScoringSteps"
      @close="scoringClose()"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
    >
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Scoring Steps</p>
        </header>
        <section class="modal-card-body" style="background-color:#f4f4f8">
          <div class="flat-card" style="margin-bottom: 10px">
            <div class="card-content">
              <small>Student answer:</small>
              <p>{{scoring.studentAnswer}}</p>
            </div>
          </div>
          <div class="flat-card" style="margin-bottom: 10px">
            <div class="card-content">
              <small>Answer key:</small>
              <p>{{scoring.answerKey}}</p>
            </div>
          </div>
          <br />
          <p class="has-text-centered">Cosine Similarity</p>
          <br />
          <table class="wordList" width="100%">
            <tr class="head">
              <th>Word list</th>
              <th>
                <i class="symbol">q</i>
              </th>
              <th>
                <i class="symbol">d</i>
              </th>
            </tr>
            <tr class="body" v-for="(item,index) in scoring.ratioMap" :key="index">
              <td>{{item.word}}</td>
              <td>{{item.ratioAnswerKey}}</td>
              <td>{{item.ratioAnswer}}</td>
            </tr>
          </table>
          <br />
          <p class="has-text-grey has-text-centered">Info</p>
          <br />
          <small>
            <i class="symbol-grey">q</i> =
            <i>Ratio of the appeared in answer key sentence</i>
          </small>
          <br />
          <small>
            <i class="symbol-grey">d</i> =
            <i>Ratio of the appeared in student's answer sentence</i>
          </small>
          <br />
          <br />
          <div class="flat-card" style="margin-bottom: 10px">
            <div class="card-content">
              <small
                class="has-text-grey"
              >After both text is projected, then we'll get the vector of both text wich shown :</small>
              <p>
                Answer key : [
                <span v-for="(item,index) in scoring.ratioMap" :key="item.word">
                  {{item.ratioAnswerKey}}
                  <span v-if="index != scoring.ratioMap.length - 1">,</span>
                </span>
                ]
              </p>
              <p>
                Student answer : [
                <span v-for="(item,index) in scoring.ratioMap" :key="item.word">
                  {{item.ratioAnswer}}
                  <span v-if="index != scoring.ratioMap.length - 1">,</span>
                </span>
                ]
              </p>
              <br />
              <small class="has-text-grey">
                Each number of vector
                <i class="symbol-grey">q</i> is multiplied by each member of vector
                <i class="symbol-grey">d</i> and add upp the product
              </small>
              <p>
                <span v-for="(item,index) in scoring.ratioMap" :key="item.word">
                  ({{item.ratioAnswerKey}}.{{item.ratioAnswer}})
                  <span
                    v-if="index != scoring.ratioMap.length - 1"
                  >+</span>
                </span>
                = {{scoring.multiplication}}
              </p>
              <br />
              <small class="has-text-grey">
                Each number of vector
                <i class="symbol-grey">q</i> is squared, added and then square rooted
              </small>
              <p>
                &Sqrt; (
                <span v-for="(item,index) in scoring.ratioMap" :key="item.word">
                  {{item.ratioAnswerKey}}&sup2;
                  <span v-if="index != scoring.ratioMap.length - 1">+</span>
                </span>
                ) = &Sqrt;{{scoring.q_square}}
              </p>
              <br />
              <small class="has-text-grey">
                Each number of vector
                <i class="symbol-grey">d</i> is squared, added and then square rooted
              </small>
              <p>
                &Sqrt; (
                <span v-for="(item,index) in scoring.ratioMap" :key="item.word">
                  {{item.ratioAnswer}}&sup2;
                  <span v-if="index != scoring.ratioMap.length - 1">+</span>
                </span>
                ) = &Sqrt;{{scoring.d_square}}
              </p>
              <br />
              <small
                class="has-text-grey"
              >The product from step 1 is divided by the product from step 2 and 3 wich has been multiplied before, and the product is multiplied</small>
              <p>
                {{scoring.multiplication}} / &Sqrt;{{scoring.q_square}} * &Sqrt;{{scoring.d_square}}
                = {{isNaN(scoring.finalScore)?0:scoring.finalScore}}
              </p>
              <br />
              <small
                class="has-text-grey"
              >Maximum score of this question is {{scoring.maxScore}}, your cosine score is {{isNaN(scoring.finalScore)?0:scoring.finalScore}} multiplies with {{scoring.maxScore}} with rounding, your final score is :</small>
              <p class="title is-4 has-text-primary">{{scoring.studentScore}}</p>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click.prevent="scoringClose()">Close</button>
        </footer>
      </div>
    </b-modal>

    <!-- Modal reason -->
    <b-modal
      :active.sync="isReasonModalActive"
      @close="reasonClose()"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
    >
      <div class="modal-card" style>
        <header class="modal-card-head">
          <p class="modal-card-title">Decline reason</p>
        </header>
        <section class="modal-card-body">
          <b-field>
            <b-input type="textarea" placeholder="Type your reason" v-model="reason" expanded />
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button"
            type="button"
            @click.prevent="isReasonModalActive = false 
            reasonClose()"
          >Close</button>
          <b-button
            type="is-primary"
            :loading="isLoading"
            @click.prevent="updateScore('DECLINE')"
          >Submit</b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { durationMil } from "../..//function-helper";
export default {
  data() {
    return {
      isReasonModalActive: false,
      showScoringSteps: false,
      isLoading: false,
      idComplaint: "",
      idReport: "",
      complaint: {},
      review: {},
      studentName: "",
      reason: "",
      scoring: {
        ratioMap: null,
        multiplication: 0,
        q_square: 0,
        d_square: 0,
        finalScore: 0
      }
    };
  },
  methods: {
    durationTime(milisecs) {
      return durationMil(milisecs);
    },
    newLineFormat(str) {
      return;
    },
    getComplaint() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/complaint/details`, {
          params: {
            access_token: this.$store.state.login.token,
            id_complaint: this.idComplaint
          }
        })
        .then(res => {
          this.complaint = res.data;
          this.idReport = res.data.idReport;
          this.studentName = res.data.studentName;

          this.isLoading = false;
          this.getReview();
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    getReview() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/report/details`, {
          params: {
            access_token: this.$store.state.login.token,
            id_report: this.idReport
          }
        })
        .then(res => {
          this.review = res.data;
          this.review.reportQuizResponses.map(el => {
            el.minScore = el.studentScore;
          });
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    updateScore(status) {
      this.isLoading = true;

      let submit;
      let data = {};

      if (status == "APPROVE") {
        this.review.reportQuizResponses.map(el => {
          data[el.idQuestionFulfilled] = Number(el.studentScore);
        });
        submit = this.axios.put(`api/instructor/quiz/complaint`, data, {
          params: {
            access_token: this.$store.state.login.token,
            idComplaint: this.idComplaint,
            status: status,
            reason: this.reason
          }
        });
      } else {
        submit = this.axios.put(
          `api/instructor/quiz/complaint`,
          {},
          {
            params: {
              access_token: this.$store.state.login.token,
              idComplaint: this.idComplaint,
              status: status,
              reason: this.reason
            }
          }
        );
      }
      submit
        .then(res => {
          this.isLoading = false;
          this.$buefy.toast.open({
            duration: 1000,
            message: "Update score successful !",
            type: "is-light",
            position: "is-top"
          });
          this.reasonClose();
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
    },
    reasonClose() {
      this.reason = "";
      this.isReasonModalActive = false;
    },
    scoringClose() {
      this.scoring = {
        ratioMap: null,
        multiplication: 0,
        q_square: 0,
        d_square: 0,
        finalScore: 0
      };
      this.showScoringSteps = false;
    },
    scoringSteps(ratioMap, studentAnswer, answerKey, maxScore, studentScore) {
      let data = [];
      this.scoring.maxScore = maxScore;
      this.scoring.studentScore = studentScore;
      this.scoring.multiplication = 0;
      this.scoring.q_square = 0;
      this.scoring.d_square = 0;
      var promises = Object.keys(ratioMap).map(key => {
        let obj = {};
        obj.word = key;
        obj.ratioAnswer = ratioMap[key].ratioAnswer;
        obj.ratioAnswerKey = ratioMap[key].ratioAnswerKey;
        data.push(obj);
        this.scoring.multiplication +=
          ratioMap[key].ratioAnswer * ratioMap[key].ratioAnswerKey;
        this.scoring.q_square += Math.pow(ratioMap[key].ratioAnswerKey, 2);
        this.scoring.d_square += Math.pow(ratioMap[key].ratioAnswer, 2);
      });
      Promise.all(promises).then(() => {
        this.scoring.ratioMap = data;
        this.scoring.studentAnswer = studentAnswer;
        this.scoring.answerKey = answerKey;
        let finalScore =
          this.scoring.multiplication /
          (Math.sqrt(this.scoring.q_square) * Math.sqrt(this.scoring.d_square));
        this.scoring.finalScore = finalScore
        this.showScoringSteps = true;
      });
    }
  },
  created() {
    this.idComplaint = this.$route.query.idComplaint;
    this.idReport = this.$route.query.idReport;
    this.studentName = this.$route.query.studentName;
    if (this.idComplaint) {
      this.getComplaint();
    } else {
      this.getReview();
    }
  }
};
</script>
<style lang="scss" scoped>
.my-table {
  tr td {
    padding: 1px 0;
    padding-right: 30px;
  }
}
.pre-formatted {
  white-space: normal;
}
.wordList {
  background-color: white;
  border-radius: 20px !important;
  tr > th {
    background-color: #33c6ff;
    color: white;
    border-left: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  tr th:first-child {
    border-radius: 20px 0 0 20px !important;
  }
  tr th:last-child {
    border-radius: 0 20px 20px 0 !important;
  }
  tr td:first-child,
  tr th:first-child {
    border-left: none;
  }
  tr > td {
    border-left: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
}
.symbol {
  border-top: 1px solid #fff;
}
.symbol-grey {
  border-top: 1px solid black;
}
</style>

