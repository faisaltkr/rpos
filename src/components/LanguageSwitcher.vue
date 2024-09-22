<template>
  <div>
    <button @click="switchLanguage('en')">English</button>
    <button @click="switchLanguage('ar')">العربية</button>
  </div>
</template>

<script>
export default {
  methods: {
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }
};
</script>

<style>
button {
  margin: 5px;
}
</style>
