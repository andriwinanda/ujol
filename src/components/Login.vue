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
              <b-input autofocus v-model="username" type="email" @keyup.enter.native="login" />
            </b-field>
            <div class="label">Password</div>
            <b-field>
              <b-input
                password-reveal
                type="password"
                v-model="password"
                @keyup.enter.native="login"
              />
            </b-field>
            <p class="dynamic-subtitle has-text-right">
              <small>
                <router-link to="/reset-password">Forgot password</router-link>
              </small>
            </p>
            <b-field>
              <b-button
                class="is-fullwidth"
                type="is-secondary"
                @click="login"
                :loading="isLoading"
              >Login</b-button>
            </b-field>
            <p class="dynamic-subtitle has-text-centered">
              <small>
                Don't have an account?
                <router-link to="/register" tag="a">Register</router-link>
              </small>
            </p>
          </div>
        </div>
      </div>
      <!-- <small>*) Harap masukan username aplikasi anda</small> -->
    </div>
  </div>
</template>
<script>
import { urlEncoded } from "../function-helper";
export default {
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      regex :/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    };
  },
  // mounted() {
  //   this.axios.get('/api/material')
  //   .then(response => {
  //     console.log(response)
  //   })
  // },
  methods: {
    login() {
      if ( this.password) {
        this.isLoading = true;
        let userLogin = {
          username: this.username,
          password: this.password,
          grant_type: "password"
        };

        const username = "area31-client";
        const password = "area31-secret";

        const token = Buffer.from(`${username}:${password}`, "utf8").toString(
          "base64"
        );

        this.axios
          .post("/oauth/token", urlEncoded(userLogin), {
            headers: {
              Authorization: `Basic ${token}`
            }
          })
          .then(res => {
            let token = res.data.access_token;
            this.axios
              .get("api/instructor/profile", {
                params: {
                  access_token: token
                }
              })
              .then(res => {
                let data = res.data.user;
                let user = {
                  id: data.idUser,
                  name: data.name
                };
                if (data.role == "ROLE_INSTRUCTOR") {
                  let data_login = {
                    token: token,
                    dataUser: data
                  };
                  this.$store.dispatch("login/login", data_login);
                  this.$buefy.toast.open({
                    duration: 1000,
                    message: "Login Success",
                    type: "is-light",
                    position: "is-top"
                  });
                  this.$router.push("/");
                  this.isLoading = false;
                }
              })
              .catch(e => {
                this.$buefy.toast.open({
                  duration: 1000,
                  message: "Access denied",
                  type: "is-danger",
                  position: "is-top"
                });
                this.isLoading = false;
                console.log(e);
              });
          })
          .catch(e => {
            this.$buefy.toast.open({
              duration: 1000,
              message: "username/password incorrect",
              type: "is-danger",
              position: "is-top"
            });
            this.isLoading = false;
            console.log(e);
          });
      } else {
        this.$buefy.toast.open({
          duration: 1000,
          message: "Data can't be null",
          type: "is-danger",
          position: "is-top"
        });
      }
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
