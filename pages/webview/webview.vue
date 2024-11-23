<template>
	<view>
		<web-view :src="path"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				path: ""
			}
		},
		onLoad(option) {
			this.path = decodeURIComponent(option.path)
		}
	}
</script>