module.exports.calcElo = calcElo = (rating) => {

      let name

      if(rating >= 0 && rating <= 899) {
        name = 'Novato(a) 3';
      } else if(rating >= 900 && rating <= 999) {
        name = 'Novato(a) 2 ';
      } else if(rating >= 1000 && rating <= 1099) {
        name = 'Novato(a) 1';
      } else if(rating >= 1100 && rating <= 1199) {
        name = 'Bronze 3';
      } else if(rating >= 1200 && rating <= 1299) {
        name = 'Bronze 2';
      } else if(rating >= 1300 && rating <= 1399) {
        name = 'Bronze 1';
      } else if(rating >= 1400 && rating <= 1499) {
        name = 'Prata 3';
      } else if(rating >= 1500 && rating <= 1599) {
        name = 'Prata 2';
      } else if(rating >= 1600 && rating <= 1699) {
        name = 'Prata 1';
      } else if(rating >= 1700 && rating <= 1799) {
        name = 'Ouro 3';
      } else if(rating >= 1800 && rating <= 1899) {
        name = 'Ouro 2';
      } else if(rating >= 1900 && rating <= 1999) {
        name = 'Ouro 1';
      } else if(rating >= 2000 && rating <= 2099) {
        name = 'Platina 3';
      } else if(rating >= 2100 && rating <= 2199) {
        name = 'Platina 2';
      } else if(rating >= 2200 && rating <= 2299) {
        name = 'Platina 1';
      } else if(rating >= 2300 && rating <= 2399) {
        name = 'Diamante 3';
      } else if(rating >= 2400 && rating <= 2499) {
        name = 'Diamante 2';
      } else if(rating >= 2500 && rating <= 2599) {
        name = 'Diamante 1';
      } else if(rating >= 2600 && rating <= 2699) {
        name = 'Desafiante 3';
      } else if(rating >= 2700 && rating <= 2799) {
        name = 'Desafiante 2';
      } else if(rating >= 2800 && rating <= 2899) {
        name = 'Desafiante 1';
      } else if(rating >= 2900) {
        name = 'Omega';
      } else {
        name = 'Unranked';
      }

      return name;

};