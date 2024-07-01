<template>
  <div>
    <video ref="video" autoplay></video>
    <button @click="takePicture">Take Picture</button>
    <canvas ref="canvas" style="display: none;"></canvas>
    <img :src="photo" v-if="photo" alt="photo"/>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression';

export default {
  data() {
    return {
      photo: null,
    };
  },
  mounted() {
    console.log('Mounted: Initializing camera');
    this.initCamera();
  },
  methods: {
    async initCamera() {
      try {
        console.log('Initializing camera');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = stream;
        console.log('Camera initialized');
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    },
    async takePicture() {
      console.log('Taking picture');
      const canvas = this.$refs.canvas;
      const video = this.$refs.video;

      // Set canvas dimensions to match the video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob
      canvas.toBlob(async (blob) => {
        try {
          // Compress the image using browser-image-compression
          const options = {
            maxSizeMB: 1, // Maximum size in MB
            maxWidthOrHeight: 1920, // Max width or height
            useWebWorker: true, // Use web worker for faster compression
          };
          const compressedBlob = await imageCompression(blob, options);

          // Convert compressed Blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(compressedBlob);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.photo = base64data;

            // Store the compressed image in local storage
            localStorage.setItem('photo', base64data);
            console.log('Picture taken, compressed, and stored in local storage');
          };
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }, 'image/jpeg');
    },
  },
};
</script>

<style scoped>
video {
  width: 100%;
  height: auto;
}
</style>
