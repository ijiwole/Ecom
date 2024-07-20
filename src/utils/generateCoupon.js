const generateCouponCode = () => {
    return 'COUPON-' + Math.random().toString(36).substring(2, 11).toUpperCase();
};

export default generateCouponCode;
