<template>
  <div>
    <div class="row">
      <div class="columns is-vcentered">
        <div class="column is-6">
          <img src="../assets/imgs/NotFound.svg" alt />
        </div>
        <div class="column is-5">
          <span class="dynamic-subtitle">
            <b class="is-size-3">Awww.. Dont Cry</b>
            <br />it just 404 Error !
            <br />What you look'in for have been missplaced in Long Term Memory
            <br />
            <a class="has-text-primary" @click="$router.push('/dashboard')">&laquo; Back to dashboard</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>