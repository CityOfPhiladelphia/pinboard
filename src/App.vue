<template>
  <router-view />
</template>

<script>

import qs from 'qs';
import axios from 'axios';

export default {
  name: 'App',
  created () {
    console.log('route', this.$route.path)

    // this.$router.replace(this.$route.query.redirect || '/')
    // this.$router.push({ name: 'home'  });
  

    // if (this.$config.agoTokenNeeded) {

    //   let data = qs.stringify({
    //     'f': 'json',
    //     'username': process.env.VUE_APP_AGO_USERNAME,
    //     'password': process.env.VUE_APP_AGO_PASSWORD,
    //     'referer': 'https://www.mydomain.com' 
    //   });

    //   let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'https://www.arcgis.com/sharing/rest/generateToken',
    //     headers: { 
    //       'Content-Type': 'application/x-www-form-urlencoded', 
    //       // 'Authorization': 'Basic Og=='
    //     },
    //     data : data
    //   };

    //   axios.request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //     this.$store.commit('setAgoToken', response.data.token);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // }


  }
};

</script>
