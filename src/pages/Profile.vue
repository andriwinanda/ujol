<template>
  <div>
    <div class="flat-card" style="margin-bottom: 10px">
      <div class="section">
        <div class="columns">
          <div class="column is-4" style="padding-left: 2rem">
            <b-field label="Name">
              <b-input v-model="update.name" />
            </b-field>
            <b-field label="Email" message="Changing email will log you out">
              <b-input v-model="update.email" type="email" />
            </b-field>
            <b-field label="Phone number">
              <b-input v-model="update.phone" />
            </b-field>
            <b-field label="Password">
              ********
              <p>
                <small>
                  Change password?
                  <a @click="isComponentModalActive = true">Click here</a>
                </small>
              </p>
            </b-field>
            <br />
            <b-field class="has-text-centered">
              <b-button
                type="is-secondary"
                label="Save change"
                @click="updateProfile"
                :disabled="!update"
                :loading="isLoading"
                rounded
              />
            </b-field>
          </div>
          <div class="column has-text-centered">
            <img width="60%" src="../assets/imgs/person.svg" alt />
            <p class="has-text-secondary is-size-3">
              <strong>Update</strong> your info
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <b-modal
      :active.sync="isComponentModalActive"
      has-modal-card
      @close="oldPassword= ''
      newPassword= ''
      confirmPassword= ''"
      trap-focus
      ref="modalPassword"
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-modal
    >
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Change password</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Recent Password">
            <b-input
              type="password"
              v-model="oldPassword"
              password-reveal
              placeholder="Current password"
              required
            ></b-input>
          </b-field>
          <b-field label="New Password">
            <b-input
              type="password"
              v-model="newPassword"
              password-reveal
              placeholder="New password"
              required
            ></b-input>
          </b-field>
          <b-field label="Confirm Password">
            <b-input
              type="password"
              v-model="confirmPassword"
              password-reveal
              placeholder="Confirm password"
              validation-message="Password doesn't match"
              :pattern="newPassword != confirmPassword"
              required
            ></b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$refs.modalPassword.close()">Close</button>
          <b-button type="is-primary" :loading="isLoading" @click="changePassword()">Save change</b-button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      isComponentModalActive: false,
      update: {
        name: "",
        email: "",
        phone: ""
      },
      recentEmail: "",
      password: "",
      oldPassword: "",
      newPassword: null,
      confirmPassword: null,
      regex :/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

    };
  },
  methods: {
    getProfile() {
      this.isLoading = true;
      this.axios
        .get(`api/instructor/profile`, {
          params: {
            access_token: this.$store.state.login.token
          }
        })
        .then(res => {
          let data = res.data.user;
          this.update.name = data.name;
          this.update.email = data.email;
          this.update.phone = data.phone;
          this.recentEmail = data.email;
          this.password = data.password;
          this.isLoading = false;
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    updateProfile() {
      if (
        this.regex.test(this.update.email) &&
        this.update.name &&
        this.update.phone &&
        this.password
      ) {
        this.isLoading = true;
        this.axios
          .put(`api/instructor/user`, this.update, {
            params: {
              access_token: this.$store.state.login.token
            }
          })
          .then(res => {
            this.isLoading = false;
            this.$buefy.toast.open({
              duration: 1000,
              message: "Update user successful !",
              type: "is-light",
              position: "is-top"
            });
            if (this.update.email != this.recentEmail) {
              this.$store.dispatch("login/logout");
              this.$buefy.toast.open({
                duration: 1000,
                message: "Logged out",
                type: "is-light",
                position: "is-top"
              });
              this.$router.push("/login");
            } else {
              this.getProfile();
              this.$store.state.login.dataUser.name = this.update.name;
            }
          })
          .catch(err => {
            this.isLoading = false;
            this.$buefy.toast.open({
              duration: 1000,
              message: "Error",
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
    changePassword() {
      if (this.oldPassword && this.newPassword === this.confirmPassword) {
        this.isLoading = true;
        this.axios
          .put(
            `api/instructor/user`,
            {
              password: this.oldPassword
            },
            {
              params: {
                access_token: this.$store.state.login.token,
                new_password: this.newPassword
              }
            }
          )
          .then(res => {
            this.isLoading = false;
            this.$refs.modalPassword.close();
            this.$buefy.toast.open({
              duration: 1000,
              message: res.data.message,
              type: "is-light",
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
    }
  },
  created() {
    this.id = this.$route.params.idCourse;
    this.getProfile();
  },
  computed: {}
};
</script>
