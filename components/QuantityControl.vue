<template>
    <view class="quantity-controls">
        <view class="quantity-button" @click="decreaseQuantity">-</view>
        <view class="quantity-display">{{ quantity }}</view>
        <view class="quantity-button" @click="increaseQuantity">+</view>
    </view>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        productId: {
            type: Number,
            required: true
        }
    },
    computed: {
        quantity: {
            get() {
                return this.value;
            },
            set(newQuantity) {
                this.$emit('input', newQuantity);
            }
        }
    },
    methods: {
        decreaseQuantity() {
            if (this.quantity > 0) {
                this.quantity--;
            }
        },
        increaseQuantity() {
            this.quantity++;
        }
    }
};
</script>

<style scoped>
.quantity-controls {
    display: flex;
    align-items: center;
}

.quantity-button {
    background-color: #00BFFF;
    color: #FFFFFF;
    border: none;
    padding: 10rpx 15rpx;
    border-radius: 5rpx;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 24rpx;
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-button:hover {
    background-color: #00A2E8;
}

.quantity-display {
    background-color: #F5F5F5;
    color: #333333;
    border: 1rpx solid #E0E0E0;
    padding: 10rpx 15rpx;
    border-radius: 5rpx;
    font-size: 24rpx;
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10rpx;
}
</style>