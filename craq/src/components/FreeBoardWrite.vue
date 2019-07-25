<template>
  <div>
    <h2>{{boardName}}</h2>

    <form action="" method="post" id="_frmForm" name="frmForm" @submit.prevent="addfreeBoard" class="form-horizontal">
      <div>
        <select v-model="selected">
          <!-- inline object literal -->
          <option v-bind:value="Notice">Notice</option>
          <option v-bind:value="Chat">Chat</option>
        </select>
        <input type="text" name="title" v-model="title">
      </div>
      <textarea rows="10" cols="30" name="content" class="form-control" v-model="content"/>
      <div>
        <!-- <input type="text" name="filename" v-model="filename" readonly=true/> -->
        <input type="file" @change="previewImage" accept="image/*"/>
      </div>
      <div>
        <button @click="clearForm">Clear</button>
        <button type="submit" class="btn btn-primary btn-sm" name="button" @click="submitForm">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>

export default {
  name : 'FreeBoardWrite',
  props : {
    freeState : {type: String, default: 'addboard'}
  },
  data() {
    return {
      boardName : this.$route.params.topic,
      imageData: "",
      selected : "",
      title : "",
      content : "",
      filename : "",
    }
  },
  methods : {
    clearForm() {

    },
    submitForm() {
      this.freeState = 'freeboard';
      this.$emit('childs-event', this.freeState)
    },
    addfreeBoard() {
      // axios.post('http://192.168.31.58:10123/api-docs/', {
      //   topic : '',
      //   user_name : '',
      //   title : '',
      //   content : '',
      // }).
      // then((response) => {
      //
      // })
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
                this.imageData = e.target.result;
                this.filename = this.imageData;
            }
            // Start the reader job - read file as a data url (base64 format)
            reader.readAsDataURL(input.files[0]);
        }
    }
  }
}

</script>

<style>

</style>
