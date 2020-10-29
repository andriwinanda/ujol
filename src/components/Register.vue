<template>
  <div class="section">
    <div class="formToken">
      <div class="flat-card">
        <div class="card-content">
          <img style="margin: auto; display: block" width="100" src="../assets/logo.png" alt />
          <br />
          <div class="content">
            <div class="label">Name</div>
            <b-field>
              <b-input autofocus v-model="name" @keyup.enter.native="login" />
            </b-field>
            <div class="label">Email</div>
            <b-field>
              <b-input autofocus v-model="email" type="email" @keyup.enter.native="login" />
            </b-field>
            <div class="label">Phone</div>
            <b-field>
              <b-input autofocus v-model="phone" type="number" @keyup.enter.native="login" />
            </b-field>
            <div class="label">Password</div>
            <b-field>
              <b-input
                password-reveal
                type="password"
                v-model="password"
                @keyup.enter.native="register"
              />
            </b-field>
            <b-field>
              <b-button
                class="is-fullwidth"
                type="is-secondary"
                @click="register"
                :loading="isLoading"
              >Register</b-button>
            </b-field>
            <p class="dynamic-subtitle has-text-centered">
              <small>
                Already have an account?
                <a @click="$router.push('/login')">Login</a>
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
      email: "",
      password: "",
      name: "",
      phone: "",
      role: "ROLE_INSTRUCTOR",
      isLoading: false,
      regex :/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

    };
  },
  methods: {
    register() {
      let data = {
        email: this.email,
        password: this.password,
        name: this.name,
        phone: this.phone,
        role: this.role
      };

      // axios.post(url, {
      //   headers: {
      //     Authorization: `Basic ${token}`
      //   }
      // });
      if (this.regex.test(data.email )&& data.password && data.name && data.phone) {
        this.isLoading = true;
        this.axios
          .post("/api/user", data)
          .then(res => {
            this.isLoading = false;
            this.$buefy.toast.open({
              duration: 1000,
              message: "Register successful !",
              type: "is-light",
              position: "is-top"
            });
            this.$router.push("/login");

            // this.$router.push('/')
          })
          .catch(e => {
            this.$buefy.toast.open({
              duration: 1000,
              message: "Register failed",
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
