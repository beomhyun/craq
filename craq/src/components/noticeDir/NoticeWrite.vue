<template>
  <div class="form-control">
    <h2>공지사항</h2>

    <form action="" method="post" id="_frmForm" name="frmForm" @submit.prevent="addnotice" class="form-horizontal">
      <div class="form-control width-100%">
        <input type="text" name="title" v-model="title" class="form-control width-70%">
      </div>
      <textarea rows="10" cols="80" name="content" class="form-control width-100%" v-model="content"/>
      <div>
        <!-- <input type="text" name="filename" v-model="filename" readonly=true/> -->
        <div v-if="imageData.length > 0">
          <img class="preview" :src="imgDir" style="max-height : 500px;">
        </div>
        <input type="file" @change="previewImage" accept="image/*" class="form-control" />
      </div>
      <div>
        <button type="submit" class="btn btn-accept btn-sm" name="button" style="margin:5px;">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name : 'NoticeWrite',
  data() {
    return {
      imageData: "",
      title : "",
      content : "",
      imgDir : "",
      isManager : false,
    }
  },
  created() {

    this.$axios
    .get(`managers/2/${this.$session.get("userPk")}`)
    .then((res) => {
      // console.log(res.data);
      if(res.data.status === "fail") {
        this.isManager = false;
      }else {
        this.isManager = true;
      }
    })
  },
  methods : {
    addnotice() {
      if(this.title.length < 1) {
        alert("제목을 입력해 주세요~!")
        return;
      }
      if(this.content.length < 1) {
        alert("내용을 입력해 주세요~!")
        return;
      }

      this.$axios
      .post('contents/notices', {
          topic_id: 2,
          user_id: this.$session.get("userPk"),
          title: this.title,
          body: this.content,
          image: this.imageData
      })
      .then((res) => {
          console.log(res.data);
          this.$router.go(-1);
      })


      // this.isAddBoard = false;
      // this.$emit('childs-event', this.isAddBoard)
    },
    previewImage: function(event) {
        // Reference to the DOM input element
        var input = event.target;
        // Ensure that you have a file before attempting to read it
        if (input.files && input.files[0]) {
            // create a new FileReader to read this image and convert to base64 format
            var reader = new FileReader();
            // Define a callback function to run, when FileReader finishes its job
            reader.onload = (e) => {
                // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                // Read image as base64 and set to imageData
                this.imgDir = e.target.result;
                // this.filename = this.imageData;
            }
            // Start the reader job - read file as a data url (base64 format)
            reader.readAsDataURL(input.files[0]);

            const formData = new FormData();
            formData.append('image', input.files[0], input.files[0].name)

            this.$axios
            .post('contents/images', formData)
            .then((res) => {
              this.imageData = res.data.data
            })
        }
    }
  }
}

</script>

<style>

</style>
