<template>
  <div>
    <div class="flat-card" style="margin-bottom: 10px">
      <div class="card-content">
        <p>
          <span class="is-size-3 is-capitalized dynamic-title">{{root.title}}</span>
        </p>
        <br />
        <article class="message is-primary">
          <div class="message-body app-background">
            <p>
              <span class="has-text-weight-semibold is-size-5 is-capitalized">{{root.user}}</span>
              <small class="dynamic-subtitle">{{root.date | moment("from", "now")}}</small>
            </p>
            <p class="dynamic-subtitle">{{root.message}}</p>
            <p>
              <small>
                <a
                  class="dynamic-subtitle"
                  @click="showInput = true 
                  $refs['comment'].focus()"
                >
                  <b-icon icon="reply" size="is-small" />Reply
                </a>
              </small>
            </p>
          </div>
        </article>

        <!-- Write Comment -->
        <article class="media" v-if="showInput">
          <div class="media-content">
            <div class="field">
              <p class="control">
                <b-input
                  type="textarea"
                   v-if="showInput"
                  v-model="writeComment"
                  :ref="'comment'"
                  placeholder="Add a comment reply..."
                  :autofocus="true"
                />
              </p>
            </div>
            <div class="field">
              <p class="control has-text-right">
                <button
                  class="button"
                  @click="showInput = false
                    writeComment = ''"
                >Cancel</button>
                <b-button type="is-primary" :loading="isLoading" @click="postComment()">Send reply</b-button>
              </p>
            </div>
          </div>
        </article>
        <hr />

        <!-- Media -->
        <article class="media" v-for="(item, index) in comment.commentList" :key="item.idComment">
          <figure class="media-left rounded">
            <p class="image is-64x64">
              <img
                class="is-rounded"
                src="https://www.sejasa.com/assets/icons/profile_pic-9f51819994c099de0ac9fee7b3f9bb341d7181d5af9eb33ec4fc7fc98b9bbb95.png"
              />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p class="dynamic-title">
                <strong class="dynamic-title">{{item.name}}</strong>
                <small
                  v-if="item.updatedAt"
                  class="dynamic-subtitle"
                >Editted {{ new Date(item.updatedAt) | moment("from", "now")}}</small>
                <small
                  v-else
                  class="dynamic-subtitle"
                >{{ new Date(item.createdAt) | moment("from", "now")}}</small>
                <br />
                {{item.body}}
                <br />
                <small>
                  <a class="dynamic-subtitle" @click="item.showInput = true">
                    <b-icon icon="reply" size="is-small" />Reply
                  </a>
                  <template v-if="item.idUser == idUser ">
                    ·
                    <a
                      class="dynamic-subtitle"
                      @click="item.writeComment = item.body
                     item.showEdit = true"
                    >
                      <b-icon icon="pencil" size="is-small" />Edit
                    </a>
                  </template>
                  ·
                  <a
                    class="dynamic-subtitle"
                    @click="deleteReply(item.idComment, 'comment', index)"
                  >
                    <b-icon icon="delete" size="is-small" />Delete
                  </a>
                  <template v-if="item.totalReplies && !item.showReply">
                    ·
                    <a
                      @click="item.showReply = true
                      if(!item.replies.length)loadReply(item.idComment, index)"
                    >Show {{item.totalReplies > 1?`${item.totalReplies} replies`: 'reply'}} &#8628;</a>
                  </template>
                  <template v-else-if="item.totalReplies && item.showReply">
                    ·
                    <a
                      @click="
                      item.showReply = false"
                    >Hide {{item.totalReplies > 1?`${item.totalReplies} replies`: 'reply'}} &#8624;</a>
                  </template>
                </small>
              </p>
            </div>

            <!-- Write Replies -->
            <article class="media" v-if="item.showInput">
              <div class="media-content">
                <b-field>
                  <b-input
                    type="textarea"
                    v-model="item.writeComment"
                    placeholder="Add a reply..."
                  />
                </b-field>
                <div class="field">
                  <p class="control has-text-right">
                    <button
                      class="button"
                      @click="item.showInput = false
                    item.writeComment = ''"
                    >Cancel</button>
                    <b-button
                      type="is-primary"
                      :loading="item.isRepliesLoading"
                      @click="postReply(item.idComment, item.writeComment, index)"
                    >Send reply</b-button>
                  </p>
                </div>
              </div>
            </article>

            <!-- Edit Comment -->
            <article class="media" v-if="item.showEdit">
              <div class="media-content">
                <b-field>
                  <b-input
                    type="textarea"
                    v-model="item.writeComment"
                    placeholder="Add a reply..."
                  />
                </b-field>
                <div class="field">
                  <p class="control has-text-right">
                    <button
                      class="button"
                      @click="item.showEdit = false
                    item.writeComment = ''"
                    >Cancel</button>
                    <b-button
                      type="is-primary"
                      :loading="isLoading"
                      @click="postEdit(item.idComment, item.writeComment)"
                    >Send update</b-button>
                  </p>
                </div>
              </div>
            </article>

            <!-- Replies -->
            <template v-if="item.showReply">
              <template v-if="item.replies.length">
                <article class="media" v-for="(reply) in item.replies" :key="reply.idReplies">
                  <figure class="media-left rounded">
                    <p class="image is-64x64">
                      <img
                        class="is-rounded"
                        src="https://www.sejasa.com/assets/icons/profile_pic-9f51819994c099de0ac9fee7b3f9bb341d7181d5af9eb33ec4fc7fc98b9bbb95.png"
                      />
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p class="dynamic-title">
                        <strong class="dynamic-title">{{reply.name}}</strong>
                        <small
                          v-if="reply.updatedAt"
                          class="dynamic-subtitle"
                        >Editted {{ new Date(reply.updatedAt) | moment("from", "now")}}</small>
                        <small
                          v-else
                          class="dynamic-subtitle"
                        >{{ new Date(reply.createdAt) | moment("from", "now")}}</small>
                        <br />
                        {{reply.body}}
                        <br />

                        <small v-if="reply.idUser == idUser ">
                          <a
                            class="dynamic-subtitle"
                            @click="reply.writeComment = reply.body
                           reply.showEdit = true"
                          >
                            <b-icon icon="pencil" size="is-small" />Edit
                          </a>
                          ·
                        </small>
                        <a
                          class="dynamic-subtitle"
                          @click="deleteReply(reply.idReplies, 'replies', index )"
                        >
                          <b-icon icon="delete" size="is-small" />Delete
                        </a>
                      </p>

                      <!-- Edit Replies -->
                      <article class="media" v-if="reply.showEdit">
                        <div class="media-content">
                          <b-field>
                            <b-input
                              type="textarea"
                              v-model="reply.writeComment"
                              placeholder="Add a reply..."
                            />
                          </b-field>
                          <div class="field">
                            <p class="control has-text-right">
                              <button
                                class="button"
                                @click="reply.showEdit = false
                                 reply.writeComment = ''"
                              >Cancel</button>
                              <b-button
                                type="is-primary"
                                :loading="item.isRepliesLoading"
                                @click="postEdit(reply.idReplies, reply.writeComment, index)"
                              >Send update</b-button>
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>
                  </div>
                </article>
              </template>

              <!-- Skeleton -->

              <template v-if="item.isRepliesLoading && item.showReply">
                <article class="media" v-for="i in item.totalReplies" :key="i">
                  <figure class="media-left">
                    <p class="image is-64x64">
                      <b-skeleton circle width="64px" height="64px"></b-skeleton>
                    </p>
                  </figure>
                  <div class="media-content">
                    <div class="content">
                      <p>
                        <b-skeleton active width="200px"></b-skeleton>
                        <b-skeleton height="50px"></b-skeleton>
                      </p>
                    </div>
                    <a>
                      <b-skeleton width="64px"></b-skeleton>
                    </a>
                  </div>
                </article>
              </template>

              <small>
                <a
                  class="more dynamic-subtitle"
                  v-if="item.indexPage < (item.totalPage - 1)"
                >&#8627; Show more replies</a>
              </small>
            </template>
          </div>
        </article>

        <!-- Skeleton -->
        <template v-if="isLoading">
          <article class="media" v-for="i in 5" :key="i">
            <figure class="media-left">
              <p class="image is-64x64">
                <b-skeleton circle width="64px" height="64px"></b-skeleton>
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <b-skeleton active width="200px"></b-skeleton>
                  <b-skeleton height="80px"></b-skeleton>
                </p>
              </div>
              <a>
                <b-skeleton width="64px"></b-skeleton>
              </a>
            </div>
          </article>
        </template>

        <p class="has-text-centered" v-if="comment.indexPage < (comment.totalPage - 1)">
          <small>
            <a class="more dynamic-subtitle" @click="moreComment()">
              Show more
              <b-icon icon="chevron-down" size="is-small"></b-icon>
            </a>
          </small>
        </p>
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
      showInput: false,
      writeComment: "",
      root: {},
      comment: {
        commentList: [],
        totalPage: 0,
        indexPage: 0
      }
    };
  },
  methods: {
    
    loadComment() {
      this.isLoading = true;

      this.axios
        .get(`api/instructor/course/qna/comment`, {
          params: {
            access_token: this.$store.state.login.token,
            id_post: this.root.id,
            page: this.comment.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          data.content.map(el => {
            el.replies = [];
            el.showReply = false;
            el.isRepliesLoading = false;
            el.showInput = false;
            el.showEdit = false;
            this.comment.commentList.push(el);
          });
          this.comment.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    moreComment() {
      if (this.comment.indexPage < this.comment.totalPage - 1) {
        this.comment.indexPage++;
        this.loadComment();
      }
    },
    loadReply(id, index) {
      this.comment.commentList[index].isRepliesLoading = true;
      this.axios
        .get(`api/instructor/course/qna/replies`, {
          params: {
            access_token: this.$store.state.login.token,
            id_comment: id,
            page: this.comment.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          data.content.map(el => {
            el.showEdit = false;
            this.comment.commentList[index].replies.push(el);
          });
          this.comment.commentList[index].totalPage = data.totalPages;
          this.comment.commentList[index].indexPage = 0;
          this.comment.commentList[index].isRepliesLoading = false;
        })
        .catch(err => {
          this.comment.commentList[index].isRepliesLoading = false;
        });
    },
    moreReplies() {
      if (
        this.comment.commentList[index].indexPage <
        this.comment.commentList[index].totalPage - 1
      ) {
        this.comment.commentList[index].indexPage++;
        this.getReplies();
      }
    },
    postComment() {
      this.isLoading = false;
      this.axios
        .post(`/api/instructor/course/qna/comment`, "", {
          params: {
            access_token: this.$store.state.login.token,
            body: this.writeComment,
            id_post: this.root.id
          }
        })
        .then(res => {
          // this.shortcutList = res.data;
          this.$buefy.toast.open({
            duration: 1000,
            message: "Reply submitted",
            type: "is-light",
            position: "is-top"
          });
          this.writeComment = "";
          this.showInput = false;
          this.isLoading = false;
          this.comment.totalPage = 0;
          this.comment.indexPage = 0;
          this.comment.commentList = [];
          this.loadComment();
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    postReply(id, message, index) {
      this.comment.commentList[index].isRepliesLoading = true;
      this.axios
        .post(`/api/instructor/course/qna/replies`, "", {
          params: {
            access_token: this.$store.state.login.token,
            body: message,
            id_comment: id
          }
        })
        .then(res => {
          // this.shortcutList = res.data;
          this.$buefy.toast.open({
            duration: 1000,
            message: "Reply submitted",
            type: "is-light",
            position: "is-top"
          });
          this.comment.commentList[index].writeComment = "";
          this.comment.commentList[index].showInput = false;
          this.comment.commentList[index].isRepliesLoading = false;
          if (this.comment.commentList[index].showReply) {
            this.comment.commentList[index].totalPage = 0;
            this.comment.commentList[index].indexPage = 0;
          }
          this.comment.commentList[index].showReply = true;
          this.comment.commentList[index].totalReplies++;
          this.comment.commentList[index].replies = [];
          this.loadReply(id, index);
        })
        .catch(err => {
          this.comment.commentList[index].isRepliesLoading = false;
        });
    },
    postEdit(id, message, index) {
      index
        ? (this.comment.commentList[index].isRepliesLoading = true)
        : (this.isLoading = true);
      let requestBody = {
        access_token: this.$store.state.login.token,
        body: message
      };
      index ? (requestBody.id_replies = id) : (requestBody.id_comment = id);
      this.axios
        .put(
          `/api/instructor/course/qna/${index ? "replies" : "comment"}`,
          "",
          { params: requestBody }
        )
        .then(res => {
          // this.shortcutList = res.data;
          this.$buefy.toast.open({
            duration: 1000,
            message: "Edit sumitted",
            type: "is-light",
            position: "is-top"
          });

          if (index) {
            this.comment.commentList[index].writeComment = "";
            this.comment.commentList[index].showEdit = false;
            this.comment.commentList[index].totalPage = 0;
            this.comment.commentList[index].indexPage = 0;
            this.comment.commentList[index].isRepliesLoading = false;
            this.comment.commentList[index].showReply = true;
            this.comment.commentList[index].replies = [];
            this.loadReply(this.comment.commentList[index].idComment, index);
          } else {
            this.writeComment = "";
            this.showInput = false;
            this.isLoading = false;
            this.comment.totalPage = 0;
            this.comment.indexPage = 0;
            this.comment.commentList = [];
            this.loadComment();
          }
        })
        .catch(err => {
          index
            ? (this.comment.commentList[index].isRepliesLoading = false)
            : (isLoading = false);
        });
    },
    deleteReply(id, type, index) {
      let requestBody = {
        access_token: this.$store.state.login.token
      };
      if (type == "comment") requestBody.id_comment = id;
      if (type == "replies") requestBody.id_replies = id;
      this.$buefy.dialog.confirm({
        title: "Deleting post",
        message:
          "Are you sure you want to <b>delete</b> this post? This action cannot be undone.",
        confirmText: "Delete Post",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          console.log(index);

          this.axios
            .delete(`/api/instructor/course/qna/${type}`, {
              params: requestBody
            })
            .then(res => {
              this.$buefy.toast.open("Post deleted!");
              if (index) {
                // console.log(index);
                this.comment.commentList[index].totalPage = 0;
                this.comment.commentList[index].indexPage = 0;
                this.comment.commentList[index].replies = [];
                this.comment.commentList[index].showReply = true;
                this.loadReply(
                  this.comment.commentList[index].idComment,
                  index
                );
              } else {
                this.comment.totalPage = 0;
                this.comment.indexPage = 0;
                this.comment.commentList = [];
                this.loadComment();
              }
            })
            .catch(err => {
              this.$buefy.toast.open("Error!");
            });
        }
      });
    }
  },
  created() {
    this.root = this.$route.query;
    this.loadComment();
  },
  computed: {
    ...mapState({
      idUser: state => state.login.dataUser.idUser
    })
  },
  directives: {
    focus: {
      inserted: function(el) {
        Vue.nextTick(() => el.focus()); // <======== changed this line
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.more {
  padding-left: 64px;
  margin-top: 30px !important;
}
</style>