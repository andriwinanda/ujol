<template>
  <div>
    <no-data v-if="!chapter.chapterList.length && !isLoading" />

    <div v-for="(item) in chapter.chapterList" :key="item.idChapter">
      <div class="flat-card" style="margin-bottom: 10px">
        <div class="card-content">
          <p class="is-size-4 is-capitalized dynamic-title">
            {{item.title}}
            <b-dropdown aria-role="list" position="is-bottom-left" class="is-pulled-right">
              <a class="dynamic-subtitle" slot="trigger" role="button">
                <b-icon icon="dots-vertical" size="is-small" type="is-grey"></b-icon>
              </a>
              <b-dropdown-item aria-role="listitem" @click="deleteChapter(item.idChapter)">Delete</b-dropdown-item>
            </b-dropdown>
          </p>
          <p class="dynamic-subtitle">{{item.description}}</p>
          <div class="has-text-right">
            <b-button
              type="is-secondary"
              size="is-small"
              @click="editChapter(item)"
              rounded
            >Edit Chapter</b-button>
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
      v-if="chapter.indexPage < (chapter.totalPage - 1)"
      @click="moreChapter()"
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
      @click="isChapterModalActive = true"
      rounded
    />

    <!-- ========== Chapter Modal ========= -->
    <b-modal
      :active.sync="isChapterModalActive"
      @close="chapterClose()"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
    >
      <form>
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p
              class="modal-card-title"
            >{{chapter.create.idChapter? 'Edit Chapter': 'Create New Chapter'}}</p>
          </header>
          <section class="modal-card-body">
            <b-field label="Title">
              <b-input v-model="chapter.create.title" required></b-input>
            </b-field>

            <b-field label="Description">
              <b-input v-model="chapter.create.description" required></b-input>
            </b-field>
            <b-field label="Lecture Note">
              <ckeditor
                id="editor"
                :editor="chapter.editor"
                v-model="chapter.create.lectureNote"
                :config="chapter.editorConfig"
              ></ckeditor>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <button
              class="button"
              type="button"
              @click.prevent="isChapterModalActive = false 
            chapterClose()"
            >Close</button>
            <b-button :loading="isLoading" type="is-primary" @click.prevent="submitChapter()">Submit</b-button>
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>
<script>
// import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import NoData from "../../components/NoData.vue";
import UploadAdapter from "../../UploadAdapter.js";

export default {
  props: ["id"],
  components: {
    NoData
  },
  data() {
    return {
      isLoading: false,
      isChapterModalActive: false,

      chapter: {
        chapterList: [],
        totalPage: 0,
        indexPage: 0,
        create: {
          idChapter: "",
          title: "",
          description: "",
          lectureNote: "",
          idCourse: ""
        },
        editor: ClassicEditor,
        editorConfig: {
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            "|",
            "imageUpload",
            "mediaEmbed",
            "|",
            "undo",
            "redo"
          ],
          table: {
            toolbar: ["tableColumn", "tableRow", "mergeTableCells"]
          },
          extraPlugins: [this.uploader],
          language: "nl"
        }
      }
    };
  },
  methods: {
    getChapter() {
      this.isLoading = true;
      this.axios
        .get(`/api/instructor/chapter`, {
          params: {
            access_token: this.$store.state.login.token,
            id_course: this.id,
            page: this.chapter.indexPage
          }
        })
        .then(res => {
          let data = res.data;
          data.content.map(el => {
            this.chapter.chapterList.push(el);
          });
          this.chapter.totalPage = data.totalPages;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    moreChapter() {
      if (this.chapter.indexPage < this.chapter.totalPage - 1) {
        this.chapter.indexPage++;
        this.getChapter();
      }
    },
    editChapter(item) {
      this.chapter.create = item;
      this.isChapterModalActive = true;
    },
    chapterClose() {
      this.chapter.create = {
        idChapter: "",
        title: "",
        description: "",
        lectureNote: "",
        idCourse: ""
      };
    },
    deleteChapter(id) {
      this.$buefy.dialog.confirm({
        title: "Deleting chapter",
        message:
          "Are you sure you want to <b>delete</b> this chapter? This action cannot be undone.",
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.isLoading = true;
          this.axios
            .delete(`api/instructor/chapter/delete`, {
              params: {
                access_token: this.$store.state.login.token,
                id_chapter: id
              }
            })
            .then(res => {
              this.$buefy.toast.open("Chapter deleted!");
              this.chapter.totalPage = 0;
              this.chapter.indexPage = 0;
              this.chapter.chapterList = [];
              this.isLoading = true;
              this.getChapter();
            })
            .catch(err => {
              this.$buefy.toast.open("Error!");
              this.isLoading = true;
            });
        }
      });
    },
    submitChapter() {
      let submit;
      let data = this.chapter.create;
      if (data.title && data.description && data.lectureNote) {
        this.isLoading = true;
        data.idCourse = this.id;
        if (this.id) {
          submit = this.axios.post(`/api/instructor/chapter/create`, data, {
            params: {
              access_token: this.$store.state.login.token
            }
          });
        } else {
          delete data.idChapter;
          submit = this.axios.post("/api/instructor/chapter/create", data, {
            params: {
              access_token: this.$store.state.login.token
            }
          });
        }
        submit
          .then(res => {
            this.chapter.totalPage = 0;
            this.chapter.indexPage = 0;
            this.chapter.chapterList = [];
            this.isChapterModalActive = false;
            this.getChapter();
            this.isLoading = false;
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
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
        return new UploadAdapter(loader);
      };
    }
  },
  created() {
    this.getChapter();
  }
};
</script>