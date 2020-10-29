<template>
  <div>
    <no-data v-if="!complaint.complaintList.length && !isLoading" />

    <template v-if="complaint.complaintList.length">
      <div class="flat-card">
        <div class="card-content">
          <b-table class :data="complaint.complaintList" :loading="isLoading" :hoverable="true">
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
    </template>
    <!-- <a
      class="has-text-centered dynamic-subtitle"
      v-if="complaint.indexPage < (complaint.totalPage - 1)"
      @click="moreChapter()"
    >
      <br />
      <p>Load more</p>
      <p>
        <b-icon icon="chevron-down" size="is-small"></b-icon>
      </p>
    </a>-->

    <p class="has-text-riprops.row.statusght float-btn">
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
          @click="filterComplaint(item.idCourse, item.name)"
          aria-role="listitem"
        >{{(item.name.length > 20)? item.name.substring(0,20)+'...': item.name}}</b-dropdown-item>
      </b-dropdown>
    </p>
  </div>
</template>
<script>
import NoData from "../../components/NoData.vue";
export default {
  components: {
    NoData
  },
  data() {
    return {
      isLoading: false,
      id: "",
      filter: {
        id: "",
        name: ""
      },
      courseList: [],
      complaint: {
        complaintList: [],
        totalPage: 0,
        indexPage: 0
      }
    };
  },
  methods: {
    filterComplaint(id, name) {
      this.filter.id = id;
      this.filter.name = name;
      this.id = id;
      this.$router.replace({
        query: { id: this.id }
      });
      this.complaint.totalPage = 0;
      this.complaint.indexPage = 0;
      this.complaint.complaintList = [];
      this.getComplaint();
    },
    resetFilter() {
      this.filter.id = "";
      this.filter.name = "";
      this.id = "";
      this.$router.replace({
        query: {}
      });
      this.complaint.totalPage = 0;
      this.complaint.indexPage = 0;
      this.complaint.complaintList = [];
      this.getComplaint();
    },
    getComplaint() {
      this.isLoading = true;
      let paramFilter = {
        access_token: this.$store.state.login.token,

        page: this.complaint.indexPage
      };
      if (this.id) paramFilter.id_course = this.id;
      this.axios
        .get(`/api/instructor/complaint`, {
          params: paramFilter
        })
        .then(res => {
          let data = res.data;
          data.content.map(el => {
            this.complaint.complaintList.push(el);
          });
          this.complaint.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    moreComplaint() {
      if (this.complaint.indexPage < this.complaint.totalPage - 1) {
        this.complaint.indexPage++;
        this.getComplaint();
        this.getComplaint();
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
        })
        .catch(err => {
          this.isLoading = false;
        });
    }
  },
  created() {
    let id = this.$route.query.id;
    this.filter.id = id;
    this.id = id;
    this.getCourseDetail();
    this.getCourse();
    this.getComplaint();
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