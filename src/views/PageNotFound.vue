<script setup>
import { useRouter} from "vue-router";

const router = useRouter();

const goToHome = (router) => {
  router.push({ name: 'home' })
}
</script>

<template>
  <section class="page_404">
    <div class="container-fluid">
      <div class="row test">
        <div class="col-sm-12">
          <div class="col-sm-10 col-sm-offset-1  text-center">
            <div class="four_zero_four_bg">
              <h1 class="text-center">404 - NOT FOUND</h1>
            </div>

            <div class="contant_box_404">
              <h3 class="h2">
                Looks like you're lost
              </h3>

              <p>The page you are looking for is not available!</p>

              <Button label="Go To Home" size="large" @click="goToHome(router)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page_404 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(90vh - var(--header-height));
}

.page_404  img {
  width: 100%;
}

.four_zero_four_bg {
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
  height: 400px;
  width: 121%;
  background-repeat: no-repeat;
  background-position: center;
}


.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.contant_box_404 {
  width: 121%;
}
</style>