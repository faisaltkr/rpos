<template>
    <div :class="[$i18n.locale === 'ar' ? 'rtl' : 'ltr']" class="window w-screen h-screen overflow-hidden">
      <HeaderNav></HeaderNav>

    </div>
 </template>    


<script>
import HeaderNav from '@/components/HeaderNav.vue';
export default {
    components: {
      HeaderNav,
    },
    data() {
      return {

      }
    }
  }

</script>