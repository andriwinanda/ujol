<template>
  <div>
    <div class="flat-card">
      <div class="card-content">
        <b-table class :data="qBankList" :loading="isLoading" :hoverable="true">
          <template slot="empty" v-if="!isLoading">
            <p
              class="dynamic-subtitle has-text-centered"
              style="padding: 10px"
            >No data available in table</p>
          </template>

          <template slot-scope="props">
            <b-table-column label="Title">{{ props.row.title }}</b-table-column>
            <b-table-column label="Decription" class="is-capitalized">{{ props.row.description }}</b-table-column>
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
        <!-- Pagination -->
        <div v-if="qBankList.length" class="column is-12">
          <nav class="pagination" role="navigation" aria-label="pagination">
            <b-button
              class="pagination-previous"
              icon-right="chevron-left"
              :disabled="indexPage < 1"
              @click="previousBank"
            />
            <b-button
              class="pagination-next"
              :disabled="indexPage >= (totalPage-1)"
              icon-right="chevron-right"
              @click="nextBank"
            />

            <p class="pagination-list dynamic-subtitle is-hidden-mobile">Page {{(indexPage+1)}}</p>
          </nav>
        </div>
        <b-button
          class="floating-btn"
          type="is-primary"
          size="is-medium"
          icon-right="plus"
          @click="$router.push('/questionbank/create')"
          rounded
        />
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
      qBankList: [],
      totalPage: 0,
      indexPage: 0
    };
  },
  methods: {
    getBank() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/question-bank`, {
          params: {
            access_token: this.$store.state.login.token,
            page: this.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          this.qBankList = data.content;
          this.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    nextBank() {
      if (this.indexPage < this.totalPage - 1) {
        this.indexPage++;
        this.getBank();
      }
    },
    previousBank() {
      this.indexPage--;
      this.getBank();
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
    this.getBank();
  }
};
</script>
<style lang="scss" scoped>
</style>