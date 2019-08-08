<template>
  <div>
    <form action="" method="post" id="_frmForm" name="frmForm" @submit.prevent="update" class="form-horizontal">
      <div class="form-control width-100%">
        <input type="text" name="title" v-model="title" class="form-control width-70%">
      </div>
      <textarea rows="10" cols="80" name="content" class="form-control width-100%" v-model="body"/>
      <div>
        <!-- <input type="text" name="filename" v-model="filename" readonly=true/> -->
        <div v-if="image.length > 0">
          <img class="preview" :src="image">
        </div>
        <input type="file" @change="editPreview" accept="image/*" class="form-control"/>
      </div>
      <div>
        <!-- <button @click="clearForm" class="btn btn-subtle btn-sm" style="margin:5px;">Clear</button> -->
        <button type="submit" class="btn btn-accept btn-sm" name="button" style="margin:5px;">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name : "FreeEdit",
  props : [
    'id',
    'freeInfo'
  ],
  data() {
    return {
      title : this.freeInfo.TITLE,
      body : this.freeInfo.BODY,
      image : this.freeInfo.IMAGE,
      imageData : this.freeInfo.IMAGE.split('/')[3],
    }
  },
  created() {
    // console.log(this.freeInfo)
    console.log(this.imageData)
  },
  methods : {
    update() {
      // axios
// alert("update")
      this.$axios
      .put(`contents/${this.freeInfo.PK}`, {
        id : this.freeInfo.PK,
        title : this.title,
        body : this.body,
        image : this.imageData
      })
      .then((res) => {
        this.$router.go(-1);
      })

    },
    editPreview: function(event) {
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
                this.image = e.target.result;
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
    },
  }
}
</script>

<style lang="scss" scoped>
.freeEdit {
    border-collapse: collapse;
    text-align: left;
    line-height: 1.5;
    border-top: 1px solid #ccc;
    border-left: 3px solid #369;
    margin : 20px 10px;

    &__th {
        width: 147px;
        padding: 10px;
        font-weight: bold;
        vertical-align: top;
        color: #153d73;
        border-top: 1px solid #ccc;
        /* border-right: 1px solid #ccc; */
        /* border-bottom: 1px solid #ccc; */

    }
    &__td {
        width: 349px;
        padding: 10px;
        vertical-align: top;
        border-top: 1px solid #ccc;
        /* border-right: 1px solid #ccc; */
        border-bottom: 1px solid #ccc;
    }
}
</style>
