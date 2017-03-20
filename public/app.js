Vue.component('new-comment-form', {
  template: `
    <form class="submit-comment" @submit.prevent="onSubmit">
      <input v-model="form.email" type="email" placeholder="Email">
      <textarea v-model="form.message" placeholder="Message"></textarea>
      <div class="text-right">
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
  data: function() {
    return {
      form: {
        email: '',
        message: ''
      }
    }
  },
  methods: {
    onSubmit: function() {
      console.log('onSubmit', this.form)
    }
  }
})

Vue.component('comments-feed', {
  props: ['comments', 'is_fetching'],
  template: `
    <div class="comments-feed">
      <input v-model="filter" type="text" placeholder="Filter">
      <comments-item v-for="comment in comments" :email="comment.email" :message="comment.message" :key="comment.id"></comments-item>
      <spinner v-if="is_fetching"></spinner>
    </div>
  `,
  data: function() {
    return {
      filter: ''
    }
  }
})

Vue.component('comments-item', {
  props: ['email', 'message'],
  template: `
    <div class="comments-item">
      <img class="gravatar_img" :src="gravatar_link" />
      <div>
        <strong>{{ email }}</strong>
        <p v-html="html_message"></p>
      </div>
    </div>
  `,
  computed: {
    gravatar_link: function(data) {
      var gravatar_hash = md5(data.email.trim().toLowerCase())
      return `https://www.gravatar.com/avatar/${gravatar_hash}?s=50`
    },
    html_message: function(data) {
      return data.message.replace("\n", '<br>')
    }
  }
})

Vue.component('spinner', {
  template: `
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  `
})

var app = new Vue({
  el: '#app',
  data: {
    comments: [],
    is_fetching: false
  },
  mounted: function() {
    this.is_fetching = true
    axios.get('/api/feed')
      .then(function (response) {
        app.is_fetching = false
        app.comments = response.data.comments
      })
  }
})
