<template>
  <div class="section">
    <div class="formToken">
      <div class="flat-card">
        <div class="card-content">
          <img style="margin: auto; display: block" width="100" src="../assets/logo.png" alt />
          <br />
          <div class="content">
            <div class="label">Email</div>
            <b-field>
              <b-input
                autofocus
                placeholder="example@example.com"
                v-model="email"
                type="email"
                required
              />
            </b-field>
            <template v-if="showResetCode">
              <b-field label="Reset Code" />
              <b-field grouped>
                <b-input expanded placeholder="Check your email for that code" type="number" v-model="resetCode" />
                <p class="control">
                  <button class="button is-primary" @click="sendEmail()" :disabled="timer>0">{{timer?counterFormat(timer*1000):'Resend code'}}</button>
                </p>
              </b-field>
            </template>
            <template v-if="showNewPassword">
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
            </template>
            <template>
              <b-field v-if="showNewPassword">
                <b-button
                  class="is-fullwidth"
                  type="is-secondary"
                  @click="resetPassword()"
                  :loading="isLoading"
                >Reset Password</b-button>
              </b-field>
              <b-field v-else-if="showResetCode">
                <b-button
                  class="is-fullwidth"
                  type="is-secondary"
                  @click="sendCode()"
                  :loading="isLoading"
                >Send</b-button>
              </b-field>
              <b-field v-else>
                <b-button
                  class="is-fullwidth"
                  type="is-secondary"
                  @click="sendEmail()"
                  :loading="isLoading"
                >Send code</b-button>
              </b-field>
              <p class="dynamic-subtitle has-text-centered">
                <small>
                  <router-link to="/login" tag="a">Back to Login</router-link>
                </small>
              </p>
            </template>
          </div>
        </div>
      </div>
      <!-- <small>*) Harap masukan username aplikasi anda</small> -->
    </div>
  </div>
</template>


<script>
import * as moment from 'moment'
import { urlEncoded } from "../function-helper";
export default {
  data() {
    return {
      email: "",
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
      isLoading: false,
      showResetCode: false,
      showNewPassword: false,
      timer: 0,
      regex: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    };
  },
  methods: {
    sendEmail() {
      if (this.regex.test(this.email)) {
        this.isLoading = true;
        this.axios
          .post(
            "forgot-password",
            {},
            {
              params: {
                email: this.email
              }
            }
          )
          .then(res => {
            this.isLoading = false;
            this.showResetCode = true;
            this.timer = 60
            this.countDownTimer()
            this.$buefy.toast.open({
              duration: 1000,
              message: "Code sent",
              type: "is-secondary",
              position: "is-top"
            });
          })
          .catch(err => {
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            });
            this.isLoading = false;
            console.log(e);
          });
      } else {
        this.$buefy.toast.open({
          duration: 1000,
          message: "Invalid format",
          type: "is-danger",
          position: "is-top"
        });
      }
    },
    sendCode() {
      if (this.resetCode) {
        this.isLoading = true;
        this.axios
          .post(
            "forgot-password/code",
            {},
            {
              params: {
                email: this.email,
                code: this.resetCode
              }
            }
          )
          .then(res => {
            this.showResetCode = false;
            this.showNewPassword = true;
            this.isLoading = false;
            this.$buefy.toast.open({
              duration: 1000,
              message: res.data.message,
              type: "is-secondary",
              position: "is-top"
            });
          })
          .catch(err => {
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            });
            this.isLoading = false;
            console.log(e);
          });
      }
    },
    resetPassword() {
      if (this.newPassword && this.newPassword === this.confirmPassword) {
        this.isLoading = true;

        this.axios
          .post(
            "forgot-password/resetPassword",
            {},
            {
              params: {
                email: this.email,
                code: this.resetCode,
                password: this.newPassword
              }
            }
          )
          .then(res => {
            this.showResetCode = false;
            this.isLoading = false;

            this.$buefy.toast.open({
              duration: 1000,
              message: res.data.message,
              type: "is-secondary",
              position: "is-top"
            });
            this.$router.push("/login");
          })
          .catch(err => {
            this.$buefy.toast.open({
              duration: 1000,
              message: err.response.data.message,
              type: "is-danger",
              position: "is-top"
            });
            this.isLoading = false;
            console.log(e);
          });
      }
    },
    countDownTimer() {
      if (this.timer > 0) {
        setTimeout(() => {
          this.timer -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
    counterFormat(timer){
      return moment(timer).format("mm:ss");
    }
  }
};
</script>
<style scoped>
.formToken {
  width: 400px;
  margin: auto;
}
</style>
