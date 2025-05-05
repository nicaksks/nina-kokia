module.exports.calcPoints = calcPoints = (rating) => {

      let points

      if(rating > 0 && rating < 799) {
        points = 0;
      } else if(rating >= 800 && rating < 899) {
        points = 800;
      } else if(rating >= 900 && rating < 999) {
        points = 900;
      } else if(rating >= 1000 && rating < 1099) {
        points = 1000;
      } else if(rating >= 1100 && rating < 1199) {
        points = 1100;
      } else if(rating >= 1200 && rating < 1299) {
        points = 1200;
      } else if(rating >= 1300 && rating < 1399) {
        points = 1300;
      } else if(rating >= 1400 && rating < 1499) {
        points = 1400;
      } else if(rating >= 1500 && rating < 1599) {
        points = 1500;
      } else if(rating >= 1600 && rating < 1699) {
        points = 1600;
      } else if(rating >= 1700 && rating < 1799) {
        points = 1700;
      } else if(rating >= 1800 && rating < 1899) {
        points = 1800;
      } else if(rating >= 1900 && rating < 1999) {
        points = 1900;
      } else if(rating >= 2000 && rating < 2099) {
        points = 2000;
      } else if(rating >= 2100 && rating < 2199) {
        points = 2100;
      } else if(rating >= 2200 && rating < 2299) {
        points = 2200;
      } else if(rating >= 2300 && rating < 2399) {
        points = 2300;
      } else if(rating >= 2400 && rating < 2499) {
        points = 2400;
      } else if(rating >= 2500 && rating < 2599) {
        points = 2500;
      } else if(rating >= 2600 && rating < 2699) {
        points = 2600;
      } else if(rating >= 2700 && rating < 2799) {
        points = 2700;
      } else if(rating >= 2800) {
        points = 2800;
      } else {
        points = 0;
      }

      return points;
};