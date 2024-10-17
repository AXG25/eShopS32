// src/utils/whatsappUtils.js

export const sendWhatsAppMessage = (phoneNumber, message) => {
  const cleanedPhoneNumber = phoneNumber.replace(/\+/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};
