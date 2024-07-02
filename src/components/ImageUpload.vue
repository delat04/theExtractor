<template>
  <div>
    <h1>Image Text Extractor</h1>
    <input type="file" @change="onFileChange" accept="image/*" />
    <button @click="uploadImage" :disabled="!selectedImage">Upload and Extract Text</button>
    <button @click="copyText" :disabled="!extractedText">Copy All</button>
    <p v-if="extractedText">Extracted Text: {{ extractedText }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedImage: null,
      extractedText: '',
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedImage = event.target.files[0];
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append('image', this.selectedImage);

      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.extractedText = data.text;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    copyText() {
      if (!navigator.clipboard) {
        // Clipboard API not available
        console.error('Clipboard API not available');
        return;
      }

      navigator.clipboard.writeText(this.extractedText)
          .then(() => {
            console.log('Text copied to clipboard');
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err);
          });
    },
  },
};
</script>

<style scoped>
/* Add any styles you need here */
button {
  margin: 5px;
}
</style>
