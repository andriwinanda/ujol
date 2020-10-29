<template>
  <div class="flat-card">
    <div class="card-content" id="printArea">
      <p class="is-size-4 dynamic-title">
        {{report[0].titleQuiz}}
        <b-button
          class="is-pulled-right"
          type="is-secondary"
          icon-left="printer"
          @click="print('printInvoice', 'html')"
          rounded
        >Print</b-button>
      </p>
      <b-table class :data="report" :loading="isLoading" id="printArea" :hoverable="true">
        <template slot="empty" v-if="!isLoading">
          <p
            class="dynamic-subtitle has-text-centered"
            style="padding: 10px"
          >No data available in table</p>
        </template>

        <template slot-scope="props">
          <b-table-column label="Name">{{ props.row.idStudent }}</b-table-column>
          <b-table-column
            label="Assign at"
          >{{ new Date(props.row.assignedAt) | moment("D MMM YYYY, HH:mm") }}</b-table-column>
          <b-table-column label="Score" centered>{{props.row.score}}</b-table-column>

          <b-table-column label="Action" centered>
            <div class="buttons has-addons is-centered">
              <b-button
                type="is-success"
                size="is-small"
                icon-left="eye"
                @click="$router.push({path: `/course/quiz/review`, query: {idReport: props.row.idReport, studentName: props.row.idStudent}})"
              ></b-button>
            </div>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import print from "print-js";
export default {
  data() {
    return {
      isLoading: false,
      id: "",
      report: []
    };
  },
  methods: {
    print() {
      let attachment = document.getElementById("printArea");
      printJS({
        printable: "printArea",
        type: "html",
        header: null,
        targetStyles: ["*"]
      });
    },
    getReport() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/report`, {
          params: {
            access_token: this.$store.state.login.token,
            id_quiz: this.id
          }
        })
        .then(res => {
          console.log(res);
          let data = res.data;
          data.map(el => {
            if (el.assignedAt) this.report.push(el);
          });
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    }
  },
  created() {
    let id = this.$route.params.id;
    this.id = id;
    this.getReport();
  }
};
</script>